'use client'

import React, { useState } from 'react'
import { useRouter } from 'next/navigation'
import { useForm } from 'react-hook-form'
import { LogIn, Terminal, Zap, Sparkles } from 'lucide-react'
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card'
import { useApp } from '@/contexts/AppContext'
import { useLanguage } from '@/contexts/LanguageContext'
import { useTheme } from '@/contexts/ThemeContext'
import { LoginRequest } from '@/types/api'
import { apiClient } from '@/lib/api'

export default function LoginPage() {
  const router = useRouter()
  const { setUser } = useApp()
  const { t, isLoaded } = useLanguage()
  const { theme } = useTheme()
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const { register, handleSubmit, formState: { errors } } = useForm<LoginRequest>()

  const onSubmit = async (data: LoginRequest) => {
    try {
      setLoading(true)
      setError('')

      await apiClient.login(data)
      const userData = await apiClient.getCurrentUser()
      setUser(userData)

      const redirect = new URLSearchParams(window.location.search).get('redirect')
      router.push(redirect || '/my-projects')
    } catch (err) {
      console.error('Login error:', err)
      const errorMessage = err instanceof Error ? err.message : 'Invalid credentials. Please try again.'
      setError(errorMessage)
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
          error: 'bg-[#dc2626]/10 border border-[#dc2626]/30 text-[#dc2626]',
          link: 'text-[#22c55e] hover:text-[#16a34a]',
          linkText: 'text-[#737373]',
          icon: <Terminal className="w-6 h-6 text-[#22c55e]" />,
        }
      case 'futuristic':
        return {
          bg: 'bg-[#030712]',
          title: 'text-white',
          subtitle: 'text-[#64748b]',
          label: 'text-[#94a3b8]',
          error: 'bg-red-500/10 border border-red-500/30 text-red-400',
          link: 'text-cyan-400 hover:text-cyan-300',
          linkText: 'text-[#64748b]',
          icon: <Zap className="w-6 h-6 text-cyan-400" />,
        }
      case 'bright':
        return {
          bg: 'bg-gradient-to-br from-orange-50 via-white to-pink-50',
          title: 'text-gray-900',
          subtitle: 'text-gray-600',
          label: 'text-gray-700',
          error: 'bg-red-50 border border-red-200 text-red-600',
          link: 'text-orange-600 hover:text-orange-500',
          linkText: 'text-gray-600',
          icon: <Sparkles className="w-6 h-6 text-orange-500" />,
        }
      default:
        return {
          bg: 'bg-gray-50',
          title: 'text-gray-900',
          subtitle: 'text-gray-600',
          label: 'text-gray-700',
          error: 'bg-red-50 border border-red-200 text-red-600',
          link: 'text-blue-600 hover:text-blue-500',
          linkText: 'text-gray-600',
          icon: <LogIn className="w-6 h-6 text-blue-600" />,
        }
    }
  }

  const styles = getPageStyles()

  if (!isLoaded) {
    return (
      <div className={`min-h-screen ${styles.bg} flex items-center justify-center`}>
        <div className="text-center">
          <div className="animate-pulse">{styles.icon}</div>
          <p className={styles.subtitle}>Loading...</p>
        </div>
      </div>
    )
  }

  return (
    <div className={`min-h-screen ${styles.bg} flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8`}>
      <div className="max-w-md w-full space-y-8">
        <div className="text-center">
          <div className="flex justify-center mb-4">{styles.icon}</div>
          <h2 className={`text-3xl font-bold ${styles.title}`}>
            {t('auth.signInTitle')}
          </h2>
          <p className={`mt-2 text-sm ${styles.subtitle}`}>
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
                <label htmlFor="username" className={`block text-sm font-medium mb-1 ${styles.label}`}>
                  {t('auth.usernameOrEmail')}
                </label>
                <Input
                  id="username"
                  {...register('username', { required: t('auth.usernameRequired') })}
                  placeholder={t('auth.enterUsername')}
                />
                {errors.username && (
                  <p className="text-red-500 text-sm mt-1">{errors.username.message}</p>
                )}
              </div>

              <div>
                <label htmlFor="password" className={`block text-sm font-medium mb-1 ${styles.label}`}>
                  {t('auth.password')}
                </label>
                <Input
                  id="password"
                  type="password"
                  {...register('password', { required: t('auth.passwordRequired') })}
                  placeholder={t('auth.enterPassword')}
                />
                {errors.password && (
                  <p className="text-red-500 text-sm mt-1">{errors.password.message}</p>
                )}
              </div>

              {error && (
                <div className={`rounded-md p-3 ${styles.error} ${theme === 'wip' ? 'rounded-none' : ''}`}>
                  <p className="text-sm">{error}</p>
                </div>
              )}

              <Button type="submit" disabled={loading} className="w-full">
                {loading ? t('auth.signingIn') : t('auth.signIn')}
              </Button>
            </form>
          </CardContent>
        </Card>

        <div className="text-center">
          <p className={`text-sm ${styles.linkText}`}>
            {t('auth.dontHaveAccount')}{' '}
            <button
              onClick={() => router.push('/register')}
              className={`font-medium ${styles.link}`}
            >
              {t('auth.signUpHere')}
            </button>
          </p>
        </div>
      </div>
    </div>
  )
}
