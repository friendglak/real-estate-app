import { Inter } from 'next/font/google'
import './globals.css'
import type { Metadata } from 'next'
import { ErrorBoundary } from '@/components/error-boundary'
import { QueryProvider } from '@/providers/query-provider'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'Real Estate Properties - Find Your Dream Home',
  description: 'Browse our extensive collection of real estate properties. Find your perfect home with advanced search filters.',
  keywords: 'real estate, properties, homes, houses, apartments, buy, rent',
  authors: [{ name: 'Real Estate Team' }],
  creator: 'Real Estate Platform',
  publisher: 'Real Estate Company',
  robots: {
    index: true,
    follow: true,
  },
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: 'https://your-domain.com',
    title: 'Real Estate Properties - Find Your Dream Home',
    description: 'Browse our extensive collection of real estate properties.',
    siteName: 'Real Estate Properties',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Real Estate Properties',
    description: 'Find your perfect home today',
    creator: '@realestate',
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body
        className={inter.className}
        suppressHydrationWarning={true}
      >
        <QueryProvider>
          <ErrorBoundary>
            {children}
          </ErrorBoundary>
        </QueryProvider>
      </body>
    </html>
  )
}