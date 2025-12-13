'use client'

import React from 'react'
import { useTheme, ThemeVariant } from '@/contexts/ThemeContext'
import { Wrench, Zap, Sun } from 'lucide-react'

const themeIcons: Record<ThemeVariant, React.ReactNode> = {
  wip: <Wrench className="w-4 h-4" />,
  futuristic: <Zap className="w-4 h-4" />,
  bright: <Sun className="w-4 h-4" />,
}

export function ThemeSwitcher() {
  const { theme, setTheme, themeLabels } = useTheme()

  const themes: ThemeVariant[] = ['wip', 'futuristic', 'bright']

  return (
    <div className="flex items-center gap-1 p-1 rounded-lg bg-gray-100 dark:bg-gray-800">
      {themes.map((t) => (
        <button
          key={t}
          onClick={() => setTheme(t)}
          className={`
            flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-medium transition-all
            ${theme === t 
              ? 'bg-white dark:bg-gray-700 shadow-sm text-gray-900 dark:text-white' 
              : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white'
            }
          `}
          title={themeLabels[t]}
        >
          {themeIcons[t]}
          <span className="hidden sm:inline">{themeLabels[t]}</span>
        </button>
      ))}
    </div>
  )
}
