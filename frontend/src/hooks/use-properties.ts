import { useState, useEffect, useCallback } from "react";
import { apiService } from "@/services/api-service";
import type { PropertyDto, SearchParams, ApiError } from "@/types/property";

export interface UsePropertiesResult {
  properties: PropertyDto[];
  loading: boolean;
  error: string | null;
  totalPages: number;
  currentPage: number;
  totalCount: number;
  refetch: () => Promise<void>;
}

export function useProperties(
  searchParams?: SearchParams
): UsePropertiesResult {
  const [properties, setProperties] = useState<PropertyDto[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [totalPages, setTotalPages] = useState(0);
  const [totalCount, setTotalCount] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);

  const fetchProperties = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);

      const response = await apiService.getProperties(searchParams);

      if (response.success) {
        setProperties(response.data);
        setTotalPages(response.totalPages);
        setTotalCount(response.totalCount);
        setCurrentPage(response.pageNumber);
      } else {
        setError(response.message);
        setProperties([]);
      }
    } catch (err) {
      const apiError = err as ApiError;
      setError(apiError.message || "Failed to fetch properties");
      setProperties([]);
    } finally {
      setLoading(false);
    }
  }, [searchParams]);

  useEffect(() => {
    fetchProperties();
  }, [fetchProperties]);

  return {
    properties,
    loading,
    error,
    totalPages,
    currentPage,
    totalCount,
    refetch: fetchProperties,
  };
}
