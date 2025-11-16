'use client'

import React, { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useForm } from 'react-hook-form'
import { ProjectCreate } from '@/types/api'
import { Button } from '@/components/ui/Button'
import { Input, Textarea } from '@/components/ui/Input'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card'
import { useApp } from '@/contexts/AppContext'
import { useLanguage } from '@/contexts/LanguageContext'
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
  const { modalState, showError, closeModal } = useModal()
  const [loading, setLoading] = useState(false)

  const { register, handleSubmit, formState: { errors } } = useForm<FormData>()

  useEffect(() => {
    // Wait for auth loading to complete
    if (authLoading) return

    if (!isAuthenticated) {
      router.push('/login?redirect=/submit')
      return
    }
  }, [isAuthenticated, router, authLoading])

  // Helper function to normalize URL
  const normalizeUrl = (url: string): string => {
    const trimmedUrl = url.trim()

    // If URL doesn't start with http:// or https://, add https://
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
    } catch (error: any) {
      console.error('Error submitting project:', error)
      // Display backend error message if available
      const errorMessage = error?.message || 'Error submitting project. Please try again.'
      showError('Submission Failed', errorMessage)
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

  if (!isAuthenticated) {
    return null // Will redirect in useEffect
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">{t('submit.title')}</h1>
          <p className="text-gray-600">
            {t('submit.subtitle')}
          </p>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          {/* Simplified submission form */}
          <Card>
            <CardHeader>
              <CardTitle>{t('submit.projectSubmission')}</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <label htmlFor="url" className="block text-sm font-medium text-gray-700 mb-1">
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
                  <p className="text-red-600 text-sm mt-1">{errors.url.message}</p>
                )}
                <p className="text-gray-500 text-xs mt-1">
                  {t('submit.urlHelp')}
                </p>
              </div>

              <div>
                <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-1">
                  {t('submit.description')}
                </label>
                <Textarea
                  id="description"
                  {...register('description', { maxLength: 1000 })}
                  placeholder={t('submit.descriptionPlaceholder')}
                  rows={8}
                />
                <p className="text-gray-500 text-xs mt-1">
                  {t('submit.descriptionHelp')}
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
              disabled={loading}
              className="flex-1"
            >
              {loading ? t('submit.submitting') : t('submit.submitProject')}
            </Button>
          </div>
        </form>

        <Card className="mt-6">
          <CardContent className="pt-6">
            <h3 className="font-semibold text-gray-900 mb-2">{t('submit.whatHappensNext')}</h3>
            <ul className="text-sm text-gray-600 space-y-2">
              {t('submit.nextSteps', { returnObjects: true }).map((step: string, index: number) => (
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
