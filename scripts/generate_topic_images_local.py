#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
Lokální generátor obrázků pomocí Stable Diffusion
Vyžaduje instalaci: pip install diffusers transformers torch accelerate pillow

Tento skript používá lokální model, takže nepotřebuje internetové připojení
po stažení modelu a je zcela zdarma.
"""

import json
import sys
import time
from pathlib import Path
from PIL import Image

PROJECT_ROOT = Path(__file__).parent.parent
TOPICS_DIR = PROJECT_ROOT / "data" / "topics"
OUTPUT_DIR = PROJECT_ROOT / "assets" / "images" / "topics"

# Fix Windows console encoding
if sys.platform == 'win32':
    try:
        sys.stdout.reconfigure(encoding='utf-8')
        sys.stderr.reconfigure(encoding='utf-8')
    except:
        pass

# Prompty pro každé téma
TOPIC_PROMPTS = {
    "T00": "elegant abstract illustration of dance and ballet, graceful flowing lines, artistic composition, soft pastel colors, educational style, minimalist design",
    "T01": "ancient Egyptian dance scene, hieroglyphic style, pyramids in background, dancers in traditional Egyptian poses, warm desert colors, golden hour lighting, historical illustration style",
    "T02": "traditional Asian dance, Chinese and Japanese dancers, pagoda architecture, cherry blossoms, elegant flowing movements, ink painting style, soft colors, cultural heritage",
    "T03": "classical Greek and Roman dance, ancient amphitheater, columns and classical architecture, graceful dancers in togas, marble sculptures, classical art style, warm Mediterranean colors",
    "T04": "medieval dance scene, Gothic architecture, castle in background, court dancers in medieval costumes, illuminated manuscript style, rich colors, historical period illustration",
    "T05": "Renaissance court dance, elegant ballroom, Italian Renaissance architecture, dancers in elaborate Renaissance costumes, Leonardo da Vinci style, warm golden light, artistic masterpiece",
    "T06": "royal court ballet, French palace interior, baroque architecture, elegant court dancers, Louis XIV style, opulent golden decorations, sophisticated atmosphere, historical illustration",
    "T07": "baroque and rococo dance, ornate baroque interior, elaborate decorations, dancers in baroque costumes with wigs, candlelit ballroom, rich colors, opulent style, 18th century atmosphere",
    "T08": "classical ballet, neoclassical architecture, elegant dancers in classical poses, clean lines, balanced composition, soft lighting, refined classical style, artistic illustration",
    "T09": "pre-romantic ballet scene, moonlit night, ethereal atmosphere, dancers in flowing white costumes, romantic landscape, soft dreamy lighting, mystical mood, artistic illustration",
    "T10": "romantic ballet, ballerina en pointe, white tutu, moonlit forest scene, ethereal sylph dancers, romantic era style, soft pastel colors, dreamy atmosphere, Giselle or La Sylphide style",
    "T11": "famous romantic ballet dancers and choreographers, Marie Taglioni style, elegant ballerina portrait, romantic era costume, soft lighting, artistic portrait, historical illustration",
    "T12": "Russian ballet, St. Petersburg theater, Russian architecture with onion domes, elegant ballet dancers, imperial style, rich colors, cultural heritage, historical illustration",
    "T13": "Ballets Russes company, Sergei Diaghilev, colorful costumes, avant-garde style, early 20th century, artistic innovation, vibrant colors, theatrical performance, historical illustration",
    "T14": "famous Ballets Russes choreographers, Nijinsky style, innovative dance poses, colorful theatrical costumes, artistic avant-garde, early 20th century, vibrant illustration",
    "T15": "American ballet development, modern American dancers, contemporary ballet style, dynamic movement, innovative choreography, bright colors, energetic atmosphere, 20th century illustration",
    "T16": "modern dance in Europe, expressive contemporary dancers, abstract movement, European avant-garde style, artistic innovation, dynamic composition, modern art illustration",
    "T17": "modern dance in USA, Isadora Duncan style, free flowing movement, expressive dancers, American modern dance pioneers, dynamic poses, artistic illustration, 20th century",
    "T18": "English ballet, Royal Ballet style, elegant British dancers, classical English architecture, refined style, sophisticated atmosphere, cultural heritage, historical illustration",
    "T19": "world famous choreographers, diverse international dancers, global ballet scene, artistic diversity, world map elements, cultural fusion, vibrant colors, contemporary illustration",
    "T20": "Czech folk dance beginnings, traditional Czech dancers, Bohemian countryside, folk costumes, cultural heritage, warm colors, historical illustration, Central European style",
    "T21": "National Theatre Prague ballet masters, historic theater building, classical ballet performance, Czech cultural heritage, elegant dancers, golden age of Czech ballet, historical illustration",
    "T22": "founders of Czech choreography, creative dance pioneers, artistic innovation, Czech cultural scene, dynamic movement, creative expression, vibrant colors, mid-20th century illustration",
    "T23": "famous Czech choreographers, Jiří Kylián style, contemporary Czech ballet, innovative choreography, artistic excellence, modern dance theater, dynamic composition, contemporary illustration",
    "T24": "National Theatre ballet masters and repertoire since 1959, modern Czech ballet, contemporary performance, innovative choreography, cultural evolution, vibrant colors, modern illustration",
}

def safe_print(text):
    """Bezpečné tisknutí s fallbackem pro Windows"""
    try:
        print(text)
    except UnicodeEncodeError:
        print(text.encode('ascii', 'replace').decode('ascii'))

def check_dependencies():
    """Zkontroluje, jestli jsou nainstalované potřebné knihovny"""
    try:
        import torch
        import diffusers
        return True
    except ImportError:
        safe_print("CHYBA: Chybi potrebne knihovny!")
        safe_print("")
        safe_print("Pro instalaci spust:")
        safe_print("  pip install diffusers transformers torch accelerate pillow")
        safe_print("")
        safe_print("Poznamka: Pro rychle generovani je doporucena GPU (CUDA).")
        safe_print("         Bez GPU bude generovani pomale (cca 30-60 sekund na obrazek).")
        return False

def generate_image_local(prompt, model_name="runwayml/stable-diffusion-v1-5"):
    """Generuje obrázek pomocí lokálního Stable Diffusion modelu"""
    try:
        from diffusers import StableDiffusionPipeline
        import torch
        
        # Zkontroluj GPU
        device = "cuda" if torch.cuda.is_available() else "cpu"
        dtype = torch.float16 if device == "cuda" else torch.float32
        
        safe_print(f"    Pouzivam {model_name} na {device}...")
        
        # Načti pipeline (při prvním použití stáhne model)
        pipe = StableDiffusionPipeline.from_pretrained(
            model_name,
            torch_dtype=dtype,
            safety_checker=None,  # Pro rychlejší generování
            requires_safety_checker=False
        )
        
        if device == "cuda":
            pipe = pipe.to("cuda")
            # Optimalizace pro GPU
            pipe.enable_attention_slicing()
        
        safe_print(f"    Generuji obrazek (to muze trvat 30-60 sekund)...")
        start_time = time.time()
        
        image = pipe(
            prompt,
            num_inference_steps=30,
            guidance_scale=7.5,
            width=512,
            height=512
        ).images[0]
        
        elapsed = time.time() - start_time
        safe_print(f"    ✓ Vygenerovano za {elapsed:.1f} sekund")
        
        return image
        
    except Exception as e:
        safe_print(f"    ✗ Chyba: {e}")
        return None

def update_json_file(topic_id, image_path):
    """Aktualizuje cestu k obrázku v JSON souboru"""
    json_file = TOPICS_DIR / f"{topic_id}.json"
    try:
        with open(json_file, 'r', encoding='utf-8') as f:
            topic = json.load(f)
        
        topic['image'] = image_path
        
        with open(json_file, 'w', encoding='utf-8') as f:
            json.dump(topic, f, ensure_ascii=False, indent=2)
        
        return True
    except Exception as e:
        safe_print(f"    Chyba pri aktualizaci JSON: {e}")
        return False

def main():
    """Hlavní funkce"""
    if not check_dependencies():
        sys.exit(1)
    
    OUTPUT_DIR.mkdir(parents=True, exist_ok=True)
    
    safe_print("=" * 70)
    safe_print("Lokalni generator obrazku pro temata dejiny tance a baletu")
    safe_print("=" * 70)
    safe_print(f"Vystupni adresar: {OUTPUT_DIR}\n")
    
    import torch
    if torch.cuda.is_available():
        safe_print(f"✓ GPU detekovano: {torch.cuda.get_device_name(0)}")
    else:
        safe_print("⚠ GPU neni dostupne - pouziva se CPU (bude pomale)")
    safe_print("")
    
    generated = 0
    skipped = 0
    failed = 0
    
    for topic_id, prompt in sorted(TOPIC_PROMPTS.items()):
        output_file = OUTPUT_DIR / f"{topic_id}.png"
        
        if output_file.exists():
            safe_print(f"{topic_id}: Obrazek jiz existuje, prepisuji...")
        
        safe_print(f"{topic_id}:")
        safe_print(f"  Prompt: {prompt[:80]}...")
        
        image = generate_image_local(prompt)
        
        if image:
            image.save(output_file, 'PNG', optimize=True)
            safe_print(f"  ✓ Ulozeno: {output_file}")
            
            image_path = f"assets/images/topics/{topic_id}.png"
            if update_json_file(topic_id, image_path):
                safe_print(f"  ✓ JSON aktualizovan")
            generated += 1
        else:
            safe_print(f"  ✗ Nepodarilo se vygenerovat obrazek")
            failed += 1
        
        safe_print("")
    
    safe_print("=" * 70)
    safe_print("Shrnutí:")
    safe_print(f"  Vygenerovano: {generated}")
    safe_print(f"  Preskoceno: {skipped}")
    safe_print(f"  Neuspesnych: {failed}")
    safe_print("=" * 70)

if __name__ == "__main__":
    main()


