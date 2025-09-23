'use client'

import { useState } from 'react'
import { PropertyCard } from '@/components/property-card'
import { PropertyModal } from '@/components/property-modal'
import { Pagination } from '@/components/pagination'
import type { PropertyDto } from '@/types/property'

interface PropertyGridProps {
  properties: PropertyDto[]
  totalPages: number
  currentPage: number
  totalCount: number
}

export function PropertyGrid({
  properties,
  totalPages,
  currentPage,
  totalCount
}: PropertyGridProps) {
  const [selectedProperty, setSelectedProperty] = useState<PropertyDto | null>(null)
  const [isModalOpen, setIsModalOpen] = useState(false)

  const handlePropertyClick = (property: PropertyDto) => {
    setSelectedProperty(property)
    setIsModalOpen(true)
  }

  const handleCloseModal = () => {
    setIsModalOpen(false)
    setSelectedProperty(null)
  }

  return (
    <div className="space-y-8">
      {/* Results summary */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div className="text-sm text-slate-600">
          Showing {((currentPage - 1) * 12) + 1} to {Math.min(currentPage * 12, totalCount)} of{' '}
          <span className="font-medium">{totalCount.toLocaleString()}</span> properties
        </div>
      </div>

      {/* Properties grid */}
      <div className="properties-grid">
        {properties.map((property) => (
          <PropertyCard
            key={property.idOwner}
            property={property}
            onClick={handlePropertyClick}
          />
        ))}
      </div>

      {/* Pagination */}
      <Pagination
        currentPage={currentPage}
        totalPages={totalPages}
        totalItems={totalCount}
      />

      {/* Property detail modal */}
      <PropertyModal
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        property={selectedProperty}
      />
    </div>
  )
}