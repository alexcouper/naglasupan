'use client'

import React, { useState, useEffect } from 'react'
import { Star, Terminal, Zap, Sparkles } from 'lucide-react'
import { ProjectCard } from '@/components/ProjectCard'
import { useLanguage } from '@/contexts/LanguageContext'
import { useTheme } from '@/contexts/ThemeContext'
import { Project } from '@/types/api'
import { apiClient } from '@/lib/api'

export default function FeaturedProjectsPage() {
  const { t, isLoaded } = useLanguage()
  const { theme } = useTheme()
  const [projects, setProjects] = useState<Project[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const loadProjects = async () => {
      try {
        setLoading(true)
        const projectsData = await apiClient.getFeaturedProjects()
        setProjects(projectsData)
      } catch (error) {
        console.error('Error loading featured projects:', error)
        setProjects([])
      } finally {
        setLoading(false)
      }
    }

    loadProjects()
  }, [])

  const getPageStyles = () => {
    switch (theme) {
      case 'wip':
        return {
          bg: 'bg-[#0d0d0d]',
          title: 'text-[#e5e5e5] font-mono',
          subtitle: 'text-[#737373]',
          skeleton: 'bg-[#262626]',
          emptyIcon: 'text-[#525252]',
          iconColor: 'text-[#fbbf24]',
          icon: <Terminal className="h-8 w-8 text-[#fbbf24]" />,
        }
      case 'futuristic':
        return {
          bg: 'bg-[#030712]',
          title: 'text-white',
          subtitle: 'text-[#64748b]',
          skeleton: 'bg-[#1e293b]',
          emptyIcon: 'text-[#64748b]',
          iconColor: 'text-amber-400',
          icon: <Zap className="h-8 w-8 text-amber-400" />,
        }
      case 'bright':
        return {
          bg: 'bg-gradient-to-br from-orange-50 via-white to-pink-50',
          title: 'text-gray-900',
          subtitle: 'text-gray-600',
          skeleton: 'bg-orange-100',
          emptyIcon: 'text-orange-300',
          iconColor: 'text-yellow-500',
          icon: <Sparkles className="h-8 w-8 text-yellow-500" />,
        }
      default:
        return {
          bg: 'bg-gray-50',
          title: 'text-gray-900',
          subtitle: 'text-gray-600',
          skeleton: 'bg-gray-200',
          emptyIcon: 'text-gray-400',
          iconColor: 'text-yellow-500',
          icon: <Star className="h-8 w-8 text-yellow-500" />,
        }
    }
  }

  const styles = getPageStyles()

  if (!isLoaded) {
    return (
      <div className={`min-h-screen ${styles.bg} py-8 flex items-center justify-center`}>
        <div className="text-center">
          <div className={`animate-pulse ${styles.iconColor}`}>
            <Star className="w-12 h-12 mx-auto mb-4" />
          </div>
          <p className={styles.subtitle}>Loading...</p>
        </div>
      </div>
    )
  }

  return (
    <div className={`min-h-screen ${styles.bg} py-8`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center gap-2 mb-2">
            {styles.icon}
            <h1 className={`text-3xl font-bold ${styles.title}`}>{t('home.featured.pageTitle') || 'Featured Projects'}</h1>
          </div>
          <p className={styles.subtitle}>
            {t('home.featured.pageSubtitle') || 'Our handpicked selection of outstanding projects'}
          </p>
        </div>

        {/* Projects Grid */}
        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[...Array(6)].map((_, i) => (
              <div key={i} className={`${styles.skeleton} animate-pulse ${theme === 'wip' ? 'rounded-none' : theme === 'bright' ? 'rounded-2xl' : 'rounded-lg'} h-96`}></div>
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
            <Star className={`w-16 h-16 mx-auto mb-4 ${styles.emptyIcon}`} />
            <h3 className={`text-lg font-medium mb-2 ${styles.title}`}>{t('home.featured.noFeatured') || 'No featured projects'}</h3>
            <p className={styles.subtitle}>{t('home.featured.noFeaturedSubtitle') || 'Check back soon for featured projects'}</p>
          </div>
        )}
      </div>
    </div>
  )
}
