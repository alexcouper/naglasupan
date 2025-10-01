#!/usr/bin/env python3
"""
Extract OpenAPI specification from FastAPI app without running the server.

Usage:
    python scripts/extract_openapi.py [--format json|yaml] [--output FILE]
"""

import argparse
import json
import sys
from pathlib import Path

# Add the project root to the Python path
project_root = Path(__file__).parent.parent
sys.path.insert(0, str(project_root))

def extract_openapi_spec(output_format="json", output_file=None):
    """Extract OpenAPI spec from the FastAPI app and save to file"""
    try:
        # Check if we're in a virtual environment
        import os
        if not os.environ.get('VIRTUAL_ENV') and not os.path.exists('.venv'):
            print("⚠️  Warning: No virtual environment detected")
            print("💡 Consider running: uv sync --dev && source .venv/bin/activate")
        
        # Import the FastAPI app
        from app.main import app
        
        # Get the OpenAPI schema
        openapi_schema = app.openapi()
        
        # Determine output file
        if output_file is None:
            if output_format == "yaml":
                output_file = project_root / "openapi.yaml"
            else:
                output_file = project_root / "openapi.json"
        else:
            output_file = Path(output_file)
        
        # Write the schema to file
        if output_format == "yaml":
            try:
                import yaml
                with open(output_file, "w", encoding="utf-8") as f:
                    yaml.dump(openapi_schema, f, default_flow_style=False, sort_keys=False)
            except ImportError:
                print("❌ PyYAML not installed. Install with: uv add pyyaml")
                return False
        else:
            with open(output_file, "w", encoding="utf-8") as f:
                json.dump(openapi_schema, f, indent=2, ensure_ascii=False)
        
        print(f"✅ OpenAPI specification extracted to: {output_file}")
        print(f"📊 Found {len(openapi_schema.get('paths', {}))} API endpoints")
        
        # Print some stats
        paths = openapi_schema.get('paths', {})
        methods = []
        for path, path_methods in paths.items():
            methods.extend(path_methods.keys())
        
        method_counts = {}
        for method in methods:
            method_counts[method.upper()] = method_counts.get(method.upper(), 0) + 1
        
        print("📈 Endpoint breakdown:")
        for method, count in sorted(method_counts.items()):
            print(f"   {method}: {count} endpoints")
            
        # Show some key endpoints
        print("📍 Key endpoints:")
        key_paths = ["/auth/login", "/auth/register", "/projects", "/admin/projects"]
        for path in key_paths:
            if path in paths:
                methods_list = list(paths[path].keys())
                print(f"   {path}: {', '.join(methods_list).upper()}")
            
        return True
        
    except ImportError as e:
        print(f"❌ Failed to import FastAPI app: {e}")
        print("💡 Make sure all dependencies are installed: uv sync --dev")
        return False
        
    except Exception as e:
        print(f"❌ Error extracting OpenAPI spec: {e}")
        return False


def main():
    parser = argparse.ArgumentParser(
        description="Extract OpenAPI specification from FastAPI app"
    )
    parser.add_argument(
        "--format", 
        choices=["json", "yaml"], 
        default="json",
        help="Output format (default: json)"
    )
    parser.add_argument(
        "--output", 
        help="Output file path (default: openapi.json or openapi.yaml)"
    )
    
    args = parser.parse_args()
    
    success = extract_openapi_spec(
        output_format=args.format,
        output_file=args.output
    )
    sys.exit(0 if success else 1)


if __name__ == "__main__":
    main()