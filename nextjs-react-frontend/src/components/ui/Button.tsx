'use client'

import React from 'react'
import { cn } from '@/lib/utils'
import { useTheme } from '@/contexts/ThemeContext'

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost' | 'danger'
  size?: 'sm' | 'md' | 'lg'
  children: React.ReactNode
}

export function Button({
  className,
  variant = 'primary',
  size = 'md',
  children,
  ...props
}: ButtonProps) {
  const { theme } = useTheme()

  const getVariantStyles = () => {
    switch (theme) {
      case 'wip':
        return {
          primary: 'bg-[#22c55e] text-[#0d0d0d] hover:bg-[#16a34a] font-bold',
          secondary: 'bg-[#262626] text-[#a3a3a3] hover:bg-[#333]',
          outline: 'border border-[#333] bg-transparent text-[#a3a3a3] hover:border-[#22c55e] hover:text-[#22c55e]',
          ghost: 'text-[#a3a3a3] hover:text-[#22c55e] hover:bg-[#262626]',
          danger: 'bg-[#dc2626] text-white hover:bg-[#b91c1c]',
        }
      case 'futuristic':
        return {
          primary: 'bg-gradient-to-r from-cyan-500 to-blue-600 text-white hover:from-cyan-400 hover:to-blue-500 shadow-lg shadow-cyan-500/25',
          secondary: 'bg-[#1e293b] text-[#94a3b8] hover:bg-[#334155]',
          outline: 'border border-purple-500/50 bg-transparent text-purple-400 hover:bg-purple-500/10 hover:border-purple-400',
          ghost: 'text-[#94a3b8] hover:text-cyan-400 hover:bg-[#1e293b]',
          danger: 'bg-gradient-to-r from-red-500 to-rose-600 text-white hover:from-red-400 hover:to-rose-500',
        }
      case 'bright':
        return {
          primary: 'bg-gradient-to-r from-orange-500 to-pink-500 text-white hover:from-orange-400 hover:to-pink-400 shadow-lg shadow-orange-500/25',
          secondary: 'bg-purple-50 text-purple-700 hover:bg-purple-100',
          outline: 'border-2 border-purple-300 bg-transparent text-purple-600 hover:bg-purple-50 hover:border-purple-400',
          ghost: 'text-gray-600 hover:text-orange-600 hover:bg-orange-50',
          danger: 'bg-gradient-to-r from-red-500 to-rose-500 text-white hover:from-red-400 hover:to-rose-400',
        }
      default:
        return {
          primary: 'bg-blue-600 text-white hover:bg-blue-700',
          secondary: 'bg-gray-100 text-gray-900 hover:bg-gray-200',
          outline: 'border border-gray-300 bg-white text-gray-700 hover:bg-gray-50',
          ghost: 'text-gray-600 hover:bg-gray-100',
          danger: 'bg-red-600 text-white hover:bg-red-700',
        }
    }
  }

  const getBorderRadius = () => {
    switch (theme) {
      case 'wip':
        return 'rounded-none'
      case 'futuristic':
        return 'rounded-lg'
      case 'bright':
        return 'rounded-full'
      default:
        return 'rounded-md'
    }
  }

  const variantStyles = getVariantStyles()

  return (
    <button
      className={cn(
        'inline-flex items-center justify-center font-medium transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50',
        getBorderRadius(),
        variantStyles[variant],
        {
          'h-8 px-3 text-sm': size === 'sm',
          'h-10 px-4': size === 'md',
          'h-12 px-6 text-lg': size === 'lg',
        },
        className
      )}
      {...props}
    >
      {children}
    </button>
  )
}
