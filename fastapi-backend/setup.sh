#!/bin/bash

# Project Showcase API Setup Script

set -e

echo "🚀 Setting up Project Showcase API..."

# Check if uv is installed
if ! command -v uv &> /dev/null; then
    echo "❌ uv is not installed. Installing uv..."
    curl -LsSf https://astral.sh/uv/install.sh | sh
    export PATH="$HOME/.cargo/bin:$PATH"
fi

# Check if direnv is installed (optional)
if ! command -v direnv &> /dev/null; then
    echo "⚠️  direnv is not installed. You can install it for automatic environment loading:"
    echo "   macOS: brew install direnv"
    echo "   Linux: apt install direnv  # or your package manager"
    echo "   Then add: eval \"\$(direnv hook bash)\" to your ~/.bashrc"
fi

# Create virtual environment
echo "📦 Creating virtual environment..."
uv venv

# Activate virtual environment
echo "🔧 Activating virtual environment..."
source .venv/bin/activate

# Install dependencies
echo "📥 Installing dependencies..."
uv sync --dev

# Create .env file if it doesn't exist
if [ ! -f .env ]; then
    echo "⚙️  Creating .env file..."
    cp .env.example .env
    echo "✏️  Please edit .env file with your database credentials and secrets"
fi

# Check if direnv is available and allow the directory
if command -v direnv &> /dev/null; then
    echo "🔄 Allowing direnv for this directory..."
    direnv allow
fi

echo ""
echo "✅ Setup complete!"
echo ""
echo "Next steps:"
echo "1. Edit .env file with your database credentials"
echo "2. Set up your PostgreSQL database"
echo "3. Run: python run.py (or just 'run' if using direnv)"
echo ""
echo "Available commands:"
echo "  python run.py  - Start development server"
echo "  pytest         - Run tests"
echo "  make lint      - Format and lint code"
echo "  make migrate   - Apply database migrations"
echo ""
if command -v direnv &> /dev/null; then
    echo "🎉 With direnv enabled, just 'cd' into this directory to auto-activate!"
fi