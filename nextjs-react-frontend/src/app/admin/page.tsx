'use client'

import React, { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { 
  CheckCircle, 
  XCircle, 
  Star, 
  Users, 
  FolderOpen, 
  Award,
  Clock,
  TrendingUp
} from 'lucide-react'
import { ProjectCard } from '@/components/ProjectCard'
import { Button } from '@/components/ui/Button'
import { Badge } from '@/components/ui/Badge'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card'
import { useApp } from '@/contexts/AppContext'
import { Project } from '@/types/api'
import { Modal } from '@/components/ui/Modal'
import { useModal } from '@/hooks/useModal'

import { apiClient } from '@/lib/api'

export default function AdminPage() {
  const router = useRouter()
  const { user, isAuthenticated, isLoading: authLoading } = useApp()
  const { modalState, showError, closeModal } = useModal()
  const [allProjects, setAllProjects] = useState<Project[]>([])
  const [projects, setProjects] = useState<Project[]>([])
  const [stats, setStats] = useState({
    total: 0,
    pending: 0,
    approved: 0,
    rejected: 0
  })
  const [loading, setLoading] = useState(true)
  const [filter, setFilter] = useState<'all' | 'pending' | 'approved' | 'rejected'>('pending')

  useEffect(() => {
    // Wait for auth loading to complete
    if (authLoading) return

    if (!isAuthenticated || (user?.username !== 'admin' && user?.username !== 'alice_dev')) {
      router.push('/')
      return
    }

    loadData()
  }, [isAuthenticated, user, router, authLoading])

  const loadData = async () => {
    try {
      setLoading(true)
      
      const projectsData = await apiClient.getAdminProjects()
      const fetchedProjects = projectsData.projects
      
      console.log('Admin projects loaded:', fetchedProjects)
      console.log('Projects data structure:', projectsData)
      
      setAllProjects(fetchedProjects)
      
      // Calculate statistics from all projects
      const newStats = {
        total: fetchedProjects.length,
        pending: fetchedProjects.filter(p => p.status === 'pending').length,
        approved: fetchedProjects.filter(p => p.status === 'approved').length,
        rejected: fetchedProjects.filter(p => p.status === 'rejected').length
      }
      
      console.log('Calculated stats:', newStats)
      setStats(newStats)
    } catch (error) {
      console.error('Error loading admin data:', error)
    } finally {
      setLoading(false)
    }
  }

  // Filter projects whenever filter or allProjects changes
  useEffect(() => {
    if (filter === 'all') {
      setProjects(allProjects)
    } else {
      setProjects(allProjects.filter(p => p.status === filter))
    }
  }, [allProjects, filter])

  const handleApproveProject = async (projectId: string, approved: boolean) => {
    try {
      await apiClient.approveProject(projectId, { approved })
      loadData() // Reload data to get updated stats
    } catch (error) {
      console.error('Error updating project:', error)
      showError('Update Failed', 'Error updating project. Please try again.')
    }
  }

  const handleToggleFeatured = async (projectId: string) => {
    try {
      await apiClient.toggleProjectFeatured(projectId)
      loadData() // Reload data to get updated stats
    } catch (error) {
      console.error('Error toggling featured:', error)
      showError('Update Failed', 'Error updating featured status. Please try again.')
    }
  }

  if (authLoading) {
    return (
      <div className="min-h-screen bg-gray-50 py-8 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-pulse">
            <div className="h-8 bg-gray-300 rounded w-64 mx-auto mb-4"></div>
            <div className="h-4 bg-gray-300 rounded w-96 mx-auto"></div>
          </div>
        </div>
      </div>
    )
  }

  if (!isAuthenticated) {
    return null
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Admin Dashboard</h1>
          <p className="text-gray-600">Manage project submissions and platform settings</p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Total Projects</p>
                  <p className="text-2xl font-bold text-gray-900">{stats.total}</p>
                </div>
                <FolderOpen className="h-8 w-8 text-blue-600" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Pending Review</p>
                  <p className="text-2xl font-bold text-orange-600">{stats.pending}</p>
                </div>
                <Clock className="h-8 w-8 text-orange-600" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Approved</p>
                  <p className="text-2xl font-bold text-green-600">{stats.approved}</p>
                </div>
                <CheckCircle className="h-8 w-8 text-green-600" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Rejected</p>
                  <p className="text-2xl font-bold text-red-600">{stats.rejected}</p>
                </div>
                <XCircle className="h-8 w-8 text-red-600" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Filter Tabs */}
        <div className="mb-6">
          <div className="flex space-x-1 bg-gray-100 rounded-lg p-1">
            {[
              { key: 'pending' as const, label: 'Pending Review', count: stats.pending },
              { key: 'approved' as const, label: 'Approved', count: stats.approved },
              { key: 'rejected' as const, label: 'Rejected', count: stats.rejected },
              { key: 'all' as const, label: 'All Projects', count: stats.total }
            ].map((tab) => (
              <button
                key={tab.key}
                onClick={() => setFilter(tab.key)}
                className={`flex-1 px-4 py-2 text-sm font-medium rounded-md transition-colors ${
                  filter === tab.key
                    ? 'bg-white text-gray-900 shadow-sm'
                    : 'text-gray-600 hover:text-gray-900'
                }`}
              >
                {tab.label} ({tab.count})
              </button>
            ))}
          </div>
        </div>

        {/* Projects List */}
        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[...Array(6)].map((_, i) => (
              <div key={i} className="bg-gray-200 animate-pulse rounded-lg h-96"></div>
            ))}
          </div>
        ) : projects.length > 0 ? (
          <div className="space-y-6">
            {projects.map((project) => (
              <Card key={project.id} className="overflow-hidden">
                <div className="md:flex">
                  {/* Project Image */}
                  <div className="md:w-1/3">
                    <div className="aspect-video relative overflow-hidden">
                      <img
                        src={project.screenshot_urls[0] || '/placeholder-project.jpg'}
                        alt={project.title}
                        className="w-full h-full object-cover"
                      />
                    </div>
                  </div>

                  {/* Project Details */}
                  <div className="md:w-2/3 p-6">
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-2">
                          <h3 className="text-xl font-semibold text-gray-900">{project.title}</h3>
                          <Badge
                            variant={
                              project.status === 'approved' ? 'success' :
                              project.status === 'rejected' ? 'danger' : 'warning'
                            }
                          >
                            {project.status}
                          </Badge>
                          {project.is_featured && (
                            <Badge variant="default">
                              <Star className="w-3 h-3 mr-1" />
                              Featured
                            </Badge>
                          )}
                        </div>
                        <p className="text-gray-600 mb-3">{project.description}</p>
                        
                        {/* Project Meta */}
                        <div className="flex items-center gap-4 text-sm text-gray-500 mb-4">
                          <span>by @{project.owner.username}</span>
                          <span>{new Date(project.created_at).toLocaleDateString()}</span>
                          <span>{project.monthly_visitors.toLocaleString()} visitors/mo</span>
                        </div>

                        {/* Tech Stack */}
                        <div className="flex flex-wrap gap-1 mb-4">
                          {project.tech_stack.slice(0, 4).map((tech) => (
                            <span
                              key={tech}
                              className="inline-block bg-gray-100 text-gray-700 text-xs px-2 py-1 rounded"
                            >
                              {tech}
                            </span>
                          ))}
                        </div>
                      </div>
                    </div>

                    {/* Admin Actions */}
                    <div className="flex flex-wrap gap-2">
                      <Button
                        size="sm"
                        onClick={() => router.push(`/projects/${project.id}`)}
                      >
                        View Details
                      </Button>
                      
                      {project.status === 'pending' && (
                        <>
                          <Button
                            size="sm"
                            variant="secondary"
                            onClick={() => handleApproveProject(project.id, true)}
                          >
                            <CheckCircle className="w-4 h-4 mr-1" />
                            Approve
                          </Button>
                          <Button
                            size="sm"
                            variant="danger"
                            onClick={() => handleApproveProject(project.id, false)}
                          >
                            <XCircle className="w-4 h-4 mr-1" />
                            Reject
                          </Button>
                        </>
                      )}
                      
                      {project.status === 'approved' && (
                        <Button
                          size="sm"
                          variant={project.is_featured ? 'secondary' : 'outline'}
                          onClick={() => handleToggleFeatured(project.id)}
                        >
                          <Star className="w-4 h-4 mr-1" />
                          {project.is_featured ? 'Unfeature' : 'Feature'}
                        </Button>
                      )}
                    </div>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <div className="text-gray-400 mb-4">
              <FolderOpen className="w-16 h-16 mx-auto" />
            </div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">No projects found</h3>
            <p className="text-gray-600">No projects match the current filter</p>
          </div>
        )}
      </div>

      <Modal
        isOpen={modalState.isOpen}
        onClose={closeModal}
        title={modalState.title}
        message={modalState.message}
        type={modalState.type}
        onConfirm={modalState.onConfirm}
      />
    </div>
  )
}