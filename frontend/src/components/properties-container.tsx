import { PropertyFiltersWrapper } from '@/components/property-filters-wrapper'
import { PropertyGridWrapper } from '@/components/property-grid-wrapper'

export function PropertiesContainer() {
  return (
    <div className="space-y-6">
      <PropertyFiltersWrapper />
      <PropertyGridWrapper />
    </div>
  )
}

