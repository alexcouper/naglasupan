'use client'

import React from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { ExternalLink, Github, Eye, Calendar, Star } from 'lucide-react'
import { Project } from '@/types/api'
import { Card, CardContent } from '@/components/ui/Card'
import { Badge } from '@/components/ui/Badge'
import { Button } from '@/components/ui/Button'
import { useLanguage } from '@/contexts/LanguageContext'
import { useTheme } from '@/contexts/ThemeContext'
import { formatNumber, formatDate } from '@/lib/utils'

interface ProjectCardProps {
  project: Project
  showOwner?: boolean
  featured?: boolean
}

export function ProjectCard({ project, showOwner = true, featured = false }: ProjectCardProps) {
  const { t } = useLanguage()
  const { theme } = useTheme()
  const primaryImage = project.screenshot_urls[0] || '/placeholder-project.svg'

  const getCardStyles = () => {
    switch (theme) {
      case 'wip':
        return {
          ring: featured ? 'ring-2 ring-[#22c55e]' : '',
          titleHover: 'hover:text-[#22c55e]',
          description: 'text-[#737373]',
          techBadge: 'bg-[#262626] text-[#a3a3a3]',
          stats: 'text-[#525252]',
          avatarBg: 'bg-[#22c55e]',
          featuredBadgeBg: 'bg-[#22c55e] text-[#0d0d0d]',
        }
      case 'futuristic':
        return {
          ring: featured ? 'ring-2 ring-cyan-500 shadow-lg shadow-cyan-500/20' : '',
          titleHover: 'hover:text-cyan-400',
          description: 'text-[#94a3b8]',
          techBadge: 'bg-[#1e293b] text-[#94a3b8]',
          stats: 'text-[#64748b]',
          avatarBg: 'bg-gradient-to-r from-cyan-500 to-purple-500',
          featuredBadgeBg: 'bg-gradient-to-r from-cyan-500 to-blue-500 text-white',
        }
      case 'bright':
        return {
          ring: featured ? 'ring-2 ring-orange-500 shadow-lg shadow-orange-500/20' : '',
          titleHover: 'hover:text-orange-500',
          description: 'text-gray-600',
          techBadge: 'bg-orange-50 text-orange-700',
          stats: 'text-gray-400',
          avatarBg: 'bg-gradient-to-r from-orange-500 to-pink-500',
          featuredBadgeBg: 'bg-gradient-to-r from-orange-500 to-pink-500 text-white',
        }
      default:
        return {
          ring: featured ? 'ring-2 ring-blue-500' : '',
          titleHover: 'hover:text-blue-600',
          description: 'text-gray-600',
          techBadge: 'bg-gray-100 text-gray-700',
          stats: 'text-gray-500',
          avatarBg: 'bg-blue-500',
          featuredBadgeBg: 'bg-blue-600 text-white',
        }
    }
  }

  const styles = getCardStyles()

  return (
    <Card className={`overflow-hidden transition-all duration-200 hover:shadow-lg ${styles.ring}`}>
      <div className="relative aspect-video overflow-hidden">
        <Image
          src={primaryImage}
          alt={project.title}
          fill
          className="object-cover transition-transform duration-200 hover:scale-105"
        />
        {featured && (
          <div className="absolute top-2 right-2">
            <Badge variant="default" className={styles.featuredBadgeBg}>
              <Star className="w-3 h-3 mr-1" />
              Featured
            </Badge>
          </div>
        )}
        {project.is_featured && !featured && (
          <div className="absolute top-2 right-2">
            <Badge variant="warning">
              <Star className="w-3 h-3 mr-1" />
              Featured
            </Badge>
          </div>
        )}
      </div>

      <CardContent className="p-4">
        <div className="space-y-3">
          {/* Title and Description */}
          <div>
            <Link href={`/projects/${project.id}`}>
              <h3 className={`font-semibold text-lg line-clamp-1 transition-colors ${styles.titleHover}`}>
                {project.title}
              </h3>
            </Link>
            <p className={`text-sm line-clamp-2 mt-1 ${styles.description}`}>
              {project.description}
            </p>
          </div>

          {/* Tags */}
          <div className="flex flex-wrap gap-1">
            {project.tags.slice(0, 3).map((tag) => (
              <Badge
                key={tag.id}
                variant="secondary"
                className="text-xs"
                style={{ 
                  backgroundColor: tag.color ? `${tag.color}20` : undefined,
                  color: tag.color || undefined
                }}
              >
                {tag.name}
              </Badge>
            ))}
            {project.tags.length > 3 && (
              <Badge variant="secondary" className="text-xs">
                +{project.tags.length - 3}
              </Badge>
            )}
          </div>

          {/* Tech Stack */}
          <div className="flex flex-wrap gap-1">
            {project.tech_stack.slice(0, 4).map((tech) => (
              <span
                key={tech}
                className={`inline-block text-xs px-2 py-1 ${styles.techBadge} ${theme === 'wip' ? 'rounded-none' : theme === 'bright' ? 'rounded-full' : 'rounded'}`}
              >
                {tech}
              </span>
            ))}
            {project.tech_stack.length > 4 && (
              <span className={`inline-block text-xs px-2 py-1 ${styles.techBadge} ${theme === 'wip' ? 'rounded-none' : theme === 'bright' ? 'rounded-full' : 'rounded'}`}>
                +{project.tech_stack.length - 4}
              </span>
            )}
          </div>

          {/* Stats and Owner */}
          <div className={`flex items-center justify-between text-sm ${styles.stats}`}>
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-1">
                <Eye className="w-4 h-4" />
                <span>{t('projects.visitorsPerMonth', { count: formatNumber(project.monthly_visitors) })}</span>
              </div>
              <div className="flex items-center space-x-1">
                <Calendar className="w-4 h-4" />
                <span>{formatDate(project.created_at)}</span>
              </div>
            </div>
            {showOwner && (
              <div className="flex items-center space-x-1">
                <div className={`w-6 h-6 ${styles.avatarBg} ${theme === 'wip' ? 'rounded-none' : theme === 'bright' ? 'rounded-lg' : 'rounded-full'} flex items-center justify-center text-white text-xs font-medium`}>
                  {project.owner.first_name[0]}{project.owner.last_name[0]}
                </div>
                <span>{project.owner.username}</span>
              </div>
            )}
          </div>

          {/* Action Buttons */}
          <div className="flex space-x-2 pt-2">
            <Button
              variant="outline"
              size="sm"
              className="flex-1"
              onClick={() => window.open(project.website_url, '_blank')}
            >
              <ExternalLink className="w-4 h-4 mr-1" />
              {t('common.visit')}
            </Button>
            {project.github_url && (
              <Button
                variant="ghost"
                size="sm"
                onClick={() => window.open(project.github_url!, '_blank')}
              >
                <Github className="w-4 h-4" />
              </Button>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
