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
  ChevronRight,
  Terminal,
  Rocket,
  Sparkles
} from 'lucide-react'
import { Project } from '@/types/api'
import { Button } from '@/components/ui/Button'
import { Badge } from '@/components/ui/Badge'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card'
import { useLanguage } from '@/contexts/LanguageContext'
import { useTheme } from '@/contexts/ThemeContext'
import { apiClient } from '@/lib/api'
import { formatNumber, formatDate, getInitials } from '@/lib/utils'

export default function ProjectDetailPage() {
  const params = useParams()
  const router = useRouter()
  const { t, isLoaded } = useLanguage()
  const { theme } = useTheme()
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

  const getPageStyles = () => {
    switch (theme) {
      case 'wip':
        return {
          bg: 'bg-[#0d0d0d]',
          cardBg: 'bg-[#171717]',
          title: 'text-[#e5e5e5] font-mono',
          subtitle: 'text-[#737373]',
          text: 'text-[#a3a3a3]',
          textMuted: 'text-[#525252]',
          techBadge: 'bg-[#262626] text-[#a3a3a3]',
          avatar: 'bg-[#22c55e]',
          skeleton: 'bg-[#262626]',
          navBtn: 'bg-[#171717]/80 hover:bg-[#262626]',
          dot: 'bg-[#22c55e]',
          dotInactive: 'bg-[#333]',
          icon: <Terminal className="w-6 h-6 text-[#22c55e]" />,
        }
      case 'futuristic':
        return {
          bg: 'bg-[#030712]',
          cardBg: 'bg-[#0f172a]',
          title: 'text-white',
          subtitle: 'text-[#64748b]',
          text: 'text-[#94a3b8]',
          textMuted: 'text-[#64748b]',
          techBadge: 'bg-[#1e293b] text-[#94a3b8]',
          avatar: 'bg-gradient-to-r from-cyan-500 to-purple-500',
          skeleton: 'bg-[#1e293b]',
          navBtn: 'bg-[#0f172a]/80 hover:bg-[#1e293b]',
          dot: 'bg-cyan-500',
          dotInactive: 'bg-[#1e293b]',
          icon: <Rocket className="w-6 h-6 text-cyan-400" />,
        }
      case 'bright':
        return {
          bg: 'bg-gradient-to-br from-orange-50 via-white to-pink-50',
          cardBg: 'bg-white',
          title: 'text-gray-900',
          subtitle: 'text-gray-600',
          text: 'text-gray-600',
          textMuted: 'text-gray-400',
          techBadge: 'bg-orange-50 text-orange-700',
          avatar: 'bg-gradient-to-r from-orange-500 to-pink-500',
          skeleton: 'bg-orange-100',
          navBtn: 'bg-white/80 hover:bg-white',
          dot: 'bg-orange-500',
          dotInactive: 'bg-orange-200',
          icon: <Sparkles className="w-6 h-6 text-orange-500" />,
        }
      default:
        return {
          bg: 'bg-gray-50',
          cardBg: 'bg-white',
          title: 'text-gray-900',
          subtitle: 'text-gray-600',
          text: 'text-gray-600',
          textMuted: 'text-gray-500',
          techBadge: 'bg-gray-100 text-gray-700',
          avatar: 'bg-blue-500',
          skeleton: 'bg-gray-200',
          navBtn: 'bg-black/50 hover:bg-black/70',
          dot: 'bg-blue-600',
          dotInactive: 'bg-gray-300',
          icon: null,
        }
    }
  }

  const styles = getPageStyles()

  if (!isLoaded || loading) {
    return (
      <div className={`min-h-screen ${styles.bg} py-8`}>
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="animate-pulse space-y-6">
            <div className={`h-8 ${styles.skeleton} rounded w-1/4`}></div>
            <div className={`h-64 ${styles.skeleton} rounded`}></div>
            <div className={`h-8 ${styles.skeleton} rounded w-3/4`}></div>
            <div className={`h-32 ${styles.skeleton} rounded`}></div>
          </div>
        </div>
      </div>
    )
  }

  if (!project) {
    return (
      <div className={`min-h-screen ${styles.bg} py-8`}>
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className={`text-2xl font-bold mb-4 ${styles.title}`}>{t('projectDetail.notFound')}</h1>
          <p className={`mb-8 ${styles.text}`}>{t('projectDetail.notFoundSubtitle')}</p>
          <Button onClick={() => router.push('/projects')}>
            <ArrowLeft className="w-4 h-4 mr-2" />
            {t('projectDetail.backToProjects')}
          </Button>
        </div>
      </div>
    )
  }

  return (
    <div className={`min-h-screen ${styles.bg} py-8`}>
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
        <Card className="mb-6">
          <CardContent className="pt-6">
            <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-6">
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-2 flex-wrap">
                  <h1 className={`text-3xl font-bold ${styles.title}`}>{project.title}</h1>
                  {project.is_featured && (
                    <Badge variant="warning">
                      <Star className="w-3 h-3 mr-1" />
                      {t('admin.status.featured')}
                    </Badge>
                  )}
                </div>
                <p className={`text-lg mb-4 ${styles.text}`}>{project.description}</p>
                
                {/* Stats */}
                <div className={`flex flex-wrap gap-4 text-sm mb-4 ${styles.textMuted}`}>
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
                    <div className={`w-12 h-12 ${styles.avatar} ${theme === 'wip' ? 'rounded-none' : theme === 'bright' ? 'rounded-2xl' : 'rounded-full'} flex items-center justify-center text-white font-medium`}>
                      {getInitials(project.owner.first_name, project.owner.last_name)}
                    </div>
                    <div>
                      <h3 className={`font-semibold ${styles.title}`}>{project.owner.first_name} {project.owner.last_name}</h3>
                      <p className={styles.textMuted}>@{project.owner.username}</p>
                      {project.owner.is_verified && (
                        <Badge variant="success" className="text-xs mt-1">{t('projectDetail.verified')}</Badge>
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </CardContent>
        </Card>

        {/* Screenshots */}
        {project.screenshot_urls && project.screenshot_urls.length > 0 && (
          <Card className="mb-6">
            <CardHeader>
              <CardTitle>{t('projectDetail.screenshots')}</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="relative">
                <div className={`aspect-video relative overflow-hidden ${theme === 'wip' ? 'rounded-none' : theme === 'bright' ? 'rounded-2xl' : 'rounded-lg'}`}>
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
                        className={`absolute left-2 top-1/2 transform -translate-y-1/2 ${styles.navBtn} text-white p-2 ${theme === 'wip' ? 'rounded-none' : 'rounded-full'} transition-all`}
                      >
                        <ChevronLeft className="w-4 h-4" />
                      </button>
                      <button
                        onClick={nextImage}
                        className={`absolute right-2 top-1/2 transform -translate-y-1/2 ${styles.navBtn} text-white p-2 ${theme === 'wip' ? 'rounded-none' : 'rounded-full'} transition-all`}
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
                        className={`w-3 h-3 ${theme === 'wip' ? 'rounded-none' : 'rounded-full'} transition-colors ${
                          index === currentImageIndex ? styles.dot : styles.dotInactive
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
                  <div className={`prose max-w-none ${styles.text}`}>
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
                      className={`px-3 py-2 text-sm font-medium ${styles.techBadge} ${theme === 'wip' ? 'rounded-none' : theme === 'bright' ? 'rounded-xl' : 'rounded-md'}`}
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
