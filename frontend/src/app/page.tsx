'use client';

import { Header } from "@/components/header";
import { FilterSidebar } from "@/components/filter-sidebar";
import { PropertiesContainerWithSuspense } from "@/components/properties-container-with-suspense";
import { useSidebarFilters } from "@/hooks/use-sidebar-filters";

export default function HomePage() {
  const { filters: sidebarFilters, setFilters: setSidebarFilters } = useSidebarFilters();

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <Header />

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Left Sidebar */}
          <div className="lg:col-span-1">
            {/* Hero Section */}
            <div className="mb-8">
              <h2 className="text-gray-900 mb-2 text-xl font-bold">Our Apartment</h2>
              <p className="text-muted-foreground text-sm leading-relaxed">
                Experience The Epitome Of Modern Living In Our Luxurious Apartments, Where Elegance
                Meets Comfort Seamlessly.
              </p>
            </div>

            {/* Filter Sidebar */}
            <FilterSidebar
              filters={sidebarFilters}
              onFiltersChange={setSidebarFilters}
            />
          </div>

          {/* Main Content Area */}
          <div className="lg:col-span-3">
            <PropertiesContainerWithSuspense />
          </div>
        </div>
      </main>
    </div>
  );
}