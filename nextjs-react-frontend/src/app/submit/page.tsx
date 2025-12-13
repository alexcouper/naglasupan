'use client'

import React, { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useForm } from 'react-hook-form'
import { Send, Terminal, Rocket, PartyPopper } from 'lucide-react'
import { ProjectCreate } from '@/types/api'
import { Button } from '@/components/ui/Button'
import { Input, Textarea } from '@/components/ui/Input'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card'
import { useApp } from '@/contexts/AppContext'
import { useLanguage } from '@/contexts/LanguageContext'
import { useTheme } from '@/contexts/ThemeContext'
import { Modal } from '@/components/ui/Modal'
import { useModal } from '@/hooks/useModal'
import { apiClient } from '@/lib/api'

interface FormData {
  url: string
  description: string
}

export default function SubmitProjectPage() {
  const router = useRouter()
  const { isAuthenticated, isLoading: authLoading } = useApp()
  const { t, isLoaded } = useLanguage()
  const { theme } = useTheme()
  const { modalState, showError, closeModal } = useModal()
  const [loading, setLoading] = useState(false)

  const { register, handleSubmit, formState: { errors } } = useForm<FormData>()

  useEffect(() => {
    if (authLoading) return
    if (!isAuthenticated) {
      router.push('/login?redirect=/submit')
      return
    }
  }, [isAuthenticated, router, authLoading])

  const normalizeUrl = (url: string): string => {
    const trimmedUrl = url.trim()
    if (!trimmedUrl.match(/^https?:\/\//i)) {
      return `https://${trimmedUrl}`
    }
    return trimmedUrl
  }

  const onSubmit = async (data: FormData) => {
    try {
      setLoading(true)

      const projectData: ProjectCreate = {
        url: normalizeUrl(data.url),
        description: data.description || undefined
      }

      await apiClient.createProject(projectData)
      router.push('/my-projects')
    } catch (err) {
      console.error('Error submitting project:', err)
      const errorMessage = err instanceof Error ? err.message : 'Error submitting project. Please try again.'
      showError('Submission Failed', errorMessage)
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
          skeleton: 'bg-[#1e293b]',
          icon: <Rocket className="w-6 h-6 text-cyan-400" />,
        }
      case 'bright':
        return {
          bg: 'bg-gradient-to-br from-orange-50 via-white to-pink-50',
          title: 'text-gray-900',
          subtitle: 'text-gray-600',
          label: 'text-gray-700',
          helpText: 'text-gray-500 text-xs',
          skeleton: 'bg-orange-100',
          icon: <PartyPopper className="w-6 h-6 text-orange-500" />,
        }
      default:
        return {
          bg: 'bg-gray-50',
          title: 'text-gray-900',
          subtitle: 'text-gray-600',
          label: 'text-gray-700',
          helpText: 'text-gray-500 text-xs',
          skeleton: 'bg-gray-300',
          icon: <Send className="w-6 h-6 text-blue-600" />,
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

  if (!isAuthenticated) {
    return null
  }

  return (
    <div className={`min-h-screen ${styles.bg} py-8`}>
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-2">
            {styles.icon}
            <h1 className={`text-3xl font-bold ${styles.title}`}>{t('submit.title')}</h1>
          </div>
          <p className={styles.subtitle}>
            {t('submit.subtitle')}
          </p>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>{t('submit.projectSubmission')}</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <label htmlFor="url" className={`block text-sm font-medium mb-1 ${styles.label}`}>
                  {t('submit.projectUrl')} *
                </label>
                <Input
                  id="url"
                  {...register('url', {
                    required: t('submit.urlRequired'),
                    pattern: {
                      value: /^(https?:\/\/)?([\da-z\.-]+)\.([a-z\.]{2,6})([\/\w \.-]*)*\/?$/i,
                      message: t('submit.validUrlRequired')
                    }
                  })}
                  placeholder={t('submit.projectUrlPlaceholder')}
                />
                {errors.url && (
                  <p className="text-red-500 text-sm mt-1">{errors.url.message}</p>
                )}
                <p className={`mt-1 ${styles.helpText}`}>
                  {t('submit.urlHelp')}
                </p>
              </div>

              <div>
                <label htmlFor="description" className={`block text-sm font-medium mb-1 ${styles.label}`}>
                  {t('submit.description')}
                </label>
                <Textarea
                  id="description"
                  {...register('description', { maxLength: 1000 })}
                  placeholder={t('submit.descriptionPlaceholder')}
                  rows={8}
                />
                <p className={`mt-1 ${styles.helpText}`}>
                  {t('submit.descriptionHelp')}
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
              disabled={loading}
              className="flex-1"
            >
              {loading ? t('submit.submitting') : t('submit.submitProject')}
            </Button>
          </div>
        </form>

        <Card className="mt-6">
          <CardContent className="pt-6">
            <h3 className={`font-semibold mb-2 ${styles.title}`}>{t('submit.whatHappensNext')}</h3>
            <ul className={`text-sm space-y-2 ${styles.subtitle}`}>
              {(t('submit.nextSteps', { returnObjects: true }) as unknown as string[]).map((step: string, index: number) => (
                <li key={index}>• {step}</li>
              ))}
            </ul>
          </CardContent>
        </Card>
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
