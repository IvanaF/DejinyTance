#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
Script to validate all links in resource files and remove invalid ones.
Checks for 404 errors, connection errors, and other HTTP issues.
"""

import json
import os
import sys
from pathlib import Path
import requests
from requests.adapters import HTTPAdapter
from urllib3.util.retry import Retry
import time

# Fix Windows console encoding
if sys.platform == 'win32':
    import io
    sys.stdout = io.TextIOWrapper(sys.stdout.buffer, encoding='utf-8')
    sys.stderr = io.TextIOWrapper(sys.stderr.buffer, encoding='utf-8')

# Add parent directory to path
sys.path.insert(0, str(Path(__file__).parent.parent))

def create_session():
    """Create a requests session with retry strategy."""
    session = requests.Session()
    retry_strategy = Retry(
        total=3,
        backoff_factor=1,
        status_forcelist=[429, 500, 502, 503, 504],
    )
    adapter = HTTPAdapter(max_retries=retry_strategy)
    session.mount("http://", adapter)
    session.mount("https://", adapter)
    return session

def is_valid_url(url, session, timeout=10):
    """
    Check if a URL is valid by making a HEAD request.
    Returns (is_valid, error_message)
    """
    try:
        # Some sites don't support HEAD, so we'll use GET with stream=True
        # but only read headers
        response = session.head(url, timeout=timeout, allow_redirects=True)
        
        # If HEAD fails, try GET
        if response.status_code == 405:  # Method Not Allowed
            response = session.get(url, timeout=timeout, stream=True, allow_redirects=True)
            # Close the connection immediately since we don't need the body
            response.close()
        
        status_code = response.status_code
        
        # Consider 2xx and 3xx as valid
        if 200 <= status_code < 400:
            return True, None
        
        # 4xx and 5xx are errors
        if status_code == 404:
            return False, f"404 Not Found"
        elif status_code == 403:
            return False, f"403 Forbidden"
        elif status_code >= 400:
            return False, f"HTTP {status_code}"
        else:
            return False, f"Unexpected status: {status_code}"
            
    except requests.exceptions.Timeout:
        return False, "Timeout"
    except requests.exceptions.ConnectionError as e:
        return False, f"Connection Error: {str(e)[:50]}"
    except requests.exceptions.TooManyRedirects:
        return False, "Too Many Redirects"
    except requests.exceptions.RequestException as e:
        return False, f"Request Error: {str(e)[:50]}"
    except Exception as e:
        return False, f"Unexpected Error: {str(e)[:50]}"

def validate_resource_file(file_path, session):
    """
    Validate all URLs in a resource file and return updated data with invalid links removed.
    Returns (updated_data, removed_count, total_count)
    """
    print(f"\n{'='*80}")
    print(f"Validating: {file_path}")
    print(f"{'='*80}")
    
    with open(file_path, 'r', encoding='utf-8') as f:
        data = json.load(f)
    
    removed_count = 0
    total_count = 0
    
    if 'sections' not in data:
        print(f"Warning: No 'sections' found in {file_path}")
        return data, 0, 0
    
    for section in data['sections']:
        if 'resources' not in section:
            continue
        
        heading = section.get('heading', 'Unknown')
        print(f"\nSection: {heading}")
        
        valid_resources = []
        
        for resource in section['resources']:
            url = resource.get('url', '')
            title = resource.get('title', 'Unknown')
            total_count += 1
            
            if not url:
                print(f"  [WARNING] Skipping resource '{title}' - no URL")
                valid_resources.append(resource)
                continue
            
            print(f"  Checking: {title[:60]}...")
            print(f"    URL: {url}")
            
            is_valid, error = is_valid_url(url, session)
            
            if is_valid:
                print(f"    [OK] Valid")
                valid_resources.append(resource)
            else:
                print(f"    [INVALID] Invalid: {error}")
                removed_count += 1
            
            # Be nice to servers
            time.sleep(0.5)
        
        section['resources'] = valid_resources
    
    return data, removed_count, total_count

def main():
    """Main function to validate all resource files."""
    project_root = Path(__file__).parent.parent
    resources_dir = project_root / 'data' / 'resources'
    
    if not resources_dir.exists():
        print(f"Error: Resources directory not found: {resources_dir}")
        return
    
    resource_files = sorted(resources_dir.glob('*.json'))
    
    if not resource_files:
        print(f"No resource files found in {resources_dir}")
        return
    
    print(f"Found {len(resource_files)} resource file(s) to validate")
    
    session = create_session()
    session.headers.update({
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
    })
    
    total_removed = 0
    total_checked = 0
    
    for file_path in resource_files:
        try:
            updated_data, removed, checked = validate_resource_file(file_path, session)
            total_removed += removed
            total_checked += checked
            
            # Write updated data back to file
            with open(file_path, 'w', encoding='utf-8') as f:
                json.dump(updated_data, f, ensure_ascii=False, indent=2)
            
            print(f"\n[SUCCESS] Updated {file_path}")
            print(f"  Removed {removed} invalid link(s) out of {checked} total")
            
        except Exception as e:
            print(f"\n[ERROR] Error processing {file_path}: {e}")
            import traceback
            traceback.print_exc()
    
    print(f"\n{'='*80}")
    print(f"SUMMARY")
    print(f"{'='*80}")
    print(f"Total links checked: {total_checked}")
    print(f"Total links removed: {total_removed}")
    print(f"Total links remaining: {total_checked - total_removed}")
    print(f"{'='*80}")

if __name__ == '__main__':
    main()

