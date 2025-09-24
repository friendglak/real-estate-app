'use client'

import { useState } from 'react'
import { useForm, Controller } from 'react-hook-form'
import { Search, X } from 'lucide-react'
import { Input } from './ui/input'
import { Button } from './ui/button'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select'
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
  propertyType: string
  bedrooms: string
}

export function PropertyFiltersForm({
  onFiltersChange,
  isLoading = false,
  initialFilters = {}
}: PropertyFiltersFormProps) {
  const { control, handleSubmit, watch, reset } = useForm<FilterFormData>({
    defaultValues: {
      name: initialFilters.name || '',
      address: initialFilters.address || '',
      minPrice: initialFilters.minPrice?.toString() || '',
      maxPrice: initialFilters.maxPrice?.toString() || '',
      propertyType: initialFilters.propertyType || 'all',
      bedrooms: initialFilters.bedrooms?.toString() || 'any',
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
      propertyType: data.propertyType !== 'all' ? data.propertyType : undefined,
      bedrooms: data.bedrooms !== 'any' ? parseInt(data.bedrooms) : undefined,
    }

    onFiltersChange(filters)
  }

  const clearFilters = () => {
    reset({
      name: '',
      address: '',
      minPrice: '',
      maxPrice: '',
      propertyType: 'all',
      bedrooms: 'any',
    })
    onFiltersChange({})
  }

  return (
    <div className="bg-white p-8 rounded-2xl shadow-sm mb-8 border border-border">
      <div className="flex items-center gap-2 mb-6">
        <Search className="w-5 h-5 text-primary" />
        <h2 className="text-primary">Search Properties</h2>
      </div>

      <form
        onSubmit={handleSubmit(onSubmit)}
        className="space-y-6"
      >
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
          {/* Name Filter */}
          <div>
            <label className="block text-sm text-muted-foreground mb-2">Property Name</label>
            <Controller
              name="name"
              control={control}
              render={({ field }) => (
                <Input
                  {...field}
                  placeholder="Enter property name"
                  className="bg-input-background border-border rounded-xl"
                  disabled={isLoading}
                />
              )}
            />
          </div>

          {/* Address Filter */}
          <div>
            <label className="block text-sm text-muted-foreground mb-2">Address</label>
            <Controller
              name="address"
              control={control}
              render={({ field }) => (
                <Input
                  {...field}
                  placeholder="Enter address"
                  className="bg-input-background border-border rounded-xl"
                  disabled={isLoading}
                />
              )}
            />
          </div>

          {/* Min Price Filter */}
          <div>
            <label className="block text-sm text-muted-foreground mb-2">Min Price</label>
            <Controller
              name="minPrice"
              control={control}
              render={({ field }) => (
                <Input
                  {...field}
                  type="number"
                  min="0"
                  step="1000"
                  placeholder="£175,000"
                  className="bg-input-background border-border rounded-xl"
                  disabled={isLoading}
                />
              )}
            />
          </div>

          {/* Max Price Filter */}
          <div>
            <label className="block text-sm text-muted-foreground mb-2">Max Price</label>
            <Controller
              name="maxPrice"
              control={control}
              render={({ field }) => (
                <Input
                  {...field}
                  type="number"
                  min="0"
                  step="1000"
                  placeholder="more than £300,000"
                  className="bg-input-background border-border rounded-xl"
                  disabled={isLoading}
                />
              )}
            />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
          {/* House Type Filter */}
          <div>
            <label className="block text-sm text-muted-foreground mb-2">House Type</label>
            <Controller
              name="propertyType"
              control={control}
              render={({ field }) => (
                <Select value={field.value} onValueChange={field.onChange}>
                  <SelectTrigger className="bg-input-background border-border rounded-xl">
                    <SelectValue placeholder="All Of Them" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Of Them</SelectItem>
                    <SelectItem value="apartment">Apartment</SelectItem>
                    <SelectItem value="house">House</SelectItem>
                    <SelectItem value="condo">Condo</SelectItem>
                    <SelectItem value="villa">Villa</SelectItem>
                  </SelectContent>
                </Select>
              )}
            />
          </div>

          {/* Rooms Filter */}
          <div>
            <label className="block text-sm text-muted-foreground mb-2">Rooms</label>
            <Controller
              name="bedrooms"
              control={control}
              render={({ field }) => (
                <Select value={field.value} onValueChange={field.onChange}>
                  <SelectTrigger className="bg-input-background border-border rounded-xl">
                    <SelectValue placeholder="3 And Less" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="any">Any</SelectItem>
                    <SelectItem value="1">1+</SelectItem>
                    <SelectItem value="2">2+</SelectItem>
                    <SelectItem value="3">3+</SelectItem>
                    <SelectItem value="4">4+</SelectItem>
                  </SelectContent>
                </Select>
              )}
            />
          </div>
        </div>

        <div className="flex flex-col sm:flex-row gap-2 justify-end pt-2">
          {hasActiveFilters && (
            <Button
              type="submit"
              onClick={clearFilters}
              disabled={isLoading}
              className="bg-accent hover:bg-accent/90 text-accent-foreground px-8 rounded-xl"
            >
              <X size={16} />
              Clear Filters
            </Button>
          )}

          <Button
            type="submit"
            disabled={isLoading}
            className="bg-primary hover:bg-primary/90 text-primary-foreground px-8 rounded-xl"
          >
            {isLoading ? 'Searching...' : 'Search Properties'}
          </Button>
        </div>
      </form>
    </div>
  )
}