# Creators.is - Next.js React Frontend

A modern, responsive frontend for the developer project showcasing platform built with Next.js 15, React 18, TypeScript, and Tailwind CSS.

## Features

### 🚀 **Core Functionality**
- **Project Discovery**: Browse, search, and filter projects by tags, tech stack, and popularity
- **Project Showcase**: Detailed project views with screenshots, descriptions, and tech stacks
- **User Authentication**: Login/register with JWT token authentication
- **Project Submission**: Rich form for submitting projects with validation
- **Admin Dashboard**: Project approval workflow and management interface

### 📱 **User Experience**
- **Responsive Design**: Optimized for mobile, tablet, and desktop
- **Modern UI**: Clean, professional interface with smooth animations
- **Fast Performance**: Built with Next.js App Router for optimal loading
- **Demo Mode**: Toggle to experience full functionality without backend API

### 🎯 **Key Pages**
- **Home**: Hero section with featured and trending projects
- **Browse Projects**: Advanced filtering and search capabilities
- **Project Details**: Comprehensive project information and screenshots
- **Submit Project**: Step-by-step project submission form
- **Admin Panel**: Project review and management interface

## Tech Stack

- **Framework**: Next.js 15 with App Router
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **UI Components**: Custom component library
- **Forms**: React Hook Form with validation
- **Icons**: Lucide React
- **API Integration**: Custom API client matching Django backend

## Getting Started

### Prerequisites
- Node.js 18+
- npm, yarn, or pnpm

### Installation

1. **Install dependencies:**
```bash
npm install
```

2. **Start the development server:**
```bash
npm run dev
```

3. **Open in browser:**
Navigate to [http://localhost:3000](http://localhost:3000)

### Environment Variables

Create a `.env.local` file for environment configuration:

```bash
NEXT_PUBLIC_API_URL=http://localhost:8000
```

## Demo Mode

The application includes a **Demo Mode** toggle that allows you to experience the full functionality without needing a backend API. This mode uses hardcoded data to simulate all features.

### Demo Credentials
When in demo mode, use these credentials to test authentication:
- **Username**: `alice_dev`
- **Password**: `password`

## Project Structure

```
src/
├── app/                    # Next.js App Router pages
│   ├── admin/             # Admin dashboard
│   ├── login/             # Authentication pages
│   ├── projects/          # Project browsing and details
│   └── submit/            # Project submission
├── components/            # Reusable UI components
│   ├── ui/               # Base UI components
│   ├── Header.tsx        # Navigation header
│   └── ProjectCard.tsx   # Project display component
├── contexts/             # React contexts
│   └── AppContext.tsx    # Global app state
├── lib/                  # Utilities and services
│   ├── api.ts           # API client
│   ├── dummy-data.ts    # Demo mode data
│   └── utils.ts         # Helper functions
└── types/               # TypeScript type definitions
    └── api.ts           # API response types
```

## Key Features

### 🔍 **Project Browsing**
- Search by title and description
- Filter by tags and technology
- Sort by date, popularity, or title
- Responsive grid layout

### 📋 **Project Submission**
- Multi-step form with validation
- Tag selection interface
- Technology stack builder
- Screenshot URL management

### 👤 **Authentication**
- JWT token authentication
- Persistent login state
- Protected routes
- User profile management

### ⚡ **Admin Dashboard**
- Project approval workflow
- Status filtering
- Featured project management
- Analytics overview

## Development Commands

```bash
# Development server
npm run dev

# Production build
npm run build

# Start production server
npm run start

# Linting
npm run lint
```

## Deployment

The application is ready for deployment on platforms like Vercel, Netlify, or AWS Amplify.

### Build Output
```bash
npm run build
```
Generates optimized static files in `.next/` directory.

## API Integration

The frontend is designed to work seamlessly with the Django backend located in `../django-backend/`. The API client automatically handles:

- Authentication with JWT tokens
- Error handling and fallbacks
- TypeScript type safety
- Demo mode simulation

Toggle the "Demo Mode" switch in the header to switch between live API calls and hardcoded data for easier development and testing.
