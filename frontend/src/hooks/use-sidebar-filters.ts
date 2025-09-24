import { useState, useCallback } from 'react'

interface SidebarFilters {
  houseType: string
  rooms: string
  sizeRange: number[]
  priceRange: number[]
}

const defaultFilters: SidebarFilters = {
  houseType: "all",
  rooms: "3-",
  sizeRange: [0, 220],
  priceRange: [175000, 300000]
}

export function useSidebarFilters(initialFilters?: Partial<SidebarFilters>) {
  const [filters, setFilters] = useState<SidebarFilters>({
    ...defaultFilters,
    ...initialFilters
  })

  const updateFilter = useCallback((key: keyof SidebarFilters, value: string | number[]) => {
    setFilters(prev => ({ ...prev, [key]: value }))
  }, [])

  const resetFilters = useCallback(() => {
    setFilters(defaultFilters)
  }, [])

  return {
    filters,
    updateFilter,
    resetFilters,
    setFilters
  }
}
