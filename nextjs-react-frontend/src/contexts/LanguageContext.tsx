'use client'

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react'
import { I18nextProvider, useTranslation } from 'react-i18next'
import i18n, { Locale, defaultLocale, loadTranslations } from '@/lib/i18n'

interface LanguageContextType {
  currentLanguage: Locale
  setLanguage: (language: Locale) => void
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  t: (key: string, options?: any) => any
  isLoaded: boolean
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined)

function LanguageProviderInner({ children }: { children: ReactNode }) {
  const { t, i18n: i18nInstance } = useTranslation('common')
  const [currentLanguage, setCurrentLanguage] = useState<Locale>(defaultLocale)
  const [isLoaded, setIsLoaded] = useState(false)

  useEffect(() => {
    // Load translations on mount
    loadTranslations().then(() => {
      setIsLoaded(true)
      // Update current language to reflect saved preference
      setCurrentLanguage(i18nInstance.language as Locale || defaultLocale)
    })
  }, [i18nInstance])

  const setLanguage = (language: Locale) => {
    setCurrentLanguage(language)
    i18nInstance.changeLanguage(language)
    
    // Save to localStorage
    if (typeof window !== 'undefined') {
      localStorage.setItem('language', language)
    }
  }

  return (
    <LanguageContext.Provider value={{
      currentLanguage,
      setLanguage,
      t,
      isLoaded
    }}>
      {children}
    </LanguageContext.Provider>
  )
}

export function LanguageProvider({ children }: { children: ReactNode }) {
  return (
    <I18nextProvider i18n={i18n}>
      <LanguageProviderInner>{children}</LanguageProviderInner>
    </I18nextProvider>
  )
}

export function useLanguage() {
  const context = useContext(LanguageContext)
  if (context === undefined) {
    throw new Error('useLanguage must be used within a LanguageProvider')
  }
  return context
}