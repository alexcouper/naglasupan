APP:=web-ui
.PHONY: help install dev build-app lint clean build publish

include ../../scripts/app-common.mk
help:
	@echo "Available commands:"
	@echo "  install       Install dependencies"
	@echo "  dev           Run development server"
	@echo "  build-app     Build the Next.js application"
	@echo "  lint          Run linter"
	@echo "  clean         Clean build artifacts"
	@echo "  build         Build Docker image (requires TAG=xxx)"
	@echo "  publish       Push Docker image to registry (requires TAG=xxx)"

install:
	npm install

dev:
	npm run dev

build-app:
	npm run build

lint:
	npm run lint

clean:
	rm -rf .next
	rm -rf node_modules

