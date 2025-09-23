export function PropertyListSkeleton() {
  return (
    <div className="space-y-6">
      {/* Filter skeleton */}
      <div className="bg-white rounded-lg shadow-md p-6 animate-pulse">
        <div className="h-6 bg-slate-200 rounded w-48 mb-4"></div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {[...Array(4)].map((_, i) => (
            <div key={i}>
              <div className="h-4 bg-slate-200 rounded w-24 mb-2"></div>
              <div className="h-10 bg-slate-200 rounded"></div>
            </div>
          ))}
        </div>
      </div>

      {/* Properties grid skeleton */}
      <div className="properties-grid">
        {[...Array(12)].map((_, i) => (
          <div key={i} className="bg-white rounded-lg shadow-md overflow-hidden animate-pulse">
            <div className="aspect-property bg-slate-200"></div>
            <div className="p-4">
              <div className="h-6 bg-slate-200 rounded mb-2"></div>
              <div className="h-4 bg-slate-200 rounded mb-3 w-3/4"></div>
              <div className="flex justify-between items-center">
                <div className="h-6 bg-slate-200 rounded w-24"></div>
                <div className="h-4 bg-slate-200 rounded w-20"></div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}