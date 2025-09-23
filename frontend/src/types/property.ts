export interface PropertyDto {
  idOwner: string;
  name: string;
  addressProperty: string;
  priceProperty: number;
  image: string;
}

export interface PropertyFilters {
  name?: string;
  address?: string;
  minPrice?: number;
  maxPrice?: number;
}

export interface PropertyDetailResponse {
  success: boolean;
  data: PropertyDto;
  message: string;
}

export interface PropertyListResponse {
  success: boolean;
  data: PropertyDto[];
  message: string;
  totalCount: number;
  pageNumber: number;
  pageSize: number;
  totalPages: number;
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
