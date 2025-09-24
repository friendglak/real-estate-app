'use client'

import { Suspense } from 'react'
import { PropertiesContainer } from './properties-container'
import { LoadingSpinner } from './loading-spinner'

function PropertiesContainerSuspended() {
  return <PropertiesContainer />
}

export function PropertiesContainerWithSuspense() {
  return (
    <Suspense fallback={
      <div className="flex justify-center py-12">
        <LoadingSpinner size={32} text="Loading properties..." />
      </div>
    }>
      <PropertiesContainerSuspended />
    </Suspense>
  )
}
