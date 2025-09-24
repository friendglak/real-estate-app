'use client'

import { useEffect } from 'react'
import { createPortal } from 'react-dom'
import Image from 'next/image'
import { X, MapPin, DollarSign, User } from 'lucide-react'
import type { PropertyDto } from '@/types/property'
import { formatCurrency } from '@/utils/formatters'

interface PropertyModalProps {
  isOpen: boolean
  onClose: () => void
  property: PropertyDto | null
}

export function PropertyModal({ isOpen, onClose, property }: PropertyModalProps) {
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden'

      const handleEscape = (e: KeyboardEvent) => {
        if (e.key === 'Escape') {
          onClose()
        }
      }

      document.addEventListener('keydown', handleEscape)

      return () => {
        document.body.style.overflow = 'unset'
        document.removeEventListener('keydown', handleEscape)
      }
    }
  }, [isOpen, onClose])

  if (!isOpen || !property) return null

  const modalContent = (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 animate-fade-in"
      onClick={(e) => {
        if (e.target === e.currentTarget) {
          onClose()
        }
      }}
    >
      <div className="relative w-full max-w-4xl max-h-[90vh] bg-white rounded-lg shadow-xl overflow-hidden animate-slide-up">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 z-10 p-2 bg-black/50 text-white rounded-full hover:bg-black/70 transition-colors focus-ring"
          aria-label="Close property details"
        >
          <X size={20} />
        </button>

        {/* Modal Content */}
        <div className="overflow-y-auto max-h-[90vh]">
          {/* Property Image */}
          <div className="relative h-64 md:h-80 w-full">
            <Image
              src={property.imageUrl || '/placeholder-property.svg'}
              alt={property.name}
              fill
              className="object-cover"
              sizes="(max-width: 768px) 100vw, 80vw"
            />
            <div className="absolute bottom-4 right-4 bg-black/70 text-white px-3 py-2 rounded-lg backdrop-blur-sm">
              <div className="flex items-center gap-2">
                <DollarSign size={18} />
                <span className="text-lg font-semibold">{formatCurrency(property.priceProperty)}</span>
              </div>
            </div>
          </div>

          {/* Property Details */}
          <div className="p-6">
            <div className="mb-6">
              <h1 className="text-3xl font-bold text-slate-900 mb-3">
                {property.name}
              </h1>

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
            <div className="bg-blue-50 rounded-lg p-6 mb-6">
              <h2 className="text-xl font-semibold text-slate-900 mb-2">Price</h2>
              <div className="text-3xl font-bold text-blue-600">
                {formatCurrency(property.priceProperty)}
              </div>
            </div>

            {/* Property Information */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
              <div className="bg-slate-50 rounded-lg p-4">
                <h3 className="font-semibold text-slate-900 mb-2">Property Name</h3>
                <p className="text-slate-700">{property.name}</p>
              </div>

              <div className="bg-slate-50 rounded-lg p-4">
                <h3 className="font-semibold text-slate-900 mb-2">Owner Information</h3>
                <p className="text-slate-700">Owner ID: {property.idOwner}</p>
              </div>
            </div>

            {/* Address Section */}
            <div className="bg-slate-50 rounded-lg p-4 mb-6">
              <h3 className="font-semibold text-slate-900 mb-2">Full Address</h3>
              <p className="text-slate-700">{property.addressProperty}</p>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row gap-3 pt-4 border-t border-slate-200">
              <button
                onClick={() => {
                  alert('Contact functionality would be implemented here')
                }}
                className="btn-primary flex-1"
              >
                Contact Owner
              </button>

              <button
                onClick={() => {
                  alert('Save functionality would be implemented here')
                }}
                className="btn-secondary flex-1"
              >
                Save Property
              </button>

              <button
                onClick={onClose}
                className="btn-outline sm:w-auto"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )

  return createPortal(modalContent, document.body)
}