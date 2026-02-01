#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
Aktualizuje cesty k obrázkům v JSON souborech témat
Použij po vygenerování obrázků pomocí externích nástrojů
"""

import json
import sys
from pathlib import Path

PROJECT_ROOT = Path(__file__).parent.parent
TOPICS_DIR = PROJECT_ROOT / "data" / "topics"
IMAGES_DIR = PROJECT_ROOT / "assets" / "images" / "topics"

# Fix Windows console encoding
if sys.platform == 'win32':
    try:
        sys.stdout.reconfigure(encoding='utf-8')
        sys.stderr.reconfigure(encoding='utf-8')
    except:
        pass

def safe_print(text):
    """Bezpečné tisknutí s fallbackem pro Windows"""
    try:
        print(text)
    except UnicodeEncodeError:
        print(text.encode('ascii', 'replace').decode('ascii'))

def update_topic_images():
    """Aktualizuje cesty k obrázkům v JSON souborech"""
    safe_print("=" * 70)
    safe_print("Aktualizace cest k obrazkum v JSON souborech")
    safe_print("=" * 70)
    safe_print("")
    
    updated = 0
    not_found = 0
    already_correct = 0
    
    # Projdi všechny JSON soubory témat
    for json_file in sorted(TOPICS_DIR.glob("T*.json")):
        try:
            with open(json_file, 'r', encoding='utf-8') as f:
                topic = json.load(f)
            
            topic_id = topic.get('id', json_file.stem)
            
            # Zkontroluj, jestli existuje PNG obrázek
            png_file = IMAGES_DIR / f"{topic_id}.png"
            svg_file = IMAGES_DIR / f"{topic_id}.svg"
            
            current_image = topic.get('image', '')
            
            if png_file.exists():
                new_image_path = f"assets/images/topics/{topic_id}.png"
                if current_image != new_image_path:
                    topic['image'] = new_image_path
                    with open(json_file, 'w', encoding='utf-8') as f:
                        json.dump(topic, f, ensure_ascii=False, indent=2)
                    safe_print(f"✓ {topic_id}: Aktualizovano na {new_image_path}")
                    updated += 1
                else:
                    safe_print(f"  {topic_id}: Uz je spravne nastaveno")
                    already_correct += 1
            elif svg_file.exists():
                # Pokud existuje jen SVG, nech ho
                safe_print(f"  {topic_id}: Pouze SVG nalezeno, ponechano")
                already_correct += 1
            else:
                safe_print(f"⚠ {topic_id}: Obrazek nenalezen (ocekavano: {topic_id}.png)")
                not_found += 1
                
        except Exception as e:
            safe_print(f"✗ Chyba pri zpracovani {json_file}: {e}")
    
    safe_print("")
    safe_print("=" * 70)
    safe_print("Shrnutí:")
    safe_print(f"  Aktualizovano: {updated}")
    safe_print(f"  Uz spravne: {already_correct}")
    safe_print(f"  Nenalezeno: {not_found}")
    safe_print("=" * 70)

if __name__ == "__main__":
    update_topic_images()

