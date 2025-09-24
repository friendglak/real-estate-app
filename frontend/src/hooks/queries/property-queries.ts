import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { apiService } from "@/services/api-service";
import type { PropertyDto, SearchParams } from "@/types/property";

// Query keys
export const propertyKeys = {
  all: ["properties"] as const,
  lists: () => [...propertyKeys.all, "list"] as const,
  list: (filters: SearchParams) => [...propertyKeys.lists(), filters] as const,
  details: () => [...propertyKeys.all, "detail"] as const,
  detail: (id: string) => [...propertyKeys.details(), id] as const,
  health: () => [...propertyKeys.all, "health"] as const,
};

// Query for getting properties list
export function usePropertiesQuery(searchParams?: SearchParams) {
  const defaultParams: SearchParams = {
    pageNumber: 1,
    pageSize: 10,
    ...searchParams,
  };

  return useQuery({
    queryKey: propertyKeys.list(defaultParams),
    queryFn: () => apiService.getProperties(defaultParams),
    enabled: true,
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
}

// Query for getting a single property
export function usePropertyQuery(id: string, enabled = true) {
  return useQuery({
    queryKey: propertyKeys.detail(id),
    queryFn: () => apiService.getPropertyById(id),
    enabled: enabled && !!id,
    staleTime: 10 * 60 * 1000, // 10 minutes
  });
}

// Query for health check
export function useHealthQuery() {
  return useQuery({
    queryKey: propertyKeys.health(),
    queryFn: () => apiService.healthCheck(),
    staleTime: 30 * 1000, // 30 seconds
    refetchInterval: 60 * 1000, // Refetch every minute
  });
}

// Mutation for creating a property
export function useCreatePropertyMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (property: Omit<PropertyDto, "id">) =>
      apiService.createProperty(property),
    onSuccess: () => {
      // Invalidate and refetch properties list
      queryClient.invalidateQueries({ queryKey: propertyKeys.lists() });
    },
  });
}

// Mutation for updating a property
export function useUpdatePropertyMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      id,
      property,
    }: {
      id: string;
      property: Partial<PropertyDto>;
    }) => apiService.updateProperty(id, property),
    onSuccess: (data: PropertyDto, variables: { id: string; property: Partial<PropertyDto> }) => {
      // Update the specific property in cache
      queryClient.setQueryData(propertyKeys.detail(variables.id), data);
      // Invalidate properties list
      queryClient.invalidateQueries({ queryKey: propertyKeys.lists() });
    },
  });
}

// Mutation for deleting a property
export function useDeletePropertyMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => apiService.deleteProperty(id),
    onSuccess: (_: void, id: string) => {
      // Remove the property from cache
      queryClient.removeQueries({ queryKey: propertyKeys.detail(id) });
      // Invalidate properties list
      queryClient.invalidateQueries({ queryKey: propertyKeys.lists() });
    },
  });
}

// Utility hook for prefetching property details
export function usePrefetchProperty() {
  const queryClient = useQueryClient();

  return (id: string) => {
    queryClient.prefetchQuery({
      queryKey: propertyKeys.detail(id),
      queryFn: () => apiService.getPropertyById(id),
      staleTime: 10 * 60 * 1000,
    });
  };
}
