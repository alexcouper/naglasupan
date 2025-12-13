'use client'

import React, { createContext, useContext, useState, ReactNode } from 'react'

export type ThemeVariant = 'wip' | 'futuristic' | 'bright'

interface ThemeContextType {
  theme: ThemeVariant
  setTheme: (theme: ThemeVariant) => void
  themeLabels: Record<ThemeVariant, string>
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined)

const themeLabels: Record<ThemeVariant, string> = {
  wip: 'Work in Progress',
  futuristic: 'Futuristic',
  bright: 'Bright & Energetic',
}

export function ThemeProvider({ children }: { children: ReactNode }) {
  const [theme, setTheme] = useState<ThemeVariant>('wip')

  return (
    <ThemeContext.Provider value={{ theme, setTheme, themeLabels }}>
      <div data-theme={theme} className="theme-wrapper">
        {children}
      </div>
    </ThemeContext.Provider>
  )
}

export function useTheme() {
  const context = useContext(ThemeContext)
  if (context === undefined) {
    throw new Error('useTheme must be used within a ThemeProvider')
  }
  return context
}
