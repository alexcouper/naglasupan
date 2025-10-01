.PHONY: help install dev run test lint clean migrate makemigration docker-build docker-run lock update extract-openapi

# Default target
help:
	@echo "Available commands:"
	@echo "  install       - Install production dependencies with uv sync"
	@echo "  dev           - Install all dependencies (including dev) with uv sync"
	@echo "  lock          - Update uv.lock file"
	@echo "  update        - Update dependencies and regenerate lockfile"
	@echo "  run           - Run the development server"
	@echo "  test          - Run tests"
	@echo "  lint          - Run linting and formatting"
	@echo "  clean         - Clean up cache and build files"
	@echo "  migrate       - Apply database migrations"
	@echo "  makemigration - Create new database migration"
	@echo "  extract-openapi - Extract OpenAPI spec to openapi.json"
	@echo "  docker-build  - Build Docker image"
	@echo "  docker-run    - Run with Docker"

# Install dependencies
install:
	uv sync

# Install development dependencies
dev:
	uv sync --dev

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

# Dependency management
lock:
	uv lock

update:
	uv lock --upgrade

# OpenAPI extraction
extract-openapi:
	python scripts/extract_openapi.py

# Docker commands
docker-build:
	docker build -t project-showcase-api .

docker-run:
	docker run -p 8000:8000 --env-file .env project-showcase-api