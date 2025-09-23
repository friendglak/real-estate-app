import { PageHeader } from '@/components/page-header'
import { PropertiesContainer } from '@/components/properties-container'
import { PropertyListSkeleton } from '@/components/property-list-skeleton'
import { Suspense } from 'react'

export default function HomePage() {
  return (
    <div className="min-h-screen bg-slate-50">
      <PageHeader />
      <main className="container-responsive py-8">
        <Suspense fallback={<PropertyListSkeleton />}>
          <PropertiesContainer />
        </Suspense>
      </main>
    </div>
  )
}