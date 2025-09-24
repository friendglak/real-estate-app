import { Slider } from "./ui/slider";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./ui/select";
import { useSidebarFilters } from "@/hooks/use-sidebar-filters";

interface FilterSidebarProps {
  filters: {
    houseType: string;
    rooms: string;
    sizeRange: number[];
    priceRange: number[];
  };
  onFiltersChange: (filters: {
    houseType: string;
    rooms: string;
    sizeRange: number[];
    priceRange: number[];
  }) => void;
}

export function FilterSidebar({ filters, onFiltersChange }: FilterSidebarProps) {
  const updateFilter = (key: string, value: string | number[]) => {
    onFiltersChange({ ...filters, [key]: value });
  };

  return (
    <div className="bg-primary text-white p-6 rounded-2xl min-h-[500px]">
      <h3 className="mb-6 text-lg font-semibold text-white">Filters</h3>
      <div className="space-y-6">
        <div>
          <label className="block text-sm mb-3">House Type:</label>
          <Select value={filters.houseType} onValueChange={(value) => updateFilter('houseType', value)}>
            <SelectTrigger className="bg-gray-700 text-white border-gray-600">
              <SelectValue placeholder="All Of Them" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Of Them</SelectItem>
              <SelectItem value="apartment">Apartment</SelectItem>
              <SelectItem value="house">House</SelectItem>
              <SelectItem value="condo">Condo</SelectItem>
              <SelectItem value="villa">Villa</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div>
          <label className="block text-sm mb-3">Rooms</label>
          <Select value={filters.rooms} onValueChange={(value) => updateFilter('rooms', value)}>
            <SelectTrigger className="bg-gray-700 text-white border-gray-600">
              <SelectValue placeholder="3 And Less" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="3-">3 And Less</SelectItem>
              <SelectItem value="1">1</SelectItem>
              <SelectItem value="2">2</SelectItem>
              <SelectItem value="3">3</SelectItem>
              <SelectItem value="4+">4+</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div>
          <label className="block text-sm mb-3">Size (M2)</label>
          <div className="px-2">
            <Slider
              value={filters.sizeRange}
              onValueChange={(value) => updateFilter('sizeRange', value)}
              max={220}
              min={0}
              step={10}
              className="w-full"
            />
            <div className="flex justify-between text-xs mt-2 text-primary-foreground/70">
              <span>{filters.sizeRange[0]}</span>
              <span>Up To {filters.sizeRange[1]}</span>
            </div>
          </div>
        </div>

        <div>
          <label className="block text-sm mb-3">Price</label>
          <div className="px-2">
            <Slider
              value={filters.priceRange}
              onValueChange={(value) => updateFilter('priceRange', value)}
              max={300000}
              min={175000}
              step={5000}
              className="w-full"
            />
            <div className="flex justify-between text-xs mt-2 text-primary-foreground/70">
              <span>£{filters.priceRange[0].toLocaleString()}</span>
              <span>more than £{filters.priceRange[1].toLocaleString()}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
