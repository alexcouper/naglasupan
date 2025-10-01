'use client'

import React, { useState, useEffect } from 'react'
import { Search, Filter, SortAsc, SortDesc } from 'lucide-react'
import { ProjectCard } from '@/components/ProjectCard'
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'
import { Badge } from '@/components/ui/Badge'
import { useApp } from '@/contexts/AppContext'
import { useLanguage } from '@/contexts/LanguageContext'
import { Project, Tag, ProjectFilters } from '@/types/api'
import { dummyProjects, dummyTags } from '@/lib/dummy-data'
import { apiClient } from '@/lib/api'

export default function ProjectsPage() {
  const { isDummyMode } = useApp()
  const { t, isLoaded } = useLanguage()
  const [projects, setProjects] = useState<Project[]>([])
  const [tags, setTags] = useState<Tag[]>([])
  const [loading, setLoading] = useState(true)
  const [filters, setFilters] = useState<ProjectFilters>({
    search: '',
    tags: [],
    sort_by: 'created_at',
    sort_order: 'desc',
    page: 1,
    per_page: 12
  })

  const loadData = async () => {
    try {
      setLoading(true)
      if (isDummyMode) {
        // Filter and sort dummy data
        let filteredProjects = dummyProjects.filter(p => p.status === 'approved')
        
        if (filters.search) {
          filteredProjects = filteredProjects.filter(p =>
            p.title.toLowerCase().includes(filters.search!.toLowerCase()) ||
            p.description.toLowerCase().includes(filters.search!.toLowerCase())
          )
        }
        
        if (filters.tags && filters.tags.length > 0) {
          filteredProjects = filteredProjects.filter(p =>
            p.tags.some(tag => filters.tags!.includes(tag.slug))
          )
        }
        
        // Sort projects
        filteredProjects.sort((a, b) => {
          const multiplier = filters.sort_order === 'desc' ? -1 : 1
          switch (filters.sort_by) {
            case 'monthly_visitors':
              return (a.monthly_visitors - b.monthly_visitors) * multiplier
            case 'title':
              return a.title.localeCompare(b.title) * multiplier
            default:
              return (new Date(a.created_at).getTime() - new Date(b.created_at).getTime()) * multiplier
          }
        })
        
        setProjects(filteredProjects)
        setTags(dummyTags)
      } else {
        const [projectsData, tagsData] = await Promise.all([
          apiClient.getProjects(filters),
          apiClient.getTags()
        ])
        setProjects(projectsData.projects)
        setTags(tagsData)
      }
    } catch (error) {
      console.error('Error loading projects:', error)
      // Fallback to dummy data
      setProjects(dummyProjects.filter(p => p.status === 'approved'))
      setTags(dummyTags)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadData()
  }, [isDummyMode, filters])

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    // Search will be triggered by the useEffect when filters change
  }

  const toggleTag = (tagSlug: string) => {
    setFilters(prev => ({
      ...prev,
      tags: prev.tags?.includes(tagSlug)
        ? prev.tags.filter(t => t !== tagSlug)
        : [...(prev.tags || []), tagSlug]
    }))
  }

  const toggleSort = () => {
    setFilters(prev => ({
      ...prev,
      sort_order: prev.sort_order === 'desc' ? 'asc' : 'desc'
    }))
  }

  // Show loading while translations are loading
  if (!isLoaded) {
    return (
      <div className="min-h-screen bg-gray-50 py-8 flex items-center justify-center">
        <div className="text-center">
          <div className="w-12 h-12 text-blue-600 mx-auto mb-4 animate-spin">⚠</div>
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
          <h1 className="text-3xl font-bold text-gray-900 mb-2">{t('projects.title')}</h1>
          <p className="text-gray-600">{t('projects.subtitle')}</p>
        </div>

        {/* Filters */}
        <div className="mb-8 space-y-4">
          {/* Search */}
          <form onSubmit={handleSearch} className="flex gap-2">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <Input
                type="text"
                placeholder={t('projects.search')}
                value={filters.search || ''}
                onChange={(e) => setFilters(prev => ({ ...prev, search: e.target.value }))}
                className="pl-10"
              />
            </div>
            <Button type="submit">{t('common.search')}</Button>
          </form>

          {/* Tags Filter */}
          <div className="flex flex-wrap gap-2">
            <span className="text-sm font-medium text-gray-700 flex items-center">
              <Filter className="w-4 h-4 mr-1" />
              {t('projects.filterByTags')}
            </span>
            {tags.map((tag) => (
              <Badge
                key={tag.id}
                variant={filters.tags?.includes(tag.slug) ? 'default' : 'secondary'}
                className="cursor-pointer hover:opacity-80"
                style={{
                  backgroundColor: filters.tags?.includes(tag.slug) && tag.color ? tag.color : undefined,
                  color: filters.tags?.includes(tag.slug) && tag.color ? 'white' : undefined
                }}
                onClick={() => toggleTag(tag.slug)}
              >
                {tag.name}
              </Badge>
            ))}
          </div>

          {/* Sort Controls */}
          <div className="flex items-center gap-4">
            <span className="text-sm font-medium text-gray-700">{t('projects.sortBy')}</span>
            <select
              value={filters.sort_by}
              onChange={(e) => setFilters(prev => ({ ...prev, sort_by: e.target.value as any }))}
              className="rounded-md border border-gray-300 px-3 py-1 text-sm"
            >
              <option value="created_at">{t('projects.sortOptions.createdAt')}</option>
              <option value="monthly_visitors">{t('projects.sortOptions.monthlyVisitors')}</option>
              <option value="title">{t('projects.sortOptions.title')}</option>
            </select>
            <Button
              variant="ghost"
              size="sm"
              onClick={toggleSort}
              className="flex items-center"
            >
              {filters.sort_order === 'desc' ? (
                <SortDesc className="w-4 h-4" />
              ) : (
                <SortAsc className="w-4 h-4" />
              )}
            </Button>
          </div>

          {/* Active Filters */}
          {(filters.tags?.length > 0 || filters.search) && (
            <div className="flex items-center gap-2">
              <span className="text-sm text-gray-600">{t('projects.activeFilters')}</span>
              {filters.search && (
                <Badge variant="secondary">
                  Search: {filters.search}
                  <button
                    onClick={() => setFilters(prev => ({ ...prev, search: '' }))}
                    className="ml-1 hover:text-red-600"
                  >
                    ×
                  </button>
                </Badge>
              )}
              {filters.tags?.map(tagSlug => {
                const tag = tags.find(t => t.slug === tagSlug)
                return (
                  <Badge key={tagSlug} variant="secondary">
                    {tag?.name || tagSlug}
                    <button
                      onClick={() => toggleTag(tagSlug)}
                      className="ml-1 hover:text-red-600"
                    >
                      ×
                    </button>
                  </Badge>
                )
              })}
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setFilters(prev => ({ ...prev, search: '', tags: [] }))}
              >
{t('projects.clearAll')}
              </Button>
            </div>
          )}
        </div>

        {/* Results */}
        <div className="mb-4">
          <p className="text-gray-600">
            {loading ? t('common.loading') : t('projects.resultsCount', { count: projects.length })}
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
              <ProjectCard key={project.id} project={project} />
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <div className="text-gray-400 mb-4">
              <Search className="w-16 h-16 mx-auto" />
            </div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">{t('projects.noProjects')}</h3>
            <p className="text-gray-600">{t('projects.noProjectsSubtitle')}</p>
          </div>
        )}
      </div>
    </div>
  )
}