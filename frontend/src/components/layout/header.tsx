'use client'

import { useState } from 'react'
import Link from 'next/link'
import { Search, Menu, X } from 'lucide-react'
import { Button } from '@/components/ui/button'

export function Header() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(prev => !prev)
  }

  return (
    <header className="bg-white shadow-sm border-b border-slate-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-sm">RE</span>
            </div>
            <span className="text-xl font-bold text-slate-900">RealEstate</span>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-8">
            <Link 
              href="/properties" 
              className="text-slate-600 hover:text-slate-900 transition-colors"
            >
              Properties
            </Link>
            <Link 
              href="/about" 
              className="text-slate-600 hover:text-slate-900 transition-colors"
            >
              About
            </Link>
            <Link 
              href="/contact" 
              className="text-slate-600 hover:text-slate-900 transition-colors"
            >
              Contact
            </Link>
          </nav>

          {/* Desktop Actions */}
          <div className="hidden md:flex items-center space-x-4">
            <Button variant="ghost" size="sm">
              <Search size={18} />
              Search
            </Button>
            <Button variant="primary" size="sm">
              Sign In
            </Button>
          </div>

          {/* Mobile Menu Button */}
          <Button
            variant="ghost"
            size="sm"
            className="md:hidden"
            onClick={toggleMobileMenu}
            aria-label="Toggle mobile menu"
          >
            {isMobileMenuOpen ? <X size={20} /> : <Menu size={20} />}
          </Button>
        </div>

        {/* Mobile Navigation */}
        {isMobileMenuOpen && (
          <div className="md:hidden border-t border-slate-200 py-4">
            <nav className="flex flex-col space-y-4">
              <Link 
                href="/properties" 
                className="text-slate-600 hover:text-slate-900 transition-colors"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                Properties
              </Link>
              <Link 
                href="/about" 
                className="text-slate-600 hover:text-slate-900 transition-colors"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                About
              </Link>
              <Link 
                href="/contact" 
                className="text-slate-600 hover:text-slate-900 transition-colors"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                Contact
              </Link>
              <div className="flex flex-col space-y-2 pt-4 border-t border-slate-200">
                <Button variant="ghost" size="sm" className="justify-start">
                  <Search size={18} />
                  Search
                </Button>
                <Button variant="primary" size="sm" className="justify-start">
                  Sign In
                </Button>
              </div>
            </nav>
          </div>
        )}
      </div>
    </header>
  )
}

