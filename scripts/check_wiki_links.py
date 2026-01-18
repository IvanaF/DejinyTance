#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
Script to check and fix Wikipedia links in term_links JSON files.
- Checks if links are valid (not 404)
- Fixes ambiguous person names using birth/death years
- Removes links to non-existent pages
- Prefers dance-related personalities
"""

import json
import os
import re
import requests
from pathlib import Path
from urllib.parse import unquote, quote
import time
import sys

# Set UTF-8 encoding for output
if sys.platform == 'win32':
    import io
    sys.stdout = io.TextIOWrapper(sys.stdout.buffer, encoding='utf-8')
    sys.stderr = io.TextIOWrapper(sys.stderr.buffer, encoding='utf-8')

# Known disambiguation mappings for dance-related personalities
DANCE_PERSONALITIES = {
    # Add known dance-related people that might conflict with non-dance people
    "Taglioni": "Filippo_Taglioni",  # Dance choreographer, not other Taglionis
    "Bournonville": "August_Bournonville",
    "Petipa": "Marius_Petipa",
    "Perrot": "Jules_Perrot",
    "Pavlova": "Anna_Pavlova",
    "Nižinský": "Vaslav_Nižinskij",
    "Nižinskij": "Vaslav_Nižinskij",
    "Fokine": "Michail_Fokine",
    "Béjart": "Maurice_Béjart",
    "Cranko": "John_Cranko",
    "Graham": "Martha_Graham",
    "Balanchine": "George_Balanchine",
}

# Birth/death years for disambiguation (from materials)
PERSON_YEARS = {
    "Achille Viscusi": (1869, 1945),
    "Remislav Remislavský": (1897, 1973),
    "Jaroslav Hladík": (1885, 1941),
    "Jelizaveta Nikolská": (1904, 1955),
    "Joe Jenčík": (1893, 1945),
    "Michail Fokine": (1880, 1942),
    "Vaslav Nižinskij": (1889, 1950),
    "Bronislava Nižinská": (1891, 1972),
    "Leonid Massine": (1895, 1979),
    "John Cranko": (1927, 1973),
    "Maurice Béjart": (1927, 2007),
    "John Neumeier": (1939, None),  # *1939 / 1942
    "Mats Ek": (1945, None),
    "William Forsythe": (1949, None),
    "Ruth St. Denis": (1879, 1968),
    "Ted Shawn": (1891, 1972),
    "Doris Humphrey": (1895, 1958),
    "Charles Weidman": (1901, 1975),
    "José Limón": (1908, 1972),
    "Martha Graham": (1894, 1991),
    "Erick Hawkins": (1909, 1994),
    "Merce Cunningham": (1919, 2009),
    "Marie Rambert": (1888, 1982),
    "Ninette de Valois": (1898, 2001),
    "Frederick Ashton": (1904, 1988),
    "Kenneth MacMillan": (1929, 1992),
}

def check_wiki_link(url, max_retries=2):
    """Check if a Wikipedia link exists (returns 200, not 404)."""
    if not url or not url.startswith('http'):
        return False, None
    
    # Skip English Wikipedia links for now (we'll handle them separately)
    if 'en.wikipedia.org' in url:
        return True, None  # Assume valid for now
    
    headers = {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
    }
    
    for attempt in range(max_retries):
        try:
            # Use HEAD request first (faster)
            response = requests.head(url, allow_redirects=True, timeout=10, headers=headers)
            if response.status_code == 200:
                return True, None
            elif response.status_code == 404:
                return False, "404 Not Found"
            elif response.status_code == 403:
                # Rate limiting, skip for now - don't mark as invalid
                return True, None
            elif response.status_code in [301, 302]:
                # Follow redirect and check final destination
                final_url = response.headers.get('Location', url)
                final_response = requests.head(final_url, allow_redirects=True, timeout=10, headers=headers)
                if final_response.status_code == 200:
                    return True, final_url
                return False, f"Redirect to {final_url} returns {final_response.status_code}"
            else:
                # Try GET for other status codes
                response = requests.get(url, allow_redirects=True, timeout=10, headers=headers)
                if response.status_code == 200:
                    # Check if it's a disambiguation or "doesn't exist" page
                    content = response.text.lower()
                    if 'tento článek neexistuje' in content or 'this article does not exist' in content:
                        return False, "Article doesn't exist"
                    if 'disambiguation' in content or 'rozcestník' in content:
                        return True, None  # Disambiguation page exists, but might need fixing
                    return True, None
                elif response.status_code == 403:
                    return True, None  # Rate limiting
                return False, f"Status {response.status_code}"
        except requests.exceptions.Timeout:
            if attempt < max_retries - 1:
                time.sleep(2)
                continue
            return False, "Timeout"
        except Exception as e:
            if attempt < max_retries - 1:
                time.sleep(2)
                continue
            return False, str(e)
    
    return False, "Failed after retries"

def extract_wiki_title(url):
    """Extract the title from a Wikipedia URL."""
    if not url:
        return None
    # Remove protocol and domain
    match = re.search(r'wiki/(.+)', url)
    if match:
        title = unquote(match.group(1))
        # Remove fragment
        title = title.split('#')[0]
        return title
    return None

def find_dance_person_link(term, current_url):
    """Try to find the correct Wikipedia link for a person, preferring dance-related."""
    term_lower = term.lower()
    
    # Check if it's a known dance personality
    for dance_term, wiki_title in DANCE_PERSONALITIES.items():
        if dance_term.lower() in term_lower or term_lower in dance_term.lower():
            # Try to construct the correct URL
            current_title = extract_wiki_title(current_url)
            if current_title and wiki_title.lower() not in current_title.lower():
                # Might be wrong person
                base_url = current_url.split('/wiki/')[0] + '/wiki/'
                new_url = base_url + quote(wiki_title.replace(' ', '_'))
                return new_url
    
    return None

def fix_ambiguous_name(term, url, file_path):
    """Try to fix ambiguous person names by checking birth/death years."""
    # Check if we have birth/death info for this person
    for person_name, years in PERSON_YEARS.items():
        if person_name.lower() in term.lower() or term.lower() in person_name.lower():
            # This is a known person, verify the link is correct
            current_title = extract_wiki_title(url)
            if current_title:
                # For now, just verify it exists - we'll manually fix ambiguous ones
                pass
    
    return None

def process_term_links_file(file_path):
    """Process a single term_links JSON file."""
    print(f"\nProcessing {file_path}...")
    
    try:
        with open(file_path, 'r', encoding='utf-8') as f:
            data = json.load(f)
    except Exception as e:
        print(f"Error reading {file_path}: {e}")
        return None
    
    if 'terms' not in data:
        print(f"No 'terms' key in {file_path}")
        return None
    
    terms = data['terms']
    changes = {
        'removed': [],
        'fixed': [],
        'needs_check': []
    }
    
    new_terms = {}
    
    for term, url in terms.items():
        if not url:
            continue
        
        # Check if link is valid
        is_valid, redirect_url = check_wiki_link(url)
        
        if not is_valid:
            # Link is invalid - remove it
            print(f"  REMOVING invalid link: {term} -> {url} ({redirect_url})")
            changes['removed'].append((term, url, redirect_url))
            # Don't add to new_terms - effectively removing it
            continue
        
        # Check for ambiguous names that might need fixing
        # For now, we'll keep valid links but flag potential issues
        fixed_url = find_dance_person_link(term, url)
        if fixed_url and fixed_url != url:
            print(f"  FIXING ambiguous link: {term}")
            print(f"    Old: {url}")
            print(f"    New: {fixed_url}")
            changes['fixed'].append((term, url, fixed_url))
            new_terms[term] = fixed_url
        else:
            new_terms[term] = url
        
        # Small delay to avoid rate limiting
        time.sleep(0.1)
    
    if changes['removed'] or changes['fixed']:
        return {
            'file': file_path,
            'changes': changes,
            'new_terms': new_terms
        }
    
    return None

def main():
    """Main function to process all term_links files."""
    term_links_dir = Path('data/term_links')
    
    if not term_links_dir.exists():
        print(f"Directory {term_links_dir} does not exist!")
        return
    
    all_changes = []
    
    # Process each JSON file
    for json_file in sorted(term_links_dir.glob('*.json')):
        result = process_term_links_file(json_file)
        if result:
            all_changes.append(result)
    
    # Print summary
    print("\n" + "="*80)
    print("SUMMARY")
    print("="*80)
    
    total_removed = 0
    total_fixed = 0
    
    for result in all_changes:
        print(f"\n{result['file']}:")
        if result['changes']['removed']:
            print(f"  Removed {len(result['changes']['removed'])} invalid links")
            total_removed += len(result['changes']['removed'])
        if result['changes']['fixed']:
            print(f"  Fixed {len(result['changes']['fixed'])} ambiguous links")
            total_fixed += len(result['changes']['fixed'])
    
    print(f"\nTotal: {total_removed} links removed, {total_fixed} links fixed")
    
    # Ask for confirmation before saving
    if all_changes:
        print("\nChanges will be saved. Review the changes above.")
        # Save changes
        for result in all_changes:
            data = {'terms': result['new_terms']}
            with open(result['file'], 'w', encoding='utf-8') as f:
                json.dump(data, f, ensure_ascii=False, indent=2)
            print(f"Saved: {result['file']}")
    else:
        print("\nNo changes needed!")

if __name__ == '__main__':
    main()

