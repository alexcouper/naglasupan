'use client'

import React, { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Image from 'next/image'
import { 
  CheckCircle, 
  XCircle, 
  Star, 
  FolderOpen, 
  Clock,
  Terminal,
  Shield,
  Sparkles
} from 'lucide-react'
import { Button } from '@/components/ui/Button'
import { Badge } from '@/components/ui/Badge'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card'
import { useApp } from '@/contexts/AppContext'
import { useTheme } from '@/contexts/ThemeContext'
import { Project } from '@/types/api'
import { Modal } from '@/components/ui/Modal'
import { useModal } from '@/hooks/useModal'
import { apiClient } from '@/lib/api'

export default function AdminPage() {
  const router = useRouter()
  const { user, isAuthenticated, isLoading: authLoading } = useApp()
  const { theme } = useTheme()
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
      setAllProjects(fetchedProjects)
      
      const newStats = {
        total: fetchedProjects.length,
        pending: fetchedProjects.filter((p: Project) => p.status === 'pending').length,
        approved: fetchedProjects.filter((p: Project) => p.status === 'approved').length,
        rejected: fetchedProjects.filter((p: Project) => p.status === 'rejected').length
      }
      setStats(newStats)
    } catch (error) {
      console.error('Error loading admin data:', error)
    } finally {
      setLoading(false)
    }
  }

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
      loadData()
    } catch (error) {
      console.error('Error updating project:', error)
      showError('Update Failed', 'Error updating project. Please try again.')
    }
  }

  const handleToggleFeatured = async (projectId: string) => {
    try {
      await apiClient.toggleProjectFeatured(projectId)
      loadData()
    } catch (error) {
      console.error('Error toggling featured:', error)
      showError('Update Failed', 'Error updating featured status. Please try again.')
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
          tabBg: 'bg-[#171717]',
          tabActive: 'bg-[#262626] text-[#22c55e]',
          tabInactive: 'text-[#737373] hover:text-[#a3a3a3]',
          techBadge: 'bg-[#262626] text-[#a3a3a3]',
          statTotal: 'text-[#3b82f6]',
          statPending: 'text-[#fbbf24]',
          statApproved: 'text-[#22c55e]',
          statRejected: 'text-[#dc2626]',
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
          textMuted: 'text-[#64748b]',
          tabBg: 'bg-[#0f172a]',
          tabActive: 'bg-[#1e293b] text-cyan-400 shadow-sm',
          tabInactive: 'text-[#64748b] hover:text-[#94a3b8]',
          techBadge: 'bg-[#1e293b] text-[#94a3b8]',
          statTotal: 'text-cyan-400',
          statPending: 'text-amber-400',
          statApproved: 'text-emerald-400',
          statRejected: 'text-red-400',
          skeleton: 'bg-[#1e293b]',
          emptyIcon: 'text-[#64748b]',
          icon: <Shield className="w-6 h-6 text-cyan-400" />,
        }
      case 'bright':
        return {
          bg: 'bg-gradient-to-br from-orange-50 via-white to-pink-50',
          title: 'text-gray-900',
          subtitle: 'text-gray-600',
          text: 'text-gray-600',
          textMuted: 'text-gray-400',
          tabBg: 'bg-orange-50',
          tabActive: 'bg-white text-orange-600 shadow-sm',
          tabInactive: 'text-gray-600 hover:text-gray-900',
          techBadge: 'bg-orange-50 text-orange-700',
          statTotal: 'text-blue-600',
          statPending: 'text-orange-600',
          statApproved: 'text-green-600',
          statRejected: 'text-red-600',
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
          textMuted: 'text-gray-500',
          tabBg: 'bg-gray-100',
          tabActive: 'bg-white text-gray-900 shadow-sm',
          tabInactive: 'text-gray-600 hover:text-gray-900',
          techBadge: 'bg-gray-100 text-gray-700',
          statTotal: 'text-blue-600',
          statPending: 'text-orange-600',
          statApproved: 'text-green-600',
          statRejected: 'text-red-600',
          skeleton: 'bg-gray-200',
          emptyIcon: 'text-gray-400',
          icon: <Shield className="w-6 h-6 text-blue-600" />,
        }
    }
  }

  const styles = getPageStyles()

  if (authLoading) {
    return (
      <div className={`min-h-screen ${styles.bg} py-8 flex items-center justify-center`}>
        <div className="text-center">
          <div className="animate-pulse">
            <div className={`h-8 ${styles.skeleton} rounded w-64 mx-auto mb-4`}></div>
            <div className={`h-4 ${styles.skeleton} rounded w-96 mx-auto`}></div>
          </div>
        </div>
      </div>
    )
  }

  if (!isAuthenticated) {
    return null
  }

  return (
    <div className={`min-h-screen ${styles.bg} py-8`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-2">
            {styles.icon}
            <h1 className={`text-3xl font-bold ${styles.title}`}>Admin Dashboard</h1>
          </div>
          <p className={styles.subtitle}>Manage project submissions and platform settings</p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className={`text-sm font-medium ${styles.text}`}>Total Projects</p>
                  <p className={`text-2xl font-bold ${styles.statTotal}`}>{stats.total}</p>
                </div>
                <FolderOpen className={`h-8 w-8 ${styles.statTotal}`} />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className={`text-sm font-medium ${styles.text}`}>Pending Review</p>
                  <p className={`text-2xl font-bold ${styles.statPending}`}>{stats.pending}</p>
                </div>
                <Clock className={`h-8 w-8 ${styles.statPending}`} />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className={`text-sm font-medium ${styles.text}`}>Approved</p>
                  <p className={`text-2xl font-bold ${styles.statApproved}`}>{stats.approved}</p>
                </div>
                <CheckCircle className={`h-8 w-8 ${styles.statApproved}`} />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className={`text-sm font-medium ${styles.text}`}>Rejected</p>
                  <p className={`text-2xl font-bold ${styles.statRejected}`}>{stats.rejected}</p>
                </div>
                <XCircle className={`h-8 w-8 ${styles.statRejected}`} />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Filter Tabs */}
        <div className="mb-6">
          <div className={`flex space-x-1 ${styles.tabBg} ${theme === 'wip' ? 'rounded-none' : theme === 'bright' ? 'rounded-2xl' : 'rounded-lg'} p-1`}>
            {[
              { key: 'pending' as const, label: 'Pending Review', count: stats.pending },
              { key: 'approved' as const, label: 'Approved', count: stats.approved },
              { key: 'rejected' as const, label: 'Rejected', count: stats.rejected },
              { key: 'all' as const, label: 'All Projects', count: stats.total }
            ].map((tab) => (
              <button
                key={tab.key}
                onClick={() => setFilter(tab.key)}
                className={`flex-1 px-4 py-2 text-sm font-medium ${theme === 'wip' ? 'rounded-none' : theme === 'bright' ? 'rounded-xl' : 'rounded-md'} transition-colors ${
                  filter === tab.key ? styles.tabActive : styles.tabInactive
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
              <div key={i} className={`${styles.skeleton} animate-pulse ${theme === 'wip' ? 'rounded-none' : theme === 'bright' ? 'rounded-2xl' : 'rounded-lg'} h-96`}></div>
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
                      <Image
                        src={project.screenshot_urls[0] || '/placeholder-project.jpg'}
                        alt={project.title}
                        fill
                        className="object-cover"
                      />
                    </div>
                  </div>

                  {/* Project Details */}
                  <div className="md:w-2/3 p-6">
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-2 flex-wrap">
                          <h3 className={`text-xl font-semibold ${styles.title}`}>{project.title}</h3>
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
                        <p className={`mb-3 ${styles.text}`}>{project.description}</p>
                        
                        {/* Project Meta */}
                        <div className={`flex items-center gap-4 text-sm mb-4 ${styles.textMuted}`}>
                          <span>by @{project.owner.username}</span>
                          <span>{new Date(project.created_at).toLocaleDateString()}</span>
                          <span>{project.monthly_visitors.toLocaleString()} visitors/mo</span>
                        </div>

                        {/* Tech Stack */}
                        <div className="flex flex-wrap gap-1 mb-4">
                          {project.tech_stack.slice(0, 4).map((tech) => (
                            <span
                              key={tech}
                              className={`inline-block text-xs px-2 py-1 ${styles.techBadge} ${theme === 'wip' ? 'rounded-none' : theme === 'bright' ? 'rounded-full' : 'rounded'}`}
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
            <div className={`mb-4 ${styles.emptyIcon}`}>
              <FolderOpen className="w-16 h-16 mx-auto" />
            </div>
            <h3 className={`text-lg font-medium mb-2 ${styles.title}`}>No projects found</h3>
            <p className={styles.text}>No projects match the current filter</p>
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
