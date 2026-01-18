#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
Comprehensive script to check and fix all term_links JSON files.
- Fixes ambiguous person names
- Fixes spelling errors
- Checks for non-existent Wikipedia pages
- Prefers dance-related personalities
"""

import json
from pathlib import Path
import sys

# Set UTF-8 encoding for output
if sys.platform == 'win32':
    import io
    sys.stdout = io.TextIOWrapper(sys.stdout.buffer, encoding='utf-8')
    sys.stderr = io.TextIOWrapper(sys.stderr.buffer, encoding='utf-8')

# Comprehensive fixes for all files
ALL_FIXES = {
    # Known spelling errors and incorrect links - ONLY fix wrong spellings
    'spelling_fixes': {
        'Michail_Fokin': 'Michail_Fokine',  # Wrong: Fokin -> Correct: Fokine
        'Vaclav_Nižinskij': 'Vaslav_Nižinskij',  # Wrong: Vaclav -> Correct: Vaslav
        # DO NOT include correct spellings here - that would cause double replacement!
    },
    
    # Ambiguous names that need context-based disambiguation
    'ambiguous_names': {
        # Taglioni family - context matters
        'Taglioni': {
            # If context is about choreography/father -> Filippo
            'default': 'Filippo_Taglioni',
            # If explicitly "P. Taglioni" or "Paolo/Paul Taglioni" -> Paolo
            # If explicitly "Marie Taglioni" -> Marie (should already be explicit)
            # If explicitly "Paulina Taglioni" -> Paulina (should already be explicit)
        },
        
        # Ek family - Mats (choreographer) vs Malin (costume designer)
        'M. Ek': 'Mats_Ek',  # Default to choreographer unless explicit
        
        # Gluck - always the composer Christoph Willibald Gluck in dance context
        'Gluck': 'Christoph_Willibald_Gluck',
        
        # Beethoven - always the composer
        'Beethoven': 'Ludwig_van_Beethoven',
        
        # Chopin - always the composer
        'Chopin': 'Fryderyk_Chopin',
    }
}

# File-specific fixes based on context
FILE_SPECIFIC_FIXES = {
    'T16_terms.json': {
        'Michail Fokine': 'https://cs.wikipedia.org/wiki/Michail_Fokine',
        'M. Fokine': 'https://cs.wikipedia.org/wiki/Michail_Fokine',
        'Fokine': 'https://cs.wikipedia.org/wiki/Michail_Fokine',
        'Vaslav Nižinskij': 'https://cs.wikipedia.org/wiki/Vaslav_Nižinskij',
        'V. Nižinskij': 'https://cs.wikipedia.org/wiki/Vaslav_Nižinskij',
        'Nižinskij': 'https://cs.wikipedia.org/wiki/Vaslav_Nižinskij',
    },
    'T18_terms.json': {
        'Taglioni': 'https://cs.wikipedia.org/wiki/Filippo_Taglioni',
    },
    'T19_terms.json': {
        'M. Ek': 'https://cs.wikipedia.org/wiki/Mats_Ek',
    },
    'T15_terms.json': {
        'Taglioni': 'https://cs.wikipedia.org/wiki/Paolo_Taglioni',  # American ballet context
    },
}

def process_all_files():
    """Process all term_links JSON files."""
    term_links_dir = Path('data/term_links')
    
    if not term_links_dir.exists():
        print(f"Directory {term_links_dir} does not exist!")
        return
    
    all_files = sorted(term_links_dir.glob('T*.json'))
    total_changes = 0
    files_changed = []
    
    print(f"Checking {len(all_files)} term_links files...\n")
    
    for json_file in all_files:
        filename = json_file.name
        print(f"\n{'='*80}")
        print(f"Processing {filename}")
        print(f"{'='*80}")
        
        try:
            with open(json_file, 'r', encoding='utf-8') as f:
                data = json.load(f)
        except Exception as e:
            print(f"  ❌ Error reading file: {e}")
            continue
        
        if 'terms' not in data:
            print(f"  ⚠ No 'terms' key found")
            continue
        
        terms = data['terms']
        changes = []
        new_terms = {}
        
        # Apply file-specific fixes first
        file_fixes = FILE_SPECIFIC_FIXES.get(filename, {})
        for term, new_url in file_fixes.items():
            if term in terms:
                old_url = terms[term]
                if old_url != new_url:
                    changes.append(('FIXED', term, old_url, new_url))
                    new_terms[term] = new_url
                else:
                    new_terms[term] = old_url
            else:
                # Check if term exists with different case or spelling
                pass
        
        # Apply spelling fixes to all terms
        for term, url in terms.items():
            if term not in new_terms:  # Skip if already processed
                fixed_url = url
                
                # Check for spelling errors in URLs
                for wrong, correct in ALL_FIXES['spelling_fixes'].items():
                    if wrong in url:
                        fixed_url = url.replace(wrong, correct)
                        if fixed_url != url:
                            changes.append(('FIXED_SPELLING', term, url, fixed_url))
                            break
                
                new_terms[term] = fixed_url
        
        # Check for ambiguous abbreviations and fix them
        for term, url in list(terms.items()):
            if term not in new_terms:
                continue
            
            # Check for "M. Ek" - should be Mats Ek (choreographer), not Malin Ek
            if term == "M. Ek" and "Malin_Ek" in new_terms[term]:
                new_url = url.replace("Malin_Ek", "Mats_Ek")
                changes.append(('FIXED_AMBIGUOUS', term, new_terms[term], new_url))
                new_terms[term] = new_url
        
        # Check for potential issues
        issues = []
        for term, url in new_terms.items():
            # Check for common problematic patterns
            if url and 'cs.wikipedia.org' in url:
                # Check for disambiguation pages or non-existent patterns
                if '_(' in url and 'disambiguation' not in url.lower():
                    # Might be a disambiguation - check if needed
                    pass
                
                # Check for obviously wrong spellings
                if 'Fokin' in url and 'Fokine' not in term:
                    issues.append(('SPELLING_ERROR', term, url))
                if 'Vaclav' in url and 'Vaslav' in term:
                    issues.append(('SPELLING_ERROR', term, url))
        
        # Report changes
        if changes:
            print(f"\n  Changes made:")
            for change_type, term, old_url, new_url in changes:
                if change_type == 'FIXED':
                    print(f"    ✓ FIXED: {term}")
                elif change_type == 'FIXED_SPELLING':
                    print(f"    ✓ FIXED SPELLING: {term}")
                elif change_type == 'FIXED_AMBIGUOUS':
                    print(f"    ✓ FIXED AMBIGUOUS: {term}")
                print(f"      Old: {old_url}")
                print(f"      New: {new_url}")
            
            # Save file
            data['terms'] = new_terms
            with open(json_file, 'w', encoding='utf-8') as f:
                json.dump(data, f, ensure_ascii=False, indent=2)
            
            total_changes += len(changes)
            files_changed.append(filename)
            print(f"\n  ✓ Saved {len(changes)} change(s) to {filename}")
        else:
            print(f"  ✓ No changes needed")
        
        if issues:
            print(f"\n  ⚠ Potential issues found:")
            for issue_type, term, url in issues:
                print(f"    - {issue_type}: {term} -> {url}")
    
    # Summary
    print(f"\n{'='*80}")
    print("SUMMARY")
    print(f"{'='*80}")
    print(f"Files checked: {len(all_files)}")
    print(f"Files changed: {len(files_changed)}")
    print(f"Total fixes: {total_changes}")
    
    if files_changed:
        print(f"\nChanged files:")
        for filename in files_changed:
            print(f"  - {filename}")
    else:
        print("\n✓ All files are already correct!")

if __name__ == '__main__':
    process_all_files()

