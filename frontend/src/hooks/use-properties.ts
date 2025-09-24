import { usePropertiesQuery } from "./queries/property-queries";
import type { PropertyDto, SearchParams } from "@/types/property";

export interface UsePropertiesResult {
  properties: PropertyDto[];
  loading: boolean;
  error: string | null;
  totalPages: number;
  currentPage: number;
  totalCount: number;
  refetch: () => void;
}

export function useProperties(
  searchParams?: SearchParams
): UsePropertiesResult {
  const { data, isLoading, error, refetch } = usePropertiesQuery(searchParams);

  return {
    properties: data?.items || [],
    loading: isLoading,
    error: error?.message || null,
    totalPages: data?.totalPages || 0,
    currentPage: data?.pageNumber || 1,
    totalCount: data?.totalCount || 0,
    refetch: () => refetch(),
  };
}
