import { render, screen, fireEvent } from '@testing-library/react'
import { Pagination } from '../pagination'

// Mock Next.js navigation hooks
const mockPush = jest.fn()
const mockPathname = '/properties'
const mockSearchParams = new URLSearchParams('?page=2&search=house')

jest.mock('next/navigation', () => ({
  useRouter: () => ({
    push: mockPush,
  }),
  usePathname: () => mockPathname,
  useSearchParams: () => mockSearchParams,
}))

// Mock window.scrollTo
Object.defineProperty(window, 'scrollTo', {
  value: jest.fn(),
  writable: true,
})

describe('Pagination', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  it('renders nothing when totalPages is 1 or less', () => {
    const { container } = render(
      <Pagination currentPage={1} totalPages={1} totalItems={10} />
    )

    expect(container.firstChild).toBeNull()
  })

  it('renders pagination when totalPages is greater than 1', () => {
    render(
      <Pagination currentPage={2} totalPages={5} totalItems={50} />
    )

    expect(screen.getByText('Previous')).toBeInTheDocument()
    expect(screen.getByText('Next')).toBeInTheDocument()
    expect(screen.getByText('2')).toBeInTheDocument() // current page
  })

  it('disables Previous button on first page', () => {
    render(
      <Pagination currentPage={1} totalPages={5} totalItems={50} />
    )

    const previousButton = screen.getByText('Previous')
    expect(previousButton).toBeDisabled()
  })

  it('disables Next button on last page', () => {
    render(
      <Pagination currentPage={5} totalPages={5} totalItems={50} />
    )

    const nextButton = screen.getByText('Next')
    expect(nextButton).toBeDisabled()
  })

  it('highlights current page correctly', () => {
    render(
      <Pagination currentPage={3} totalPages={5} totalItems={50} />
    )

    const currentPageButton = screen.getByText('3')
    expect(currentPageButton).toHaveClass('bg-blue-50 border-blue-500 text-blue-600')
    expect(currentPageButton).toHaveAttribute('aria-current', 'page')
  })

  it('shows correct page numbers for small ranges', () => {
    render(
      <Pagination currentPage={2} totalPages={3} totalItems={30} />
    )

    expect(screen.getByText('1')).toBeInTheDocument()
    expect(screen.getByText('2')).toBeInTheDocument()
    expect(screen.getByText('3')).toBeInTheDocument()
    expect(screen.queryByText('...')).not.toBeInTheDocument()
  })

  it('has correct accessibility attributes', () => {
    render(
      <Pagination currentPage={2} totalPages={5} totalItems={50} />
    )

    const nav = screen.getByRole('navigation')
    expect(nav).toHaveAttribute('aria-label', 'Pagination')

    const previousButton = screen.getByLabelText('Previous page')
    expect(previousButton).toBeInTheDocument()

    const nextButton = screen.getByLabelText('Next page')
    expect(nextButton).toBeInTheDocument()

    const pageButton = screen.getByLabelText('Go to page 3')
    expect(pageButton).toBeInTheDocument()
  })
})
