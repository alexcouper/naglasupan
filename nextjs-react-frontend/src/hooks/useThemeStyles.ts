'use client'

import { useTheme, ThemeVariant } from '@/contexts/ThemeContext'

export interface ThemeStyles {
  // Page backgrounds
  pageBg: string
  
  // Cards/Surfaces
  cardBg: string
  cardBorder: string
  cardHover: string
  
  // Text colors
  textPrimary: string
  textSecondary: string
  textMuted: string
  
  // Inputs
  inputBg: string
  inputBorder: string
  inputText: string
  inputPlaceholder: string
  inputFocus: string
  
  // Buttons
  buttonPrimary: string
  buttonPrimaryHover: string
  buttonSecondary: string
  buttonGhost: string
  buttonDanger: string
  
  // Badges
  badgeDefault: string
  badgeSecondary: string
  badgeSuccess: string
  badgeWarning: string
  badgeDanger: string
  
  // Borders
  border: string
  borderHover: string
  
  // Accent colors
  accent: string
  accentMuted: string
  
  // Links
  link: string
  linkHover: string
  
  // Status colors
  success: string
  warning: string
  error: string
  info: string
  
  // Modal
  modalBg: string
  modalBackdrop: string
  
  // Misc
  skeleton: string
  divider: string
}

const wipStyles: ThemeStyles = {
  pageBg: 'bg-[#0d0d0d]',
  cardBg: 'bg-[#171717]',
  cardBorder: 'border-[#333]',
  cardHover: 'hover:border-[#22c55e]',
  textPrimary: 'text-[#e5e5e5]',
  textSecondary: 'text-[#a3a3a3]',
  textMuted: 'text-[#525252]',
  inputBg: 'bg-[#171717]',
  inputBorder: 'border-[#333]',
  inputText: 'text-[#e5e5e5]',
  inputPlaceholder: 'placeholder:text-[#525252]',
  inputFocus: 'focus:border-[#22c55e] focus:ring-[#22c55e]/20',
  buttonPrimary: 'bg-[#22c55e] text-[#0d0d0d] hover:bg-[#16a34a]',
  buttonPrimaryHover: 'hover:bg-[#16a34a]',
  buttonSecondary: 'bg-[#262626] text-[#a3a3a3] hover:bg-[#333]',
  buttonGhost: 'text-[#a3a3a3] hover:text-[#22c55e] hover:bg-[#262626]',
  buttonDanger: 'bg-[#dc2626] text-white hover:bg-[#b91c1c]',
  badgeDefault: 'bg-[#22c55e]/20 text-[#22c55e]',
  badgeSecondary: 'bg-[#333] text-[#a3a3a3]',
  badgeSuccess: 'bg-[#22c55e]/20 text-[#22c55e]',
  badgeWarning: 'bg-[#fbbf24]/20 text-[#fbbf24]',
  badgeDanger: 'bg-[#dc2626]/20 text-[#dc2626]',
  border: 'border-[#333]',
  borderHover: 'hover:border-[#22c55e]',
  accent: 'text-[#22c55e]',
  accentMuted: 'text-[#15803d]',
  link: 'text-[#22c55e]',
  linkHover: 'hover:text-[#16a34a]',
  success: 'text-[#22c55e]',
  warning: 'text-[#fbbf24]',
  error: 'text-[#dc2626]',
  info: 'text-[#3b82f6]',
  modalBg: 'bg-[#171717]',
  modalBackdrop: 'bg-black/60',
  skeleton: 'bg-[#262626]',
  divider: 'border-[#333]',
}

const futuristicStyles: ThemeStyles = {
  pageBg: 'bg-[#030712]',
  cardBg: 'bg-[#0f172a]',
  cardBorder: 'border-[#1e293b]',
  cardHover: 'hover:border-cyan-500/50 hover:shadow-lg hover:shadow-cyan-500/10',
  textPrimary: 'text-[#f1f5f9]',
  textSecondary: 'text-[#94a3b8]',
  textMuted: 'text-[#64748b]',
  inputBg: 'bg-[#0f172a]',
  inputBorder: 'border-[#1e293b]',
  inputText: 'text-[#f1f5f9]',
  inputPlaceholder: 'placeholder:text-[#64748b]',
  inputFocus: 'focus:border-cyan-500 focus:ring-cyan-500/20',
  buttonPrimary: 'bg-gradient-to-r from-cyan-500 to-blue-600 text-white hover:from-cyan-400 hover:to-blue-500 shadow-lg shadow-cyan-500/25',
  buttonPrimaryHover: 'hover:from-cyan-400 hover:to-blue-500',
  buttonSecondary: 'bg-[#1e293b] text-[#94a3b8] hover:bg-[#334155]',
  buttonGhost: 'text-purple-400 hover:text-cyan-400 hover:bg-[#1e293b]',
  buttonDanger: 'bg-gradient-to-r from-red-500 to-rose-600 text-white hover:from-red-400 hover:to-rose-500',
  badgeDefault: 'bg-cyan-500/20 text-cyan-400',
  badgeSecondary: 'bg-[#1e293b] text-[#94a3b8]',
  badgeSuccess: 'bg-emerald-500/20 text-emerald-400',
  badgeWarning: 'bg-amber-500/20 text-amber-400',
  badgeDanger: 'bg-red-500/20 text-red-400',
  border: 'border-[#1e293b]',
  borderHover: 'hover:border-cyan-500/50',
  accent: 'text-cyan-400',
  accentMuted: 'text-cyan-600',
  link: 'text-cyan-400',
  linkHover: 'hover:text-cyan-300',
  success: 'text-emerald-400',
  warning: 'text-amber-400',
  error: 'text-red-400',
  info: 'text-cyan-400',
  modalBg: 'bg-[#0f172a]',
  modalBackdrop: 'bg-[#030712]/80 backdrop-blur-sm',
  skeleton: 'bg-[#1e293b]',
  divider: 'border-[#1e293b]',
}

const brightStyles: ThemeStyles = {
  pageBg: 'bg-gradient-to-br from-orange-50 via-white to-pink-50',
  cardBg: 'bg-white',
  cardBorder: 'border-orange-100',
  cardHover: 'hover:border-orange-300 hover:shadow-lg',
  textPrimary: 'text-gray-900',
  textSecondary: 'text-gray-600',
  textMuted: 'text-gray-400',
  inputBg: 'bg-white',
  inputBorder: 'border-orange-200',
  inputText: 'text-gray-900',
  inputPlaceholder: 'placeholder:text-gray-400',
  inputFocus: 'focus:border-orange-500 focus:ring-orange-500/20',
  buttonPrimary: 'bg-gradient-to-r from-orange-500 to-pink-500 text-white hover:from-orange-400 hover:to-pink-400 shadow-lg shadow-orange-500/25',
  buttonPrimaryHover: 'hover:from-orange-400 hover:to-pink-400',
  buttonSecondary: 'bg-purple-50 text-purple-700 hover:bg-purple-100',
  buttonGhost: 'text-gray-600 hover:text-orange-600 hover:bg-orange-50',
  buttonDanger: 'bg-gradient-to-r from-red-500 to-rose-500 text-white hover:from-red-400 hover:to-rose-400',
  badgeDefault: 'bg-orange-100 text-orange-700',
  badgeSecondary: 'bg-gray-100 text-gray-700',
  badgeSuccess: 'bg-green-100 text-green-700',
  badgeWarning: 'bg-yellow-100 text-yellow-700',
  badgeDanger: 'bg-red-100 text-red-700',
  border: 'border-orange-100',
  borderHover: 'hover:border-orange-300',
  accent: 'text-orange-500',
  accentMuted: 'text-orange-400',
  link: 'text-orange-600',
  linkHover: 'hover:text-orange-500',
  success: 'text-green-600',
  warning: 'text-yellow-600',
  error: 'text-red-600',
  info: 'text-blue-600',
  modalBg: 'bg-white',
  modalBackdrop: 'bg-white/60 backdrop-blur-sm',
  skeleton: 'bg-orange-100',
  divider: 'border-orange-100',
}

const themeStylesMap: Record<ThemeVariant, ThemeStyles> = {
  wip: wipStyles,
  futuristic: futuristicStyles,
  bright: brightStyles,
}

export function useThemeStyles(): ThemeStyles & { theme: ThemeVariant } {
  const { theme } = useTheme()
  return {
    theme,
    ...themeStylesMap[theme],
  }
}

// Helper to get font classes for the theme
export function useThemeFont(): string {
  const { theme } = useTheme()
  switch (theme) {
    case 'wip':
      return 'font-mono'
    case 'futuristic':
      return 'font-sans'
    case 'bright':
      return 'font-sans'
    default:
      return 'font-sans'
  }
}

// Helper to get border radius classes
export function useThemeBorderRadius(): string {
  const { theme } = useTheme()
  switch (theme) {
    case 'wip':
      return 'rounded-none'
    case 'futuristic':
      return 'rounded-lg'
    case 'bright':
      return 'rounded-2xl'
    default:
      return 'rounded-lg'
  }
}
