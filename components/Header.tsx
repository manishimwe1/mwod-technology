'use client'

import { Search, User, ShoppingBag, Menu } from 'lucide-react'
import Link from 'next/link'
import { useState } from 'react'

export default function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false)

  return (
    <header className="bg-white border-b border-gray-200 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <div className="flex items-center">
            <Link href="/" className="text-2xl font-bold text-green-600">
              ElectroX
            </Link>
          </div>

          {/* Navigation */}
          <nav className="hidden md:flex items-center space-x-8">
            <Link href="/browse" className="text-gray-700 hover:text-green-600 font-medium">
              Browse
            </Link>
            <Link href="/sell" className="text-gray-700 hover:text-green-600 font-medium">
              Sell
            </Link>
            <Link href="/news" className="text-gray-700 hover:text-green-600 font-medium">
              News
            </Link>
            <Link href="/about" className="text-gray-700 hover:text-green-600 font-medium">
              About
            </Link>
          </nav>

          {/* Search */}
          <div className="hidden md:flex flex-1 max-w-lg mx-8">
            <div className="relative w-full">
              <input
                type="text"
                placeholder="Search for electronics..."
                className="w-full px-4 py-2 pl-10 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-600 focus:border-transparent"
              />
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
            </div>
          </div>

          {/* User Actions */}
          <div className="flex items-center space-x-4">
            <button className="p-2 text-gray-700 hover:text-green-600">
              <User size={24} />
            </button>
            <button className="p-2 text-gray-700 hover:text-green-600">
              <ShoppingBag size={24} />
            </button>
            <button 
              className="md:hidden p-2 text-gray-700"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
            >
              <Menu size={24} />
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        {isMenuOpen && (
          <div className="md:hidden border-t border-gray-200 py-4">
            <div className="space-y-4">
              <div className="relative">
                <input
                  type="text"
                  placeholder="Search for electronics..."
                  className="w-full px-4 py-2 pl-10 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-600"
                />
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
              </div>
              <nav className="space-y-2">
                <a href="/browse" className="block py-2 text-gray-700 hover:text-green-600">Browse</a>
                <a href="/sell" className="block py-2 text-gray-700 hover:text-green-600">Sell</a>
                <a href="/news" className="block py-2 text-gray-700 hover:text-green-600">News</a>
                <a href="/about" className="block py-2 text-gray-700 hover:text-green-600">About</a>
              </nav>
            </div>
          </div>
        )}
      </div>
    </header>
  )
}
