export interface PropertyDto {
  id: string;
  idOwner: string;
  name: string;
  addressProperty: string;
  priceProperty: number;
  imageUrl: string;
  description?: string;
  bedrooms?: number;
  bathrooms?: number;
  squareMeters?: number;
  propertyType: number;
  isAvailable: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface PropertyFilters {
  name?: string;
  address?: string;
  minPrice?: number;
  maxPrice?: number;
  propertyType?: string;
  bedrooms?: number;
}

export interface PropertyListResponse {
  items: PropertyDto[];
  pageNumber: number;
  pageSize: number;
  totalCount: number;
  totalPages: number;
  hasNextPage: boolean;
  hasPreviousPage: boolean;
}

export interface ApiError {
  success: false;
  message: string;
  errors?: Record<string, string[]>;
}

export interface PaginationParams {
  pageNumber: number;
  pageSize: number;
}

export interface SearchParams extends PropertyFilters, PaginationParams {}

export interface ApiResponse<T> {
  success: boolean;
  data: T;
  message: string;
}

export interface PaginatedApiResponse<T> extends ApiResponse<T[]> {
  totalCount: number;
  pageNumber: number;
  pageSize: number;
  totalPages: number;
}
