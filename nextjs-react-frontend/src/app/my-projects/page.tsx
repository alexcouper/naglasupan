'use client'

import React, { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { Plus, Eye, Edit, Trash2, Clock, CheckCircle, XCircle, AlertCircle } from 'lucide-react'
import { Project } from '@/types/api'
import { Button } from '@/components/ui/Button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card'
import { Badge } from '@/components/ui/Badge'
import { useApp } from '@/contexts/AppContext'
import { useLanguage } from '@/contexts/LanguageContext'

import { apiClient } from '@/lib/api'

export default function MyProjectsPage() {
  const router = useRouter()
  const { user, isAuthenticated, isLoading: authLoading } = useApp()
  const { t, isLoaded } = useLanguage()
  const [projects, setProjects] = useState<Project[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // Wait for auth loading to complete
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
    switch (status) {
      case 'approved':
        return <CheckCircle className="w-4 h-4 text-green-600" />
      case 'pending':
        return <Clock className="w-4 h-4 text-yellow-600" />
      case 'rejected':
        return <XCircle className="w-4 h-4 text-red-600" />
      default:
        return <AlertCircle className="w-4 h-4 text-gray-600" />
    }
  }

  const getStatusText = (status: string) => {
    switch (status) {
      case 'approved':
        return 'Published'
      case 'pending':
        return 'Under Review'
      case 'rejected':
        return 'Rejected'
      default:
        return 'Draft'
    }
  }

  const getStatusVariant = (status: string): "default" | "secondary" => {
    switch (status) {
      case 'approved':
        return 'default'
      case 'pending':
        return 'secondary'
      case 'rejected':
        return 'secondary'
      default:
        return 'secondary'
    }
  }

  if (authLoading || !isLoaded) {
    return (
      <div className="min-h-screen bg-gray-50 py-8">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
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

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 py-8">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
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

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">My Projects</h1>
            <p className="text-gray-600">
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
                <div className="w-16 h-16 bg-gray-200 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Plus className="w-8 h-8 text-gray-400" />
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">No projects yet</h3>
                <p className="text-gray-600 mb-6">
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
                  <p className="text-gray-600 text-sm mb-4 line-clamp-3">
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
                    <div className="text-sm text-gray-500 mb-4">
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
                  <div className="text-xs text-gray-400 mt-4 space-y-1">
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
                  <div className="text-2xl font-bold text-gray-900">{projects.length}</div>
                  <div className="text-sm text-gray-600">Total Projects</div>
                </div>
                <div>
                  <div className="text-2xl font-bold text-green-600">
                    {projects.filter(p => p.status === 'approved').length}
                  </div>
                  <div className="text-sm text-gray-600">Published</div>
                </div>
                <div>
                  <div className="text-2xl font-bold text-yellow-600">
                    {projects.filter(p => p.status === 'pending').length}
                  </div>
                  <div className="text-sm text-gray-600">Under Review</div>
                </div>
                <div>
                  <div className="text-2xl font-bold text-blue-600">
                    {projects.filter(p => p.is_featured).length}
                  </div>
                  <div className="text-sm text-gray-600">Featured</div>
                </div>
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  )
}