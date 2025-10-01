'use client'

import React, { useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { Menu, X, Plus, User, LogOut, Settings, Code2 } from 'lucide-react'
import { useApp } from '@/contexts/AppContext'
import { Button } from '@/components/ui/Button'

export function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [showUserMenu, setShowUserMenu] = useState(false)
  const { user, isAuthenticated, isDummyMode, setIsDummyMode } = useApp()
  const router = useRouter()

  const handleLogout = () => {
    // In dummy mode, just clear the user
    setShowUserMenu(false)
    // In real mode, this would call apiClient.clearToken() and redirect
  }

  const navigation = [
    { name: 'Browse Projects', href: '/projects' },
    { name: 'Featured', href: '/projects/featured' },
    { name: 'Trending', href: '/projects/trending' },
  ]

  return (
    <header className="bg-white border-b border-gray-200 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <div className="flex items-center">
            <Link href="/" className="flex items-center space-x-2">
              <Code2 className="h-8 w-8 text-blue-600" />
              <span className="text-xl font-bold text-gray-900">DevShowcase</span>
            </Link>
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex space-x-8">
            {navigation.map((item) => (
              <Link
                key={item.name}
                href={item.href}
                className="text-gray-600 hover:text-gray-900 px-3 py-2 text-sm font-medium transition-colors"
              >
                {item.name}
              </Link>
            ))}
          </nav>

          {/* Desktop Actions */}
          <div className="hidden md:flex items-center space-x-4">
            {/* Dummy Mode Toggle */}
            <label className="flex items-center space-x-2 text-sm text-gray-600">
              <input
                type="checkbox"
                checked={isDummyMode}
                onChange={(e) => setIsDummyMode(e.target.checked)}
                className="rounded"
              />
              <span>Demo Mode</span>
            </label>

            {isAuthenticated ? (
              <div className="flex items-center space-x-3">
                <Button
                  variant="primary"
                  size="sm"
                  onClick={() => router.push('/submit')}
                >
                  <Plus className="w-4 h-4 mr-1" />
                  Submit Project
                </Button>

                <div className="relative">
                  <button
                    onClick={() => setShowUserMenu(!showUserMenu)}
                    className="flex items-center space-x-2 text-gray-600 hover:text-gray-900"
                  >
                    <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center text-white text-sm font-medium">
                      {user?.first_name[0]}{user?.last_name[0]}
                    </div>
                  </button>

                  {showUserMenu && (
                    <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg py-1 z-50">
                      <Link
                        href="/profile"
                        className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                        onClick={() => setShowUserMenu(false)}
                      >
                        <User className="w-4 h-4 mr-2" />
                        Profile
                      </Link>
                      <Link
                        href="/my-projects"
                        className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                        onClick={() => setShowUserMenu(false)}
                      >
                        <Code2 className="w-4 h-4 mr-2" />
                        My Projects
                      </Link>
                      {user?.username === 'admin' && (
                        <Link
                          href="/admin"
                          className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                          onClick={() => setShowUserMenu(false)}
                        >
                          <Settings className="w-4 h-4 mr-2" />
                          Admin
                        </Link>
                      )}
                      <button
                        onClick={handleLogout}
                        className="flex items-center w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                      >
                        <LogOut className="w-4 h-4 mr-2" />
                        Logout
                      </button>
                    </div>
                  )}
                </div>
              </div>
            ) : (
              <div className="flex items-center space-x-3">
                <Button variant="ghost" size="sm" onClick={() => router.push('/login')}>
                  Login
                </Button>
                <Button variant="primary" size="sm" onClick={() => router.push('/register')}>
                  Sign Up
                </Button>
              </div>
            )}
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden">
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="text-gray-600 hover:text-gray-900"
            >
              {isMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
          </div>
        </div>

        {/* Mobile Navigation */}
        {isMenuOpen && (
          <div className="md:hidden">
            <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3 border-t border-gray-200">
              {navigation.map((item) => (
                <Link
                  key={item.name}
                  href={item.href}
                  className="text-gray-600 hover:text-gray-900 block px-3 py-2 text-base font-medium"
                  onClick={() => setIsMenuOpen(false)}
                >
                  {item.name}
                </Link>
              ))}
              
              <div className="pt-4 pb-2 border-t border-gray-200">
                <label className="flex items-center space-x-2 text-sm text-gray-600 px-3 py-2">
                  <input
                    type="checkbox"
                    checked={isDummyMode}
                    onChange={(e) => setIsDummyMode(e.target.checked)}
                    className="rounded"
                  />
                  <span>Demo Mode</span>
                </label>
              </div>

              {isAuthenticated ? (
                <div className="pt-2 space-y-1">
                  <Button
                    variant="primary"
                    className="w-full"
                    onClick={() => {
                      setIsMenuOpen(false)
                      router.push('/submit')
                    }}
                  >
                    <Plus className="w-4 h-4 mr-1" />
                    Submit Project
                  </Button>
                </div>
              ) : (
                <div className="pt-2 space-y-2">
                  <Button
                    variant="ghost"
                    className="w-full"
                    onClick={() => {
                      setIsMenuOpen(false)
                      router.push('/login')
                    }}
                  >
                    Login
                  </Button>
                  <Button
                    variant="primary"
                    className="w-full"
                    onClick={() => {
                      setIsMenuOpen(false)
                      router.push('/register')
                    }}
                  >
                    Sign Up
                  </Button>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </header>
  )
}