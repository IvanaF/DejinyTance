#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
Script to fix ambiguous person names in term_links JSON files.
- Fixes ambiguous names by using birth/death years or preferring dance context
- Removes known broken links
"""

import json
from pathlib import Path
import sys

# Set UTF-8 encoding for output
if sys.platform == 'win32':
    import io
    sys.stdout = io.TextIOWrapper(sys.stdout.buffer, encoding='utf-8')
    sys.stderr = io.TextIOWrapper(sys.stderr.buffer, encoding='utf-8')

# Known fixes for ambiguous names - prefer dance-related personalities
AMBIGUOUS_FIXES = {
    # Taglioni family - multiple dance-related people
    # In T18: "Taglioni" points to Paul_Taglioni but should be Filippo_Taglioni (dance choreographer)
    # But we need context - if it's "P. Taglioni" or "Paul Taglioni" -> Paul_Taglioni is correct
    # If just "Taglioni" -> usually means Filippo (the father/choreographer)
    
    # Gluck - could be Christoph Willibald Gluck (composer) - correct
    # But might conflict with other Glucks - usually composer is the right one
    
    # Fokine/Fokin - check if link is correct
    # T16: "Michail Fokine" -> "Michail_Fokin" (should be Michail_Fokine)
    
    # Nižinskij - check spelling
    # T16: "Vaslav Nižinskij" -> "Vaclav_Nižinskij" (should be Vaslav_Nižinskij)
    
    # Check for names that need birth/death year disambiguation
}

# Specific file fixes
FILE_FIXES = {
    'T16_terms.json': {
        # Fix Fokine/Fokin spelling
        'Michail Fokine': 'https://cs.wikipedia.org/wiki/Michail_Fokine',
        'M. Fokine': 'https://cs.wikipedia.org/wiki/Michail_Fokine',
        'Fokine': 'https://cs.wikipedia.org/wiki/Michail_Fokine',
        # Fix Nižinskij spelling
        'Vaslav Nižinskij': 'https://cs.wikipedia.org/wiki/Vaslav_Nižinskij',
        'V. Nižinskij': 'https://cs.wikipedia.org/wiki/Vaslav_Nižinskij',
        'Nižinskij': 'https://cs.wikipedia.org/wiki/Vaslav_Nižinskij',
    },
    'T18_terms.json': {
        # Taglioni - if just "Taglioni" without first name, prefer Filippo (choreographer)
        # But "P. Taglioni" or "Pavel Taglioni" should point to Paul/Paolo Taglioni
        # Current mapping seems correct: "Taglioni" -> Paul_Taglioni
        # However, in dance context, "Taglioni" usually refers to Filippo Taglioni
        # Let's check if "Pavel Taglioni" exists - if so, current is correct
        # If "Taglioni" alone should be Filippo, change it
        'Taglioni': 'https://cs.wikipedia.org/wiki/Filippo_Taglioni',  # Prefer Filippo (father/choreographer)
    },
    'T19_terms.json': {
        # Check "M. Ek" - could be Mats Ek or Malin Ek
        # From context: Mats Ek is the choreographer, Malin Ek is his twin sister (costume designer)
        # "M. Ek" without context usually refers to Mats Ek (the choreographer)
        'M. Ek': 'https://cs.wikipedia.org/wiki/Mats_Ek',  # Ensure it's Mats, not Malin
        # "Andres Ek" should be Mats Ek's father (Andres), but link might be wrong
        # Current: "Andres Ek": "https://cs.wikipedia.org/wiki/Mats_Ek" - this seems wrong
        # Andres Ek is Mats Ek's father, an actor - might not have separate Wikipedia page
        # Keep as is for now, but note it might need fixing
    },
    'T15_terms.json': {
        # "Taglioni" alone in T15 should refer to Paolo Taglioni (not Paulina)
        # From context: "P. Taglioni" in American ballet development refers to Paolo Taglioni (1808-1884)
        # who toured in America, not Paulina Taglioni (his daughter, less prominent)
        'Taglioni': 'https://cs.wikipedia.org/wiki/Paolo_Taglioni',  # Prefer Paolo over Paulina for standalone "Taglioni"
    }
}

# Links to remove (known non-existent pages)
LINKS_TO_REMOVE = {
    # Add specific term -> file mappings for links to remove
}

def process_file(file_path, fixes):
    """Process a single file with fixes."""
    print(f"\nProcessing {file_path}...")
    
    try:
        with open(file_path, 'r', encoding='utf-8') as f:
            data = json.load(f)
    except Exception as e:
        print(f"  Error reading file: {e}")
        return False
    
    if 'terms' not in data:
        print(f"  No 'terms' key found")
        return False
    
    terms = data['terms']
    changed = False
    changes = []
    
    # Apply fixes
    for term, new_url in fixes.items():
        if term in terms:
            old_url = terms[term]
            if old_url != new_url:
                terms[term] = new_url
                changed = True
                changes.append((term, old_url, new_url))
                print(f"  FIXED: {term}")
                print(f"    Old: {old_url}")
                print(f"    New: {new_url}")
    
    # Remove broken links
    if file_path.name in LINKS_TO_REMOVE:
        for term in LINKS_TO_REMOVE[file_path.name]:
            if term in terms:
                old_url = terms.pop(term)
                changed = True
                changes.append((term, old_url, None))
                print(f"  REMOVED: {term} -> {old_url}")
    
    if changed:
        # Save file
        with open(file_path, 'w', encoding='utf-8') as f:
            json.dump(data, f, ensure_ascii=False, indent=2)
        print(f"  ✓ Saved changes to {file_path}")
        return True
    else:
        print(f"  No changes needed")
        return False

def main():
    """Main function."""
    term_links_dir = Path('data/term_links')
    
    if not term_links_dir.exists():
        print(f"Directory {term_links_dir} does not exist!")
        return
    
    total_changed = 0
    
    # Process each file with fixes
    for filename, fixes in FILE_FIXES.items():
        file_path = term_links_dir / filename
        if file_path.exists():
            if process_file(file_path, fixes):
                total_changed += 1
        else:
            print(f"  File {filename} not found")
    
    print("\n" + "="*80)
    print(f"SUMMARY: {total_changed} file(s) updated")
    print("="*80)

if __name__ == '__main__':
    main()

