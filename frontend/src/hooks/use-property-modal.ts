import { useState, useCallback } from 'react'
import type { PropertyDto } from '@/types/property'

export function usePropertyModal() {
  const [selectedPropertyId, setSelectedPropertyId] = useState<string | null>(null)
  const [isModalOpen, setIsModalOpen] = useState(false)

  const openModal = useCallback((propertyId: string) => {
    setSelectedPropertyId(propertyId)
    setIsModalOpen(true)
  }, [])

  const closeModal = useCallback(() => {
    setIsModalOpen(false)
    setSelectedPropertyId(null)
  }, [])

  const openModalWithProperty = useCallback((property: PropertyDto) => {
    setSelectedPropertyId(property.id)
    setIsModalOpen(true)
  }, [])

  return {
    selectedPropertyId,
    isModalOpen,
    openModal,
    closeModal,
    openModalWithProperty,
  }
}
