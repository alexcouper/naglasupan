'use client'

import React, { useState, useEffect } from 'react'
import { Star } from 'lucide-react'
import { ProjectCard } from '@/components/ProjectCard'
import { useApp } from '@/contexts/AppContext'
import { useLanguage } from '@/contexts/LanguageContext'
import { Project } from '@/types/api'
import { featuredProjects } from '@/lib/dummy-data'
import { apiClient } from '@/lib/api'

export default function FeaturedProjectsPage() {
  const { isDummyMode } = useApp()
  const { t, isLoaded } = useLanguage()
  const [projects, setProjects] = useState<Project[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const loadProjects = async () => {
      try {
        setLoading(true)
        if (isDummyMode) {
          setProjects(featuredProjects)
        } else {
          const projectsData = await apiClient.getFeaturedProjects()
          setProjects(projectsData)
        }
      } catch (error) {
        console.error('Error loading featured projects:', error)
        setProjects(featuredProjects)
      } finally {
        setLoading(false)
      }
    }

    loadProjects()
  }, [isDummyMode])

  // Show loading while translations are loading
  if (!isLoaded) {
    return (
      <div className="min-h-screen bg-gray-50 py-8 flex items-center justify-center">
        <div className="text-center">
          <Star className="w-12 h-12 text-yellow-500 mx-auto mb-4 animate-pulse" />
          <p className="text-gray-600">Loading...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center gap-2 mb-2">
            <Star className="h-8 w-8 text-yellow-500" />
            <h1 className="text-3xl font-bold text-gray-900">{t('home.featured.pageTitle')}</h1>
          </div>
          <p className="text-gray-600">
            {t('home.featured.pageSubtitle')}
          </p>
        </div>

        {/* Projects Grid */}
        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[...Array(6)].map((_, i) => (
              <div key={i} className="bg-gray-200 animate-pulse rounded-lg h-96"></div>
            ))}
          </div>
        ) : projects.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {projects.map((project) => (
              <ProjectCard key={project.id} project={project} featured />
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <Star className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">{t('home.featured.noFeatured')}</h3>
            <p className="text-gray-600">{t('home.featured.noFeaturedSubtitle')}</p>
          </div>
        )}
      </div>
    </div>
  )
}