#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
Zjednodušený generátor obrázků pro témata - používá lokální Stable Diffusion
nebo Hugging Face API s lepším error handlingem

Pro použití:
1. Instaluj závislosti: pip install diffusers transformers torch pillow requests
2. Nebo použij Hugging Face API (bezplatné, ale může být pomalé)
"""

import json
import os
import sys
import time
from pathlib import Path
from PIL import Image
import requests
from io import BytesIO

# Fix Windows console encoding
if sys.platform == 'win32':
    try:
        sys.stdout.reconfigure(encoding='utf-8')
        sys.stderr.reconfigure(encoding='utf-8')
    except:
        pass

PROJECT_ROOT = Path(__file__).parent.parent
TOPICS_DIR = PROJECT_ROOT / "data" / "topics"
OUTPUT_DIR = PROJECT_ROOT / "assets" / "images" / "topics"

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

def generate_with_huggingface_api(prompt, model="stabilityai/stable-diffusion-xl-base-1.0"):
    """Generuje obrázek pomocí Hugging Face Inference API"""
    # Zkus různé endpointy
    endpoints = [
        f"https://api-inference.huggingface.co/models/{model}",
        f"https://router.huggingface.co/api-inference/v1/models/{model}",
        f"https://hf-inference-api.huggingface.co/models/{model}",
    ]
    
    headers = {"Content-Type": "application/json"}
    payload = {
        "inputs": prompt,
        "parameters": {
            "num_inference_steps": 25,
            "guidance_scale": 7.5,
        }
    }
    
    for API_URL in endpoints:
        try:
            response = requests.post(API_URL, headers=headers, json=payload, timeout=90)
            
            if response.status_code == 200:
                return Image.open(BytesIO(response.content))
            elif response.status_code == 503:
                # Model se načítá
                wait_time = int(response.headers.get("x-wait-for-model", 20))
                safe_print(f"    Model se nacita, cekam {wait_time} sekund...")
                time.sleep(wait_time)
                # Zkus znovu
                response = requests.post(API_URL, headers=headers, json=payload, timeout=90)
                if response.status_code == 200:
                    return Image.open(BytesIO(response.content))
            elif response.status_code == 401 or response.status_code == 403:
                # Vyžaduje autentizaci, zkus další endpoint
                continue
        except requests.exceptions.RequestException:
            # Zkus další endpoint
            continue
        except Exception as e:
            safe_print(f"    Chyba s {API_URL}: {e}")
            continue
    
    return None

def generate_with_replicate_api(prompt):
    """Alternativní metoda pomocí Replicate API (vyžaduje API klíč)"""
    try:
        import replicate
        safe_print("    Pouzivam Replicate API...")
        output = replicate.run(
            "stability-ai/stable-diffusion:db21e45d3f7023abc2a46ee38a23973f6dce16bb082a930b0c49861f96d1e5bf",
            input={"prompt": prompt}
        )
        if output and len(output) > 0:
            img_response = requests.get(output[0])
            return Image.open(BytesIO(img_response.content))
    except ImportError:
        pass
    except Exception as e:
        safe_print(f"    Replicate chyba: {e}")
    return None

def generate_with_local_model(prompt):
    """Generuje obrázek pomocí lokálního Stable Diffusion modelu"""
    try:
        from diffusers import StableDiffusionPipeline
        import torch
        
        safe_print("    Pouzivam lokalni Stable Diffusion model...")
        
        # Zkus použít GPU pokud je dostupné
        device = "cuda" if torch.cuda.is_available() else "cpu"
        dtype = torch.float16 if device == "cuda" else torch.float32
        
        pipe = StableDiffusionPipeline.from_pretrained(
            "runwayml/stable-diffusion-v1-5",
            torch_dtype=dtype
        )
        pipe = pipe.to(device)
        
        safe_print(f"    Generuji obrazek na {device}...")
        image = pipe(
            prompt,
            num_inference_steps=30,
            guidance_scale=7.5,
            width=512,
            height=512
        ).images[0]
        
        return image
    except ImportError:
        safe_print("    Lokalni model neni k dispozici (nainstaluj: pip install diffusers transformers torch)")
        return None
    except Exception as e:
        safe_print(f"    Chyba lokalniho modelu: {e}")
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

def safe_print(text):
    """Bezpečné tisknutí s fallbackem pro Windows"""
    try:
        print(text)
    except UnicodeEncodeError:
        # Fallback pro Windows konzoli
        print(text.encode('ascii', 'replace').decode('ascii'))

def main():
    """Hlavní funkce"""
    OUTPUT_DIR.mkdir(parents=True, exist_ok=True)
    
    safe_print("=" * 70)
    safe_print("Generator obrazku pro temata dejiny tance a baletu")
    safe_print("=" * 70)
    print(f"Výstupní adresář: {OUTPUT_DIR}\n")
    
    # Zkontroluj, jestli je dostupný lokální model
    use_local = False
    try:
        import torch
        import diffusers
        use_local = True
        safe_print("✓ Lokalni model je k dispozici")
    except ImportError:
        safe_print("⚠ Lokalni model neni k dispozici - pouziji Hugging Face API")
        safe_print("  (Pro lokalni model nainstaluj: pip install diffusers transformers torch)\n")
    
    safe_print(f"Nacitam temata z {TOPICS_DIR}...\n")
    
    generated = 0
    skipped = 0
    failed = 0
    
    for topic_id, prompt in sorted(TOPIC_PROMPTS.items()):
        output_file = OUTPUT_DIR / f"{topic_id}.png"
        
        # Pokud obrázek existuje, přeskoč (nebo přepiš automaticky)
        if output_file.exists():
            safe_print(f"{topic_id}: Obrazek jiz existuje, prepisuji...")
        
        safe_print(f"{topic_id}:")
        safe_print(f"  Prompt: {prompt[:80]}...")
        
        # Zkus generovat
        image = None
        
        if use_local:
            image = generate_with_local_model(prompt)
        
        if image is None:
            safe_print("  Zkousim Hugging Face API...")
            # Zkus různé modely
            for model in [
                "runwayml/stable-diffusion-v1-5",  # Začni s menším modelem
                "stabilityai/stable-diffusion-2-1",
                "CompVis/stable-diffusion-v1-4"
            ]:
                image = generate_with_huggingface_api(prompt, model)
                if image:
                    break
                time.sleep(2)
            
            # Pokud HF API nefunguje, zkus Replicate (pokud je nainstalován)
            if image is None:
                image = generate_with_replicate_api(prompt)
        
        if image:
            # Ulož obrázek
            image.save(output_file, 'PNG', optimize=True)
            safe_print(f"  ✓ Ulozeno: {output_file}")
            
            # Aktualizuj JSON
            image_path = f"assets/images/topics/{topic_id}.png"
            if update_json_file(topic_id, image_path):
                safe_print(f"  ✓ JSON aktualizovan")
            generated += 1
        else:
            safe_print(f"  ✗ Nepodarilo se vygenerovat obrazek")
            failed += 1
        
        safe_print("")
        
        # Počkej mezi požadavky
        if topic_id != sorted(TOPIC_PROMPTS.keys())[-1]:
            time.sleep(3)
    
    safe_print("=" * 70)
    safe_print("Shrnutí:")
    safe_print(f"  Vygenerovano: {generated}")
    safe_print(f"  Preskoceno: {skipped}")
    safe_print(f"  Neuspesnych: {failed}")
    safe_print("=" * 70)

if __name__ == "__main__":
    main()

