#!/usr/bin/env python3
"""
Script to extract OpenAPI specification from Django Ninja API
without needing a running server instance.
"""

import os
import sys
import json
import django
from pathlib import Path

# Add the project root to Python path
project_root = Path(__file__).parent.parent
sys.path.insert(0, str(project_root))

# Setup Django
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'project_showcase.settings')
django.setup()

# Import the API after Django setup
from api.main import api


def extract_openapi_spec():
    """Extract OpenAPI specification from Django Ninja API"""
    try:
        # Get the OpenAPI schema
        openapi_schema = api.get_openapi_schema()
        
        # Convert to JSON string with proper formatting
        openapi_json = json.dumps(openapi_schema, indent=2, ensure_ascii=False)
        
        # Write to file
        output_file = project_root / "openapi.json"
        with open(output_file, 'w', encoding='utf-8') as f:
            f.write(openapi_json)
        
        print(f"✅ OpenAPI specification extracted to: {output_file}")
        print(f"📊 Schema contains {len(openapi_schema.get('paths', {}))} endpoints")
        
        # Show some basic stats
        paths = openapi_schema.get('paths', {})
        total_operations = sum(len(methods) for methods in paths.values())
        components = openapi_schema.get('components', {})
        schemas = components.get('schemas', {})
        
        print(f"📈 Total operations: {total_operations}")
        print(f"🏷️  Schema components: {len(schemas)}")
        
        return True
        
    except Exception as e:
        print(f"❌ Error extracting OpenAPI spec: {e}")
        return False


if __name__ == "__main__":
    success = extract_openapi_spec()
    sys.exit(0 if success else 1)