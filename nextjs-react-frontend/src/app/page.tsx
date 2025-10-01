'use client'

import React, { useEffect, useState } from 'react'
import Link from 'next/link'
import { Rocket, Code2, Users, Award, ArrowRight, Star, TrendingUp } from 'lucide-react'
import { ProjectCard } from '@/components/ProjectCard'
import { Button } from '@/components/ui/Button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card'
import { useApp } from '@/contexts/AppContext'
import { Project } from '@/types/api'
import { featuredProjects, trendingProjects } from '@/lib/dummy-data'
import { apiClient } from '@/lib/api'

export default function Home() {
  const { isDummyMode } = useApp()
  const [featured, setFeatured] = useState<Project[]>([])
  const [trending, setTrending] = useState<Project[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const loadData = async () => {
      try {
        if (isDummyMode) {
          setFeatured(featuredProjects)
          setTrending(trendingProjects)
        } else {
          const [featuredData, trendingData] = await Promise.all([
            apiClient.getFeaturedProjects(),
            apiClient.getTrendingProjects()
          ])
          setFeatured(featuredData)
          setTrending(trendingData)
        }
      } catch (error) {
        console.error('Error loading data:', error)
        // Fallback to dummy data
        setFeatured(featuredProjects)
        setTrending(trendingProjects)
      } finally {
        setLoading(false)
      }
    }

    loadData()
  }, [isDummyMode])

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
      {/* Hero Section */}
      <section className="pt-20 pb-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto text-center">
          <div className="flex justify-center mb-8">
            <div className="flex items-center space-x-2 bg-blue-100 text-blue-800 px-4 py-2 rounded-full text-sm font-medium">
              <Rocket className="w-4 h-4" />
              <span>Showcase Your Amazing Projects</span>
            </div>
          </div>
          
          <h1 className="text-4xl sm:text-6xl font-bold text-gray-900 mb-6">
            Where Developers
            <span className="block text-blue-600">Showcase Excellence</span>
          </h1>
          
          <p className="text-xl text-gray-600 max-w-3xl mx-auto mb-8">
            Join our community of talented developers. Submit your projects, get discovered by peers, 
            and compete for monthly prizes. Your next big break starts here.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/projects">
              <Button size="lg" className="w-full sm:w-auto">
                <Code2 className="w-5 h-5 mr-2" />
                Browse Projects
              </Button>
            </Link>
            <Link href="/submit">
              <Button variant="outline" size="lg" className="w-full sm:w-auto">
                Submit Your Project
                <ArrowRight className="w-5 h-5 ml-2" />
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 bg-white">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <Card className="text-center">
              <CardContent className="pt-6">
                <Code2 className="w-12 h-12 text-blue-600 mx-auto mb-4" />
                <h3 className="text-2xl font-bold text-gray-900 mb-2">500+</h3>
                <p className="text-gray-600">Amazing Projects</p>
              </CardContent>
            </Card>
            
            <Card className="text-center">
              <CardContent className="pt-6">
                <Users className="w-12 h-12 text-green-600 mx-auto mb-4" />
                <h3 className="text-2xl font-bold text-gray-900 mb-2">1,200+</h3>
                <p className="text-gray-600">Active Developers</p>
              </CardContent>
            </Card>
            
            <Card className="text-center">
              <CardContent className="pt-6">
                <Award className="w-12 h-12 text-purple-600 mx-auto mb-4" />
                <h3 className="text-2xl font-bold text-gray-900 mb-2">$50,000</h3>
                <p className="text-gray-600">In Monthly Prizes</p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Featured Projects */}
      <section className="py-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h2 className="text-3xl font-bold text-gray-900 mb-2">Featured Projects</h2>
              <p className="text-gray-600">Handpicked exceptional projects from our community</p>
            </div>
            <Link href="/projects/featured">
              <Button variant="outline">
                <Star className="w-4 h-4 mr-2" />
                View All Featured
              </Button>
            </Link>
          </div>
          
          {loading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[...Array(3)].map((_, i) => (
                <div key={i} className="bg-gray-200 animate-pulse rounded-lg h-96"></div>
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {featured.slice(0, 3).map((project) => (
                <ProjectCard key={project.id} project={project} featured />
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Trending Projects */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 bg-gray-50">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h2 className="text-3xl font-bold text-gray-900 mb-2">Trending This Month</h2>
              <p className="text-gray-600">Projects gaining the most traction in our community</p>
            </div>
            <Link href="/projects/trending">
              <Button variant="outline">
                <TrendingUp className="w-4 h-4 mr-2" />
                View All Trending
              </Button>
            </Link>
          </div>
          
          {loading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[...Array(3)].map((_, i) => (
                <div key={i} className="bg-gray-200 animate-pulse rounded-lg h-96"></div>
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {trending.slice(0, 3).map((project) => (
                <ProjectCard key={project.id} project={project} />
              ))}
            </div>
          )}
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 bg-blue-600">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl font-bold text-white mb-4">
            Ready to Showcase Your Project?
          </h2>
          <p className="text-xl text-blue-100 mb-8">
            Join thousands of developers who have already shared their amazing work with our community.
          </p>
          <Link href="/submit">
            <Button variant="secondary" size="lg">
              Submit Your Project Today
              <ArrowRight className="w-5 h-5 ml-2" />
            </Button>
          </Link>
        </div>
      </section>
    </div>
  )
}
