import { render, screen } from '@testing-library/react'
import { PropertiesContainer } from '../properties-container'

// Mock the child components
jest.mock('../property-filters-wrapper', () => ({
  PropertyFiltersWrapper: () => <div data-testid="property-filters-wrapper">Property Filters Wrapper</div>,
}))

jest.mock('../property-grid-wrapper', () => ({
  PropertyGridWrapper: () => <div data-testid="property-grid-wrapper">Property Grid Wrapper</div>,
}))

describe('PropertiesContainer', () => {
  it('renders the container with correct structure', () => {
    render(<PropertiesContainer />)

    const container = screen.getByTestId('property-filters-wrapper').parentElement
    expect(container).toHaveClass('space-y-6')
  })

  it('renders PropertyFiltersWrapper component', () => {
    render(<PropertiesContainer />)

    expect(screen.getByTestId('property-filters-wrapper')).toBeInTheDocument()
  })

  it('renders PropertyGridWrapper component', () => {
    render(<PropertiesContainer />)

    expect(screen.getByTestId('property-grid-wrapper')).toBeInTheDocument()
  })

  it('renders both child components in correct order', () => {
    const { container } = render(<PropertiesContainer />)

    const filtersWrapper = screen.getByTestId('property-filters-wrapper')
    const gridWrapper = screen.getByTestId('property-grid-wrapper')

    expect(container.firstChild).toContainElement(filtersWrapper)
    expect(container.firstChild).toContainElement(gridWrapper)

    // Check that filters wrapper comes before grid wrapper
    const children = Array.from((container.firstChild as HTMLElement)?.children || [])
    const filtersIndex = children.indexOf(filtersWrapper)
    const gridIndex = children.indexOf(gridWrapper)

    expect(filtersIndex).toBeLessThan(gridIndex)
  })

  it('applies correct spacing classes', () => {
    const { container } = render(<PropertiesContainer />)

    const mainContainer = container.firstChild as HTMLElement
    expect(mainContainer).toHaveClass('space-y-6')
  })
})
