# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

This is a monorepo for a developer project showcasing platform where developers can submit their pet projects for community visibility. The platform includes user authentication, project submission with admin approval workflow, public browsing, and analytics.

## Repository Structure

- **`django-backend/`** - Django backend with Django Ninja, PostgreSQL, and JWT authentication
- **`nextjs-react-frontend/`** - Next.js 15 frontend with TypeScript, Tailwind CSS, and App Router

## Development Commands

### Django Backend (`django-backend/`)

```bash
# Setup
cd django-backend
uv sync                           # Install dependencies
cp .env.example .env             # Configure environment

# Development
uv run python manage.py runserver 0.0.0.0:8000  # Run dev server
make dev                          # Alternative dev server

# Database
uv run python manage.py makemigrations  # Create migrations
uv run python manage.py migrate         # Apply migrations
make migrate                      # Apply migrations
make makemigrations              # Create migrations

# Admin
uv run python manage.py createsuperuser  # Create admin user
make createsuperuser             # Create admin user

# Testing & Utilities
uv run python manage.py test     # Run tests
uv run python manage.py shell    # Open Django shell
make test                         # Run tests
make shell                        # Open shell

# OpenAPI
make extract-openapi              # Extract spec to openapi.json
```

### Next.js Frontend (`nextjs-react-frontend/`)

```bash
# Setup
cd nextjs-react-frontend
npm install                       # Install dependencies

# Development
npm run dev                       # Run dev server (port 3000, with Turbopack)
npm run build                     # Production build
npm run start                     # Start production server
npm run lint                      # Run ESLint

# Environment
# Create .env.local with:
NEXT_PUBLIC_API_URL=http://localhost:8000
```

## Architecture & Key Concepts

### Backend Architecture (Django)

**Database Models:**
- `User` - Authentication, profile, admin privileges
- `Project` - Project submissions with approval status (pending/approved/rejected)
- `Tag` - Categorization via many-to-many relationship with projects
- `ProjectView` - IP-based view tracking for analytics
- `MonthlyPrize` - Monthly competition tracking

**API Layers:**
- `api/routers/` → `apps/` (models + logic)
- Django Ninja handles OpenAPI generation and routing

**Authentication:**
- JWT-based with access tokens (15 min expiry) and refresh tokens (30 day expiry)
- Password hashing with bcrypt
- Admin users have `is_admin=True` flag

**Project Approval Workflow:**
1. User submits project → status: "pending"
2. Admin approves/rejects → status: "approved"/"rejected"
3. Approved projects are publicly visible
4. Users can only edit pending/rejected projects

### Frontend Architecture (Next.js)

**Structure:**
- `src/app/` - Next.js App Router pages (file-based routing)
- `src/components/` - Reusable UI components
- `src/contexts/` - React Context for global state (auth, demo mode)
- `src/lib/api.ts` - API client with JWT token management
- `src/lib/dummy-data.ts` - Demo mode mock data
- `src/types/api.ts` - TypeScript types matching backend schemas

**Key Features:**
- **Demo Mode Toggle**: Switch between live API and dummy data without backend
- **JWT Token Management**: Auto-refresh, localStorage persistence, 401 handling
- **Protected Routes**: Auth checks in page components
- **Internationalization**: i18next setup in `lib/i18n.ts`

**API Integration:**
- All API calls go through `apiClient` singleton in `lib/api.ts`
- API base URL: `/api/*` routes proxy to backend via `next.config.ts`
- Unauthorized (401) triggers global logout event

## Running Tests

### Django Backend
```bash
cd django-backend
make test                         # All tests
uv run python manage.py test apps.users  # Specific app
```

## Database Setup

### Django (PostgreSQL)
```bash
# Update .env with DB credentials
DB_NAME=project_showcase
DB_USER=postgres
DB_PASSWORD=your-password

# Apply migrations
uv run python manage.py migrate

# Create new migrations
uv run python manage.py makemigrations
```

## Package Management

Backend uses **uv** (ultra-fast Python package manager):
- `uv sync` - Install exact versions from `uv.lock` (like `npm install`)
- `uv sync --dev` - Include dev dependencies
- `uv lock` - Update lockfile
- `uv lock --upgrade` - Upgrade all dependencies

Frontend uses npm with standard `package-lock.json`.

## OpenAPI Specification

Django backend auto-generates OpenAPI 3.0 spec via Django Ninja:

**Access when server running:**
- Swagger UI: `http://localhost:8000/docs`
- ReDoc: `http://localhost:8000/redoc`
- JSON: `http://localhost:8000/openapi.json`

**Extract to file (offline):**
```bash
cd django-backend && make extract-openapi
```

This creates `openapi.json` for client generation:
```bash
npx @openapitools/openapi-generator-cli generate \
  -i ./openapi.json \
  -g typescript-axios \
  -o ./generated-client
```

## Environment Variables

### Django Backend (.env)
```bash
DEBUG=True
SECRET_KEY=django-secret-key
DB_NAME=project_showcase
DB_USER=postgres
DB_PASSWORD=password
DB_HOST=localhost
DB_PORT=5432
JWT_SECRET_KEY=jwt-secret-key
```

### Next.js Frontend (.env.local)
```bash
NEXT_PUBLIC_API_URL=http://localhost:8000
```

## Common Development Workflows

### Adding a New API Endpoint

1. Add schema in `api/schemas/`
2. Add route in `api/routers/`
3. Update model in `apps/*/models.py` (if needed)
4. Generate migration: `python manage.py makemigrations`

### Adding a New Frontend Page

1. Create page in `src/app/[route]/page.tsx`
2. Add to navigation in `src/components/Header.tsx`
3. Update types in `src/types/api.ts` (if new data structures)
4. Add API methods to `src/lib/api.ts`
5. Add dummy data to `src/lib/dummy-data.ts` (for demo mode)

### Running the Full Stack Locally

```bash
# Terminal 1: Backend
cd django-backend
make dev

# Terminal 2: Frontend
cd nextjs-react-frontend
npm run dev

# Access:
# Frontend: http://localhost:3000
# Backend API: http://localhost:8000
# API Docs: http://localhost:8000/docs
```

## Direnv Support

The Django backend includes `.envrc` for automatic environment management with direnv:
- Auto-creates virtual environment
- Auto-installs dependencies on lockfile changes
- Auto-loads `.env` variables
- Provides shell aliases (`run`, `test`, `lint`, `migrate`, etc.)

To enable: `direnv allow` in django-backend directory.

## Important Notes

- Frontend Demo Mode allows full testing without backend
- Project approval is manual - requires admin user intervention
- Database migrations must be created manually after model changes
- JWT tokens are short-lived; frontend handles refresh automatically
- API routes are prefixed with `/api/` in production via Next.js proxy
