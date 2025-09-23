'use client'

import { useState } from 'react'
import { useForm, Controller } from 'react-hook-form'
import { Search, Filter, X, ChevronDown } from 'lucide-react'
import type { PropertyFilters } from '@/types/property'

interface PropertyFiltersFormProps {
  onFiltersChange: (filters: PropertyFilters) => void
  isLoading?: boolean
  initialFilters?: PropertyFilters
}

interface FilterFormData {
  name: string
  address: string
  minPrice: string
  maxPrice: string
}

export function PropertyFiltersForm({
  onFiltersChange,
  isLoading = false,
  initialFilters = {}
}: PropertyFiltersFormProps) {
  const [isExpanded, setIsExpanded] = useState(false)

  const { control, handleSubmit, watch, reset } = useForm<FilterFormData>({
    defaultValues: {
      name: initialFilters.name || '',
      address: initialFilters.address || '',
      minPrice: initialFilters.minPrice?.toString() || '',
      maxPrice: initialFilters.maxPrice?.toString() || '',
    }
  })

  const watchedValues = watch()
  const hasActiveFilters = Object.values(watchedValues).some(value => value !== '')

  const onSubmit = (data: FilterFormData) => {
    const filters: PropertyFilters = {
      name: data.name || undefined,
      address: data.address || undefined,
      minPrice: data.minPrice ? parseFloat(data.minPrice) : undefined,
      maxPrice: data.maxPrice ? parseFloat(data.maxPrice) : undefined,
    }

    onFiltersChange(filters)
  }

  const clearFilters = () => {
    reset({
      name: '',
      address: '',
      minPrice: '',
      maxPrice: '',
    })
    onFiltersChange({})
  }

  return (
    <div className="bg-white rounded-lg shadow-md p-4 md:p-6">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-lg font-semibold text-slate-900 flex items-center gap-2">
          <Filter size={20} />
          Search Properties
        </h2>

        <button
          type="button"
          onClick={() => setIsExpanded(!isExpanded)}
          className="lg:hidden btn-outline text-sm"
        >
          <span>{isExpanded ? 'Hide' : 'Show'} Filters</span>
          <ChevronDown
            size={16}
            className={`transition-transform ${isExpanded ? 'rotate-180' : ''}`}
          />
        </button>
      </div>

      <form
        onSubmit={handleSubmit(onSubmit)}
        className={`space-y-4 ${!isExpanded ? 'hidden' : 'block'} lg:block`}
      >
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {/* Name Filter */}
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">
              Property Name
            </label>
            <Controller
              name="name"
              control={control}
              render={({ field }) => (
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400" size={16} />
                  <input
                    {...field}
                    type="text"
                    placeholder="Search by name..."
                    className="input-field pl-9"
                    disabled={isLoading}
                  />
                </div>
              )}
            />
          </div>

          {/* Address Filter */}
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">
              Address
            </label>
            <Controller
              name="address"
              control={control}
              render={({ field }) => (
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400" size={16} />
                  <input
                    {...field}
                    type="text"
                    placeholder="Search by address..."
                    className="input-field pl-9"
                    disabled={isLoading}
                  />
                </div>
              )}
            />
          </div>

          {/* Min Price Filter */}
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">
              Min Price
            </label>
            <Controller
              name="minPrice"
              control={control}
              render={({ field }) => (
                <input
                  {...field}
                  type="number"
                  min="0"
                  step="1000"
                  placeholder="0"
                  className="input-field"
                  disabled={isLoading}
                />
              )}
            />
          </div>

          {/* Max Price Filter */}
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">
              Max Price
            </label>
            <Controller
              name="maxPrice"
              control={control}
              render={({ field }) => (
                <input
                  {...field}
                  type="number"
                  min="0"
                  step="1000"
                  placeholder="No limit"
                  className="input-field"
                  disabled={isLoading}
                />
              )}
            />
          </div>
        </div>

        <div className="flex flex-col sm:flex-row gap-2 justify-end pt-2">
          {hasActiveFilters && (
            <button
              type="button"
              onClick={clearFilters}
              disabled={isLoading}
              className="btn-outline"
            >
              <X size={16} />
              Clear Filters
            </button>
          )}

          <button
            type="submit"
            disabled={isLoading}
            className="btn-primary"
          >
            <Search size={16} />
            {isLoading ? 'Searching...' : 'Search Properties'}
          </button>
        </div>
      </form>
    </div>
  )
}