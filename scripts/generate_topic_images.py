#!/usr/bin/env python3
"""
Generátor obrázků pro témata dějin tance a baletu pomocí AI

Vytváří krásné, tematicky relevantní obrázky pro každé téma pomocí
Stable Diffusion modelu z Hugging Face.
"""

import json
import os
import time
from pathlib import Path
from PIL import Image
import requests
from io import BytesIO

PROJECT_ROOT = Path(__file__).parent.parent
TOPICS_DIR = PROJECT_ROOT / "data" / "topics"
OUTPUT_DIR = PROJECT_ROOT / "assets" / "images" / "topics"

# API endpoint pro Hugging Face Inference API (bezplatné, bez API klíče)
HF_API_URL = "https://api-inference.huggingface.co/models/stabilityai/stable-diffusion-xl-base-1.0"

# Alternativní model (pokud první nefunguje)
HF_API_URL_ALT = "https://api-inference.huggingface.co/models/runwayml/stable-diffusion-v1-5"

# Prompty pro každé téma - detailní a tematicky relevantní
TOPIC_PROMPTS = {
    "T00": {
        "prompt": "elegant abstract illustration of dance and ballet, graceful flowing lines, artistic composition, soft pastel colors, educational style, minimalist design",
        "negative": "realistic photo, dark colors, cluttered"
    },
    "T01": {
        "prompt": "ancient Egyptian dance scene, hieroglyphic style, pyramids in background, dancers in traditional Egyptian poses, warm desert colors, golden hour lighting, historical illustration style",
        "negative": "modern, contemporary, dark"
    },
    "T02": {
        "prompt": "traditional Asian dance, Chinese and Japanese dancers, pagoda architecture, cherry blossoms, elegant flowing movements, ink painting style, soft colors, cultural heritage",
        "negative": "western style, modern, dark"
    },
    "T03": {
        "prompt": "classical Greek and Roman dance, ancient amphitheater, columns and classical architecture, graceful dancers in togas, marble sculptures, classical art style, warm Mediterranean colors",
        "negative": "modern, dark, cluttered"
    },
    "T04": {
        "prompt": "medieval dance scene, Gothic architecture, castle in background, court dancers in medieval costumes, illuminated manuscript style, rich colors, historical period illustration",
        "negative": "modern, contemporary, dark"
    },
    "T05": {
        "prompt": "Renaissance court dance, elegant ballroom, Italian Renaissance architecture, dancers in elaborate Renaissance costumes, Leonardo da Vinci style, warm golden light, artistic masterpiece",
        "negative": "modern, dark, simple"
    },
    "T06": {
        "prompt": "royal court ballet, French palace interior, baroque architecture, elegant court dancers, Louis XIV style, opulent golden decorations, sophisticated atmosphere, historical illustration",
        "negative": "modern, casual, dark"
    },
    "T07": {
        "prompt": "baroque and rococo dance, ornate baroque interior, elaborate decorations, dancers in baroque costumes with wigs, candlelit ballroom, rich colors, opulent style, 18th century atmosphere",
        "negative": "modern, minimalist, dark"
    },
    "T08": {
        "prompt": "classical ballet, neoclassical architecture, elegant dancers in classical poses, clean lines, balanced composition, soft lighting, refined classical style, artistic illustration",
        "negative": "baroque, ornate, dark"
    },
    "T09": {
        "prompt": "pre-romantic ballet scene, moonlit night, ethereal atmosphere, dancers in flowing white costumes, romantic landscape, soft dreamy lighting, mystical mood, artistic illustration",
        "negative": "bright daylight, modern, dark"
    },
    "T10": {
        "prompt": "romantic ballet, ballerina en pointe, white tutu, moonlit forest scene, ethereal sylph dancers, romantic era style, soft pastel colors, dreamy atmosphere, Giselle or La Sylphide style",
        "negative": "modern, bright colors, dark"
    },
    "T11": {
        "prompt": "famous romantic ballet dancers and choreographers, Marie Taglioni style, elegant ballerina portrait, romantic era costume, soft lighting, artistic portrait, historical illustration",
        "negative": "modern, dark, casual"
    },
    "T12": {
        "prompt": "Russian ballet, St. Petersburg theater, Russian architecture with onion domes, elegant ballet dancers, imperial style, rich colors, cultural heritage, historical illustration",
        "negative": "modern, western style, dark"
    },
    "T13": {
        "prompt": "Ballets Russes company, Sergei Diaghilev, colorful costumes, avant-garde style, early 20th century, artistic innovation, vibrant colors, theatrical performance, historical illustration",
        "negative": "modern, minimalist, dark"
    },
    "T14": {
        "prompt": "famous Ballets Russes choreographers, Nijinsky style, innovative dance poses, colorful theatrical costumes, artistic avant-garde, early 20th century, vibrant illustration",
        "negative": "modern, simple, dark"
    },
    "T15": {
        "prompt": "American ballet development, modern American dancers, contemporary ballet style, dynamic movement, innovative choreography, bright colors, energetic atmosphere, 20th century illustration",
        "negative": "classical European, dark, old-fashioned"
    },
    "T16": {
        "prompt": "modern dance in Europe, expressive contemporary dancers, abstract movement, European avant-garde style, artistic innovation, dynamic composition, modern art illustration",
        "negative": "classical ballet, traditional, dark"
    },
    "T17": {
        "prompt": "modern dance in USA, Isadora Duncan style, free flowing movement, expressive dancers, American modern dance pioneers, dynamic poses, artistic illustration, 20th century",
        "negative": "classical ballet, rigid, dark"
    },
    "T18": {
        "prompt": "English ballet, Royal Ballet style, elegant British dancers, classical English architecture, refined style, sophisticated atmosphere, cultural heritage, historical illustration",
        "negative": "modern, casual, dark"
    },
    "T19": {
        "prompt": "world famous choreographers, diverse international dancers, global ballet scene, artistic diversity, world map elements, cultural fusion, vibrant colors, contemporary illustration",
        "negative": "single culture, dark, simple"
    },
    "T20": {
        "prompt": "Czech folk dance beginnings, traditional Czech dancers, Bohemian countryside, folk costumes, cultural heritage, warm colors, historical illustration, Central European style",
        "negative": "modern, urban, dark"
    },
    "T21": {
        "prompt": "National Theatre Prague ballet masters, historic theater building, classical ballet performance, Czech cultural heritage, elegant dancers, golden age of Czech ballet, historical illustration",
        "negative": "modern, dark, simple"
    },
    "T22": {
        "prompt": "founders of Czech choreography, creative dance pioneers, artistic innovation, Czech cultural scene, dynamic movement, creative expression, vibrant colors, mid-20th century illustration",
        "negative": "modern, dark, simple"
    },
    "T23": {
        "prompt": "famous Czech choreographers, Jiří Kylián style, contemporary Czech ballet, innovative choreography, artistic excellence, modern dance theater, dynamic composition, contemporary illustration",
        "negative": "classical, old-fashioned, dark"
    },
    "T24": {
        "prompt": "National Theatre ballet masters and repertoire since 1959, modern Czech ballet, contemporary performance, innovative choreography, cultural evolution, vibrant colors, modern illustration",
        "negative": "old-fashioned, dark, simple"
    },
}

def generate_image_with_hf(prompt, negative_prompt="", max_retries=3):
    """
    Generuje obrázek pomocí Hugging Face Inference API
    
    Zkusí hlavní model, pokud selže, zkusí alternativní.
    """
    headers = {
        "Content-Type": "application/json",
    }
    
    payload = {
        "inputs": prompt,
        "parameters": {
            "negative_prompt": negative_prompt,
            "num_inference_steps": 30,
            "guidance_scale": 7.5,
            "width": 512,
            "height": 512
        }
    }
    
    # Zkus hlavní model
    for attempt in range(max_retries):
        try:
            response = requests.post(HF_API_URL, headers=headers, json=payload, timeout=60)
            
            if response.status_code == 200:
                image = Image.open(BytesIO(response.content))
                return image
            elif response.status_code == 503:
                # Model se načítá, počkej
                print(f"  Model se načítá, čekám 10 sekund... (pokus {attempt + 1}/{max_retries})")
                time.sleep(10)
                continue
            else:
                print(f"  Chyba API: {response.status_code}, zkouším alternativní model...")
                break
        except requests.exceptions.Timeout:
            print(f"  Timeout, zkouším znovu... (pokus {attempt + 1}/{max_retries})")
            time.sleep(5)
            continue
        except Exception as e:
            print(f"  Chyba: {e}, zkouším alternativní model...")
            break
    
    # Zkus alternativní model
    print("  Zkouším alternativní model...")
    for attempt in range(max_retries):
        try:
            response = requests.post(HF_API_URL_ALT, headers=headers, json=payload, timeout=60)
            
            if response.status_code == 200:
                image = Image.open(BytesIO(response.content))
                return image
            elif response.status_code == 503:
                print(f"  Alternativní model se načítá, čekám 10 sekund... (pokus {attempt + 1}/{max_retries})")
                time.sleep(10)
                continue
            else:
                print(f"  Chyba alternativního API: {response.status_code}")
                return None
        except Exception as e:
            print(f"  Chyba alternativního modelu: {e}")
            if attempt < max_retries - 1:
                time.sleep(5)
            continue
    
    return None

def generate_image_local(prompt, negative_prompt=""):
    """
    Alternativní metoda: použití lokálního Stable Diffusion (pokud je nainstalován)
    """
    try:
        from diffusers import StableDiffusionPipeline
        import torch
        
        print("  Používám lokální model...")
        pipe = StableDiffusionPipeline.from_pretrained(
            "runwayml/stable-diffusion-v1-5",
            torch_dtype=torch.float16 if torch.cuda.is_available() else torch.float32
        )
        
        if torch.cuda.is_available():
            pipe = pipe.to("cuda")
        
        image = pipe(
            prompt,
            negative_prompt=negative_prompt,
            num_inference_steps=30,
            guidance_scale=7.5,
            width=512,
            height=512
        ).images[0]
        
        return image
    except ImportError:
        print("  Lokální model není k dispozici (diffusers není nainstalován)")
        return None
    except Exception as e:
        print(f"  Chyba lokálního modelu: {e}")
        return None

def load_topic_data():
    """Načte data o tématech z JSON souborů"""
    topics = {}
    for json_file in sorted(TOPICS_DIR.glob("T*.json")):
        try:
            with open(json_file, 'r', encoding='utf-8') as f:
                topic = json.load(f)
                topics[topic['id']] = topic
        except Exception as e:
            print(f"Chyba při načítání {json_file}: {e}")
    return topics

def update_topic_image_path(topic_id, new_image_path):
    """Aktualizuje cestu k obrázku v JSON souboru tématu"""
    json_file = TOPICS_DIR / f"{topic_id}.json"
    try:
        with open(json_file, 'r', encoding='utf-8') as f:
            topic = json.load(f)
        
        topic['image'] = new_image_path
        
        with open(json_file, 'w', encoding='utf-8') as f:
            json.dump(topic, f, ensure_ascii=False, indent=2)
        
        return True
    except Exception as e:
        print(f"  Chyba při aktualizaci {json_file}: {e}")
        return False

def main():
    """Hlavní funkce pro generování obrázků"""
    OUTPUT_DIR.mkdir(parents=True, exist_ok=True)
    
    print("=" * 60)
    print("Generátor obrázků pro témata dějin tance a baletu")
    print("=" * 60)
    print(f"Výstupní adresář: {OUTPUT_DIR}\n")
    
    # Načti témata
    topics = load_topic_data()
    print(f"Načteno {len(topics)} témat\n")
    
    generated = 0
    skipped = 0
    failed = 0
    
    for topic_id in sorted(TOPIC_PROMPTS.keys()):
        if topic_id not in topics:
            print(f"{topic_id}: Téma nenalezeno, přeskočeno")
            skipped += 1
            continue
        
        topic = topics[topic_id]
        prompt_data = TOPIC_PROMPTS[topic_id]
        
        output_file = OUTPUT_DIR / f"{topic_id}.png"
        
        # Pokud obrázek už existuje, zeptej se, jestli ho přepsat
        if output_file.exists():
            print(f"{topic_id} ({topic['title']}): Obrázek již existuje")
            response = input("  Přepsat? (a/n, nebo Enter pro přeskočení): ").strip().lower()
            if response != 'a':
                print("  Přeskočeno")
                skipped += 1
                continue
        
        print(f"\n{topic_id} ({topic['title']}):")
        print(f"  Prompt: {prompt_data['prompt']}")
        
        # Zkus generovat pomocí Hugging Face API
        image = generate_image_with_hf(
            prompt_data['prompt'],
            prompt_data.get('negative', '')
        )
        
        # Pokud API selhalo, zkus lokální model
        if image is None:
            print("  Zkouším lokální model...")
            image = generate_image_local(
                prompt_data['prompt'],
                prompt_data.get('negative', '')
            )
        
        if image:
            # Ulož obrázek
            image.save(output_file, 'PNG', optimize=True, quality=95)
            
            # Aktualizuj JSON
            new_image_path = f"assets/images/topics/{topic_id}.png"
            if update_topic_image_path(topic_id, new_image_path):
                print(f"  ✓ Obrázek uložen: {output_file}")
                print(f"  ✓ JSON aktualizován")
                generated += 1
            else:
                print(f"  ✓ Obrázek uložen, ale JSON se nepodařilo aktualizovat")
                generated += 1
        else:
            print(f"  ✗ Nepodařilo se vygenerovat obrázek")
            failed += 1
        
        # Počkej chvíli mezi požadavky (kvůli rate limiting)
        if topic_id != sorted(TOPIC_PROMPTS.keys())[-1]:
            time.sleep(2)
    
    print("\n" + "=" * 60)
    print("Shrnutí:")
    print(f"  Vygenerováno: {generated}")
    print(f"  Přeskočeno: {skipped}")
    print(f"  Neúspěšných: {failed}")
    print("=" * 60)

if __name__ == "__main__":
    main()

