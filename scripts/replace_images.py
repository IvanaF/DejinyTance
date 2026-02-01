#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
Nahradí originální obrázky obrázky z review složky
Použijte po kontrole obrázků v review složce
"""

import json
import sys
import shutil
from pathlib import Path

PROJECT_ROOT = Path(__file__).parent.parent
TOPICS_DIR = PROJECT_ROOT / "data" / "topics"
REVIEW_DIR = PROJECT_ROOT / "assets" / "images" / "topics" / "review"
ORIGINAL_DIR = PROJECT_ROOT / "assets" / "images" / "topics"

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

def backup_original_images():
    """Vytvoří zálohu originálních obrázků"""
    backup_dir = PROJECT_ROOT / "assets" / "images" / "topics" / "backup"
    backup_dir.mkdir(parents=True, exist_ok=True)
    
    backed_up = 0
    for img_file in ORIGINAL_DIR.glob("*.png"):
        if img_file.name.startswith("T"):
            backup_file = backup_dir / img_file.name
            if not backup_file.exists():
                shutil.copy2(img_file, backup_file)
                backed_up += 1
    
    if backed_up > 0:
        safe_print(f"✓ Vytvorena zaloha {backed_up} obrazku do: {backup_dir}")
    return backup_dir

def replace_images():
    """Nahradí originální obrázky obrázky z review"""
    safe_print("=" * 70)
    safe_print("Nahrazovani puvodnich obrazku obrazky z review")
    safe_print("=" * 70)
    safe_print("")
    
    # Vytvoř zálohu
    backup_dir = backup_original_images()
    safe_print("")
    
    replaced = 0
    not_found = 0
    updated_json = 0
    
    # Projdi všechny obrázky v review
    for review_file in sorted(REVIEW_DIR.glob("T*.png")):
        topic_id = review_file.stem
        original_file = ORIGINAL_DIR / review_file.name
        
        if review_file.exists():
            # Zkopíruj z review do originální složky
            shutil.copy2(review_file, original_file)
            safe_print(f"✓ {topic_id}: Nahrazeno")
            replaced += 1
            
            # Aktualizuj JSON
            json_file = TOPICS_DIR / f"{topic_id}.json"
            if json_file.exists():
                try:
                    with open(json_file, 'r', encoding='utf-8') as f:
                        topic = json.load(f)
                    
                    image_path = f"assets/images/topics/{topic_id}.png"
                    if topic.get('image') != image_path:
                        topic['image'] = image_path
                        with open(json_file, 'w', encoding='utf-8') as f:
                            json.dump(topic, f, ensure_ascii=False, indent=2)
                        updated_json += 1
                except Exception as e:
                    safe_print(f"  ⚠ Chyba pri aktualizaci JSON: {e}")
        else:
            safe_print(f"⚠ {topic_id}: Obrazek v review nenalezen")
            not_found += 1
    
    safe_print("")
    safe_print("=" * 70)
    safe_print("Shrnutí:")
    safe_print(f"  Nahrazeno: {replaced}")
    safe_print(f"  JSON aktualizovano: {updated_json}")
    safe_print(f"  Nenalezeno: {not_found}")
    safe_print(f"  Zaloha: {backup_dir}")
    safe_print("")
    safe_print("✓ Hotovo! Puvodni obrazky byly zalohovany.")
    safe_print("=" * 70)

if __name__ == "__main__":
    # Potvrzení
    safe_print("Tento skript nahradi puvodni obrazky obrazky z review slozky.")
    safe_print("Puvodni obrazky budou zalohovany do backup slozky.")
    safe_print("")
    response = input("Pokracovat? (ano/ne): ").strip().lower()
    
    if response in ['ano', 'a', 'yes', 'y']:
        replace_images()
    else:
        safe_print("Zruseno.")

