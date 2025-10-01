'use client'

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react'
import { User } from '@/types/api'
import { LanguageProvider } from './LanguageContext'
import { apiClient } from '@/lib/api'

interface AppContextType {
  user: User | null
  setUser: (user: User | null) => void
  isAuthenticated: boolean
  isLoading: boolean
}

const AppContext = createContext<AppContextType | undefined>(undefined)

export function AppProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  const isAuthenticated = !!user

  // Restore user state from token on app load
  useEffect(() => {
    const initializeAuth = async () => {
      try {
        setIsLoading(true)
        const userData = await apiClient.validateToken()
        if (userData) {
          setUser(userData)
        }
      } catch (error) {
        console.error('Error validating token:', error)
      } finally {
        setIsLoading(false)
      }
    }

    initializeAuth()
  }, [])

  // Listen for unauthorized events from API client
  useEffect(() => {
    const handleUnauthorized = () => {
      setUser(null)
      // Optionally redirect to login
      if (typeof window !== 'undefined') {
        window.location.href = '/login'
      }
    }

    if (typeof window !== 'undefined') {
      window.addEventListener('unauthorized', handleUnauthorized)
      return () => window.removeEventListener('unauthorized', handleUnauthorized)
    }
  }, [])

  return (
    <LanguageProvider>
      <AppContext.Provider value={{
        user,
        setUser,
        isAuthenticated,
        isLoading
      }}>
        {children}
      </AppContext.Provider>
    </LanguageProvider>
  )
}

export function useApp() {
  const context = useContext(AppContext)
  if (context === undefined) {
    throw new Error('useApp must be used within an AppProvider')
  }
  return context
}