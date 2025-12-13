'use client'

import React from 'react'
import { cn } from '@/lib/utils'
import { useTheme } from '@/contexts/ThemeContext'

interface BadgeProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: 'default' | 'secondary' | 'success' | 'warning' | 'danger'
  children: React.ReactNode
}

export function Badge({ className, variant = 'default', children, ...props }: BadgeProps) {
  const { theme } = useTheme()

  const getBadgeStyles = () => {
    switch (theme) {
      case 'wip':
        return {
          base: 'rounded-none font-mono text-xs',
          default: 'bg-[#22c55e]/20 text-[#22c55e] border border-[#22c55e]/30',
          secondary: 'bg-[#333] text-[#a3a3a3] border border-[#333]',
          success: 'bg-[#22c55e]/20 text-[#22c55e] border border-[#22c55e]/30',
          warning: 'bg-[#fbbf24]/20 text-[#fbbf24] border border-[#fbbf24]/30',
          danger: 'bg-[#dc2626]/20 text-[#dc2626] border border-[#dc2626]/30',
        }
      case 'futuristic':
        return {
          base: 'rounded-md',
          default: 'bg-cyan-500/20 text-cyan-400 border border-cyan-500/30',
          secondary: 'bg-[#1e293b] text-[#94a3b8] border border-[#1e293b]',
          success: 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30',
          warning: 'bg-amber-500/20 text-amber-400 border border-amber-500/30',
          danger: 'bg-red-500/20 text-red-400 border border-red-500/30',
        }
      case 'bright':
        return {
          base: 'rounded-full',
          default: 'bg-orange-100 text-orange-700',
          secondary: 'bg-gray-100 text-gray-700',
          success: 'bg-green-100 text-green-700',
          warning: 'bg-yellow-100 text-yellow-700',
          danger: 'bg-red-100 text-red-700',
        }
      default:
        return {
          base: 'rounded-full',
          default: 'bg-blue-100 text-blue-800',
          secondary: 'bg-gray-100 text-gray-800',
          success: 'bg-green-100 text-green-800',
          warning: 'bg-yellow-100 text-yellow-800',
          danger: 'bg-red-100 text-red-800',
        }
    }
  }

  const styles = getBadgeStyles()

  return (
    <div
      className={cn(
        'inline-flex items-center px-2.5 py-0.5 text-xs font-medium',
        styles.base,
        styles[variant],
        className
      )}
      {...props}
    >
      {children}
    </div>
  )
}
