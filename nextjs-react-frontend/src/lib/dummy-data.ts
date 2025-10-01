import { Project, Tag, User, ProjectListResponse } from '@/types/api'

export const dummyTags: Tag[] = [
  {
    id: '1',
    name: 'React',
    slug: 'react',
    description: 'Frontend JavaScript library',
    color: '#61DAFB'
  },
  {
    id: '2',
    name: 'Next.js',
    slug: 'nextjs',
    description: 'React framework for production',
    color: '#000000'
  },
  {
    id: '3',
    name: 'TypeScript',
    slug: 'typescript',
    description: 'Typed JavaScript at scale',
    color: '#3178C6'
  },
  {
    id: '4',
    name: 'Python',
    slug: 'python',
    description: 'General-purpose programming language',
    color: '#3776AB'
  },
  {
    id: '5',
    name: 'Django',
    slug: 'django',
    description: 'High-level Python web framework',
    color: '#092E20'
  },
  {
    id: '6',
    name: 'Machine Learning',
    slug: 'ml',
    description: 'AI and ML projects',
    color: '#FF6F00'
  },
  {
    id: '7',
    name: 'Mobile',
    slug: 'mobile',
    description: 'Mobile app development',
    color: '#9C27B0'
  },
  {
    id: '8',
    name: 'API',
    slug: 'api',
    description: 'Backend APIs and services',
    color: '#4CAF50'
  }
]

export const dummyUsers: User[] = [
  {
    id: '1',
    email: 'alice@example.com',
    username: 'alice_dev',
    first_name: 'Alice',
    last_name: 'Johnson',
    is_verified: true,
    created_at: '2024-01-15T10:00:00Z'
  },
  {
    id: '2',
    email: 'bob@example.com',
    username: 'bob_builder',
    first_name: 'Bob',
    last_name: 'Smith',
    is_verified: true,
    created_at: '2024-02-20T14:30:00Z'
  },
  {
    id: '3',
    email: 'carol@example.com',
    username: 'carol_codes',
    first_name: 'Carol',
    last_name: 'Williams',
    is_verified: true,
    created_at: '2024-03-10T09:15:00Z'
  }
]

export const dummyProjects: Project[] = [
  {
    id: '1',
    title: 'TaskFlow - Smart Project Management',
    description: 'An AI-powered project management tool that automatically prioritizes tasks and predicts project timelines.',
    long_description: 'TaskFlow revolutionizes project management by leveraging machine learning to analyze team productivity patterns, automatically prioritize tasks based on urgency and impact, and provide accurate project timeline predictions. The platform integrates with popular development tools and provides real-time insights into team performance.',
    website_url: 'https://taskflow-demo.com',
    github_url: 'https://github.com/alice/taskflow',
    demo_url: 'https://demo.taskflow-demo.com',
    screenshot_urls: [
      'https://images.unsplash.com/photo-1611224923853-80b023f02d71?w=800&h=600&fit=crop',
      'https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=800&h=600&fit=crop'
    ],
    tech_stack: ['React', 'TypeScript', 'Python', 'Django', 'PostgreSQL', 'TensorFlow'],
    monthly_visitors: 15420,
    status: 'approved',
    is_featured: true,
    created_at: '2024-01-15T10:00:00Z',
    approved_at: '2024-01-20T16:30:00Z',
    owner: dummyUsers[0],
    tags: [dummyTags[0], dummyTags[2], dummyTags[4], dummyTags[5]]
  },
  {
    id: '2',
    title: 'WeatherWise - Hyperlocal Weather App',
    description: 'A mobile weather app that provides hyperlocal forecasts using crowdsourced data and advanced meteorological models.',
    long_description: 'WeatherWise combines official weather data with crowdsourced reports from users to provide the most accurate hyperlocal weather forecasts. The app features real-time weather updates, severe weather alerts, and detailed hourly forecasts with stunning visualizations.',
    website_url: 'https://weatherwise-app.com',
    github_url: 'https://github.com/bob/weatherwise',
    demo_url: null,
    screenshot_urls: [
      'https://images.unsplash.com/photo-1504608524841-42fe6f032b4b?w=800&h=600&fit=crop',
      'https://images.unsplash.com/photo-1559827260-dc66d52bef19?w=800&h=600&fit=crop'
    ],
    tech_stack: ['React Native', 'Node.js', 'MongoDB', 'AWS'],
    monthly_visitors: 8750,
    status: 'approved',
    is_featured: false,
    created_at: '2024-02-20T14:30:00Z',
    approved_at: '2024-02-25T11:45:00Z',
    owner: dummyUsers[1],
    tags: [dummyTags[6], dummyTags[7]]
  },
  {
    id: '3',
    title: 'CodeReview AI',
    description: 'An intelligent code review assistant that helps developers write better code through automated analysis and suggestions.',
    long_description: 'CodeReview AI uses advanced static analysis and machine learning to provide intelligent code review suggestions. It identifies potential bugs, security vulnerabilities, performance issues, and style inconsistencies, helping teams maintain high code quality standards.',
    website_url: 'https://codereview-ai.dev',
    github_url: 'https://github.com/carol/codereview-ai',
    demo_url: 'https://demo.codereview-ai.dev',
    screenshot_urls: [
      'https://images.unsplash.com/photo-1555066931-4365d14bab8c?w=800&h=600&fit=crop'
    ],
    tech_stack: ['Python', 'FastAPI', 'React', 'TypeScript', 'Docker'],
    monthly_visitors: 12300,
    status: 'approved',
    is_featured: true,
    created_at: '2024-03-10T09:15:00Z',
    approved_at: '2024-03-15T13:20:00Z',
    owner: dummyUsers[2],
    tags: [dummyTags[0], dummyTags[2], dummyTags[3], dummyTags[5]]
  },
  {
    id: '4',
    title: 'EcoTracker - Carbon Footprint Monitor',
    description: 'Track and reduce your carbon footprint with personalized recommendations and community challenges.',
    long_description: 'EcoTracker helps individuals and organizations monitor their environmental impact through detailed carbon footprint tracking. The app provides personalized recommendations for reducing emissions and connects users with community challenges to promote sustainable living.',
    website_url: 'https://ecotracker-green.com',
    github_url: null,
    demo_url: 'https://demo.ecotracker-green.com',
    screenshot_urls: [
      'https://images.unsplash.com/photo-1542601906990-b4d3fb778b09?w=800&h=600&fit=crop',
      'https://images.unsplash.com/photo-1518495973542-4542c06a5843?w=800&h=600&fit=crop'
    ],
    tech_stack: ['Next.js', 'TypeScript', 'Prisma', 'PostgreSQL'],
    monthly_visitors: 6890,
    status: 'approved',
    is_featured: false,
    created_at: '2024-03-25T16:45:00Z',
    approved_at: '2024-03-30T10:10:00Z',
    owner: dummyUsers[0],
    tags: [dummyTags[1], dummyTags[2]]
  },
  {
    id: '5',
    title: 'DevDocs Organizer',
    description: 'A smart documentation platform that automatically organizes and cross-references your development documentation.',
    long_description: 'DevDocs Organizer uses natural language processing to automatically categorize, tag, and cross-reference your development documentation. It provides intelligent search capabilities and suggests related documentation as you write code.',
    website_url: 'https://devdocs-org.com',
    github_url: 'https://github.com/alice/devdocs-organizer',
    demo_url: null,
    screenshot_urls: [
      'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=800&h=600&fit=crop'
    ],
    tech_stack: ['Vue.js', 'Node.js', 'Elasticsearch', 'Docker'],
    monthly_visitors: 4250,
    status: 'pending',
    is_featured: false,
    created_at: '2024-04-01T08:30:00Z',
    approved_at: null,
    owner: dummyUsers[0],
    tags: [dummyTags[7]]
  },
  {
    id: '6',
    title: 'FitnessPal Pro',
    description: 'A comprehensive fitness tracking app with AI-powered workout recommendations and nutrition guidance.',
    long_description: 'FitnessPal Pro combines advanced fitness tracking with artificial intelligence to provide personalized workout recommendations and nutrition guidance. The app tracks your progress, adapts to your fitness level, and helps you achieve your health goals.',
    website_url: 'https://fitnesspal-pro.app',
    github_url: 'https://github.com/bob/fitnesspal-pro',
    demo_url: 'https://demo.fitnesspal-pro.app',
    screenshot_urls: [
      'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=800&h=600&fit=crop',
      'https://images.unsplash.com/photo-1576678927484-cc907957088c?w=800&h=600&fit=crop'
    ],
    tech_stack: ['React Native', 'Python', 'TensorFlow', 'Firebase'],
    monthly_visitors: 22100,
    status: 'approved',
    is_featured: true,
    created_at: '2024-02-05T11:20:00Z',
    approved_at: '2024-02-10T15:45:00Z',
    owner: dummyUsers[1],
    tags: [dummyTags[6], dummyTags[5], dummyTags[3]]
  }
]

export const dummyProjectListResponse: ProjectListResponse = {
  projects: dummyProjects.filter(p => p.status === 'approved'),
  total: dummyProjects.filter(p => p.status === 'approved').length,
  page: 1,
  per_page: 20,
  pages: 1
}

export const featuredProjects = dummyProjects.filter(p => p.is_featured && p.status === 'approved')
export const trendingProjects = [...dummyProjects]
  .filter(p => p.status === 'approved')
  .sort((a, b) => b.monthly_visitors - a.monthly_visitors)
  .slice(0, 3)