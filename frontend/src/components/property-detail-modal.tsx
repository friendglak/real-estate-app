'use client'

import React, { useEffect, useState, useCallback, useMemo } from 'react'
import Image from 'next/image'
import { X, MapPin, DollarSign, User, Phone, Heart, Share2 } from 'lucide-react'
import { PropertyDto, ApiError } from '@/types/property'
import { apiService } from '@/services/api-service'
import { formatCurrency } from '@/utils/formatters'
import { LoadingSpinner } from './loading-spinner'
import { ErrorDisplay } from './ui/error-display'
import { Button } from './ui/button'
import { useAsyncError } from '@/hooks/use-error-boundary'

interface PropertyDetailModalProps {
  isOpen: boolean
  onClose: () => void
  propertyId?: string
  property?: PropertyDto
}

export function PropertyDetailModal({
  isOpen,
  onClose,
  propertyId,
  property: initialProperty
}: PropertyDetailModalProps) {
  const [property, setProperty] = useState<PropertyDto | null>(initialProperty || null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [isFavorite, setIsFavorite] = useState(false)

  const { handleAsyncError } = useAsyncError()

  // Memoize property data to prevent unnecessary re-renders
  const propertyData = useMemo(() => property, [property])

  // Fetch property details with proper error handling
  const fetchPropertyDetails = useCallback(async (id: string) => {
    try {
      setLoading(true)
      setError(null)

      const response = await apiService.getPropertyById(id)

      if (response.success && response.data) {
        setProperty(response.data)
      } else {
        setError(response.message || 'Failed to load property details')
      }
    } catch (err) {
      const apiError = err as ApiError
      const errorMessage = apiError.message || 'Failed to fetch property details'
      setError(errorMessage)
      handleAsyncError(err)
    } finally {
      setLoading(false)
    }
  }, [handleAsyncError])

  // Handle modal state changes
  useEffect(() => {
    if (!isOpen) {
      setProperty(initialProperty || null)
      setError(null)
      return
    }

    if (initialProperty) {
      setProperty(initialProperty)
      return
    }

    if (propertyId && !initialProperty) {
      fetchPropertyDetails(propertyId)
    }
  }, [isOpen, propertyId, initialProperty, fetchPropertyDetails])

  // Handle backdrop click
  const handleBackdropClick = useCallback((e: React.MouseEvent<HTMLDivElement>) => {
    if (e.target === e.currentTarget) {
      onClose()
    }
  }, [onClose])

  // Handle escape key
  const handleEscapeKey = useCallback((e: KeyboardEvent) => {
    if (e.key === 'Escape') {
      onClose()
    }
  }, [onClose])

  // Handle favorite toggle
  const handleToggleFavorite = useCallback(() => {
    setIsFavorite(prev => !prev)
    // TODO: Implement favorite API call
  }, [])

  // Handle share functionality
  const handleShare = useCallback(async () => {
    if (navigator.share && property) {
      try {
        await navigator.share({
          title: property.name,
          text: `Check out this property: ${property.name}`,
          url: window.location.href
        })
      } catch {
        // Fallback to clipboard
        navigator.clipboard.writeText(window.location.href)
      }
    }
  }, [property])

  // Handle contact actions
  const handleContactOwner = useCallback(() => {
    // TODO: Implement contact functionality
    alert('Contact functionality would be implemented here')
  }, [])

  // Handle body scroll lock
  useEffect(() => {
    if (isOpen) {
      document.addEventListener('keydown', handleEscapeKey)
      document.body.style.overflow = 'hidden'
    }

    return () => {
      document.removeEventListener('keydown', handleEscapeKey)
      document.body.style.overflow = 'unset'
    }
  }, [isOpen, handleEscapeKey])

  if (!isOpen) return null

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 animate-fade-in"
      onClick={handleBackdropClick}
      role="dialog"
      aria-modal="true"
      aria-labelledby="property-title"
    >
      <div className="relative w-full max-w-4xl max-h-[90vh] bg-white rounded-lg shadow-xl overflow-hidden animate-slide-up">
        {/* Header */}
        <div className="relative">
          {/* Close Button */}
          <Button
            onClick={onClose}
            variant="ghost"
            size="sm"
            className="absolute top-4 right-4 z-10 bg-black/50 text-white hover:bg-black/70"
            aria-label="Close modal"
          >
            <X size={20} />
          </Button>

          {/* Property Image */}
          {propertyData?.image && (
            <div className="relative h-64 md:h-80 w-full">
              <Image
                src={propertyData.image}
                alt={propertyData.name}
                fill
                className="object-cover"
                sizes="(max-width: 768px) 100vw, 80vw"
                priority
              />

              {/* Price Overlay */}
              <div className="absolute bottom-4 right-4 bg-black/70 text-white px-3 py-2 rounded-lg">
                <div className="flex items-center gap-2">
                  <DollarSign size={18} />
                  <span className="text-lg font-semibold">
                    {formatCurrency(propertyData.priceProperty)}
                  </span>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Content */}
        <div className="overflow-y-auto max-h-[90vh]">
          {loading ? (
            <div className="flex items-center justify-center h-64">
              <LoadingSpinner size={32} text="Loading property details..." />
            </div>
          ) : error ? (
            <div className="p-6">
              <ErrorDisplay
                title="Error Loading Property"
                message={error}
                onDismiss={() => setError(null)}
              />
              <div className="mt-4 text-center">
                <Button onClick={onClose} variant="secondary">
                  Close
                </Button>
              </div>
            </div>
          ) : propertyData ? (
            <div className="p-6">
              {/* Property Header */}
              <div className="mb-6">
                <div className="flex items-start justify-between mb-3">
                  <h1
                    id="property-title"
                    className="text-3xl font-bold text-slate-900 flex-1"
                  >
                    {propertyData.name}
                  </h1>

                  {/* Action Buttons */}
                  <div className="flex items-center gap-2 ml-4">
                    <Button
                      onClick={handleToggleFavorite}
                      variant="ghost"
                      size="sm"
                      className={isFavorite ? 'text-red-500' : 'text-slate-500'}
                      aria-label={isFavorite ? 'Remove from favorites' : 'Add to favorites'}
                    >
                      <Heart
                        size={20}
                        className={isFavorite ? 'fill-current' : ''}
                      />
                    </Button>

                    <Button
                      onClick={handleShare}
                      variant="ghost"
                      size="sm"
                      aria-label="Share property"
                    >
                      <Share2 size={20} />
                    </Button>
                  </div>
                </div>

                <div className="flex items-start gap-2 text-slate-600 mb-4">
                  <MapPin size={20} className="mt-1 flex-shrink-0" />
                  <p className="text-lg">{propertyData.addressProperty}</p>
                </div>

                <div className="flex items-center gap-2 text-slate-600 mb-6">
                  <User size={20} />
                  <span>Owner ID: {propertyData.idOwner}</span>
                </div>
              </div>

              {/* Price Section */}
              <div className="bg-blue-50 rounded-lg p-6 mb-6">
                <h2 className="text-xl font-semibold text-slate-900 mb-2">Price</h2>
                <div className="text-3xl font-bold text-blue-600">
                  {formatCurrency(propertyData.priceProperty)}
                </div>
              </div>

              {/* Property Information Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                <div className="bg-slate-50 rounded-lg p-4">
                  <h3 className="font-semibold text-slate-900 mb-2">Property Details</h3>
                  <div className="space-y-2 text-slate-700">
                    <p><span className="font-medium">Name:</span> {propertyData.name}</p>
                  </div>
                </div>

                <div className="bg-slate-50 rounded-lg p-4">
                  <h3 className="font-semibold text-slate-900 mb-2">Owner Information</h3>
                  <div className="space-y-2 text-slate-700">
                    <p><span className="font-medium">Owner ID:</span> {propertyData.idOwner}</p>
                    {/* TODO: Add actual owner details when available */}
                  </div>
                </div>
              </div>

              {/* Address Section */}
              <div className="bg-slate-50 rounded-lg p-4 mb-6">
                <h3 className="font-semibold text-slate-900 mb-2">Full Address</h3>
                <p className="text-slate-700">{propertyData.addressProperty}</p>
              </div>

              {/* Action Buttons */}
              <div className="flex flex-col sm:flex-row gap-3 pt-4 border-t border-slate-200">
                <Button
                  onClick={handleContactOwner}
                  variant="primary"
                  className="flex-1"
                >
                  <Phone size={16} />
                  Contact Owner
                </Button>

                <Button
                  onClick={() => {
                    // TODO: Implement save functionality
                    alert('Save functionality would be implemented here')
                  }}
                  variant="secondary"
                  className="flex-1"
                >
                  <Heart size={16} />
                  Save Property
                </Button>

                <Button
                  onClick={onClose}
                  variant="ghost"
                  className="sm:w-auto"
                >
                  Close
                </Button>
              </div>
            </div>
          ) : (
            <div className="flex items-center justify-center h-64">
              <p className="text-slate-600">No property data available</p>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
