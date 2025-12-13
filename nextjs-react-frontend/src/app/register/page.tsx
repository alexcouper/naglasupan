'use client'

import React, { useState } from 'react'
import { useRouter } from 'next/navigation'
import { useForm } from 'react-hook-form'
import { UserPlus, Terminal, Zap, Sparkles } from 'lucide-react'
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card'
import { useLanguage } from '@/contexts/LanguageContext'
import { useTheme } from '@/contexts/ThemeContext'
import { UserCreate } from '@/types/api'
import { apiClient } from '@/lib/api'
import { Modal } from '@/components/ui/Modal'
import { useModal } from '@/hooks/useModal'

export default function RegisterPage() {
  const router = useRouter()
  const { t, isLoaded } = useLanguage()
  const { theme } = useTheme()
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [kennitalaDisplay, setKennitalaDisplay] = useState('')
  const { modalState, showSuccess, closeModal } = useModal()

  const { register, handleSubmit, formState: { errors }, watch, setValue } = useForm<UserCreate & { confirmPassword: string }>()

  const formatKennitala = (value: string) => {
    const digits = value.replace(/\D/g, '')
    const limited = digits.slice(0, 10)
    if (limited.length > 6) {
      return `${limited.slice(0, 6)}-${limited.slice(6)}`
    }
    return limited
  }

  const handleKennitalaChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const formatted = formatKennitala(e.target.value)
    setKennitalaDisplay(formatted)
    const digitsOnly = formatted.replace(/\D/g, '')
    setValue('kennitala', digitsOnly)
  }

  const onSubmit = async (data: UserCreate & { confirmPassword: string }) => {
    try {
      setLoading(true)
      setError('')

      if (data.password !== data.confirmPassword) {
        setError('Passwords do not match')
        return
      }

      const { confirmPassword: _, ...userData } = data
      await apiClient.register(userData)
      showSuccess(
        'Registration Successful!',
        'Your account has been created. Please sign in with your credentials.',
        () => router.push('/login')
      )
    } catch (err) {
      console.error('Registration error:', err)
      const errorMessage = err instanceof Error ? err.message : 'Registration failed. Please try again.'
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
          error: 'bg-[#dc2626]/10 border border-[#dc2626]/30 text-[#dc2626] rounded-none',
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
          error: 'bg-red-500/10 border border-red-500/30 text-red-400 rounded-lg',
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
          error: 'bg-red-50 border border-red-200 text-red-600 rounded-xl',
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
          error: 'bg-red-50 border border-red-200 text-red-600 rounded-md',
          link: 'text-blue-600 hover:text-blue-500',
          linkText: 'text-gray-600',
          icon: <UserPlus className="w-6 h-6 text-blue-600" />,
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
            {t('auth.signUpTitle')}
          </h2>
          <p className={`mt-2 text-sm ${styles.subtitle}`}>
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
              </div>

              <div>
                <label htmlFor="email" className={`block text-sm font-medium mb-1 ${styles.label}`}>
                  Email *
                </label>
                <Input
                  id="email"
                  type="email"
                  {...register('email', { required: 'Email is required' })}
                  placeholder="john@example.com"
                />
                {errors.email && (
                  <p className="text-red-500 text-sm mt-1">{errors.email.message}</p>
                )}
              </div>

              <div>
                <label htmlFor="username" className={`block text-sm font-medium mb-1 ${styles.label}`}>
                  Username *
                </label>
                <Input
                  id="username"
                  {...register('username', { required: 'Username is required', minLength: 3 })}
                  placeholder="johndoe"
                />
                {errors.username && (
                  <p className="text-red-500 text-sm mt-1">{errors.username.message}</p>
                )}
              </div>

              <div>
                <label htmlFor="kennitala" className={`block text-sm font-medium mb-1 ${styles.label}`}>
                  Kennitala *
                </label>
                <Input
                  id="kennitala"
                  value={kennitalaDisplay}
                  onChange={handleKennitalaChange}
                  placeholder="000000-0000"
                  maxLength={11}
                />
                <input
                  type="hidden"
                  {...register('kennitala', {
                    required: 'Kennitala is required',
                    pattern: {
                      value: /^\d{10}$/,
                      message: 'Kennitala must be exactly 10 digits'
                    }
                  })}
                />
                {errors.kennitala && (
                  <p className="text-red-500 text-sm mt-1">{errors.kennitala.message}</p>
                )}
              </div>

              <div>
                <label htmlFor="password" className={`block text-sm font-medium mb-1 ${styles.label}`}>
                  Password *
                </label>
                <Input
                  id="password"
                  type="password"
                  {...register('password', { required: 'Password is required', minLength: 8 })}
                  placeholder="Enter password"
                />
                {errors.password && (
                  <p className="text-red-500 text-sm mt-1">{errors.password.message}</p>
                )}
              </div>

              <div>
                <label htmlFor="confirmPassword" className={`block text-sm font-medium mb-1 ${styles.label}`}>
                  Confirm Password *
                </label>
                <Input
                  id="confirmPassword"
                  type="password"
                  {...register('confirmPassword', { required: 'Please confirm your password' })}
                  placeholder="Confirm password"
                />
                {errors.confirmPassword && (
                  <p className="text-red-500 text-sm mt-1">{errors.confirmPassword.message}</p>
                )}
              </div>

              {error && (
                <div className={`p-3 ${styles.error}`}>
                  <p className="text-sm">{error}</p>
                </div>
              )}

              <Button type="submit" disabled={loading} className="w-full">
                {loading ? 'Creating account...' : 'Create Account'}
              </Button>
            </form>
          </CardContent>
        </Card>

        <div className="text-center">
          <p className={`text-sm ${styles.linkText}`}>
            Already have an account?{' '}
            <button
              onClick={() => router.push('/login')}
              className={`font-medium ${styles.link}`}
            >
              Sign in here
            </button>
          </p>
        </div>
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
