import axios, { AxiosInstance, AxiosResponse } from "axios";
import type {
  PropertyListResponse,
  SearchParams,
  ApiError,
  PropertyDto,
} from "@/types/property";

class ApiService {
  private api: AxiosInstance;

  constructor() {
    this.api = axios.create({
      baseURL: "http://localhost:5000/",
      timeout: 10000,
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
      },
    });

    // Request interceptor
    this.api.interceptors.request.use(
      (config) => {
        if (process.env.NODE_ENV === "development") {
          console.log(`Making request to: ${config.url}`);
          console.log(`Full URL: ${config.baseURL}${config.url}`);
        }
        return config;
      },
      (error) => {
        console.error("Request error:", error);
        return Promise.reject(error);
      }
    );

    // Response interceptor
    this.api.interceptors.response.use(
      (response: AxiosResponse) => {
        if (process.env.NODE_ENV === "development") {
          console.log(`Response received:`, response.status, response.data);
        }
        return response;
      },
      (error) => {
        console.error("Response error:", error);

        // Handle network errors
        if (!error.response) {
          const networkError: ApiError = {
            success: false,
            message:
              "Network error. Please check your internet connection and try again.",
          };
          return Promise.reject(networkError);
        }

        // Handle specific HTTP status codes
        let message = "An unexpected error occurred";

        switch (error.response.status) {
          case 400:
            message = "Invalid request. Please check your search parameters.";
            break;
          case 404:
            message = "The requested resource was not found.";
            break;
          case 429:
            message =
              "Too many requests. Please wait a moment before trying again.";
            break;
          case 500:
            message = "Server error. Please try again later.";
            break;
          case 503:
            message =
              "Service temporarily unavailable. Please try again later.";
            break;
        }

        const apiError: ApiError = {
          success: false,
          message: error.response.data?.message || message,
          errors: error.response.data?.errors,
        };

        return Promise.reject(apiError);
      }
    );
  }

  // Get all properties with filters and pagination
  async getProperties(params?: SearchParams): Promise<PropertyListResponse> {
    try {
      const response = await this.api.get<PropertyListResponse>(
        "api/properties",
        {
          params: this.cleanParams(params),
        }
      );
      return response.data;
    } catch (error) {
      console.error("Error fetching properties:", error);
      throw error;
    }
  }

  // Get property by ID
  async getPropertyById(id: string): Promise<PropertyDto> {
    try {
      const response = await this.api.get<PropertyDto>(`api/properties/${id}`);
      return response.data;
    } catch (error) {
      console.error(`Error fetching property ${id}:`, error);
      throw error;
    }
  }

  // Health check endpoint
  async healthCheck(): Promise<{ status: string; timestamp: string }> {
    try {
      const response = await this.api.get("api/health");
      return response.data;
    } catch (error) {
      console.error("Health check failed:", error);
      throw error;
    }
  }

  // Create property
  async createProperty(
    property: Omit<PropertyDto, "id">
  ): Promise<PropertyDto> {
    try {
      const response = await this.api.post<PropertyDto>(
        "api/properties",
        property
      );
      return response.data;
    } catch (error) {
      console.error("Error creating property:", error);
      throw error;
    }
  }

  // Update property
  async updateProperty(
    id: string,
    property: Partial<PropertyDto>
  ): Promise<PropertyDto> {
    try {
      const response = await this.api.put<PropertyDto>(
        `api/properties/${id}`,
        property
      );
      return response.data;
    } catch (error) {
      console.error(`Error updating property ${id}:`, error);
      throw error;
    }
  }

  // Delete property
  async deleteProperty(id: string): Promise<void> {
    try {
      await this.api.delete(`api/properties/${id}`);
    } catch (error) {
      console.error(`Error deleting property ${id}:`, error);
      throw error;
    }
  }

  // Helper method to clean undefined parameters
  private cleanParams(params?: SearchParams): Record<string, string | number> {
    if (!params) return {};

    const cleaned: Record<string, string | number> = {};

    Object.entries(params).forEach(([key, value]) => {
      if (value !== undefined && value !== null && value !== "") {
        // Convert camelCase to snake_case for API compatibility if needed
        const apiKey =
          key === "pageNumber"
            ? "page"
            : key === "pageSize"
              ? "size"
              : key === "minPrice"
                ? "min_price"
                : key === "maxPrice"
                  ? "max_price"
                  : key;
        cleaned[apiKey] = value;
      }
    });

    return cleaned;
  }
}

// Export singleton instance
export const apiService = new ApiService();
