#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
Generuje všechny obrázky do review složky pro kontrolu před nahrazením
Obrázky se ukládají do assets/images/topics/review/ místo přímého nahrazení
"""

import json
import sys
import time
import subprocess
from pathlib import Path
from PIL import Image
import requests
from io import BytesIO

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

def generate_with_huggingface_api(prompt, model="runwayml/stable-diffusion-v1-5"):
    """Generuje obrázek pomocí Hugging Face Inference API"""
    endpoints = [
        f"https://api-inference.huggingface.co/models/{model}",
        f"https://router.huggingface.co/api-inference/v1/models/{model}",
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
                wait_time = int(response.headers.get("x-wait-for-model", 20))
                safe_print(f"    Model se nacita, cekam {wait_time} sekund...")
                time.sleep(wait_time)
                response = requests.post(API_URL, headers=headers, json=payload, timeout=90)
                if response.status_code == 200:
                    return Image.open(BytesIO(response.content))
        except Exception as e:
            continue
    
    return None

def generate_with_local_model(prompt):
    """Generuje obrázek pomocí lokálního Stable Diffusion modelu"""
    try:
        from diffusers import StableDiffusionPipeline
        import torch
        
        device = "cuda" if torch.cuda.is_available() else "cpu"
        dtype = torch.float16 if device == "cuda" else torch.float32
        
        safe_print(f"    Pouzivam lokalni model na {device}...")
        
        pipe = StableDiffusionPipeline.from_pretrained(
            "runwayml/stable-diffusion-v1-5",
            torch_dtype=dtype,
            safety_checker=None,
            requires_safety_checker=False
        )
        
        if device == "cuda":
            pipe = pipe.to("cuda")
            pipe.enable_attention_slicing()
        
        safe_print(f"    Generuji obrazek...")
        image = pipe(
            prompt,
            num_inference_steps=30,
            guidance_scale=7.5,
            width=512,
            height=512
        ).images[0]
        
        return image
    except ImportError:
        return None
    except Exception as e:
        safe_print(f"    Chyba lokalniho modelu: {e}")
        return None

def create_html_review_page():
    """Vytvoří HTML stránku pro review obrázků"""
    html_file = REVIEW_DIR / "review.html"
    
    html_content = """<!DOCTYPE html>
<html lang="cs">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Review generovaných obrázků</title>
    <style>
        body {
            font-family: Arial, sans-serif;
            max-width: 1400px;
            margin: 0 auto;
            padding: 20px;
            background: #f5f5f5;
        }
        .header {
            background: white;
            padding: 20px;
            border-radius: 8px;
            margin-bottom: 20px;
            box-shadow: 0 2px 4px rgba(0,0,0,0.1);
        }
        .topic {
            background: white;
            margin: 15px 0;
            padding: 20px;
            border-radius: 8px;
            box-shadow: 0 2px 4px rgba(0,0,0,0.1);
            display: flex;
            gap: 20px;
        }
        .topic-info {
            flex: 1;
        }
        .topic-id {
            font-weight: bold;
            color: #7c3aed;
            font-size: 1.2em;
            margin-bottom: 10px;
        }
        .prompt {
            background: #f9f9f9;
            padding: 10px;
            border-left: 4px solid #7c3aed;
            margin: 10px 0;
            font-size: 0.9em;
            word-break: break-word;
        }
        .image-container {
            flex: 0 0 300px;
        }
        .image-container img {
            width: 100%;
            height: auto;
            border: 2px solid #ddd;
            border-radius: 4px;
        }
        .status {
            margin-top: 10px;
            padding: 5px 10px;
            border-radius: 4px;
            display: inline-block;
        }
        .status.new {
            background: #dbeafe;
            color: #1e40af;
        }
        .status.exists {
            background: #fef3c7;
            color: #92400e;
        }
        .actions {
            margin-top: 15px;
        }
        .btn {
            padding: 8px 15px;
            margin-right: 10px;
            border: none;
            border-radius: 4px;
            cursor: pointer;
            text-decoration: none;
            display: inline-block;
        }
        .btn-primary {
            background: #7c3aed;
            color: white;
        }
        .btn-primary:hover {
            background: #6d28d9;
        }
        .summary {
            background: #e0f2fe;
            padding: 15px;
            border-radius: 8px;
            margin-bottom: 20px;
        }
    </style>
</head>
<body>
    <div class="header">
        <h1>🎨 Review generovaných obrázků</h1>
        <p>Zkontrolujte všechny obrázky před nahrazením originálů.</p>
        <div class="summary">
            <p><strong>Instrukce:</strong></p>
            <ol>
                <li>Zkontrolujte každý obrázek</li>
                <li>Pokud jsou obrázky v pořádku, spusťte: <code>python scripts/replace_images.py</code></li>
                <li>Pokud chcete některé přegenerovat, smažte je a spusťte generátor znovu</li>
            </ol>
        </div>
    </div>
"""
    
    # Načti názvy témat
    topics = {}
    for json_file in sorted(TOPICS_DIR.glob("T*.json")):
        try:
            with open(json_file, 'r', encoding='utf-8') as f:
                topic = json.load(f)
                topics[topic['id']] = topic.get('title', topic['id'])
        except:
            pass
    
    new_count = 0
    exists_count = 0
    
    for topic_id, prompt in sorted(TOPIC_PROMPTS.items()):
        title = topics.get(topic_id, topic_id)
        review_file = REVIEW_DIR / f"{topic_id}.png"
        original_file = ORIGINAL_DIR / f"{topic_id}.png"
        
        exists = original_file.exists()
        new = review_file.exists()
        
        if exists:
            exists_count += 1
        if new:
            new_count += 1
        
        status_class = "new" if new else ""
        status_text = "Nový obrázek" if new else "Chybí"
        if exists:
            status_text += " (originál existuje)"
        
        html_content += f"""
    <div class="topic">
        <div class="topic-info">
            <div class="topic-id">{topic_id}: {title}</div>
            <div class="prompt">{prompt}</div>
            <div class="status {status_class}">{status_text}</div>
            <div class="actions">
                <a href="{topic_id}.png" target="_blank" class="btn btn-primary">Zobrazit v plné velikosti</a>
            </div>
        </div>
        <div class="image-container">
"""
        if new:
            html_content += f'            <img src="{topic_id}.png" alt="{title}" />'
        else:
            html_content += f'            <div style="padding: 50px; text-align: center; color: #999;">Obrázek ještě nebyl vygenerován</div>'
        
        html_content += """
        </div>
    </div>
"""
    
    html_content += f"""
    <div class="header">
        <h2>Shrnutí</h2>
        <p>Vygenerováno: {new_count} / {len(TOPIC_PROMPTS)}</p>
        <p>Originálů existuje: {exists_count}</p>
        <p><strong>Pro nahrazení originálů spusťte:</strong></p>
        <code style="background: #f0f0f0; padding: 10px; display: block; margin-top: 10px;">
            python scripts/replace_images.py
        </code>
    </div>
</body>
</html>
"""
    
    with open(html_file, 'w', encoding='utf-8') as f:
        f.write(html_content)
    
    return html_file

def main():
    """Hlavní funkce"""
    REVIEW_DIR.mkdir(parents=True, exist_ok=True)
    
    safe_print("=" * 70)
    safe_print("Generator obrazku do review slozky")
    safe_print("=" * 70)
    safe_print(f"Review slozka: {REVIEW_DIR}")
    safe_print(f"Originalni slozka: {ORIGINAL_DIR}")
    safe_print("")
    safe_print("Obrazky budou ulozeny do review slozky pro kontrolu.")
    safe_print("Puvodni obrazky zustanou nezmenene.")
    safe_print("")
    
    # Zkontroluj lokální model
    use_local = False
    try:
        import torch
        import diffusers
        use_local = True
        safe_print("✓ Lokalni model je k dispozici")
    except ImportError:
        safe_print("⚠ Lokalni model neni k dispozici - pouziji Hugging Face API")
        safe_print("  (Pro lokalni model: pip install diffusers transformers torch)")
    
    safe_print("")
    
    generated = 0
    skipped = 0
    failed = 0
    
    for topic_id, prompt in sorted(TOPIC_PROMPTS.items()):
        review_file = REVIEW_DIR / f"{topic_id}.png"
        
        if review_file.exists():
            safe_print(f"{topic_id}: Obrazek jiz existuje v review, preskakuji...")
            skipped += 1
            continue
        
        safe_print(f"{topic_id}:")
        safe_print(f"  Prompt: {prompt[:80]}...")
        
        image = None
        
        # Zkus lokální model
        if use_local:
            image = generate_with_local_model(prompt)
        
        # Zkus API
        if image is None:
            safe_print("  Zkousim Hugging Face API...")
            for model in [
                "runwayml/stable-diffusion-v1-5",
                "stabilityai/stable-diffusion-2-1",
                "CompVis/stable-diffusion-v1-4"
            ]:
                image = generate_with_huggingface_api(prompt, model)
                if image:
                    break
                time.sleep(2)
        
        if image:
            image.save(review_file, 'PNG', optimize=True)
            safe_print(f"  ✓ Ulozeno do review: {review_file.name}")
            generated += 1
        else:
            safe_print(f"  ✗ Nepodarilo se vygenerovat obrazek")
            failed += 1
        
        safe_print("")
        
        # Počkej mezi požadavky
        if topic_id != sorted(TOPIC_PROMPTS.keys())[-1]:
            time.sleep(3)
    
    # Vytvoř review HTML stránku
    safe_print("Vytvarim HTML review stranku...")
    html_file = create_html_review_page()
    
    safe_print("")
    safe_print("=" * 70)
    safe_print("Shrnutí:")
    safe_print(f"  Vygenerovano: {generated}")
    safe_print(f"  Preskoceno: {skipped}")
    safe_print(f"  Neuspesnych: {failed}")
    safe_print("")
    safe_print(f"Review obrazky: {REVIEW_DIR}")
    safe_print(f"Review HTML: {html_file}")
    safe_print("")
    safe_print("Pro nahrazeni puvodnich obrazku spust:")
    safe_print("  python scripts/replace_images.py")
    safe_print("=" * 70)

if __name__ == "__main__":
    main()

