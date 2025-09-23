'use client'

import { useRouter, useSearchParams, usePathname } from 'next/navigation'
import { ChevronLeft, ChevronRight } from 'lucide-react'

interface PaginationProps {
  currentPage: number
  totalPages: number
  totalItems: number
}

export function Pagination({ currentPage, totalPages, totalItems }: PaginationProps) {
  const router = useRouter()
  const pathname = usePathname()
  const searchParams = useSearchParams()

  if (totalPages <= 1) return null

  const navigateToPage = (page: number) => {
    const params = new URLSearchParams(searchParams.toString())
    if (page === 1) {
      params.delete('page')
    } else {
      params.set('page', String(page))
    }

    const newUrl = params.toString() ? `${pathname}?${params.toString()}` : pathname
    router.push(newUrl)

    // Scroll to top
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  const getVisiblePages = () => {
    const delta = 2
    const range = []
    const rangeWithDots = []

    for (
      let i = Math.max(2, currentPage - delta);
      i <= Math.min(totalPages - 1, currentPage + delta);
      i++
    ) {
      range.push(i)
    }

    if (currentPage - delta > 2) {
      rangeWithDots.push(1, '...')
    } else {
      rangeWithDots.push(1)
    }

    rangeWithDots.push(...range)

    if (currentPage + delta < totalPages - 1) {
      rangeWithDots.push('...', totalPages)
    } else if (totalPages > 1) {
      rangeWithDots.push(totalPages)
    }

    return rangeWithDots
  }

  const visiblePages = getVisiblePages()

  return (
    <nav className="flex items-center justify-between" aria-label="Pagination">
      <div className="flex-1 flex justify-between sm:hidden">
        {/* Mobile pagination */}
        <button
          onClick={() => navigateToPage(currentPage - 1)}
          disabled={currentPage <= 1}
          className="btn-outline disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <ChevronLeft size={16} />
          Previous
        </button>
        <button
          onClick={() => navigateToPage(currentPage + 1)}
          disabled={currentPage >= totalPages}
          className="btn-outline disabled:opacity-50 disabled:cursor-not-allowed"
        >
          Next
          <ChevronRight size={16} />
        </button>
      </div>

      <div className="hidden sm:flex sm:flex-1 sm:items-center sm:justify-between">
        <div>
          <p className="text-sm text-slate-700">
            Showing{' '}
            <span className="font-medium">{((currentPage - 1) * 12) + 1}</span>
            {' '}to{' '}
            <span className="font-medium">{Math.min(currentPage * 12, totalItems)}</span>
            {' '}of{' '}
            <span className="font-medium">{totalItems}</span>
            {' '}results
          </p>
        </div>

        <div className="flex items-center space-x-1">
          {/* Previous Button */}
          <button
            onClick={() => navigateToPage(currentPage - 1)}
            disabled={currentPage <= 1}
            className="relative inline-flex items-center px-2 py-2 rounded-l-md border border-slate-300 bg-white text-sm font-medium text-slate-500 hover:bg-slate-50 disabled:opacity-50 disabled:cursor-not-allowed focus-ring"
            aria-label="Previous page"
          >
            <ChevronLeft size={16} />
          </button>

          {/* Page Numbers */}
          {visiblePages.map((page, index) => (
            <div key={index}>
              {page === '...' ? (
                <span className="relative inline-flex items-center px-4 py-2 border border-slate-300 bg-white text-sm font-medium text-slate-700">
                  ...
                </span>
              ) : (
                <button
                  onClick={() => navigateToPage(page as number)}
                  className={`relative inline-flex items-center px-4 py-2 border text-sm font-medium focus-ring ${page === currentPage
                    ? 'z-10 bg-blue-50 border-blue-500 text-blue-600'
                    : 'bg-white border-slate-300 text-slate-500 hover:bg-slate-50'
                    }`}
                  aria-label={`Go to page ${page}`}
                  aria-current={page === currentPage ? 'page' : undefined}
                >
                  {page}
                </button>
              )}
            </div>
          ))}

          {/* Next Button */}
          <button
            onClick={() => navigateToPage(currentPage + 1)}
            disabled={currentPage >= totalPages}
            className="relative inline-flex items-center px-2 py-2 rounded-r-md border border-slate-300 bg-white text-sm font-medium text-slate-500 hover:bg-slate-50 disabled:opacity-50 disabled:cursor-not-allowed focus-ring"
            aria-label="Next page"
          >
            <ChevronRight size={16} />
          </button>
        </div>
      </div>
    </nav>
  )
}