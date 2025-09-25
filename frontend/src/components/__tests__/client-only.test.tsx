import { render, screen, waitFor } from '@testing-library/react'
import { ClientOnly } from '../client-only'

describe('ClientOnly', () => {
  it('renders children after mounting on client side', async () => {
    render(
      <ClientOnly fallback={<div>Loading...</div>}>
        <div>Client content</div>
      </ClientOnly>
    )

    // In testing environment, useEffect runs synchronously, so children are shown immediately
    expect(screen.getByText('Client content')).toBeInTheDocument()
    expect(screen.queryByText('Loading...')).not.toBeInTheDocument()
  })

  it('renders null fallback by default', () => {
    render(
      <ClientOnly>
        <div>Client content</div>
      </ClientOnly>
    )

    // In testing environment, useEffect runs synchronously, so children are shown immediately
    expect(screen.getByText('Client content')).toBeInTheDocument()
  })

  it('renders children after mounting with no fallback', async () => {
    render(
      <ClientOnly>
        <div>Client content</div>
      </ClientOnly>
    )

    await waitFor(() => {
      expect(screen.getByText('Client content')).toBeInTheDocument()
    })
  })

  it('handles multiple children', async () => {
    render(
      <ClientOnly fallback={<div>Loading...</div>}>
        <div>Child 1</div>
        <div>Child 2</div>
        <span>Child 3</span>
      </ClientOnly>
    )

    await waitFor(() => {
      expect(screen.getByText('Child 1')).toBeInTheDocument()
      expect(screen.getByText('Child 2')).toBeInTheDocument()
      expect(screen.getByText('Child 3')).toBeInTheDocument()
    })
  })

  it('handles complex fallback content', async () => {
    const complexFallback = (
      <div>
        <h2>Loading...</h2>
        <p>Please wait while we load the content</p>
        <div>Spinner here</div>
      </div>
    )

    render(
      <ClientOnly fallback={complexFallback}>
        <div>Client content</div>
      </ClientOnly>
    )

    // In testing environment, useEffect runs synchronously, so children are shown immediately
    expect(screen.getByText('Client content')).toBeInTheDocument()
    expect(screen.queryByText('Loading...')).not.toBeInTheDocument()
    expect(screen.queryByText('Please wait while we load the content')).not.toBeInTheDocument()
    expect(screen.queryByText('Spinner here')).not.toBeInTheDocument()
  })

  it('handles empty children', async () => {
    render(
      <ClientOnly fallback={<div>Loading...</div>}>
        {null}
      </ClientOnly>
    )

    await waitFor(() => {
      expect(screen.queryByText('Loading...')).not.toBeInTheDocument()
    })
  })

  it('handles conditional children', async () => {
    const shouldShow = true

    render(
      <ClientOnly fallback={<div>Loading...</div>}>
        {shouldShow && <div>Conditional content</div>}
      </ClientOnly>
    )

    await waitFor(() => {
      expect(screen.getByText('Conditional content')).toBeInTheDocument()
    })
  })

  it('maintains state across re-renders', async () => {
    const { rerender } = render(
      <ClientOnly fallback={<div>Loading...</div>}>
        <div>Client content</div>
      </ClientOnly>
    )

    await waitFor(() => {
      expect(screen.getByText('Client content')).toBeInTheDocument()
    })

    // Re-render with same props
    rerender(
      <ClientOnly fallback={<div>Loading...</div>}>
        <div>Client content</div>
      </ClientOnly>
    )

    // Should still show children (not fallback)
    expect(screen.getByText('Client content')).toBeInTheDocument()
    expect(screen.queryByText('Loading...')).not.toBeInTheDocument()
  })
})
