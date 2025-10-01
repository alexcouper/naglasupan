'use client'

import React, { useState, useEffect } from 'react'
import { useParams, useRouter } from 'next/navigation'
import { useForm } from 'react-hook-form'
import { Plus, X, ArrowLeft, Save } from 'lucide-react'
import { ProjectCreate, ProjectUpdate, Tag, Project } from '@/types/api'
import { Button } from '@/components/ui/Button'
import { Input, Textarea } from '@/components/ui/Input'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card'
import { Badge } from '@/components/ui/Badge'
import { useApp } from '@/contexts/AppContext'
import { useLanguage } from '@/contexts/LanguageContext'
import { apiClient } from '@/lib/api'

interface FormData {
  title: string
  description: string
  long_description: string
  website_url: string
  github_url?: string
  demo_url?: string
  screenshot_urls: string[]
  tech_stack: string[]
  tag_ids: string[]
}

export default function EditProjectPage() {
  const params = useParams()
  const router = useRouter()
  const { isAuthenticated, user, isLoading: authLoading } = useApp()
  const { t, isLoaded } = useLanguage()
  const [project, setProject] = useState<Project | null>(null)
  const [tags, setTags] = useState<Tag[]>([])
  const [loading, setLoading] = useState(false)
  const [loadingData, setLoadingData] = useState(true)
  const [currentScreenshot, setCurrentScreenshot] = useState('')
  const [currentTech, setCurrentTech] = useState('')
  const [customCategories, setCustomCategories] = useState<string[]>([])
  const [currentCategory, setCurrentCategory] = useState('')

  const { register, handleSubmit, watch, setValue, reset, formState: { errors } } = useForm<FormData>({
    defaultValues: {
      screenshot_urls: [],
      tech_stack: [],
      tag_ids: []
    }
  })

  const watchedScreenshots = watch('screenshot_urls')
  const watchedTechStack = watch('tech_stack')
  const watchedTagIds = watch('tag_ids')

  useEffect(() => {
    // Wait for auth loading to complete
    if (authLoading) return

    if (!isAuthenticated) {
      router.push('/login?redirect=' + encodeURIComponent(window.location.pathname))
      return
    }

    const loadData = async () => {
      try {
        setLoadingData(true)
        const [projectData, tagsData] = await Promise.all([
          apiClient.getProject(params.id as string),
          apiClient.getTags()
        ])
        
        // Check if user owns this project
        if (projectData.owner.id !== user?.id) {
          alert('You can only edit your own projects')
          router.push('/my-projects')
          return
        }
        
        setProject(projectData)
        setTags(tagsData)
        
        // Populate form with existing data
        reset({
          title: projectData.title,
          description: projectData.description,
          long_description: projectData.long_description || '',
          website_url: projectData.website_url,
          github_url: projectData.github_url || '',
          demo_url: projectData.demo_url || '',
          screenshot_urls: projectData.screenshot_urls,
          tech_stack: projectData.tech_stack,
          tag_ids: projectData.tags.map(tag => tag.id)
        })
      } catch (error) {
        console.error('Error loading project:', error)
        alert('Error loading project data')
        router.push('/my-projects')
      } finally {
        setLoadingData(false)
      }
    }

    if (params.id && user) {
      loadData()
    }
  }, [isAuthenticated, params.id, user, router, reset, authLoading])

  const addScreenshot = () => {
    if (currentScreenshot.trim()) {
      setValue('screenshot_urls', [...watchedScreenshots, currentScreenshot.trim()])
      setCurrentScreenshot('')
    }
  }

  const removeScreenshot = (index: number) => {
    setValue('screenshot_urls', watchedScreenshots.filter((_, i) => i !== index))
  }

  const addTech = () => {
    if (currentTech.trim() && !watchedTechStack.includes(currentTech.trim())) {
      setValue('tech_stack', [...watchedTechStack, currentTech.trim()])
      setCurrentTech('')
    }
  }

  const removeTech = (tech: string) => {
    setValue('tech_stack', watchedTechStack.filter(t => t !== tech))
  }

  const addCustomCategory = () => {
    if (currentCategory.trim() && !customCategories.includes(currentCategory.trim())) {
      setCustomCategories([...customCategories, currentCategory.trim()])
      setCurrentCategory('')
    }
  }

  const removeCustomCategory = (category: string) => {
    setCustomCategories(customCategories.filter(c => c !== category))
  }

  const toggleTag = (tagId: string) => {
    if (watchedTagIds.includes(tagId)) {
      setValue('tag_ids', watchedTagIds.filter(id => id !== tagId))
    } else {
      setValue('tag_ids', [...watchedTagIds, tagId])
    }
  }

  const onSubmit = async (data: FormData) => {
    try {
      setLoading(true)
      
      const projectData: ProjectUpdate = {
        title: data.title,
        description: data.description,
        long_description: data.long_description || undefined,
        website_url: data.website_url,
        github_url: data.github_url || undefined,
        demo_url: data.demo_url || undefined,
        screenshot_urls: data.screenshot_urls,
        tech_stack: data.tech_stack,
        tag_ids: data.tag_ids
      }
      
      await apiClient.updateProject(params.id as string, projectData)
      alert('Project updated successfully!')
      router.push('/my-projects')
    } catch (error) {
      console.error('Error updating project:', error)
      alert('Error updating project. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  if (authLoading || !isLoaded || loadingData) {
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
    return null // Will redirect in useEffect
  }

  if (!project) {
    return (
      <div className="min-h-screen bg-gray-50 py-8 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-2">Project not found</h1>
          <p className="text-gray-600 mb-4">The project you're looking for doesn't exist or you don't have permission to edit it.</p>
          <Button onClick={() => router.push('/my-projects')}>
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to My Projects
          </Button>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-8 flex items-center gap-4">
          <Button
            variant="outline"
            onClick={() => router.push('/my-projects')}
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back
          </Button>
          <div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Edit Project</h1>
            <p className="text-gray-600">
              Update your project details and resubmit for approval
            </p>
          </div>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          {/* Basic Information */}
          <Card>
            <CardHeader>
              <CardTitle>Basic Information</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-1">
                  Project Title *
                </label>
                <Input
                  id="title"
                  {...register('title', { required: 'Project title is required', maxLength: 100 })}
                  placeholder="Enter your project title"
                />
                {errors.title && (
                  <p className="text-red-600 text-sm mt-1">{errors.title.message}</p>
                )}
              </div>

              <div>
                <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-1">
                  Short Description *
                </label>
                <Textarea
                  id="description"
                  {...register('description', { required: 'Description is required', maxLength: 500 })}
                  placeholder="Brief description of your project (max 500 characters)"
                  rows={3}
                />
                {errors.description && (
                  <p className="text-red-600 text-sm mt-1">{errors.description.message}</p>
                )}
              </div>

              <div>
                <label htmlFor="long_description" className="block text-sm font-medium text-gray-700 mb-1">
                  Detailed Description
                </label>
                <Textarea
                  id="long_description"
                  {...register('long_description')}
                  placeholder="Detailed description of your project, features, and technical details"
                  rows={6}
                />
              </div>
            </CardContent>
          </Card>

          {/* URLs */}
          <Card>
            <CardHeader>
              <CardTitle>Links</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <label htmlFor="website_url" className="block text-sm font-medium text-gray-700 mb-1">
                  Website URL *
                </label>
                <Input
                  id="website_url"
                  type="url"
                  {...register('website_url', { required: 'Website URL is required' })}
                  placeholder="https://yourproject.com"
                />
                {errors.website_url && (
                  <p className="text-red-600 text-sm mt-1">{errors.website_url.message}</p>
                )}
              </div>

              <div>
                <label htmlFor="github_url" className="block text-sm font-medium text-gray-700 mb-1">
                  GitHub URL
                </label>
                <Input
                  id="github_url"
                  type="url"
                  {...register('github_url')}
                  placeholder="https://github.com/username/repository"
                />
              </div>

              <div>
                <label htmlFor="demo_url" className="block text-sm font-medium text-gray-700 mb-1">
                  Live Demo URL
                </label>
                <Input
                  id="demo_url"
                  type="url"
                  {...register('demo_url')}
                  placeholder="https://demo.yourproject.com"
                />
              </div>
            </CardContent>
          </Card>

          {/* Screenshots */}
          <Card>
            <CardHeader>
              <CardTitle>Screenshots</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex gap-2">
                <Input
                  value={currentScreenshot}
                  onChange={(e) => setCurrentScreenshot(e.target.value)}
                  placeholder="Enter screenshot URL"
                  type="url"
                />
                <Button type="button" onClick={addScreenshot}>
                  <Plus className="w-4 h-4" />
                </Button>
              </div>

              {watchedScreenshots.length > 0 && (
                <div className="space-y-2">
                  {watchedScreenshots.map((url, index) => (
                    <div key={index} className="flex items-center gap-2 bg-gray-100 p-2 rounded">
                      <span className="flex-1 text-sm truncate">{url}</span>
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        onClick={() => removeScreenshot(index)}
                      >
                        <X className="w-4 h-4" />
                      </Button>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>

          {/* Tech Stack */}
          <Card>
            <CardHeader>
              <CardTitle>Technology Stack *</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex gap-2">
                <Input
                  value={currentTech}
                  onChange={(e) => setCurrentTech(e.target.value)}
                  placeholder="Add technology (e.g., React, Node.js)"
                  onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addTech())}
                />
                <Button type="button" onClick={addTech}>
                  <Plus className="w-4 h-4" />
                </Button>
              </div>

              {watchedTechStack.length > 0 && (
                <div className="flex flex-wrap gap-2">
                  {watchedTechStack.map((tech) => (
                    <Badge key={tech} variant="secondary" className="flex items-center gap-1">
                      {tech}
                      <button
                        type="button"
                        onClick={() => removeTech(tech)}
                        className="hover:text-red-600"
                      >
                        <X className="w-3 h-3" />
                      </button>
                    </Badge>
                  ))}
                </div>
              )}

              {watchedTechStack.length === 0 && (
                <p className="text-red-600 text-sm">At least one technology is required</p>
              )}
            </CardContent>
          </Card>

          {/* Tags */}
          <Card>
            <CardHeader>
              <CardTitle>Categories *</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex flex-wrap gap-2">
                {tags.map((tag) => (
                  <Badge
                    key={tag.id}
                    variant={watchedTagIds.includes(tag.id) ? 'default' : 'secondary'}
                    className="cursor-pointer hover:opacity-80"
                    style={{
                      backgroundColor: watchedTagIds.includes(tag.id) && tag.color ? tag.color : undefined,
                      color: watchedTagIds.includes(tag.id) && tag.color ? 'white' : undefined
                    }}
                    onClick={() => toggleTag(tag.id)}
                  >
                    {tag.name}
                  </Badge>
                ))}
              </div>
              
              {/* Custom Categories Input */}
              <div className="mt-4 pt-4 border-t border-gray-200">
                <p className="text-sm text-gray-600 mb-2">Or add custom categories:</p>
                <div className="flex gap-2">
                  <Input
                    value={currentCategory}
                    onChange={(e) => setCurrentCategory(e.target.value)}
                    placeholder="Add custom category"
                    onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addCustomCategory())}
                  />
                  <Button type="button" onClick={addCustomCategory}>
                    <Plus className="w-4 h-4" />
                  </Button>
                </div>
                
                {customCategories.length > 0 && (
                  <div className="flex flex-wrap gap-2 mt-2">
                    {customCategories.map((category) => (
                      <Badge key={category} variant="default" className="flex items-center gap-1">
                        {category}
                        <button
                          type="button"
                          onClick={() => removeCustomCategory(category)}
                          className="hover:text-red-600"
                        >
                          <X className="w-3 h-3" />
                        </button>
                      </Badge>
                    ))}
                  </div>
                )}
              </div>

              {watchedTagIds.length === 0 && customCategories.length === 0 && (
                <p className="text-red-600 text-sm mt-2">At least one category is required</p>
              )}
            </CardContent>
          </Card>

          {/* Submit */}
          <div className="flex gap-4">
            <Button
              type="button"
              variant="outline"
              onClick={() => router.push('/my-projects')}
              disabled={loading}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={loading || watchedTechStack.length === 0 || (watchedTagIds.length === 0 && customCategories.length === 0)}
              className="flex-1"
            >
              <Save className="w-4 h-4 mr-2" />
              {loading ? 'Updating...' : 'Update Project'}
            </Button>
          </div>
        </form>
      </div>
    </div>
  )
}