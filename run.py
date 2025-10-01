#!/usr/bin/env python3

import uvicorn
from app.core.config import settings


def main():
    """Main entry point for the application."""
    uvicorn.run(
        "app.main:app",
        host="0.0.0.0",
        port=8000,
        reload=settings.environment == "development",
        log_level="info"
    )


if __name__ == "__main__":
    main()