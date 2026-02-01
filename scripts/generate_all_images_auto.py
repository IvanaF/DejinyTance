#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
Automatický generátor všech obrázků najednou
Zkouší různé metody a služby pro generování
"""

import json
import sys
import time
import base64
from pathlib import Path
from PIL import Image
import requests
from io import BytesIO

PROJECT_ROOT = Path(__file__).parent.parent
TOPICS_DIR = PROJECT_ROOT / "data" / "topics"
REVIEW_DIR = PROJECT_ROOT / "assets" / "images" / "topics" / "review"

# Fix Windows console encoding
if sys.platform == 'win32':
    try:
        sys.stdout.reconfigure(encoding='utf-8')
        sys.stderr.reconfigure(encoding='utf-8')
    except:
        pass

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
    try:
        print(text)
    except UnicodeEncodeError:
        print(text.encode('ascii', 'replace').decode('ascii'))

def generate_with_local_model(prompt):
    """Lokální Stable Diffusion"""
    try:
        from diffusers import StableDiffusionPipeline
        import torch
        
        device = "cuda" if torch.cuda.is_available() else "cpu"
        dtype = torch.float16 if device == "cuda" else torch.float32
        
        pipe = StableDiffusionPipeline.from_pretrained(
            "runwayml/stable-diffusion-v1-5",
            torch_dtype=dtype,
            safety_checker=None,
            requires_safety_checker=False
        )
        
        if device == "cuda":
            pipe = pipe.to("cuda")
            pipe.enable_attention_slicing()
        
        image = pipe(
            prompt,
            num_inference_steps=30,
            guidance_scale=7.5,
            width=512,
            height=512
        ).images[0]
        
        return image
    except:
        return None

def generate_with_hf_spaces_api(prompt):
    """Hugging Face Spaces API - nový způsob"""
    try:
        # Zkus použít Inference API přes nový endpoint
        API_URL = "https://api-inference.huggingface.co/models/runwayml/stable-diffusion-v1-5"
        headers = {"Content-Type": "application/json"}
        payload = {"inputs": prompt}
        
        response = requests.post(API_URL, headers=headers, json=payload, timeout=120)
        
        if response.status_code == 200:
            return Image.open(BytesIO(response.content))
        elif response.status_code == 503:
            # Model se načítá
            wait = int(response.headers.get("x-wait-for-model", 30))
            safe_print(f"    Cekam na nacitani modelu ({wait}s)...")
            time.sleep(wait)
            response = requests.post(API_URL, headers=headers, json=payload, timeout=120)
            if response.status_code == 200:
                return Image.open(BytesIO(response.content))
    except Exception as e:
        pass
    return None

def generate_with_craiyon_api(prompt):
    """Craiyon API (pokud je dostupné)"""
    try:
        # Craiyon má API, ale může vyžadovat autentizaci
        # Zkusíme jednoduchý request
        API_URL = "https://api.craiyon.com/v3"
        payload = {"prompt": prompt}
        
        response = requests.post(API_URL, json=payload, timeout=60)
        if response.status_code == 200:
            data = response.json()
            if 'images' in data and len(data['images']) > 0:
                # Craiyon vrací base64 obrázky
                img_data = base64.b64decode(data['images'][0])
                return Image.open(BytesIO(img_data))
    except:
        pass
    return None

def generate_with_replicate_api(prompt):
    """Replicate API (vyžaduje API klíč, ale zkusíme)"""
    try:
        import replicate
        output = replicate.run(
            "stability-ai/stable-diffusion:db21e45d3f7023abc2a46ee38a23973f6dce16bb082a930b0c49861f96d1e5bf",
            input={"prompt": prompt, "image_dimensions": "512x512"}
        )
        if output and len(output) > 0:
            img_response = requests.get(output[0])
            return Image.open(BytesIO(img_response.content))
    except ImportError:
        safe_print("    Replicate neni nainstalovan (pip install replicate)")
    except Exception as e:
        pass
    return None

def generate_with_banana_api(prompt):
    """Banana.dev API (pokud je dostupné)"""
    # Banana.dev vyžaduje API klíč a model deployment
    # Pro teď přeskočíme, ale můžeme přidat později
    return None

def generate_image(prompt, topic_id):
    """Zkusí vygenerovat obrázek pomocí různých metod"""
    safe_print(f"  Zkousim ruzne metody...")
    
    # Metoda 1: Lokální model
    safe_print("    [1/4] Lokalni model...")
    image = generate_with_local_model(prompt)
    if image:
        safe_print("    ✓ Lokalni model uspesny!")
        return image
    
    # Metoda 2: Hugging Face API
    safe_print("    [2/4] Hugging Face API...")
    image = generate_with_hf_spaces_api(prompt)
    if image:
        safe_print("    ✓ Hugging Face API uspesny!")
        return image
    
    # Metoda 3: Replicate (pokud je nainstalován)
    safe_print("    [3/4] Replicate API...")
    image = generate_with_replicate_api(prompt)
    if image:
        safe_print("    ✓ Replicate API uspesny!")
        return image
    
    # Metoda 4: Craiyon
    safe_print("    [4/4] Craiyon API...")
    image = generate_with_craiyon_api(prompt)
    if image:
        safe_print("    ✓ Craiyon API uspesny!")
        return image
    
    return None

def main():
    """Hlavní funkce"""
    REVIEW_DIR.mkdir(parents=True, exist_ok=True)
    
    safe_print("=" * 70)
    safe_print("Automaticky generator vsech obrazku")
    safe_print("=" * 70)
    safe_print(f"Review slozka: {REVIEW_DIR}")
    safe_print("")
    
    # Zkontroluj dostupné metody
    methods_available = []
    
    try:
        import torch
        import diffusers
        methods_available.append("Lokalni model (GPU/CPU)")
    except:
        pass
    
    methods_available.append("Hugging Face API")
    methods_available.append("Replicate API (pokud nainstalovan)")
    methods_available.append("Craiyon API")
    
    safe_print(f"Dostupne metody: {', '.join(methods_available)}")
    safe_print("")
    
    generated = 0
    skipped = 0
    failed = 0
    
    for topic_id, prompt in sorted(TOPIC_PROMPTS.items()):
        review_file = REVIEW_DIR / f"{topic_id}.png"
        
        if review_file.exists():
            safe_print(f"{topic_id}: Jiz existuje, preskakuji...")
            skipped += 1
            continue
        
        safe_print(f"{topic_id}:")
        safe_print(f"  Prompt: {prompt[:70]}...")
        
        image = generate_image(prompt, topic_id)
        
        if image:
            image.save(review_file, 'PNG', optimize=True)
            safe_print(f"  ✓ Ulozeno: {review_file.name}")
            generated += 1
        else:
            safe_print(f"  ✗ Vsechny metody selhaly")
            failed += 1
        
        safe_print("")
        
        # Počkej mezi požadavky
        if topic_id != sorted(TOPIC_PROMPTS.keys())[-1]:
            time.sleep(2)
    
    safe_print("=" * 70)
    safe_print("Shrnutí:")
    safe_print(f"  Vygenerovano: {generated}")
    safe_print(f"  Preskoceno: {skipped}")
    safe_print(f"  Neuspesnych: {failed}")
    safe_print("")
    
    if failed > 0:
        safe_print("Pro neuspesne obrazky pouzijte HTML pomocnik:")
        safe_print(f"  {REVIEW_DIR / 'generate_review.html'}")
        safe_print("")
    
    safe_print(f"Review obrazky: {REVIEW_DIR}")
    safe_print("Pro nahrazeni puvodnich: python scripts/replace_images.py")
    safe_print("=" * 70)

if __name__ == "__main__":
    main()

