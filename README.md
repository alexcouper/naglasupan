# Project Showcase API

A FastAPI-based backend for a developer project showcasing platform where developers can submit their pet projects for community visibility.

## Features

- **User Authentication**: JWT-based authentication with registration and login
- **Project Submission**: Users can submit projects with manual admin approval
- **Public Browsing**: Browse approved projects with filtering by tags and sorting
- **Admin Panel**: Complete admin interface for project management
- **Auto-Generated OpenAPI**: FastAPI automatically generates OpenAPI 3.0 spec

## Tech Stack

- **FastAPI** - Modern, fast web framework for building APIs
- **SQLAlchemy 2.0** - Async ORM for database operations
- **PostgreSQL** - Primary database
- **Pydantic** - Data validation using Python type annotations
- **JWT** - Authentication tokens
- **Alembic** - Database migrations
- **uv** - Ultra-fast Python package installer and resolver
- **direnv** - Automatic environment management

## Project Structure

```
app/
├── models/          # SQLAlchemy database models
├── schemas/         # Pydantic request/response models
├── routers/         # API route handlers
├── core/           # Core functionality (auth, database, config)
├── services/       # Business logic services
└── main.py         # FastAPI application entry point
```

## Installation

### Prerequisites
- **Python 3.11+**
- **uv** - Fast Python package installer: `curl -LsSf https://astral.sh/uv/install.sh | sh`
- **direnv** (optional) - For automatic environment loading: `brew install direnv` or [install guide](https://direnv.net/docs/installation.html)
- **PostgreSQL** database

### Quick Start with Auto-Environment (Recommended)

1. **Clone and enter the repository**
   ```bash
   git clone <repository-url>
   cd project-showcase-api
   ```

2. **Enable direnv (if using)**
   ```bash
   direnv allow
   ```
   
   This will automatically:
   - Create a virtual environment with `uv venv`
   - Install dependencies with `uv sync --dev`
   - Activate the environment
   - Load environment variables from `.env`
   - Set up helpful aliases

3. **Set up environment variables**
   ```bash
   cp .env.example .env
   # Edit .env with your database credentials and secrets
   ```

4. **Set up PostgreSQL database**
   - Create a PostgreSQL database
   - Update `DATABASE_URL` in your `.env` file

5. **Run the application**
   ```bash
   run  # or python run.py
   ```

### Manual Installation (without direnv)

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd project-showcase-api
   ```

2. **Create virtual environment and install dependencies**
   ```bash
   uv venv
   source .venv/bin/activate  # On Windows: .venv\Scripts\activate
   uv sync --dev  # or just `uv sync` for production dependencies only
   ```

3. **Set up environment variables**
   ```bash
   cp .env.example .env
   # Edit .env with your database credentials and secrets
   ```

4. **Set up PostgreSQL database**
   - Create a PostgreSQL database
   - Update `DATABASE_URL` in your `.env` file

5. **Run the application**
   ```bash
   python run.py
   ```

## Environment Variables

| Variable | Description | Default |
|----------|-------------|---------|
| `DATABASE_URL` | PostgreSQL connection string | Required |
| `SECRET_KEY` | Application secret key | Required |
| `JWT_SECRET_KEY` | JWT token secret key | Required |
| `JWT_ALGORITHM` | JWT algorithm | HS256 |
| `ACCESS_TOKEN_EXPIRE_MINUTES` | Access token expiry | 15 |
| `REFRESH_TOKEN_EXPIRE_DAYS` | Refresh token expiry | 30 |
| `ENVIRONMENT` | Environment (development/production) | development |

## Database Setup

The application will automatically create database tables on startup. For production, you should use Alembic for migrations:

```bash
# Generate migration
alembic revision --autogenerate -m "Initial migration"

# Apply migration
alembic upgrade head
```

## API Documentation

When running in development mode, visit:
- **Swagger UI**: http://localhost:8000/docs
- **ReDoc**: http://localhost:8000/redoc

## API Endpoints

### Authentication
- `POST /auth/register` - Register new user
- `POST /auth/login` - User login
- `GET /auth/me` - Get current user info
- `PUT /auth/me` - Update current user

### Public Projects
- `GET /projects` - List approved projects (with filtering/sorting)
- `GET /projects/{id}` - Get single project
- `GET /projects/featured` - Get featured projects
- `GET /projects/trending` - Get trending projects

### User Project Management
- `GET /my/projects` - List user's projects
- `POST /my/projects` - Submit new project
- `PUT /my/projects/{id}` - Update project
- `DELETE /my/projects/{id}` - Delete project
- `POST /my/projects/{id}/resubmit` - Resubmit rejected project

### Admin
- `GET /admin/projects` - List all projects for review
- `PUT /admin/projects/{id}/approve` - Approve/reject project
- `PUT /admin/projects/{id}/feature` - Feature/unfeature project
- `GET /admin/users` - List users
- `PUT /admin/users/{id}/ban` - Ban/unban user
- `POST /admin/tags` - Create new tag
- `PUT /admin/tags/{id}` - Update tag
- `DELETE /admin/tags/{id}` - Delete tag
- `GET /admin/analytics` - Platform analytics

### Tags
- `GET /tags` - List all tags

## Database Models

### Users
- Authentication and user profile information
- Admin privileges for project approval

### Projects
- Project submissions with approval workflow
- Rich metadata including tech stack, URLs, screenshots
- Monthly visitor tracking for competitions

### Tags
- Categorization system for projects
- Many-to-many relationship with projects

### Monthly Prizes
- Track monthly competition winners
- Prize amounts and announcement dates

### Project Views
- Analytics for project popularity
- IP-based view tracking for monthly visitor counts

## Authentication Flow

1. **Registration**: `POST /auth/register`
   - Create account with email, username, password
   - Returns user information

2. **Login**: `POST /auth/login`
   - Authenticate with username/email and password
   - Returns JWT access token and refresh token

3. **Protected Routes**: Include `Authorization: Bearer <access_token>` header

## Project Submission Flow

1. **Submit Project**: `POST /my/projects`
   - User submits project with required information
   - Project status set to "pending"

2. **Admin Review**: `PUT /admin/projects/{id}/approve`
   - Admin approves or rejects with reason
   - Approved projects become publicly visible

3. **Updates**: `PUT /my/projects/{id}`
   - Users can update pending/rejected projects
   - Approved projects cannot be modified

## Deployment

### Railway Deployment

1. **Connect to Railway**
   - Link your GitHub repository to Railway
   - Add PostgreSQL addon

2. **Environment Variables**
   - Set all required environment variables in Railway dashboard
   - Use Railway's generated `DATABASE_URL`

3. **Deploy**
   - Railway will automatically deploy on git push

### Docker Deployment

```dockerfile
FROM python:3.11-slim

WORKDIR /app
COPY requirements.txt .
RUN pip install -r requirements.txt

COPY . .
EXPOSE 8000

CMD ["python", "-m", "app.main"]
```

## Development

### Running in Development

**With direnv (recommended):**
```bash
# Just enter the directory and everything is set up automatically
cd project-showcase-api
run  # Starts development server with auto-reload
```

**Manual setup:**
```bash
# Create and activate virtual environment
uv venv
source .venv/bin/activate

# Install dependencies
uv sync --dev

# Set up environment
cp .env.example .env

# Run with auto-reload
python run.py
```

### Development Commands

When using the `.envrc` setup, these aliases are available:
- `run` - Start the development server
- `test` - Run the test suite
- `lint` - Format and lint code (black + isort + flake8)
- `migrate` - Apply database migrations
- `makemigration` - Create new database migration

### Adding New Features

1. **Models**: Add new SQLAlchemy models in `app/models/`
2. **Schemas**: Add Pydantic schemas in `app/schemas/`
3. **Routes**: Add API routes in `app/routers/`
4. **Business Logic**: Add services in `app/services/`

### Testing

```bash
# Run tests
test  # or pytest

# Run with coverage report
pytest --cov=app --cov-report=html

# Run specific test file
pytest tests/test_auth.py

# Run tests with verbose output
pytest -v
```

## OpenAPI Schema Generation

FastAPI automatically generates OpenAPI 3.0 specification from your code:

- **Access Schema**: `GET /openapi.json` (when server is running)
- **Extract Schema**: `make extract-openapi` (without running server)
- **Generate Client**: Use tools like `openapi-generator` to create frontend clients

### Extract OpenAPI Spec (Offline)

```bash
# Extract OpenAPI spec to openapi.json file
make extract-openapi

# Or run the script directly
python scripts/extract_openapi.py

# Or with direnv alias
extract-openapi
```

This creates an `openapi.json` file that can be used for:
- Frontend client generation
- API documentation
- Contract testing
- Integration with API management tools

### Generate Frontend Client

Example client generation:
```bash
# First extract the schema
make extract-openapi

# Then generate TypeScript client
npx @openapitools/openapi-generator-cli generate \
  -i ./openapi.json \
  -g typescript-axios \
  -o ./generated-client

# Or use other generators
npx @openapitools/openapi-generator-cli generate \
  -i ./openapi.json \
  -g typescript-fetch \
  -o ./generated-client
```

## Quick Setup Script

For a one-command setup, run:
```bash
./setup.sh
```

This script will:
- Install `uv` if not present
- Create virtual environment
- Install all dependencies
- Create `.env` file from template
- Set up `direnv` if available

## Why uv?

This project uses [uv](https://github.com/astral-sh/uv) instead of pip for several advantages:

- **🚀 Speed**: 10-100x faster than pip
- **🔒 Reliability**: Better dependency resolution with lockfile (`uv.lock`)
- **🎯 Simplicity**: Single tool for virtual environments and packages
- **⚡ Modern**: Built in Rust, designed for modern Python development
- **🔐 Deterministic**: Lockfile ensures reproducible installs across environments

### uv sync vs pip install

- `uv sync` installs exact versions from `uv.lock` (like npm install or yarn install)
- Guarantees identical dependency versions across development, staging, and production
- Much faster than traditional pip workflows
- Automatic virtual environment management

The `.envrc` file provides automatic environment management:
- Auto-creates virtual environment
- Auto-installs dependencies when `uv.lock` or `pyproject.toml` changes
- Auto-loads environment variables
- Provides helpful command aliases

## Security Considerations

- JWT tokens for stateless authentication
- Password hashing with bcrypt
- Input validation with Pydantic
- SQL injection protection with SQLAlchemy
- CORS configuration for production

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests for new functionality
5. Submit a pull request

## License

MIT License - see LICENSE file for details