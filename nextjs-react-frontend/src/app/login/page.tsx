'use client'

import React, { useState } from 'react'
import { useRouter } from 'next/navigation'
import { useForm } from 'react-hook-form'
import { LogIn, User } from 'lucide-react'
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card'
import { useApp } from '@/contexts/AppContext'
import { useLanguage } from '@/contexts/LanguageContext'
import { LoginRequest } from '@/types/api'
import { dummyUsers } from '@/lib/dummy-data'
import { apiClient } from '@/lib/api'

export default function LoginPage() {
  const router = useRouter()
  const { setUser, isDummyMode } = useApp()
  const { t, isLoaded } = useLanguage()
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const { register, handleSubmit, formState: { errors } } = useForm<LoginRequest>()

  const onSubmit = async (data: LoginRequest) => {
    try {
      setLoading(true)
      setError('')

      if (isDummyMode) {
        // Simulate login with dummy data
        await new Promise(resolve => setTimeout(resolve, 1000))
        
        // Find user by username or email
        const user = dummyUsers.find(u => 
          u.username === data.username || u.email === data.username
        )
        
        if (user && data.password === 'password') {
          setUser(user)
          const redirect = new URLSearchParams(window.location.search).get('redirect')
          router.push(redirect || '/')
        } else {
          setError('Invalid credentials. Try username: "alice_dev" password: "password"')
        }
      } else {
        const tokenData = await apiClient.login(data)
        const userData = await apiClient.getCurrentUser()
        setUser(userData)
        
        const redirect = new URLSearchParams(window.location.search).get('redirect')
        router.push(redirect || '/')
      }
    } catch (error) {
      console.error('Login error:', error)
      setError('Invalid credentials. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  // Show loading while translations are loading
  if (!isLoaded) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <LogIn className="w-8 h-8 text-blue-600 mx-auto mb-4 animate-pulse" />
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
            {t('auth.signInTitle')}
          </h2>
          <p className="mt-2 text-sm text-gray-600">
            {t('auth.signInSubtitle')}
          </p>
        </div>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <LogIn className="w-5 h-5" />
              {t('auth.signIn')}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
              <div>
                <label htmlFor="username" className="block text-sm font-medium text-gray-700 mb-1">
                  {t('auth.usernameOrEmail')}
                </label>
                <Input
                  id="username"
                  {...register('username', { required: t('auth.usernameRequired') })}
                  placeholder={t('auth.enterUsername')}
                />
                {errors.username && (
                  <p className="text-red-600 text-sm mt-1">{errors.username.message}</p>
                )}
              </div>

              <div>
                <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">
                  {t('auth.password')}
                </label>
                <Input
                  id="password"
                  type="password"
                  {...register('password', { required: t('auth.passwordRequired') })}
                  placeholder={t('auth.enterPassword')}
                />
                {errors.password && (
                  <p className="text-red-600 text-sm mt-1">{errors.password.message}</p>
                )}
              </div>

              {error && (
                <div className="bg-red-50 border border-red-200 rounded-md p-3">
                  <p className="text-red-600 text-sm">{error}</p>
                </div>
              )}

              <Button type="submit" disabled={loading} className="w-full">
                {loading ? t('auth.signingIn') : t('auth.signIn')}
              </Button>
            </form>

            {isDummyMode && (
              <div className="mt-4 p-3 bg-blue-50 border border-blue-200 rounded-md">
                <h4 className="text-sm font-medium text-blue-900 mb-2">{t('auth.demoCredentials')}</h4>
                <div className="text-xs text-blue-700 space-y-1">
                  <div>{t('auth.usernameDemo')} <code className="bg-blue-100 px-1 rounded">alice_dev</code></div>
                  <div>{t('auth.passwordDemo')} <code className="bg-blue-100 px-1 rounded">password</code></div>
                </div>
              </div>
            )}
          </CardContent>
        </Card>

        <div className="text-center">
          <p className="text-sm text-gray-600">
            {t('auth.dontHaveAccount')}{' '}
            <button
              onClick={() => router.push('/register')}
              className="font-medium text-blue-600 hover:text-blue-500"
            >
              {t('auth.signUpHere')}
            </button>
          </p>
        </div>
      </div>
    </div>
  )
}