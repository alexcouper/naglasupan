APP:=django-backend
.PHONY: help install dev migrate makemigrations shell test createsuperuser clean extract-openapi lint

include ../../scripts/app-common.mk

help:
	@echo "Available commands:"
	@echo "  install       Install dependencies"
	@echo "  dev           Run development server"
	@echo "  migrate       Run database migrations"
	@echo "  makemigrations Create new migrations"
	@echo "  shell         Open Django shell"
	@echo "  test          Run tests"
	@echo "  createsuperuser Create superuser"
	@echo "  extract-openapi Extract OpenAPI specification to openapi.json"
	@echo "  lint          Run ruff linter and formatter check"
	@echo "  clean         Clean cache files"

install:
	uv sync --all-extras

dev:
	uv run python manage.py runserver 0.0.0.0:8000

migrate:
	uv run python manage.py migrate

makemigrations:
	uv run python manage.py makemigrations

shell:
	uv run python manage.py shell

test:
	uv run pytest

createsuperuser:
	uv run python manage.py createsuperuser

extract-openapi:
	uv run python scripts/extract_openapi.py

clean:
	find . -name "*.pyc" -delete
	find . -name "__pycache__" -type d -exec rm -rf {} +

lint:
	uv run ruff check .
	uv run ruff format --check .
