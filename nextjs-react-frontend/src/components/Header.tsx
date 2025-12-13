'use client'

import React, { useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { Menu, X, Plus, User, LogOut, Settings, Code2, Terminal, Sparkles } from 'lucide-react'
import { useApp } from '@/contexts/AppContext'
import { useLanguage } from '@/contexts/LanguageContext'
import { useTheme } from '@/contexts/ThemeContext'
import { ThemeSwitcher } from '@/components/ThemeSwitcher'
import { apiClient } from '@/lib/api'

export function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [showUserMenu, setShowUserMenu] = useState(false)
  const { user, isAuthenticated, setUser } = useApp()
  const { t, isLoaded } = useLanguage()
  const { theme } = useTheme()
  const router = useRouter()

  const handleLogout = () => {
    setShowUserMenu(false)
    apiClient.clearToken()
    setUser(null)
    router.push('/')
  }

  const navigation: { name: string; href: string }[] = []

  // Theme-specific styles
  const getHeaderStyles = () => {
    switch (theme) {
      case 'wip':
        return 'bg-[#0d0d0d] border-b border-[#333]'
      case 'futuristic':
        return 'bg-[#030712]/80 backdrop-blur-lg border-b border-[#1e293b]'
      case 'bright':
        return 'bg-white/80 backdrop-blur-lg border-b border-orange-100 shadow-sm'
      default:
        return 'bg-white border-b border-gray-200'
    }
  }

  const getLogoStyles = () => {
    switch (theme) {
      case 'wip':
        return {
          icon: 'text-[#22c55e]',
          text: 'text-[#e5e5e5] font-mono'
        }
      case 'futuristic':
        return {
          icon: 'text-cyan-400',
          text: 'text-white font-bold'
        }
      case 'bright':
        return {
          icon: 'text-orange-500',
          text: 'text-gray-900 font-bold'
        }
      default:
        return {
          icon: 'text-blue-600',
          text: 'text-gray-900'
        }
    }
  }

  const getNavLinkStyles = () => {
    switch (theme) {
      case 'wip':
        return 'text-[#737373] hover:text-[#22c55e]'
      case 'futuristic':
        return 'text-[#64748b] hover:text-cyan-400'
      case 'bright':
        return 'text-gray-600 hover:text-orange-500'
      default:
        return 'text-gray-600 hover:text-gray-900'
    }
  }

  const getButtonStyles = () => {
    switch (theme) {
      case 'wip':
        return {
          primary: 'bg-[#22c55e] text-[#0d0d0d] hover:bg-[#16a34a] rounded-none font-mono text-sm',
          ghost: 'text-[#a3a3a3] hover:text-[#22c55e] border border-[#333] hover:border-[#22c55e] rounded-none'
        }
      case 'futuristic':
        return {
          primary: 'bg-gradient-to-r from-cyan-500 to-blue-600 text-white hover:from-cyan-400 hover:to-blue-500 shadow-lg shadow-cyan-500/25',
          ghost: 'text-purple-400 border border-purple-500/50 hover:bg-purple-500/10'
        }
      case 'bright':
        return {
          primary: 'bg-gradient-to-r from-orange-500 to-pink-500 text-white hover:from-orange-400 hover:to-pink-400 rounded-full',
          ghost: 'text-purple-600 border border-purple-300 hover:bg-purple-50 rounded-full'
        }
      default:
        return {
          primary: '',
          ghost: ''
        }
    }
  }

  const LogoIcon = () => {
    switch (theme) {
      case 'wip':
        return <Terminal className={`h-6 w-6 ${getLogoStyles().icon}`} />
      case 'futuristic':
        return <Code2 className={`h-7 w-7 ${getLogoStyles().icon}`} />
      case 'bright':
        return <Sparkles className={`h-7 w-7 ${getLogoStyles().icon}`} />
      default:
        return <Code2 className={`h-8 w-8 ${getLogoStyles().icon}`} />
    }
  }

  const logoStyles = getLogoStyles()
  const buttonStyles = getButtonStyles()

  // Fallback while translations are loading
  if (!isLoaded) {
    return (
      <header className={`sticky top-0 z-50 ${getHeaderStyles()}`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center">
              <Link href="/" className="flex items-center space-x-2">
                <LogoIcon />
                <span className={`text-xl ${logoStyles.text}`}>krí1.is</span>
              </Link>
            </div>
            <div className="text-sm text-gray-500">Loading...</div>
          </div>
        </div>
      </header>
    )
  }

  return (
    <header className={`sticky top-0 z-50 ${getHeaderStyles()}`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <div className="flex items-center">
            <Link href="/" className="flex items-center space-x-2">
              <LogoIcon />
              <span className={`text-xl ${logoStyles.text}`}>krí1.is</span>
              {theme === 'wip' && (
                <span className="text-xs text-[#fbbf24] border border-[#fbbf24] px-1.5 py-0.5 ml-2">
                  ALPHA
                </span>
              )}
            </Link>
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex space-x-8">
            {navigation.map((item) => (
              <Link
                key={item.name}
                href={item.href}
                className={`${getNavLinkStyles()} px-3 py-2 text-sm font-medium transition-colors`}
              >
                {item.name}
              </Link>
            ))}
          </nav>

          {/* Desktop Actions */}
          <div className="hidden md:flex items-center space-x-4">
            {/* Theme Switcher */}
            { /* <ThemeSwitcher /> */}

            {isAuthenticated ? (
              <div className="flex items-center space-x-3">
                <button
                  onClick={() => router.push('/submit')}
                  className={`flex items-center gap-1.5 px-4 py-2 text-sm font-medium transition-all ${buttonStyles.primary}`}
                >
                  <Plus className="w-4 h-4" />
                  {t('nav.submitProject')}
                </button>

                <div className="relative">
                  <button
                    onClick={() => setShowUserMenu(!showUserMenu)}
                    className={`flex items-center space-x-2 ${getNavLinkStyles()}`}
                  >
                    <div className={`w-8 h-8 ${theme === 'wip' ? 'bg-[#22c55e]' : theme === 'futuristic' ? 'bg-gradient-to-r from-cyan-500 to-purple-500' : 'bg-gradient-to-r from-orange-500 to-pink-500'} ${theme === 'bright' ? 'rounded-full' : theme === 'wip' ? 'rounded-none' : 'rounded-lg'} flex items-center justify-center text-white text-sm font-medium`}>
                      {user?.first_name[0]}{user?.last_name[0]}
                    </div>
                  </button>

                  {showUserMenu && (
                    <div className={`absolute right-0 mt-2 w-48 ${theme === 'wip' ? 'bg-[#171717] border border-[#333]' : theme === 'futuristic' ? 'bg-[#0f172a] border border-[#1e293b]' : 'bg-white border border-orange-100'} rounded-md shadow-lg py-1 z-50`}>
                      <Link
                        href="/profile"
                        className={`flex items-center px-4 py-2 text-sm ${getNavLinkStyles()}`}
                        onClick={() => setShowUserMenu(false)}
                      >
                        <User className="w-4 h-4 mr-2" />
                        {t('nav.profile')}
                      </Link>
                      <Link
                        href="/my-projects"
                        className={`flex items-center px-4 py-2 text-sm ${getNavLinkStyles()}`}
                        onClick={() => setShowUserMenu(false)}
                      >
                        <Code2 className="w-4 h-4 mr-2" />
                        {t('nav.myProjects')}
                      </Link>
                      {user?.username === 'admin' && (
                        <Link
                          href="/admin"
                          className={`flex items-center px-4 py-2 text-sm ${getNavLinkStyles()}`}
                          onClick={() => setShowUserMenu(false)}
                        >
                          <Settings className="w-4 h-4 mr-2" />
                          {t('nav.admin')}
                        </Link>
                      )}
                      <button
                        onClick={handleLogout}
                        className={`flex items-center w-full px-4 py-2 text-sm ${getNavLinkStyles()}`}
                      >
                        <LogOut className="w-4 h-4 mr-2" />
                        {t('nav.logout')}
                      </button>
                    </div>
                  )}
                </div>
              </div>
            ) : (
              <div className="flex items-center space-x-3">
                <button
                  onClick={() => router.push('/login')}
                  className={`px-4 py-2 text-sm font-medium transition-all ${buttonStyles.ghost}`}
                >
                  {t('nav.login')}
                </button>
                <button
                  onClick={() => router.push('/register')}
                  className={`flex items-center gap-1.5 px-4 py-2 text-sm font-medium transition-all ${buttonStyles.primary}`}
                >
                  {t('nav.signUp')}
                </button>
              </div>
            )}
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden">
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className={getNavLinkStyles()}
            >
              {isMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
          </div>
        </div>

        {/* Mobile Navigation */}
        {isMenuOpen && (
          <div className="md:hidden">
            <div className={`px-2 pt-2 pb-3 space-y-1 sm:px-3 border-t ${theme === 'wip' ? 'border-[#333]' : theme === 'futuristic' ? 'border-[#1e293b]' : 'border-orange-100'}`}>
              {navigation.map((item) => (
                <Link
                  key={item.name}
                  href={item.href}
                  className={`${getNavLinkStyles()} block px-3 py-2 text-base font-medium`}
                  onClick={() => setIsMenuOpen(false)}
                >
                  {item.name}
                </Link>
              ))}

              <div className="pt-4 pb-2 border-t border-gray-200">
                <div className="px-3 py-2 space-y-3">
                  <ThemeSwitcher />
                </div>
              </div>

              {isAuthenticated ? (
                <div className="pt-2 space-y-1">
                  <button
                    onClick={() => {
                      setIsMenuOpen(false)
                      router.push('/submit')
                    }}
                    className={`w-full flex items-center justify-center gap-1.5 px-4 py-2 text-sm font-medium transition-all ${buttonStyles.primary}`}
                  >
                    <Plus className="w-4 h-4" />
                    {t('nav.submitProject')}
                  </button>
                </div>
              ) : (
                <div className="pt-2 space-y-2">
                  <button
                    onClick={() => {
                      setIsMenuOpen(false)
                      router.push('/login')
                    }}
                    className={`w-full px-4 py-2 text-sm font-medium transition-all ${buttonStyles.ghost}`}
                  >
                    {t('nav.login')}
                  </button>
                  <button
                    onClick={() => {
                      setIsMenuOpen(false)
                      router.push('/register')
                    }}
                    className={`w-full flex items-center justify-center gap-1.5 px-4 py-2 text-sm font-medium transition-all ${buttonStyles.primary}`}
                  >
                    {t('nav.signUp')}
                  </button>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </header>
  )
}
