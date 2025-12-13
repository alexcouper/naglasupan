'use client'

import React, { useState, useEffect } from 'react'
import { TrendingUp, Terminal, Rocket, Flame } from 'lucide-react'
import { ProjectCard } from '@/components/ProjectCard'
import { useLanguage } from '@/contexts/LanguageContext'
import { useTheme } from '@/contexts/ThemeContext'
import { Project } from '@/types/api'
import { apiClient } from '@/lib/api'

export default function TrendingProjectsPage() {
  const { t, isLoaded } = useLanguage()
  const { theme } = useTheme()
  const [projects, setProjects] = useState<Project[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const loadProjects = async () => {
      try {
        setLoading(true)
        const projectsData = await apiClient.getTrendingProjects()
        setProjects(projectsData)
      } catch (error) {
        console.error('Error loading trending projects:', error)
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
          rankBg: 'bg-[#22c55e] text-[#0d0d0d]',
          iconColor: 'text-[#22c55e]',
          icon: <Terminal className="h-8 w-8 text-[#22c55e]" />,
        }
      case 'futuristic':
        return {
          bg: 'bg-[#030712]',
          title: 'text-white',
          subtitle: 'text-[#64748b]',
          skeleton: 'bg-[#1e293b]',
          emptyIcon: 'text-[#64748b]',
          rankBg: 'bg-gradient-to-r from-cyan-500 to-purple-500 text-white',
          iconColor: 'text-cyan-400',
          icon: <Rocket className="h-8 w-8 text-cyan-400" />,
        }
      case 'bright':
        return {
          bg: 'bg-gradient-to-br from-orange-50 via-white to-pink-50',
          title: 'text-gray-900',
          subtitle: 'text-gray-600',
          skeleton: 'bg-orange-100',
          emptyIcon: 'text-orange-300',
          rankBg: 'bg-gradient-to-r from-orange-500 to-pink-500 text-white',
          iconColor: 'text-orange-500',
          icon: <Flame className="h-8 w-8 text-orange-500" />,
        }
      default:
        return {
          bg: 'bg-gray-50',
          title: 'text-gray-900',
          subtitle: 'text-gray-600',
          skeleton: 'bg-gray-200',
          emptyIcon: 'text-gray-400',
          rankBg: 'bg-green-500 text-white',
          iconColor: 'text-green-500',
          icon: <TrendingUp className="h-8 w-8 text-green-500" />,
        }
    }
  }

  const styles = getPageStyles()

  if (!isLoaded) {
    return (
      <div className={`min-h-screen ${styles.bg} py-8 flex items-center justify-center`}>
        <div className="text-center">
          <div className={`animate-pulse ${styles.iconColor}`}>
            <TrendingUp className="w-12 h-12 mx-auto mb-4" />
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
            <h1 className={`text-3xl font-bold ${styles.title}`}>{t('home.trending.pageTitle') || 'Trending Projects'}</h1>
          </div>
          <p className={styles.subtitle}>
            {t('home.trending.pageSubtitle') || 'The most popular projects right now'}
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
            {projects.map((project, index) => (
              <div key={project.id} className="relative">
                <div className={`absolute top-2 left-2 z-10 ${styles.rankBg} text-xs font-bold px-2 py-1 ${theme === 'wip' ? 'rounded-none' : theme === 'bright' ? 'rounded-full' : 'rounded'}`}>
                  #{index + 1}
                </div>
                <ProjectCard project={project} />
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <TrendingUp className={`w-16 h-16 mx-auto mb-4 ${styles.emptyIcon}`} />
            <h3 className={`text-lg font-medium mb-2 ${styles.title}`}>{t('home.trending.noTrending') || 'No trending projects'}</h3>
            <p className={styles.subtitle}>{t('home.trending.noTrendingSubtitle') || 'Check back soon for trending projects'}</p>
          </div>
        )}
      </div>
    </div>
  )
}
