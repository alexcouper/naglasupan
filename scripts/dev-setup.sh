#!/bin/bash

# Development setup script using uv sync
echo "🚀 Setting up Project Showcase API with uv sync..."

# Check if uv is installed
if ! command -v uv &> /dev/null; then
    echo "❌ uv is not installed. Installing uv..."
    curl -LsSf https://astral.sh/uv/install.sh | sh
    export PATH="$HOME/.cargo/bin:$PATH"
fi

# Create and sync environment
echo "📦 Creating virtual environment and syncing dependencies..."
uv venv
uv sync --dev

echo "✅ Setup complete!"
echo ""
echo "To activate the environment manually:"
echo "  source .venv/bin/activate"
echo ""
echo "To sync dependencies in the future:"
echo "  uv sync --dev"
echo ""
echo "To update dependencies:"
echo "  uv lock --upgrade && uv sync --dev"