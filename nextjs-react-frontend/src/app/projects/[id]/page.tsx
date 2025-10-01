'use client'

import React, { useState, useEffect } from 'react'
import { useParams, useRouter } from 'next/navigation'
import Image from 'next/image'
import { 
  ExternalLink, 
  Github, 
  Play, 
  Eye, 
  Calendar, 
  User, 
  Star,
  ArrowLeft,
  ChevronLeft,
  ChevronRight
} from 'lucide-react'
import { Project } from '@/types/api'
import { Button } from '@/components/ui/Button'
import { Badge } from '@/components/ui/Badge'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card'
import { useApp } from '@/contexts/AppContext'
import { useLanguage } from '@/contexts/LanguageContext'

import { apiClient } from '@/lib/api'
import { formatNumber, formatDate, getInitials } from '@/lib/utils'

export default function ProjectDetailPage() {
  const params = useParams()
  const router = useRouter()

  const { t, isLoaded } = useLanguage()
  const [project, setProject] = useState<Project | null>(null)
  const [loading, setLoading] = useState(true)
  const [currentImageIndex, setCurrentImageIndex] = useState(0)

  useEffect(() => {
    const loadProject = async () => {
      try {
        setLoading(true)
        const projectData = await apiClient.getProject(params.id as string)
        setProject(projectData)
      } catch (error) {
        console.error('Error loading project:', error)
        setProject(null)
      } finally {
        setLoading(false)
      }
    }

    if (params.id) {
      loadProject()
    }
  }, [params.id])

  const nextImage = () => {
    if (project?.screenshot_urls) {
      setCurrentImageIndex((prev) => 
        prev === project.screenshot_urls.length - 1 ? 0 : prev + 1
      )
    }
  }

  const prevImage = () => {
    if (project?.screenshot_urls) {
      setCurrentImageIndex((prev) => 
        prev === 0 ? project.screenshot_urls.length - 1 : prev - 1
      )
    }
  }

  // Show loading while translations are loading
  if (!isLoaded || loading) {
    return (
      <div className="min-h-screen bg-gray-50 py-8">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="animate-pulse space-y-6">
            <div className="h-8 bg-gray-200 rounded w-1/4"></div>
            <div className="h-64 bg-gray-200 rounded"></div>
            <div className="h-8 bg-gray-200 rounded w-3/4"></div>
            <div className="h-32 bg-gray-200 rounded"></div>
          </div>
        </div>
      </div>
    )
  }

  if (!project) {
    return (
      <div className="min-h-screen bg-gray-50 py-8">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">{t('projectDetail.notFound')}</h1>
          <p className="text-gray-600 mb-8">{t('projectDetail.notFoundSubtitle')}</p>
          <Button onClick={() => router.push('/projects')}>
            <ArrowLeft className="w-4 h-4 mr-2" />
            {t('projectDetail.backToProjects')}
          </Button>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Back Button */}
        <Button
          variant="ghost"
          onClick={() => router.back()}
          className="mb-6"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          {t('common.back')}
        </Button>

        {/* Project Header */}
        <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
          <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-6">
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-2">
                <h1 className="text-3xl font-bold text-gray-900">{project.title}</h1>
                {project.is_featured && (
                  <Badge variant="warning">
                    <Star className="w-3 h-3 mr-1" />
                    {t('admin.status.featured')}
                  </Badge>
                )}
              </div>
              <p className="text-gray-600 text-lg mb-4">{project.description}</p>
              
              {/* Stats */}
              <div className="flex flex-wrap gap-4 text-sm text-gray-500 mb-4">
                <div className="flex items-center gap-1">
                  <Eye className="w-4 h-4" />
                  <span>{t('projectDetail.visitorsPerMonth', { count: formatNumber(project.monthly_visitors) })}</span>
                </div>
                <div className="flex items-center gap-1">
                  <Calendar className="w-4 h-4" />
                  <span>{t('projectDetail.createdOn', { date: formatDate(project.created_at) })}</span>
                </div>
                <div className="flex items-center gap-1">
                  <User className="w-4 h-4" />
                  <span>{t('projects.by')} {project.owner.username}</span>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex flex-wrap gap-3">
                <Button onClick={() => window.open(project.website_url, '_blank')}>
                  <ExternalLink className="w-4 h-4 mr-2" />
                  {t('common.visitWebsite')}
                </Button>
                {project.github_url && (
                    <Button 
                      variant="outline"
                      onClick={() => window.open(project.github_url!, '_blank')}
                    >
                      <Github className="w-4 h-4 mr-2" />
                      {t('common.viewCode')}
                    </Button>
                )}
                {project.demo_url && (
                    <Button 
                      variant="outline"
                      onClick={() => window.open(project.demo_url!, '_blank')}
                    >
                      <Play className="w-4 h-4 mr-2" />
                      {t('common.liveDemo')}
                    </Button>
                )}
              </div>
            </div>

            {/* Owner Card */}
            <Card className="w-full lg:w-80">
              <CardHeader>
                <CardTitle className="text-lg">{t('projectDetail.projectOwner')}</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 bg-blue-500 rounded-full flex items-center justify-center text-white font-medium">
                    {getInitials(project.owner.first_name, project.owner.last_name)}
                  </div>
                  <div>
                    <h3 className="font-semibold">{project.owner.first_name} {project.owner.last_name}</h3>
                    <p className="text-gray-600">@{project.owner.username}</p>
                    {project.owner.is_verified && (
                      <Badge variant="success" className="text-xs mt-1">{t('projectDetail.verified')}</Badge>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Screenshots */}
        {project.screenshot_urls && project.screenshot_urls.length > 0 && (
          <Card className="mb-6">
            <CardHeader>
              <CardTitle>{t('projectDetail.screenshots')}</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="relative">
                <div className="aspect-video relative overflow-hidden rounded-lg">
                  <Image
                    src={project.screenshot_urls[currentImageIndex]}
                    alt={`${project.title} screenshot ${currentImageIndex + 1}`}
                    fill
                    className="object-cover"
                  />
                  
                  {project.screenshot_urls.length > 1 && (
                    <>
                      <button
                        onClick={prevImage}
                        className="absolute left-2 top-1/2 transform -translate-y-1/2 bg-black bg-opacity-50 text-white p-2 rounded-full hover:bg-opacity-70 transition-opacity"
                      >
                        <ChevronLeft className="w-4 h-4" />
                      </button>
                      <button
                        onClick={nextImage}
                        className="absolute right-2 top-1/2 transform -translate-y-1/2 bg-black bg-opacity-50 text-white p-2 rounded-full hover:bg-opacity-70 transition-opacity"
                      >
                        <ChevronRight className="w-4 h-4" />
                      </button>
                    </>
                  )}
                </div>
                
                {project.screenshot_urls.length > 1 && (
                  <div className="flex justify-center gap-2 mt-4">
                    {project.screenshot_urls.map((_, index) => (
                      <button
                        key={index}
                        onClick={() => setCurrentImageIndex(index)}
                        className={`w-3 h-3 rounded-full transition-colors ${
                          index === currentImageIndex ? 'bg-blue-600' : 'bg-gray-300'
                        }`}
                      />
                    ))}
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Description */}
            {project.long_description && (
              <Card>
                <CardHeader>
                  <CardTitle>{t('projectDetail.aboutProject')}</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="prose prose-gray max-w-none">
                    {project.long_description.split('\n').map((paragraph, index) => (
                      <p key={index} className="mb-4 last:mb-0">{paragraph}</p>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Tags */}
            <Card>
              <CardHeader>
                <CardTitle>{t('projectDetail.tags')}</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex flex-wrap gap-2">
                  {project.tags.map((tag) => (
                    <Badge
                      key={tag.id}
                      variant="secondary"
                      style={{
                        backgroundColor: tag.color ? `${tag.color}20` : undefined,
                        color: tag.color || undefined
                      }}
                    >
                      {tag.name}
                    </Badge>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Tech Stack */}
            <Card>
              <CardHeader>
                <CardTitle>{t('projectDetail.techStack')}</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  {project.tech_stack.map((tech, index) => (
                    <div 
                      key={index}
                      className="bg-gray-100 text-gray-700 px-3 py-2 rounded-md text-sm font-medium"
                    >
                      {tech}
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}