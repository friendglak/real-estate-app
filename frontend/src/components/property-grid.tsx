'use client'

import { PropertyCard } from '@/components/property-card'
import { PropertyDetailModal } from '@/components/property-detail-modal'
import { Pagination } from '@/components/pagination'
import { usePropertyModal } from '@/hooks/use-property-modal'
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
  const { selectedPropertyId, isModalOpen, openModalWithProperty, closeModal } = usePropertyModal()

  const handlePropertyClick = (property: PropertyDto) => {
    openModalWithProperty(property)
  }

  return (
    <div className="space-y-8">
      {/* Results summary */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div className="text-gray-600 mb-6">
          <p>Showing {((currentPage - 1) * 12) + 1} to {Math.min(currentPage * 12, totalCount)} of {totalCount.toLocaleString()} properties</p>
        </div>
      </div>

      {/* Properties grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
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
        onClose={closeModal}
        propertyId={selectedPropertyId || undefined}
      />
    </div>
  )
}