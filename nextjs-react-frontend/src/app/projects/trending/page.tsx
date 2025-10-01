'use client'

import React, { useState, useEffect } from 'react'
import { TrendingUp } from 'lucide-react'
import { ProjectCard } from '@/components/ProjectCard'
import { useApp } from '@/contexts/AppContext'
import { Project } from '@/types/api'
import { trendingProjects } from '@/lib/dummy-data'
import { apiClient } from '@/lib/api'

export default function TrendingProjectsPage() {
  const { isDummyMode } = useApp()
  const [projects, setProjects] = useState<Project[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const loadProjects = async () => {
      try {
        setLoading(true)
        if (isDummyMode) {
          setProjects(trendingProjects)
        } else {
          const projectsData = await apiClient.getTrendingProjects()
          setProjects(projectsData)
        }
      } catch (error) {
        console.error('Error loading trending projects:', error)
        setProjects(trendingProjects)
      } finally {
        setLoading(false)
      }
    }

    loadProjects()
  }, [isDummyMode])

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center gap-2 mb-2">
            <TrendingUp className="h-8 w-8 text-green-500" />
            <h1 className="text-3xl font-bold text-gray-900">Trending Projects</h1>
          </div>
          <p className="text-gray-600">
            Projects gaining the most traction in our community this month
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
            {projects.map((project, index) => (
              <div key={project.id} className="relative">
                <div className="absolute top-2 left-2 z-10 bg-green-500 text-white text-xs font-bold px-2 py-1 rounded">
                  #{index + 1}
                </div>
                <ProjectCard project={project} />
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <TrendingUp className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">No trending projects</h3>
            <p className="text-gray-600">Check back soon for trending projects</p>
          </div>
        )}
      </div>
    </div>
  )
}