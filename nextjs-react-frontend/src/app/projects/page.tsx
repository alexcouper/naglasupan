'use client'

import React, { useState, useEffect } from 'react'
import { Search, Filter, SortAsc, SortDesc, Terminal, Rocket, Sparkles } from 'lucide-react'
import { ProjectCard } from '@/components/ProjectCard'
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'
import { Badge } from '@/components/ui/Badge'
import { useLanguage } from '@/contexts/LanguageContext'
import { useTheme } from '@/contexts/ThemeContext'
import { Project, Tag, ProjectFilters } from '@/types/api'
import { apiClient } from '@/lib/api'

export default function ProjectsPage() {
  const { t, isLoaded } = useLanguage()
  const { theme } = useTheme()
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
      const [projectsData, tagsData] = await Promise.all([
        apiClient.getProjects(filters),
        apiClient.getTags()
      ])
      setProjects(projectsData.projects)
      setTags(tagsData)
    } catch (error) {
      console.error('Error loading projects:', error)
      setProjects([])
      setTags([])
    } finally {
      setLoading(false)
    }
  }

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
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

  useEffect(() => {
    loadData()
  }, [filters])

  const getPageStyles = () => {
    switch (theme) {
      case 'wip':
        return {
          bg: 'bg-[#0d0d0d]',
          title: 'text-[#e5e5e5] font-mono',
          subtitle: 'text-[#737373]',
          text: 'text-[#a3a3a3]',
          filterLabel: 'text-[#a3a3a3] font-mono text-xs uppercase',
          selectBg: 'bg-[#171717] border-[#333] text-[#e5e5e5]',
          skeleton: 'bg-[#262626]',
          emptyIcon: 'text-[#525252]',
          icon: <Terminal className="w-6 h-6 text-[#22c55e]" />,
        }
      case 'futuristic':
        return {
          bg: 'bg-[#030712]',
          title: 'text-white',
          subtitle: 'text-[#64748b]',
          text: 'text-[#94a3b8]',
          filterLabel: 'text-[#94a3b8]',
          selectBg: 'bg-[#0f172a] border-[#1e293b] text-[#f1f5f9]',
          skeleton: 'bg-[#1e293b]',
          emptyIcon: 'text-[#64748b]',
          icon: <Rocket className="w-6 h-6 text-cyan-400" />,
        }
      case 'bright':
        return {
          bg: 'bg-gradient-to-br from-orange-50 via-white to-pink-50',
          title: 'text-gray-900',
          subtitle: 'text-gray-600',
          text: 'text-gray-600',
          filterLabel: 'text-gray-700',
          selectBg: 'bg-white border-orange-200 text-gray-900',
          skeleton: 'bg-orange-100',
          emptyIcon: 'text-orange-300',
          icon: <Sparkles className="w-6 h-6 text-orange-500" />,
        }
      default:
        return {
          bg: 'bg-gray-50',
          title: 'text-gray-900',
          subtitle: 'text-gray-600',
          text: 'text-gray-600',
          filterLabel: 'text-gray-700',
          selectBg: 'bg-white border-gray-300 text-gray-900',
          skeleton: 'bg-gray-200',
          emptyIcon: 'text-gray-400',
          icon: <Search className="w-6 h-6 text-blue-600" />,
        }
    }
  }

  const styles = getPageStyles()

  if (!isLoaded) {
    return (
      <div className={`min-h-screen ${styles.bg} py-8 flex items-center justify-center`}>
        <div className="text-center">
          <div className="animate-pulse">{styles.icon}</div>
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
          <div className="flex items-center gap-3 mb-2">
            {styles.icon}
            <h1 className={`text-3xl font-bold ${styles.title}`}>{t('projects.title')}</h1>
          </div>
          <p className={styles.subtitle}>{t('projects.subtitle')}</p>
        </div>

        {/* Filters */}
        <div className="mb-8 space-y-4">
          {/* Search */}
          <form onSubmit={handleSearch} className="flex gap-2">
            <div className="relative flex-1">
              <Search className={`absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 ${theme === 'wip' ? 'text-[#525252]' : theme === 'futuristic' ? 'text-[#64748b]' : 'text-gray-400'}`} />
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
            <span className={`text-sm font-medium flex items-center ${styles.filterLabel}`}>
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
            <span className={`text-sm font-medium ${styles.filterLabel}`}>{t('projects.sortBy')}</span>
            <select
              value={filters.sort_by}
              onChange={(e) => setFilters(prev => ({ ...prev, sort_by: e.target.value as ProjectFilters['sort_by'] }))}
              className={`${theme === 'wip' ? 'rounded-none' : theme === 'bright' ? 'rounded-xl' : 'rounded-md'} border px-3 py-1 text-sm ${styles.selectBg}`}
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
          {((filters.tags?.length ?? 0) > 0 || filters.search) && (
            <div className="flex items-center gap-2 flex-wrap">
              <span className={`text-sm ${styles.text}`}>{t('projects.activeFilters')}</span>
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
          <p className={styles.text}>
            {loading ? t('common.loading') : t('projects.resultsCount', { count: projects.length })}
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
              <ProjectCard key={project.id} project={project} />
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <div className={`mb-4 ${styles.emptyIcon}`}>
              <Search className="w-16 h-16 mx-auto" />
            </div>
            <h3 className={`text-lg font-medium mb-2 ${styles.title}`}>{t('projects.noProjects')}</h3>
            <p className={styles.text}>{t('projects.noProjectsSubtitle')}</p>
          </div>
        )}
      </div>
    </div>
  )
}
