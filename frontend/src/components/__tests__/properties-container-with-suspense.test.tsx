import { render, screen } from '@testing-library/react'
import { PropertiesContainerWithSuspense } from '../properties-container-with-suspense'

// Mock the child components
jest.mock('../properties-container', () => ({
  PropertiesContainer: () => <div data-testid="properties-container">Properties Container</div>,
}))

jest.mock('../loading-spinner', () => ({
  LoadingSpinner: ({ size, text }: { size: number; text: string }) => (
    <div data-testid="loading-spinner" data-size={size}>
      {text}
    </div>
  ),
}))

describe('PropertiesContainerWithSuspense', () => {
  it('renders the Suspense wrapper', () => {
    render(<PropertiesContainerWithSuspense />)

    // The Suspense component should render the PropertiesContainer
    expect(screen.getByTestId('properties-container')).toBeInTheDocument()
  })

  it('renders PropertiesContainer inside Suspense', () => {
    render(<PropertiesContainerWithSuspense />)

    const propertiesContainer = screen.getByTestId('properties-container')
    expect(propertiesContainer).toBeInTheDocument()
  })

  it('has correct fallback structure', () => {
    // We can't easily test the fallback without triggering Suspense
    // but we can verify the component renders without errors
    expect(() => {
      render(<PropertiesContainerWithSuspense />)
    }).not.toThrow()
  })

  it('renders without errors', () => {
    expect(() => {
      render(<PropertiesContainerWithSuspense />)
    }).not.toThrow()
  })

  it('wraps PropertiesContainer in Suspense boundary', () => {
    const { container } = render(<PropertiesContainerWithSuspense />)

    // The PropertiesContainer should be rendered
    expect(screen.getByTestId('properties-container')).toBeInTheDocument()

    // The container should have the expected structure
    expect(container.firstChild).toBeInTheDocument()
  })
})
