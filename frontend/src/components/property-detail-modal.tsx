'use client'

import React, { useEffect, useCallback } from 'react'
import Image from 'next/image'
import { X, MapPin, User, Phone, Heart, Share2 } from 'lucide-react'
import { PropertyDto } from '@/types/property'
import { usePropertyQuery } from '@/hooks/queries/property-queries'
import { useFavorites } from '@/hooks/use-favorites'
import { useScrollLock } from '@/hooks/use-scroll-lock'
import { useContact } from '@/hooks/use-contact'
import { formatCurrency } from '@/utils/formatters'
import { LoadingSpinner } from './loading-spinner'
import { ErrorDisplay } from './ui/error-display'
import { Button } from './ui/button'

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
  const { isFavorited, toggleFavorite } = useFavorites()
  const { openContactForm } = useContact()

  // Use React Query to fetch property details
  const {
    data: propertyData,
    isLoading: loading,
    error: queryError,
  } = usePropertyQuery(propertyId || '', isOpen && !initialProperty)

  // Use initial property if provided, otherwise use fetched data
  const property = initialProperty || propertyData
  const error = queryError?.message || null

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
    if (property) {
      toggleFavorite(property.id)
    }
  }, [property, toggleFavorite])

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
    if (property) {
      openContactForm(property.idOwner, property.name)
    }
  }, [property, openContactForm])

  // Handle body scroll lock
  useScrollLock(isOpen)

  // Handle escape key
  useEffect(() => {
    if (isOpen) {
      document.addEventListener('keydown', handleEscapeKey)
    }

    return () => {
      document.removeEventListener('keydown', handleEscapeKey)
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
      <div className="relative w-full max-w-2xl max-h-[90vh] bg-white rounded-2xl shadow-xl overflow-hidden animate-slide-up flex flex-col">
        {/* Header */}
        <div className="relative flex-shrink-0">
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
          {property?.imageUrl && (
            <div className="relative h-64 md:h-80 w-full">
              <Image
                src={property.imageUrl}
                alt={property.name}
                fill
                className="object-cover"
                sizes="(max-width: 768px) 100vw, 80vw"
                priority
              />

              {/* Price Overlay */}
              <div className="absolute bottom-4 right-4 bg-black/70 text-white px-3 py-2 rounded-lg">
                <div className="flex items-center gap-2">
                  <span className="text-lg font-semibold">
                    {formatCurrency(property.priceProperty)}
                  </span>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto">
          {loading ? (
            <div className="flex items-center justify-center h-64">
              <LoadingSpinner size={32} text="Loading property details..." />
            </div>
          ) : error ? (
            <div className="p-6">
              <ErrorDisplay
                title="Error Loading Property"
                message={error}
                onDismiss={onClose}
              />
              <div className="mt-4 text-center">
                <Button onClick={onClose} variant="secondary">
                  Close
                </Button>
              </div>
            </div>
          ) : property ? (
            <div className="p-6">
              {/* Property Header */}
              <div className="mb-6">
                <div className="flex items-start justify-between mb-3">
                  <h1
                    id="property-title"
                    className="text-3xl font-bold text-slate-900 flex-1"
                  >
                    {property.name}
                  </h1>

                  {/* Action Buttons */}
                  <div className="flex items-center gap-2 ml-4">
                    <Button
                      onClick={handleToggleFavorite}
                      variant="ghost"
                      size="sm"
                      className={property && isFavorited(property.id) ? 'text-red-500' : 'text-slate-500'}
                      aria-label={property && isFavorited(property.id) ? 'Remove from favorites' : 'Add to favorites'}
                    >
                      <Heart
                        size={20}
                        className={property && isFavorited(property.id) ? 'fill-current' : ''}
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
                  <p className="text-lg">{property.addressProperty}</p>
                </div>

                <div className="flex items-center gap-2 text-slate-600 mb-6">
                  <User size={20} />
                  <span>Owner ID: {property.idOwner}</span>
                </div>
              </div>

              {/* Price Section */}
              <div className="bg-muted p-4 rounded-lg mb-6">
                <h3 className="text-primary mb-2 font-semibold">Price</h3>
                <div className="text-primary text-2xl font-bold">{formatCurrency(property.priceProperty)}</div>
              </div>

              {/* Property Information */}
              <div className="space-y-4 mb-6">
                <div className="bg-gray-50 rounded-lg p-4">
                  <h3 className="font-semibold text-gray-900 mb-2">Property Details</h3>
                  <div className="space-y-2 text-gray-700">
                    <p><span className="font-medium">Name:</span> {property.name}</p>
                    <p><span className="font-medium">Bedrooms:</span> {property.bedrooms || 'N/A'}</p>
                    <p><span className="font-medium">Bathrooms:</span> {property.bathrooms || 'N/A'}</p>
                    <p><span className="font-medium">Square Meters:</span> {property.squareMeters || 'N/A'}</p>
                    <p><span className="font-medium">Property Type:</span> {property.propertyType || 'N/A'}</p>
                  </div>
                </div>

                <div className="bg-gray-50 rounded-lg p-4">
                  <h3 className="font-semibold text-gray-900 mb-2">Owner Information</h3>
                  <div className="space-y-2 text-gray-700">
                    <p><span className="font-medium">Owner ID:</span> {property.idOwner}</p>
                  </div>
                </div>

                {property.description && (
                  <div className="bg-gray-50 rounded-lg p-4">
                    <h3 className="font-semibold text-gray-900 mb-2">Description</h3>
                    <p className="text-gray-700">{property.description}</p>
                  </div>
                )}
              </div>

              {/* Action Buttons */}
              <div className="flex gap-3 pt-4 border-t border-gray-200">
                <button
                  onClick={handleContactOwner}
                  className="flex-1 bg-primary text-white py-3 px-4 rounded-xl hover:bg-primary/90 transition-colors flex items-center justify-center gap-2"
                >
                  <Phone className="w-4 h-4" />
                  Contact Owner
                </button>

                <button
                  onClick={() => {
                    if (property) {
                      toggleFavorite(property.id)
                    }
                  }}
                  className="flex-1 bg-gray-200 text-gray-700 py-3 px-4 rounded-xl hover:bg-gray-300 transition-colors flex items-center justify-center gap-2"
                >
                  <Heart className="w-4 h-4" />
                  Save Property
                </button>
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
