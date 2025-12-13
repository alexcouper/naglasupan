'use client'

import React from 'react'
import { cn } from '@/lib/utils'
import { useTheme } from '@/contexts/ThemeContext'

type InputProps = React.InputHTMLAttributes<HTMLInputElement>

export const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, type, ...props }, ref) => {
    const { theme } = useTheme()

    const getInputStyles = () => {
      switch (theme) {
        case 'wip':
          return 'bg-[#171717] border-[#333] text-[#e5e5e5] placeholder:text-[#525252] focus:border-[#22c55e] focus:ring-[#22c55e]/20 rounded-none font-mono'
        case 'futuristic':
          return 'bg-[#0f172a] border-[#1e293b] text-[#f1f5f9] placeholder:text-[#64748b] focus:border-cyan-500 focus:ring-cyan-500/20 rounded-lg'
        case 'bright':
          return 'bg-white border-orange-200 text-gray-900 placeholder:text-gray-400 focus:border-orange-500 focus:ring-orange-500/20 rounded-xl'
        default:
          return 'bg-white border-gray-300 text-gray-900 placeholder:text-gray-500 focus:ring-blue-500 rounded-md'
      }
    }

    return (
      <input
        type={type}
        className={cn(
          'flex h-10 w-full border px-3 py-2 text-sm ring-offset-white file:border-0 file:bg-transparent file:text-sm file:font-medium focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 transition-colors',
          getInputStyles(),
          className
        )}
        ref={ref}
        {...props}
      />
    )
  }
)
Input.displayName = 'Input'

type TextareaProps = React.TextareaHTMLAttributes<HTMLTextAreaElement>

export const Textarea = React.forwardRef<HTMLTextAreaElement, TextareaProps>(
  ({ className, ...props }, ref) => {
    const { theme } = useTheme()

    const getTextareaStyles = () => {
      switch (theme) {
        case 'wip':
          return 'bg-[#171717] border-[#333] text-[#e5e5e5] placeholder:text-[#525252] focus:border-[#22c55e] focus:ring-[#22c55e]/20 rounded-none font-mono'
        case 'futuristic':
          return 'bg-[#0f172a] border-[#1e293b] text-[#f1f5f9] placeholder:text-[#64748b] focus:border-cyan-500 focus:ring-cyan-500/20 rounded-lg'
        case 'bright':
          return 'bg-white border-orange-200 text-gray-900 placeholder:text-gray-400 focus:border-orange-500 focus:ring-orange-500/20 rounded-xl'
        default:
          return 'bg-white border-gray-300 text-gray-900 placeholder:text-gray-500 focus:ring-blue-500 rounded-md'
      }
    }

    return (
      <textarea
        className={cn(
          'flex min-h-[80px] w-full border px-3 py-2 text-sm ring-offset-white placeholder:text-gray-500 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 transition-colors',
          getTextareaStyles(),
          className
        )}
        ref={ref}
        {...props}
      />
    )
  }
)
Textarea.displayName = 'Textarea'
