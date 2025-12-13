'use client'

import React, { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useForm } from 'react-hook-form'
import { User as UserIcon, Terminal, Cpu, Heart } from 'lucide-react'
import { UserUpdate } from '@/types/api'
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card'
import { useApp } from '@/contexts/AppContext'
import { useLanguage } from '@/contexts/LanguageContext'
import { useTheme } from '@/contexts/ThemeContext'
import { Modal } from '@/components/ui/Modal'
import { useModal } from '@/hooks/useModal'
import { apiClient } from '@/lib/api'

interface FormData {
  username: string
  first_name: string
  last_name: string
}

export default function ProfilePage() {
  const router = useRouter()
  const { user, isAuthenticated, isLoading: authLoading, setUser } = useApp()
  const { t, isLoaded } = useLanguage()
  const { theme } = useTheme()
  const { modalState, showSuccess, showError, closeModal } = useModal()
  const [loading, setLoading] = useState(false)

  const { register, handleSubmit, reset, formState: { errors, isDirty } } = useForm<FormData>()

  useEffect(() => {
    if (authLoading) return
    if (!isAuthenticated) {
      router.push('/login?redirect=/profile')
      return
    }
    if (user) {
      reset({
        username: user.username,
        first_name: user.first_name,
        last_name: user.last_name,
      })
    }
  }, [isAuthenticated, user, router, authLoading, reset])

  const onSubmit = async (data: FormData) => {
    try {
      setLoading(true)

      const updateData: UserUpdate = {
        username: data.username,
        first_name: data.first_name,
        last_name: data.last_name,
      }

      const updatedUser = await apiClient.updateProfile(updateData)
      setUser(updatedUser)

      reset({
        username: updatedUser.username,
        first_name: updatedUser.first_name,
        last_name: updatedUser.last_name,
      })

      showSuccess(t('profile.profileUpdated'), t('profile.profileUpdated'))
    } catch (err) {
      console.error('Error updating profile:', err)
      const errorMessage = err instanceof Error ? err.message : t('profile.updateFailed')
      showError(t('profile.updateFailed'), errorMessage)
    } finally {
      setLoading(false)
    }
  }

  const getPageStyles = () => {
    switch (theme) {
      case 'wip':
        return {
          bg: 'bg-[#0d0d0d]',
          title: 'text-[#e5e5e5] font-mono',
          subtitle: 'text-[#737373]',
          label: 'text-[#a3a3a3] font-mono text-xs uppercase tracking-wider',
          helpText: 'text-[#525252] text-xs',
          divider: 'border-[#333]',
          disabledInput: 'bg-[#262626] cursor-not-allowed',
          skeleton: 'bg-[#262626]',
          icon: <Terminal className="w-6 h-6 text-[#22c55e]" />,
        }
      case 'futuristic':
        return {
          bg: 'bg-[#030712]',
          title: 'text-white',
          subtitle: 'text-[#64748b]',
          label: 'text-[#94a3b8]',
          helpText: 'text-[#64748b] text-xs',
          divider: 'border-[#1e293b]',
          disabledInput: 'bg-[#1e293b] cursor-not-allowed',
          skeleton: 'bg-[#1e293b]',
          icon: <Cpu className="w-6 h-6 text-cyan-400" />,
        }
      case 'bright':
        return {
          bg: 'bg-gradient-to-br from-orange-50 via-white to-pink-50',
          title: 'text-gray-900',
          subtitle: 'text-gray-600',
          label: 'text-gray-700',
          helpText: 'text-gray-500 text-xs',
          divider: 'border-orange-100',
          disabledInput: 'bg-orange-50 cursor-not-allowed',
          skeleton: 'bg-orange-100',
          icon: <Heart className="w-6 h-6 text-orange-500" />,
        }
      default:
        return {
          bg: 'bg-gray-50',
          title: 'text-gray-900',
          subtitle: 'text-gray-600',
          label: 'text-gray-700',
          helpText: 'text-gray-500 text-xs',
          divider: 'border-gray-200',
          disabledInput: 'bg-gray-100 cursor-not-allowed',
          skeleton: 'bg-gray-300',
          icon: <UserIcon className="w-6 h-6 text-blue-600" />,
        }
    }
  }

  const styles = getPageStyles()

  if (authLoading || !isLoaded) {
    return (
      <div className={`min-h-screen ${styles.bg} py-8`}>
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <div className="animate-pulse">
              <div className={`h-8 ${styles.skeleton} rounded w-64 mx-auto mb-4`}></div>
              <div className={`h-4 ${styles.skeleton} rounded w-96 mx-auto`}></div>
            </div>
          </div>
        </div>
      </div>
    )
  }

  if (!isAuthenticated || !user) {
    return null
  }

  return (
    <div className={`min-h-screen ${styles.bg} py-8`}>
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-2">
            {styles.icon}
            <h1 className={`text-3xl font-bold ${styles.title}`}>{t('profile.title')}</h1>
          </div>
          <p className={styles.subtitle}>
            {t('profile.subtitle')}
          </p>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>{t('profile.personalInfo')}</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <label htmlFor="first_name" className={`block text-sm font-medium mb-1 ${styles.label}`}>
                  {t('auth.firstName')} *
                </label>
                <Input
                  id="first_name"
                  {...register('first_name', { required: t('auth.firstNameRequired') })}
                  placeholder={t('auth.enterFirstName')}
                />
                {errors.first_name && (
                  <p className="text-red-500 text-sm mt-1">{errors.first_name.message}</p>
                )}
              </div>

              <div>
                <label htmlFor="last_name" className={`block text-sm font-medium mb-1 ${styles.label}`}>
                  {t('auth.lastName')} *
                </label>
                <Input
                  id="last_name"
                  {...register('last_name', { required: t('auth.lastNameRequired') })}
                  placeholder={t('auth.enterLastName')}
                />
                {errors.last_name && (
                  <p className="text-red-500 text-sm mt-1">{errors.last_name.message}</p>
                )}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>{t('profile.accountInfo')}</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <label htmlFor="username" className={`block text-sm font-medium mb-1 ${styles.label}`}>
                  {t('auth.username')} *
                </label>
                <Input
                  id="username"
                  {...register('username', { required: t('auth.usernameRequired') })}
                  placeholder={t('auth.enterUsernameExample')}
                />
                {errors.username && (
                  <p className="text-red-500 text-sm mt-1">{errors.username.message}</p>
                )}
              </div>

              <div>
                <label htmlFor="email" className={`block text-sm font-medium mb-1 ${styles.label}`}>
                  {t('auth.email')}
                </label>
                <Input
                  id="email"
                  type="email"
                  value={user.email}
                  disabled
                  className={styles.disabledInput}
                />
                <p className={`mt-1 ${styles.helpText}`}>
                  {t('profile.emailReadOnly')}
                </p>
              </div>

              <div>
                <label htmlFor="kennitala" className={`block text-sm font-medium mb-1 ${styles.label}`}>
                  Kennitala
                </label>
                <Input
                  id="kennitala"
                  value={user.kennitala || ''}
                  disabled
                  className={styles.disabledInput}
                />
                <p className={`mt-1 ${styles.helpText}`}>
                  {t('profile.kennitalaReadOnly')}
                </p>
              </div>

              <div className={`pt-4 border-t ${styles.divider}`}>
                <p className={`text-sm ${styles.subtitle}`}>
                  {t('profile.accountCreated', {
                    date: new Date(user.created_at).toLocaleDateString()
                  })}
                </p>
              </div>
            </CardContent>
          </Card>

          <div className="flex gap-4">
            <Button
              type="button"
              variant="outline"
              onClick={() => router.back()}
              disabled={loading}
            >
              {t('common.cancel')}
            </Button>
            <Button
              type="submit"
              disabled={loading || !isDirty}
              className="flex-1"
            >
              {loading ? t('profile.updating') : t('profile.updateProfile')}
            </Button>
          </div>
        </form>
      </div>

      <Modal
        isOpen={modalState.isOpen}
        onClose={closeModal}
        title={modalState.title}
        message={modalState.message}
        type={modalState.type}
        onConfirm={modalState.onConfirm}
      />
    </div>
  )
}
