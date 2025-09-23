'use client'

import { useState, memo, useCallback } from 'react'
import Image from 'next/image'
import { MapPin, DollarSign } from 'lucide-react'
import type { PropertyDto } from '@/types/property'
import { formatCurrency } from '@/utils/formatters'

interface PropertyCardProps {
  property: PropertyDto
  onClick: (property: PropertyDto) => void
}

function PropertyCardComponent({ property, onClick }: PropertyCardProps) {
  const [imageError, setImageError] = useState(false)

  const handleClick = useCallback(() => {
    onClick(property)
  }, [onClick, property])

  const handleKeyDown = useCallback((e: React.KeyboardEvent) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault()
      onClick(property)
    }
  }, [onClick, property])

  return (
    <article
      className="bg-white rounded-lg shadow-md overflow-hidden card-hover cursor-pointer focus-ring"
      onClick={handleClick}
      role="button"
      tabIndex={0}
      onKeyDown={handleKeyDown}
      aria-label={`View details for ${property.name}`}
    >
      {/* Property Image */}
      <div className="relative aspect-property overflow-hidden">
        <Image
          src={imageError ? '/placeholder-property.jpg' : property.image || '/placeholder-property.jpg'}
          alt={property.name}
          fill
          className="object-cover transition-transform duration-300 group-hover:scale-105"
          sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
          onError={() => setImageError(true)}
        />

        {/* Price overlay */}
        <div className="absolute top-3 right-3 bg-black/70 text-white px-2 py-1 rounded text-sm font-medium backdrop-blur-sm">
          <div className="flex items-center gap-1">
            <DollarSign size={14} aria-hidden="true" />
            <span>{formatCurrency(property.priceProperty)}</span>
          </div>
        </div>
      </div>

      {/* Property Details */}
      <div className="p-4">
        <h3 className="font-semibold text-lg text-slate-900 mb-2 line-clamp-1">
          {property.name}
        </h3>

        <div className="flex items-start gap-2 text-slate-600 mb-3">
          <MapPin size={16} className="mt-0.5 flex-shrink-0" aria-hidden="true" />
          <p className="text-sm line-clamp-2">
            {property.addressProperty}
          </p>
        </div>

        <div className="flex justify-between items-center">
          <span className="text-blue-600 font-semibold text-lg">
            {formatCurrency(property.priceProperty)}
          </span>
          <span className="text-blue-600 hover:text-blue-700 text-sm font-medium">
            View Details →
          </span>
        </div>
      </div>
    </article>
  )
}

export const PropertyCard = memo(PropertyCardComponent)