'use client'

import React, { createContext, useContext, useState, ReactNode } from 'react'
import { User } from '@/types/api'

interface AppContextType {
  user: User | null
  setUser: (user: User | null) => void
  isAuthenticated: boolean
  isDummyMode: boolean
  setIsDummyMode: (isDummy: boolean) => void
}

const AppContext = createContext<AppContextType | undefined>(undefined)

export function AppProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [isDummyMode, setIsDummyMode] = useState(true) // Start in dummy mode for easier testing

  const isAuthenticated = !!user

  return (
    <AppContext.Provider value={{
      user,
      setUser,
      isAuthenticated,
      isDummyMode,
      setIsDummyMode
    }}>
      {children}
    </AppContext.Provider>
  )
}

export function useApp() {
  const context = useContext(AppContext)
  if (context === undefined) {
    throw new Error('useApp must be used within an AppProvider')
  }
  return context
}