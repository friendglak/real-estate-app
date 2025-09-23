'use client'

import { useSearchParams } from 'next/navigation'
import { PropertyGrid } from '@/components/property-grid'
import { useProperties } from '@/hooks/use-properties'
import { LoadingSpinner } from '@/components/loading-spinner'
import { EmptyState } from '@/components/empty-state'
import { ErrorDisplay } from '@/components/error-display'
import { Home, Search } from 'lucide-react'

export function PropertyGridWrapper() {
  const searchParams = useSearchParams()

  // Build search parameters from URL
  const searchOptions = {
    name: searchParams.get('name') || undefined,
    address: searchParams.get('address') || undefined,
    minPrice: searchParams.get('minPrice') ? Number(searchParams.get('minPrice')) : undefined,
    maxPrice: searchParams.get('maxPrice') ? Number(searchParams.get('maxPrice')) : undefined,
    pageNumber: searchParams.get('page') ? Number(searchParams.get('page')) : 1,
    pageSize: 12,
  }

  const {
    properties,
    loading,
    error,
    totalPages,
    currentPage,
    totalCount,
    refetch,
  } = useProperties(searchOptions)

  if (loading) {
    return (
      <div className="flex justify-center py-12">
        <LoadingSpinner size={32} text="Loading properties..." />
      </div>
    )
  }

  if (error) {
    return (
      <ErrorDisplay
        title="Error Loading Properties"
        message={error}
        onRetry={refetch}
      />
    )
  }

  if (properties.length === 0) {
    const hasFilters = Object.values(searchOptions).some(value =>
      value !== undefined && value !== 1 && value !== 12
    )

    return (
      <EmptyState
        title="No Properties Found"
        description={
          hasFilters
            ? "Try adjusting your search filters to find more properties."
            : "No properties are currently available. Please check back later."
        }
        icon={<Home size={48} />}
      >
        {hasFilters && (
          <button
            onClick={() => window.location.href = '/'}
            className="btn-primary"
          >
            <Search size={16} />
            Clear All Filters
          </button>
        )}
      </EmptyState>
    )
  }

  return (
    <PropertyGrid
      properties={properties}
      totalPages={totalPages}
      currentPage={currentPage}
      totalCount={totalCount}
    />
  )
}