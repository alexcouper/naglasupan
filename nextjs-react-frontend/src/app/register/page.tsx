'use client'

import React, { useState } from 'react'
import { useRouter } from 'next/navigation'
import { useForm } from 'react-hook-form'
import { UserPlus } from 'lucide-react'
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card'
import { useApp } from '@/contexts/AppContext'
import { useLanguage } from '@/contexts/LanguageContext'
import { UserCreate } from '@/types/api'
import { apiClient } from '@/lib/api'

export default function RegisterPage() {
  const router = useRouter()
  const { setUser, isDummyMode } = useApp()
  const { t, isLoaded } = useLanguage()
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const { register, handleSubmit, formState: { errors }, watch } = useForm<UserCreate & { confirmPassword: string }>()

  const password = watch('password')

  const onSubmit = async (data: UserCreate & { confirmPassword: string }) => {
    try {
      setLoading(true)
      setError('')

      if (data.password !== data.confirmPassword) {
        setError('Passwords do not match')
        return
      }

      if (isDummyMode) {
        // Simulate registration
        await new Promise(resolve => setTimeout(resolve, 1000))
        alert('Registration successful! Please sign in with your credentials. (Demo Mode)')
        router.push('/login')
      } else {
        const { confirmPassword, ...userData } = data
        await apiClient.register(userData)
        alert('Registration successful! Please sign in with your credentials.')
        router.push('/login')
      }
    } catch (error) {
      console.error('Registration error:', error)
      setError('Registration failed. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  // Show loading while translations are loading
  if (!isLoaded) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <UserPlus className="w-8 h-8 text-blue-600 mx-auto mb-4 animate-pulse" />
          <p className="text-gray-600">Loading...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div className="text-center">
          <h2 className="mt-6 text-3xl font-bold text-gray-900">
            {t('auth.signUpTitle')}
          </h2>
          <p className="mt-2 text-sm text-gray-600">
            {t('auth.signUpSubtitle')}
          </p>
        </div>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <UserPlus className="w-5 h-5" />
              {t('auth.signUp')}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
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
              </div>

              <div>
                <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                  Email *
                </label>
                <Input
                  id="email"
                  type="email"
                  {...register('email', { required: 'Email is required' })}
                  placeholder="john@example.com"
                />
                {errors.email && (
                  <p className="text-red-600 text-sm mt-1">{errors.email.message}</p>
                )}
              </div>

              <div>
                <label htmlFor="username" className="block text-sm font-medium text-gray-700 mb-1">
                  Username *
                </label>
                <Input
                  id="username"
                  {...register('username', { required: 'Username is required', minLength: 3 })}
                  placeholder="johndoe"
                />
                {errors.username && (
                  <p className="text-red-600 text-sm mt-1">{errors.username.message}</p>
                )}
              </div>

              <div>
                <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">
                  Password *
                </label>
                <Input
                  id="password"
                  type="password"
                  {...register('password', { required: 'Password is required', minLength: 8 })}
                  placeholder="Enter password"
                />
                {errors.password && (
                  <p className="text-red-600 text-sm mt-1">{errors.password.message}</p>
                )}
              </div>

              <div>
                <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700 mb-1">
                  Confirm Password *
                </label>
                <Input
                  id="confirmPassword"
                  type="password"
                  {...register('confirmPassword', { required: 'Please confirm your password' })}
                  placeholder="Confirm password"
                />
                {errors.confirmPassword && (
                  <p className="text-red-600 text-sm mt-1">{errors.confirmPassword.message}</p>
                )}
              </div>

              {error && (
                <div className="bg-red-50 border border-red-200 rounded-md p-3">
                  <p className="text-red-600 text-sm">{error}</p>
                </div>
              )}

              <Button type="submit" disabled={loading} className="w-full">
                {loading ? 'Creating account...' : 'Create Account'}
              </Button>
            </form>
          </CardContent>
        </Card>

        <div className="text-center">
          <p className="text-sm text-gray-600">
            Already have an account?{' '}
            <button
              onClick={() => router.push('/login')}
              className="font-medium text-blue-600 hover:text-blue-500"
            >
              Sign in here
            </button>
          </p>
        </div>
      </div>
    </div>
  )
}