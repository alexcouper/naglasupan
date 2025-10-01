'use client'

import React, { useState } from 'react'
import { ChevronDown, Languages } from 'lucide-react'
import { useLanguage } from '@/contexts/LanguageContext'
import { locales, languageNames, languageFlags, Locale } from '@/lib/i18n'

export function LanguageSwitcher() {
  const { currentLanguage, setLanguage } = useLanguage()
  const [isOpen, setIsOpen] = useState(false)

  const handleLanguageChange = (language: Locale) => {
    setLanguage(language)
    setIsOpen(false)
  }

  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center space-x-2 px-3 py-2 text-sm text-gray-600 hover:text-gray-900 rounded-md hover:bg-gray-100 transition-colors"
      >
        <Languages className="w-4 h-4" />
        <span className="hidden sm:inline">{languageFlags[currentLanguage]} {languageNames[currentLanguage]}</span>
        <span className="sm:hidden">{languageFlags[currentLanguage]}</span>
        <ChevronDown className="w-3 h-3" />
      </button>

      {isOpen && (
        <div className="absolute right-0 mt-2 w-40 bg-white rounded-md shadow-lg py-1 z-50 border border-gray-200">
          {locales.map((language) => (
            <button
              key={language}
              onClick={() => handleLanguageChange(language)}
              className={`flex items-center w-full px-4 py-2 text-sm hover:bg-gray-100 transition-colors ${
                language === currentLanguage ? 'bg-blue-50 text-blue-600' : 'text-gray-700'
              }`}
            >
              <span className="mr-3">{languageFlags[language]}</span>
              <span>{languageNames[language]}</span>
            </button>
          ))}
        </div>
      )}

      {/* Overlay to close dropdown when clicking outside */}
      {isOpen && (
        <div
          className="fixed inset-0 z-40"
          onClick={() => setIsOpen(false)}
        />
      )}
    </div>
  )
}