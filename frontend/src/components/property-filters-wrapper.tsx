'use client'

import { useState, useCallback } from 'react'
import { useSearchParams, useRouter, usePathname } from 'next/navigation'
import { PropertyFiltersForm } from '@/components/property-filters-form'
import type { PropertyFilters } from '@/types/property'

export function PropertyFiltersWrapper() {
  const router = useRouter()
  const pathname = usePathname()
  const searchParams = useSearchParams()

  const [isLoading, setIsLoading] = useState(false)

  // Get initial filters from URL search params
  const initialFilters: PropertyFilters = {
    name: searchParams.get('name') || undefined,
    address: searchParams.get('address') || undefined,
    minPrice: searchParams.get('minPrice') ? Number(searchParams.get('minPrice')) : undefined,
    maxPrice: searchParams.get('maxPrice') ? Number(searchParams.get('maxPrice')) : undefined,
  }

  const handleFiltersChange = useCallback((filters: PropertyFilters) => {
    setIsLoading(true)

    // Create new search params
    const params = new URLSearchParams(searchParams.toString())

    // Update or remove parameters
    Object.entries(filters).forEach(([key, value]) => {
      if (value !== undefined && value !== null && value !== '') {
        params.set(key, String(value))
      } else {
        params.delete(key)
      }
    })

    // Reset to first page when filters change
    params.delete('page')

    // Update URL
    const newUrl = params.toString() ? `${pathname}?${params.toString()}` : pathname
    router.push(newUrl)

    // Reset loading state after navigation
    setTimeout(() => setIsLoading(false), 100)
  }, [router, pathname, searchParams])

  return (
    <PropertyFiltersForm
      onFiltersChange={handleFiltersChange}
      isLoading={isLoading}
      initialFilters={initialFilters}
    />
  )
}