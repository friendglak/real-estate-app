'use client'

import Link from 'next/link'

export function Footer() {
  return (
    <footer className="bg-slate-900 text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Company Info */}
          <div className="col-span-1 md:col-span-2">
            <Link href="/" className="flex items-center space-x-2 mb-4">
              <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-sm">RE</span>
              </div>
              <span className="text-xl font-bold">RealEstate</span>
            </Link>
            <p className="text-slate-300 mb-4 max-w-md">
              Find your perfect property with our comprehensive real estate platform. 
              Browse thousands of listings and connect with trusted agents.
            </p>
            <div className="flex space-x-4">
              {/* Social media links would go here */}
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Quick Links</h3>
            <ul className="space-y-2">
              <li>
                <Link href="/properties" className="text-slate-300 hover:text-white transition-colors">
                  Browse Properties
                </Link>
              </li>
              <li>
                <Link href="/sell" className="text-slate-300 hover:text-white transition-colors">
                  Sell Property
                </Link>
              </li>
              <li>
                <Link href="/agents" className="text-slate-300 hover:text-white transition-colors">
                  Find Agents
                </Link>
              </li>
              <li>
                <Link href="/calculator" className="text-slate-300 hover:text-white transition-colors">
                  Mortgage Calculator
                </Link>
              </li>
            </ul>
          </div>

          {/* Support */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Support</h3>
            <ul className="space-y-2">
              <li>
                <Link href="/help" className="text-slate-300 hover:text-white transition-colors">
                  Help Center
                </Link>
              </li>
              <li>
                <Link href="/contact" className="text-slate-300 hover:text-white transition-colors">
                  Contact Us
                </Link>
              </li>
              <li>
                <Link href="/privacy" className="text-slate-300 hover:text-white transition-colors">
                  Privacy Policy
                </Link>
              </li>
              <li>
                <Link href="/terms" className="text-slate-300 hover:text-white transition-colors">
                  Terms of Service
                </Link>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-slate-700 mt-8 pt-8 text-center">
          <p className="text-slate-300">
            © {new Date().getFullYear()} RealEstate. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  )
}

