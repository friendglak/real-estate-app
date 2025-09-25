import { render } from '@testing-library/react'
import { PropertyListSkeleton } from '../property-list-skeleton'

describe('PropertyListSkeleton', () => {
  it('renders the skeleton container', () => {
    const { container } = render(<PropertyListSkeleton />)

    const mainContainer = container.firstChild as HTMLElement
    expect(mainContainer).toHaveClass('space-y-6')
  })

  it('renders filter skeleton section', () => {
    const { container } = render(<PropertyListSkeleton />)

    const filterSkeleton = container.querySelector('.bg-white.rounded-lg.shadow-md.p-6.animate-pulse')
    expect(filterSkeleton).toBeInTheDocument()
  })

  it('renders filter skeleton title', () => {
    const { container } = render(<PropertyListSkeleton />)

    const titleSkeleton = container.querySelector('.h-6.bg-slate-200.rounded.w-48.mb-4')
    expect(titleSkeleton).toBeInTheDocument()
  })

  it('renders 4 filter skeleton items', () => {
    const { container } = render(<PropertyListSkeleton />)

    const filterGrid = container.querySelector('.grid.grid-cols-1.md\\:grid-cols-2.lg\\:grid-cols-4.gap-4')
    expect(filterGrid).toBeInTheDocument()

    // Count the direct children divs (each filter item is wrapped in a div)
    const filterItems = filterGrid?.children
    expect(filterItems).toHaveLength(4)
  })

  it('renders properties grid skeleton', () => {
    const { container } = render(<PropertyListSkeleton />)

    const propertiesGrid = container.querySelector('.properties-grid')
    expect(propertiesGrid).toBeInTheDocument()
  })

  it('renders 12 property skeleton cards', () => {
    const { container } = render(<PropertyListSkeleton />)

    const propertyCards = container.querySelectorAll('.bg-white.rounded-lg.shadow-md.overflow-hidden.animate-pulse')
    expect(propertyCards).toHaveLength(12)
  })

  it('each property card has correct skeleton structure', () => {
    const { container } = render(<PropertyListSkeleton />)

    const propertyCard = container.querySelector('.bg-white.rounded-lg.shadow-md.overflow-hidden.animate-pulse')
    expect(propertyCard).toBeInTheDocument()

    // Check for image skeleton
    const imageSkeleton = propertyCard?.querySelector('.aspect-property.bg-slate-200')
    expect(imageSkeleton).toBeInTheDocument()

    // Check for content skeleton
    const contentSkeleton = propertyCard?.querySelector('.p-4')
    expect(contentSkeleton).toBeInTheDocument()

    // Check for title skeleton
    const titleSkeleton = contentSkeleton?.querySelector('.h-6.bg-slate-200.rounded.mb-2')
    expect(titleSkeleton).toBeInTheDocument()

    // Check for description skeleton
    const descSkeleton = contentSkeleton?.querySelector('.h-4.bg-slate-200.rounded.mb-3.w-3\\/4')
    expect(descSkeleton).toBeInTheDocument()

    // Check for price and status skeletons
    const priceStatusContainer = contentSkeleton?.querySelector('.flex.justify-between.items-center')
    expect(priceStatusContainer).toBeInTheDocument()

    const priceSkeleton = priceStatusContainer?.querySelector('.h-6.bg-slate-200.rounded.w-24')
    expect(priceSkeleton).toBeInTheDocument()

    const statusSkeleton = priceStatusContainer?.querySelector('.h-4.bg-slate-200.rounded.w-20')
    expect(statusSkeleton).toBeInTheDocument()
  })

  it('applies correct animation classes', () => {
    const { container } = render(<PropertyListSkeleton />)

    const animatedElements = container.querySelectorAll('.animate-pulse')
    expect(animatedElements.length).toBeGreaterThan(0)
  })

  it('applies correct responsive grid classes', () => {
    const { container } = render(<PropertyListSkeleton />)

    const filterGrid = container.querySelector('.grid.grid-cols-1.md\\:grid-cols-2.lg\\:grid-cols-4.gap-4')
    expect(filterGrid).toHaveClass('grid-cols-1', 'md:grid-cols-2', 'lg:grid-cols-4', 'gap-4')
  })
})
