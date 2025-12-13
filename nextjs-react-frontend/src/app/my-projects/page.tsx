'use client'

import React, { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { Plus, Eye, Edit, Clock, CheckCircle, XCircle, AlertCircle, Terminal, Rocket, Sparkles } from 'lucide-react'
import { Project } from '@/types/api'
import { Button } from '@/components/ui/Button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card'
import { Badge } from '@/components/ui/Badge'
import { useApp } from '@/contexts/AppContext'
import { useLanguage } from '@/contexts/LanguageContext'
import { useTheme } from '@/contexts/ThemeContext'
import { apiClient } from '@/lib/api'

export default function MyProjectsPage() {
  const router = useRouter()
  const { user, isAuthenticated, isLoading: authLoading } = useApp()
  const { isLoaded } = useLanguage()
  const { theme } = useTheme()
  const [projects, setProjects] = useState<Project[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (authLoading) return
    if (!isAuthenticated) {
      router.push('/login?redirect=/my-projects')
      return
    }

    const loadUserProjects = async () => {
      try {
        const userProjects = await apiClient.getMyProjects()
        setProjects(userProjects)
      } catch (error) {
        console.error('Error loading user projects:', error)
        setProjects([])
      } finally {
        setLoading(false)
      }
    }

    if (user) {
      loadUserProjects()
    }
  }, [isAuthenticated, user, router, authLoading])

  const getStatusIcon = (status: string) => {
    const iconColors = {
      wip: { approved: 'text-[#22c55e]', pending: 'text-[#fbbf24]', rejected: 'text-[#dc2626]', default: 'text-[#737373]' },
      futuristic: { approved: 'text-emerald-400', pending: 'text-amber-400', rejected: 'text-red-400', default: 'text-[#64748b]' },
      bright: { approved: 'text-green-600', pending: 'text-yellow-600', rejected: 'text-red-600', default: 'text-gray-600' },
    }
    const colors = iconColors[theme] || iconColors.bright

    switch (status) {
      case 'approved':
        return <CheckCircle className={`w-4 h-4 ${colors.approved}`} />
      case 'pending':
        return <Clock className={`w-4 h-4 ${colors.pending}`} />
      case 'rejected':
        return <XCircle className={`w-4 h-4 ${colors.rejected}`} />
      default:
        return <AlertCircle className={`w-4 h-4 ${colors.default}`} />
    }
  }

  const getStatusText = (status: string) => {
    switch (status) {
      case 'approved': return 'Published'
      case 'pending': return 'Under Review'
      case 'rejected': return 'Rejected'
      default: return 'Draft'
    }
  }

  const getStatusVariant = (status: string): "success" | "warning" | "danger" | "secondary" => {
    switch (status) {
      case 'approved': return 'success'
      case 'pending': return 'warning'
      case 'rejected': return 'danger'
      default: return 'secondary'
    }
  }

  const getPageStyles = () => {
    switch (theme) {
      case 'wip':
        return {
          bg: 'bg-[#0d0d0d]',
          title: 'text-[#e5e5e5] font-mono',
          subtitle: 'text-[#737373]',
          text: 'text-[#a3a3a3]',
          textMuted: 'text-[#525252]',
          statValue: 'text-[#e5e5e5]',
          statApproved: 'text-[#22c55e]',
          statPending: 'text-[#fbbf24]',
          statFeatured: 'text-[#3b82f6]',
          emptyBg: 'bg-[#262626]',
          emptyIcon: 'text-[#525252]',
          skeleton: 'bg-[#262626]',
          icon: <Terminal className="w-6 h-6 text-[#22c55e]" />,
        }
      case 'futuristic':
        return {
          bg: 'bg-[#030712]',
          title: 'text-white',
          subtitle: 'text-[#64748b]',
          text: 'text-[#94a3b8]',
          textMuted: 'text-[#64748b]',
          statValue: 'text-white',
          statApproved: 'text-emerald-400',
          statPending: 'text-amber-400',
          statFeatured: 'text-cyan-400',
          emptyBg: 'bg-[#1e293b]',
          emptyIcon: 'text-[#64748b]',
          skeleton: 'bg-[#1e293b]',
          icon: <Rocket className="w-6 h-6 text-cyan-400" />,
        }
      case 'bright':
        return {
          bg: 'bg-gradient-to-br from-orange-50 via-white to-pink-50',
          title: 'text-gray-900',
          subtitle: 'text-gray-600',
          text: 'text-gray-600',
          textMuted: 'text-gray-400',
          statValue: 'text-gray-900',
          statApproved: 'text-green-600',
          statPending: 'text-yellow-600',
          statFeatured: 'text-orange-600',
          emptyBg: 'bg-orange-100',
          emptyIcon: 'text-orange-300',
          skeleton: 'bg-orange-100',
          icon: <Sparkles className="w-6 h-6 text-orange-500" />,
        }
      default:
        return {
          bg: 'bg-gray-50',
          title: 'text-gray-900',
          subtitle: 'text-gray-600',
          text: 'text-gray-600',
          textMuted: 'text-gray-400',
          statValue: 'text-gray-900',
          statApproved: 'text-green-600',
          statPending: 'text-yellow-600',
          statFeatured: 'text-blue-600',
          emptyBg: 'bg-gray-200',
          emptyIcon: 'text-gray-400',
          skeleton: 'bg-gray-300',
          icon: <Plus className="w-6 h-6 text-blue-600" />,
        }
    }
  }

  const styles = getPageStyles()

  if (authLoading || !isLoaded) {
    return (
      <div className={`min-h-screen ${styles.bg} py-8`}>
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
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

  if (loading) {
    return (
      <div className={`min-h-screen ${styles.bg} py-8`}>
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
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

  return (
    <div className={`min-h-screen ${styles.bg} py-8`}>
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="flex justify-between items-center mb-8">
          <div>
            <div className="flex items-center gap-3 mb-2">
              {styles.icon}
              <h1 className={`text-3xl font-bold ${styles.title}`}>My Projects</h1>
            </div>
            <p className={styles.subtitle}>
              Manage your submitted projects and track their approval status
            </p>
          </div>
          <Button onClick={() => router.push('/submit')}>
            <Plus className="w-4 h-4 mr-2" />
            Submit New Project
          </Button>
        </div>

        {/* Projects Grid */}
        {projects.length === 0 ? (
          <Card className="text-center py-12">
            <CardContent>
              <div className="max-w-md mx-auto">
                <div className={`w-16 h-16 ${styles.emptyBg} ${theme === 'wip' ? 'rounded-none' : theme === 'bright' ? 'rounded-2xl' : 'rounded-full'} flex items-center justify-center mx-auto mb-4`}>
                  <Plus className={`w-8 h-8 ${styles.emptyIcon}`} />
                </div>
                <h3 className={`text-lg font-semibold mb-2 ${styles.title}`}>No projects yet</h3>
                <p className={`mb-6 ${styles.text}`}>
                  Get started by submitting your first project to the showcase.
                </p>
                <Button onClick={() => router.push('/submit')}>
                  <Plus className="w-4 h-4 mr-2" />
                  Submit Your First Project
                </Button>
              </div>
            </CardContent>
          </Card>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {projects.map((project) => (
              <Card key={project.id} className="hover:shadow-md transition-shadow">
                <CardHeader>
                  <div className="flex justify-between items-start">
                    <CardTitle className="text-lg line-clamp-2">{project.title}</CardTitle>
                    <div className="flex items-center gap-1 ml-2">
                      {getStatusIcon(project.status)}
                      <Badge variant={getStatusVariant(project.status)} className="text-xs">
                        {getStatusText(project.status)}
                      </Badge>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <p className={`text-sm mb-4 line-clamp-3 ${styles.text}`}>
                    {project.description}
                  </p>

                  {/* Tags */}
                  <div className="flex flex-wrap gap-1 mb-4">
                    {project.tags.slice(0, 3).map((tag) => (
                      <Badge key={tag.id} variant="secondary" className="text-xs">
                        {tag.name}
                      </Badge>
                    ))}
                    {project.tags.length > 3 && (
                      <Badge variant="secondary" className="text-xs">
                        +{project.tags.length - 3} more
                      </Badge>
                    )}
                  </div>

                  {/* Stats */}
                  {project.status === 'approved' && (
                    <div className={`text-sm mb-4 ${styles.textMuted}`}>
                      <span>{project.monthly_visitors?.toLocaleString()} monthly visitors</span>
                      {project.is_featured && (
                        <Badge variant="default" className="ml-2 text-xs">Featured</Badge>
                      )}
                    </div>
                  )}

                  {/* Actions */}
                  <div className="flex gap-2">
                    {project.status === 'approved' && (
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => router.push(`/projects/${project.id}`)}
                      >
                        <Eye className="w-4 h-4 mr-1" />
                        View
                      </Button>
                    )}
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => router.push(`/projects/${project.id}/edit`)}
                      disabled={project.status === 'rejected'}
                    >
                      <Edit className="w-4 h-4 mr-1" />
                      Edit
                    </Button>
                  </div>

                  {/* Timestamps */}
                  <div className={`text-xs mt-4 space-y-1 ${styles.textMuted}`}>
                    <div>Submitted: {new Date(project.created_at).toLocaleDateString()}</div>
                    {project.approved_at && (
                      <div>Approved: {new Date(project.approved_at).toLocaleDateString()}</div>
                    )}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}

        {/* Stats Summary */}
        {projects.length > 0 && (
          <Card className="mt-8">
            <CardHeader>
              <CardTitle>Summary</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4 text-center">
                <div>
                  <div className={`text-2xl font-bold ${styles.statValue}`}>{projects.length}</div>
                  <div className={`text-sm ${styles.text}`}>Total Projects</div>
                </div>
                <div>
                  <div className={`text-2xl font-bold ${styles.statApproved}`}>
                    {projects.filter(p => p.status === 'approved').length}
                  </div>
                  <div className={`text-sm ${styles.text}`}>Published</div>
                </div>
                <div>
                  <div className={`text-2xl font-bold ${styles.statPending}`}>
                    {projects.filter(p => p.status === 'pending').length}
                  </div>
                  <div className={`text-sm ${styles.text}`}>Under Review</div>
                </div>
                <div>
                  <div className={`text-2xl font-bold ${styles.statFeatured}`}>
                    {projects.filter(p => p.is_featured).length}
                  </div>
                  <div className={`text-sm ${styles.text}`}>Featured</div>
                </div>
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  )
}
