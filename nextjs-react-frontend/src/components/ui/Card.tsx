'use client'

import React from 'react'
import { cn } from '@/lib/utils'
import { useTheme } from '@/contexts/ThemeContext'

interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode
}

export function Card({ className, children, ...props }: CardProps) {
  const { theme } = useTheme()

  const getCardStyles = () => {
    switch (theme) {
      case 'wip':
        return 'bg-[#171717] border-[#333] rounded-none'
      case 'futuristic':
        return 'bg-[#0f172a] border-[#1e293b] rounded-xl'
      case 'bright':
        return 'bg-white border-orange-100 rounded-2xl shadow-sm'
      default:
        return 'bg-white border-gray-200 rounded-lg'
    }
  }

  return (
    <div
      className={cn(
        'border p-6 transition-all',
        getCardStyles(),
        className
      )}
      {...props}
    >
      {children}
    </div>
  )
}

export function CardHeader({ className, children, ...props }: CardProps) {
  return (
    <div
      className={cn('flex flex-col space-y-1.5 pb-4', className)}
      {...props}
    >
      {children}
    </div>
  )
}

export function CardTitle({ className, children, ...props }: CardProps) {
  const { theme } = useTheme()

  const getTitleStyles = () => {
    switch (theme) {
      case 'wip':
        return 'text-[#e5e5e5] font-mono'
      case 'futuristic':
        return 'text-[#f1f5f9]'
      case 'bright':
        return 'text-gray-900'
      default:
        return 'text-gray-900'
    }
  }

  return (
    <h3
      className={cn('text-lg font-semibold leading-none tracking-tight', getTitleStyles(), className)}
      {...props}
    >
      {children}
    </h3>
  )
}

export function CardContent({ className, children, ...props }: CardProps) {
  return (
    <div className={cn('pt-0', className)} {...props}>
      {children}
    </div>
  )
}
