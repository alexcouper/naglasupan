'use client'

import { useState, useCallback } from 'react'
import { ModalType } from '@/components/ui/Modal'

interface ModalState {
  isOpen: boolean
  title: string
  message: string
  type: ModalType
  onConfirm?: () => void
}

export function useModal() {
  const [modalState, setModalState] = useState<ModalState>({
    isOpen: false,
    title: '',
    message: '',
    type: 'info'
  })

  const showModal = useCallback((
    title: string,
    message: string,
    type: ModalType = 'info',
    onConfirm?: () => void
  ) => {
    setModalState({
      isOpen: true,
      title,
      message,
      type,
      onConfirm
    })
  }, [])

  const showSuccess = useCallback((title: string, message: string, onConfirm?: () => void) => {
    showModal(title, message, 'success', onConfirm)
  }, [showModal])

  const showError = useCallback((title: string, message: string, onConfirm?: () => void) => {
    showModal(title, message, 'error', onConfirm)
  }, [showModal])

  const showInfo = useCallback((title: string, message: string, onConfirm?: () => void) => {
    showModal(title, message, 'info', onConfirm)
  }, [showModal])

  const closeModal = useCallback(() => {
    setModalState(prev => ({ ...prev, isOpen: false }))
  }, [])

  return {
    modalState,
    showModal,
    showSuccess,
    showError,
    showInfo,
    closeModal
  }
}
