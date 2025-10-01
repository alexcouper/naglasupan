import i18next from 'i18next'
import { initReactI18next } from 'react-i18next'

export const defaultLocale = 'en'
export const locales = ['en', 'pl', 'is'] as const
export type Locale = typeof locales[number]

// Language names for the UI
export const languageNames: Record<Locale, string> = {
  en: 'English',
  pl: 'Polski', 
  is: 'Íslenska'
}

// Language flags/icons
export const languageFlags: Record<Locale, string> = {
  en: '🇺🇸',
  pl: '🇵🇱',
  is: '🇮🇸'
}

// Translation resources - these will be loaded dynamically
const resources = {
  en: { common: {} },
  pl: { common: {} },
  is: { common: {} }
}

// Initialize i18next instance
if (!i18next.isInitialized) {
  i18next
    .use(initReactI18next)
    .init({
      resources,
      lng: defaultLocale,
      fallbackLng: defaultLocale,
      debug: false,
      
      interpolation: {
        escapeValue: false,
      },
      
      defaultNS: 'common',
      ns: ['common'],
    })
}

// Function to load translations dynamically (client-side only)
export const loadTranslations = async () => {
  if (typeof window === 'undefined') return
  
  try {
    const [enCommon, plCommon, isCommon] = await Promise.all([
      fetch('/locales/en/common.json').then(r => r.json()),
      fetch('/locales/pl/common.json').then(r => r.json()),
      fetch('/locales/is/common.json').then(r => r.json())
    ])

    // Add resources to i18next
    i18next.addResourceBundle('en', 'common', enCommon, true, true)
    i18next.addResourceBundle('pl', 'common', plCommon, true, true)
    i18next.addResourceBundle('is', 'common', isCommon, true, true)
    
    // Load saved language from localStorage
    const savedLanguage = localStorage.getItem('language') as Locale
    if (savedLanguage && locales.includes(savedLanguage)) {
      await i18next.changeLanguage(savedLanguage)
    }
  } catch (error) {
    console.error('Failed to load translations:', error)
  }
}

export default i18next