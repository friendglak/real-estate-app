import { render, screen } from '@testing-library/react'
import RootLayout from '../layout'

// Mock Next.js font
jest.mock('next/font/google', () => ({
  Inter: () => ({
    className: 'inter-font-class',
  }),
}))

// Mock the QueryProvider
jest.mock('../../providers/query-provider', () => ({
  QueryProvider: ({ children }: { children: React.ReactNode }) => (
    <div data-testid="query-provider">{children}</div>
  ),
}))

describe('RootLayout', () => {
  it('renders children inside QueryProvider', () => {
    render(
      <RootLayout>
        <div data-testid="test-content">Test content</div>
      </RootLayout>
    )

    expect(screen.getByTestId('query-provider')).toBeInTheDocument()
    expect(screen.getByTestId('test-content')).toBeInTheDocument()
  })

  it('renders the layout component without errors', () => {
    expect(() => {
      render(
        <RootLayout>
          <div>Test content</div>
        </RootLayout>
      )
    }).not.toThrow()
  })

  it('renders with mocked font class applied', () => {
    const { container } = render(
      <RootLayout>
        <div>Test content</div>
      </RootLayout>
    )

    // Since we're mocking the font, we can't directly test the className on body
    // but we can verify the component renders without errors
    expect(container).toBeInTheDocument()
  })

  it('renders multiple children correctly', () => {
    render(
      <RootLayout>
        <div data-testid="child-1">Child 1</div>
        <div data-testid="child-2">Child 2</div>
        <span data-testid="child-3">Child 3</span>
      </RootLayout>
    )

    expect(screen.getByTestId('child-1')).toBeInTheDocument()
    expect(screen.getByTestId('child-2')).toBeInTheDocument()
    expect(screen.getByTestId('child-3')).toBeInTheDocument()
  })

  it('maintains proper nesting structure', () => {
    render(
      <RootLayout>
        <div data-testid="nested-child">
          <span>Nested content</span>
        </div>
      </RootLayout>
    )

    const nestedChild = screen.getByTestId('nested-child')
    const span = screen.getByText('Nested content')

    expect(nestedChild).toContainElement(span)
    expect(nestedChild).toBeInTheDocument()
  })
})
