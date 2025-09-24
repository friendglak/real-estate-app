import { Heart, MapPin, Bed, Bath, Square } from "lucide-react";
import { ImageWithFallback } from "./ui/image-with-fallback";
import type { PropertyDto } from "@/types/property";

interface PropertyCardProps {
  property: PropertyDto;
  onClick: (property: PropertyDto) => void;
  onFavorite?: (propertyId: string) => void;
  isFavorited?: boolean;
}

export function PropertyCard({
  property,
  onClick,
  onFavorite,
  isFavorited = false,
}: PropertyCardProps) {
  const {
    id,
    name: title,
    addressProperty: address,
    priceProperty: price,
    imageUrl: image,
    bedrooms,
    bathrooms,
    squareMeters: sqft,
    isAvailable
  } = property;

  const status = isAvailable ? "Available For Sale" : "Not Available";
  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(price);
  };

  return (
    <div className="bg-white rounded-2xl shadow-sm hover:shadow-md transition-all duration-300 overflow-hidden cursor-pointer group border border-gray-100">
      <div className="relative" onClick={() => onClick(property)}>
        <ImageWithFallback
          src={image}
          alt={title}
          className="w-full h-48 object-cover"
        />
        <button
          onClick={(e) => {
            e.stopPropagation();
            onFavorite?.(id);
          }}
          className={`absolute top-3 right-3 p-2 rounded-full transition-colors ${isFavorited
            ? 'bg-red-500 text-white'
            : 'bg-white/90 text-gray-600 hover:bg-white'
            }`}
        >
          <Heart className="w-4 h-4" fill={isFavorited ? 'currentColor' : 'none'} />
        </button>
        <div className="absolute bottom-3 left-3 bg-white/95 text-gray-800 px-3 py-1 rounded-full text-sm backdrop-blur-sm">
          {status}
        </div>
      </div>

      <div className="p-5">
        <div className="mb-3">
          <h3 className="text-gray-900 mb-1 font-semibold">{title}</h3>
          <div className="flex items-baseline text-gray-500">
            <MapPin className="w-3 h-3 mr-1" />
            <span className="text-sm">{address}</span>
          </div>
        </div>

        <div className="text-gray-900 mb-4 font-bold">
          {formatPrice(price)}
        </div>

        {(bedrooms || bathrooms || sqft) && (
          <div className="flex items-center gap-4 text-sm text-gray-500">
            {bedrooms && (
              <div className="flex items-center gap-1">
                <Bed className="w-3 h-3" />
                <span>{bedrooms}</span>
              </div>
            )}
            {bathrooms && (
              <div className="flex items-center gap-1">
                <Bath className="w-3 h-3" />
                <span>{bathrooms}</span>
              </div>
            )}
            {sqft && (
              <div className="flex items-center gap-1">
                <Square className="w-3 h-3" />
                <span>{sqft}</span>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}