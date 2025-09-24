'use client'

import { ErrorBoundary } from '@/components/error-boundary'
import { ErrorBoundaryProvider } from '@/components/error-boundary-provider'
import { Footer } from './footer'
import { Header } from '../header'

interface AppLayoutProps {
  children: React.ReactNode
}

export function AppLayout({ children }: AppLayoutProps) {
  return (
    <ErrorBoundaryProvider showErrorDetails={process.env.NODE_ENV === 'development'}>
      <div className="min-h-screen flex flex-col bg-slate-50">
        <Header />
        <main className="flex-1">
          <ErrorBoundary service="app-layout">
            {children}
          </ErrorBoundary>
        </main>
        <Footer />
      </div>
    </ErrorBoundaryProvider>
  )
}
