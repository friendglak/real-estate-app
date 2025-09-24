'use client'

import { useState } from 'react'
import { PropertyCard } from '@/components/property-card'
import { PropertyDetailModal } from '@/components/property-detail-modal'
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
  const [selectedPropertyId, setSelectedPropertyId] = useState<string | null>(null)
  const [isModalOpen, setIsModalOpen] = useState(false)

  const handlePropertyClick = (property: PropertyDto) => {
    setSelectedPropertyId(property.id)
    setIsModalOpen(true)
  }

  const handleCloseModal = () => {
    setIsModalOpen(false)
    setSelectedPropertyId(null)
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
            key={property.id}
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
      <PropertyDetailModal
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        propertyId={selectedPropertyId || undefined}
      />
    </div>
  )
}