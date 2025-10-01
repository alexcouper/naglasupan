# Use Python 3.11 slim image
FROM python:3.11-slim

# Install uv
COPY --from=ghcr.io/astral-sh/uv:latest /uv /bin/uv

# Set environment variables
ENV PYTHONUNBUFFERED=1
ENV PYTHONDONTWRITEBYTECODE=1
ENV PATH="/app/.venv/bin:$PATH"

# Set work directory
WORKDIR /app

# Create virtual environment
RUN uv venv

# Copy dependency files
COPY pyproject.toml uv.lock ./

# Install dependencies using uv sync
RUN uv sync --no-dev

# Copy application code
COPY app/ app/
COPY alembic/ alembic/
COPY alembic.ini .
COPY run.py .

# Expose port
EXPOSE 8000

# Health check
HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
  CMD curl -f http://localhost:8000/health || exit 1

# Run the application
CMD ["python", "run.py"]