'use client'

import React, { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useForm } from 'react-hook-form'
import { User, UserUpdate } from '@/types/api'
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card'
import { useApp } from '@/contexts/AppContext'
import { useLanguage } from '@/contexts/LanguageContext'
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
  const { modalState, showSuccess, showError, closeModal } = useModal()
  const [loading, setLoading] = useState(false)

  const { register, handleSubmit, reset, formState: { errors, isDirty } } = useForm<FormData>()

  useEffect(() => {
    // Wait for auth loading to complete
    if (authLoading) return

    if (!isAuthenticated) {
      router.push('/login?redirect=/profile')
      return
    }

    // Populate form with user data
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

      // Update user in context
      setUser(updatedUser)

      // Reset form with new values to clear isDirty state
      reset({
        username: updatedUser.username,
        first_name: updatedUser.first_name,
        last_name: updatedUser.last_name,
      })

      showSuccess(t('profile.profileUpdated'), t('profile.profileUpdated'))
    } catch (error: any) {
      console.error('Error updating profile:', error)
      // Display backend error message if available
      const errorMessage = error?.message || t('profile.updateFailed')
      showError(t('profile.updateFailed'), errorMessage)
    } finally {
      setLoading(false)
    }
  }

  if (authLoading || !isLoaded) {
    return (
      <div className="min-h-screen bg-gray-50 py-8">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <div className="animate-pulse">
              <div className="h-8 bg-gray-300 rounded w-64 mx-auto mb-4"></div>
              <div className="h-4 bg-gray-300 rounded w-96 mx-auto"></div>
            </div>
          </div>
        </div>
      </div>
    )
  }

  if (!isAuthenticated || !user) {
    return null // Will redirect in useEffect
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">{t('profile.title')}</h1>
          <p className="text-gray-600">
            {t('profile.subtitle')}
          </p>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          {/* Personal Information */}
          <Card>
            <CardHeader>
              <CardTitle>{t('profile.personalInfo')}</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <label htmlFor="first_name" className="block text-sm font-medium text-gray-700 mb-1">
                  {t('auth.firstName')} *
                </label>
                <Input
                  id="first_name"
                  {...register('first_name', { required: t('auth.firstNameRequired') })}
                  placeholder={t('auth.enterFirstName')}
                />
                {errors.first_name && (
                  <p className="text-red-600 text-sm mt-1">{errors.first_name.message}</p>
                )}
              </div>

              <div>
                <label htmlFor="last_name" className="block text-sm font-medium text-gray-700 mb-1">
                  {t('auth.lastName')} *
                </label>
                <Input
                  id="last_name"
                  {...register('last_name', { required: t('auth.lastNameRequired') })}
                  placeholder={t('auth.enterLastName')}
                />
                {errors.last_name && (
                  <p className="text-red-600 text-sm mt-1">{errors.last_name.message}</p>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Account Information */}
          <Card>
            <CardHeader>
              <CardTitle>{t('profile.accountInfo')}</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <label htmlFor="username" className="block text-sm font-medium text-gray-700 mb-1">
                  {t('auth.username')} *
                </label>
                <Input
                  id="username"
                  {...register('username', { required: t('auth.usernameRequired') })}
                  placeholder={t('auth.enterUsernameExample')}
                />
                {errors.username && (
                  <p className="text-red-600 text-sm mt-1">{errors.username.message}</p>
                )}
              </div>

              <div>
                <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                  {t('auth.email')}
                </label>
                <Input
                  id="email"
                  type="email"
                  value={user.email}
                  disabled
                  className="bg-gray-100 cursor-not-allowed"
                />
                <p className="text-gray-500 text-xs mt-1">
                  {t('profile.emailReadOnly')}
                </p>
              </div>

              <div>
                <label htmlFor="kennitala" className="block text-sm font-medium text-gray-700 mb-1">
                  Kennitala
                </label>
                <Input
                  id="kennitala"
                  value={user.kennitala}
                  disabled
                  className="bg-gray-100 cursor-not-allowed"
                />
                <p className="text-gray-500 text-xs mt-1">
                  {t('profile.kennitalaReadOnly')}
                </p>
              </div>

              <div className="pt-4 border-t border-gray-200">
                <p className="text-sm text-gray-600">
                  {t('profile.accountCreated', {
                    date: new Date(user.created_at).toLocaleDateString()
                  })}
                </p>
              </div>
            </CardContent>
          </Card>

          {/* Submit */}
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
