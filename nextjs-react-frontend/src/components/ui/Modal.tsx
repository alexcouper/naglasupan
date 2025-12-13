'use client'

import React, { useEffect } from 'react'
import { X, CheckCircle, AlertCircle, Info } from 'lucide-react'
import { cn } from '@/lib/utils'
import { Button } from './Button'
import { useTheme } from '@/contexts/ThemeContext'

export type ModalType = 'success' | 'error' | 'info'

interface ModalProps {
  isOpen: boolean
  onClose: () => void
  title: string
  message: string
  type?: ModalType
  confirmText?: string
  onConfirm?: () => void
}

export function Modal({
  isOpen,
  onClose,
  title,
  message,
  type = 'info',
  confirmText = 'OK',
  onConfirm
}: ModalProps) {
  const { theme } = useTheme()

  // Close on escape key
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        if (onConfirm) {
          onConfirm()
        }
        onClose()
      }
    }

    if (isOpen) {
      document.addEventListener('keydown', handleEscape)
      document.body.style.overflow = 'hidden'
    }

    return () => {
      document.removeEventListener('keydown', handleEscape)
      document.body.style.overflow = 'unset'
    }
  }, [isOpen, onClose, onConfirm])

  if (!isOpen) return null

  const handleClose = () => {
    if (onConfirm) {
      onConfirm()
    }
    onClose()
  }

  const handleConfirm = () => {
    handleClose()
  }

  const getThemeStyles = () => {
    switch (theme) {
      case 'wip':
        return {
          backdrop: 'bg-black/70',
          modal: 'bg-[#171717] border border-[#333] rounded-none',
          closeBtn: 'text-[#525252] hover:text-[#a3a3a3]',
          title: 'text-[#e5e5e5] font-mono',
          message: 'text-[#a3a3a3]',
        }
      case 'futuristic':
        return {
          backdrop: 'bg-[#030712]/80 backdrop-blur-sm',
          modal: 'bg-[#0f172a] border border-[#1e293b] rounded-xl shadow-2xl shadow-cyan-500/10',
          closeBtn: 'text-[#64748b] hover:text-cyan-400',
          title: 'text-[#f1f5f9]',
          message: 'text-[#94a3b8]',
        }
      case 'bright':
        return {
          backdrop: 'bg-white/60 backdrop-blur-sm',
          modal: 'bg-white border border-orange-100 rounded-2xl shadow-2xl',
          closeBtn: 'text-gray-400 hover:text-orange-500',
          title: 'text-gray-900',
          message: 'text-gray-600',
        }
      default:
        return {
          backdrop: 'bg-white/20 backdrop-blur-md',
          modal: 'bg-white border border-gray-200 rounded-lg shadow-2xl',
          closeBtn: 'text-gray-400 hover:text-gray-600',
          title: 'text-gray-900',
          message: 'text-gray-600',
        }
    }
  }

  const getIcon = () => {
    const iconClass = 'w-12 h-12'
    switch (type) {
      case 'success':
        return <CheckCircle className={cn(iconClass, theme === 'futuristic' ? 'text-emerald-400' : theme === 'wip' ? 'text-[#22c55e]' : 'text-green-500')} />
      case 'error':
        return <AlertCircle className={cn(iconClass, theme === 'futuristic' ? 'text-red-400' : theme === 'wip' ? 'text-[#dc2626]' : 'text-red-500')} />
      case 'info':
        return <Info className={cn(iconClass, theme === 'futuristic' ? 'text-cyan-400' : theme === 'wip' ? 'text-[#3b82f6]' : 'text-blue-500')} />
    }
  }

  const getIconBgClasses = () => {
    switch (theme) {
      case 'wip':
        return type === 'success' ? 'border border-[#22c55e]/30 bg-[#22c55e]/10' :
               type === 'error' ? 'border border-[#dc2626]/30 bg-[#dc2626]/10' :
               'border border-[#3b82f6]/30 bg-[#3b82f6]/10'
      case 'futuristic':
        return type === 'success' ? 'border border-emerald-500/30 bg-emerald-500/10' :
               type === 'error' ? 'border border-red-500/30 bg-red-500/10' :
               'border border-cyan-500/30 bg-cyan-500/10'
      case 'bright':
        return type === 'success' ? 'bg-green-50 border border-green-200' :
               type === 'error' ? 'bg-red-50 border border-red-200' :
               'bg-blue-50 border border-blue-200'
      default:
        return type === 'success' ? 'border-green-200 bg-green-50' :
               type === 'error' ? 'border-red-200 bg-red-50' :
               'border-blue-200 bg-blue-50'
    }
  }

  const styles = getThemeStyles()

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      {/* Backdrop */}
      <div
        className={cn('absolute inset-0 transition-opacity', styles.backdrop)}
        onClick={handleClose}
      />

      {/* Modal */}
      <div className={cn('relative max-w-md w-full mx-4 animate-in fade-in zoom-in duration-200', styles.modal)}>
        {/* Close button */}
        <button
          onClick={handleClose}
          className={cn('absolute top-4 right-4 transition-colors', styles.closeBtn)}
          aria-label="Close"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Content */}
        <div className="p-6">
          {/* Icon */}
          <div className={cn('rounded-full p-3 inline-flex mb-4', theme === 'wip' && 'rounded-none', getIconBgClasses())}>
            {getIcon()}
          </div>

          {/* Title */}
          <h3 className={cn('text-xl font-semibold mb-2', styles.title)}>
            {title}
          </h3>

          {/* Message */}
          <p className={cn('mb-6', styles.message)}>
            {message}
          </p>

          {/* Actions */}
          <div className="flex gap-3 justify-center mt-8">
            <Button
              onClick={handleConfirm}
              variant="primary"
              className="min-w-[120px]"
            >
              {confirmText}
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}
