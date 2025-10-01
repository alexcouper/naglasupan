.PHONY: help install dev run test lint clean migrate makemigration docker-build docker-run

# Default target
help:
	@echo "Available commands:"
	@echo "  install       - Install dependencies with uv"
	@echo "  dev           - Install development dependencies"
	@echo "  run           - Run the development server"
	@echo "  test          - Run tests"
	@echo "  lint          - Run linting and formatting"
	@echo "  clean         - Clean up cache and build files"
	@echo "  migrate       - Apply database migrations"
	@echo "  makemigration - Create new database migration"
	@echo "  docker-build  - Build Docker image"
	@echo "  docker-run    - Run with Docker"

# Install dependencies
install:
	uv pip install \
		fastapi>=0.104.1 \
		uvicorn[standard]>=0.24.0 \
		sqlalchemy>=2.0.23 \
		asyncpg>=0.29.0 \
		alembic>=1.12.1 \
		pydantic[email]>=2.5.0 \
		python-jose[cryptography]>=3.3.0 \
		passlib[bcrypt]>=1.7.4 \
		python-multipart>=0.0.6 \
		slowapi>=0.1.9 \
		python-dotenv>=1.0.0 \
		psycopg2-binary>=2.9.9

# Install development dependencies
dev: install
	uv pip install \
		pytest>=7.4.0 \
		pytest-asyncio>=0.21.0 \
		pytest-cov>=4.1.0 \
		httpx>=0.25.0 \
		black>=23.0.0 \
		isort>=5.12.0 \
		flake8>=6.0.0 \
		mypy>=1.5.0

# Run development server
run:
	python run.py

# Run tests
test:
	pytest

# Run linting and formatting
lint:
	black .
	isort .
	flake8 .
	mypy app/

# Clean up
clean:
	find . -type d -name __pycache__ -exec rm -rf {} +
	find . -type f -name "*.pyc" -delete
	rm -rf .pytest_cache
	rm -rf .coverage
	rm -rf htmlcov
	rm -rf dist
	rm -rf build
	rm -rf *.egg-info

# Database migrations
migrate:
	alembic upgrade head

makemigration:
	alembic revision --autogenerate -m "$(MSG)"

# Docker commands
docker-build:
	docker build -t project-showcase-api .

docker-run:
	docker run -p 8000:8000 --env-file .env project-showcase-api