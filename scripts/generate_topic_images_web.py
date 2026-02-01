#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
Web-based image generator - používá online služby pro generování obrázků
Alternativa když API nefungují - vytvoří HTML stránku s odkazy pro generování
"""

import json
import sys
from pathlib import Path

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

def create_prompts_file():
    """Vytvoří soubor s prompty pro snadné kopírování"""
    prompts_file = PROJECT_ROOT / "image_generation_prompts.txt"
    
    with open(prompts_file, 'w', encoding='utf-8') as f:
        f.write("=" * 70 + "\n")
        f.write("PROMPTY PRO GENEROVÁNÍ OBRÁZKŮ PRO TÉMATA\n")
        f.write("=" * 70 + "\n\n")
        f.write("Tyto prompty můžete použít v jakékoli AI image generátoru:\n")
        f.write("- Hugging Face Spaces (huggingface.co/spaces)\n")
        f.write("- Stable Diffusion Online\n")
        f.write("- DALL-E, Midjourney, nebo jiné služby\n\n")
        f.write("=" * 70 + "\n\n")
        
        # Načti názvy témat
        topics = {}
        for json_file in sorted(TOPICS_DIR.glob("T*.json")):
            try:
                with open(json_file, 'r', encoding='utf-8') as f2:
                    topic = json.load(f2)
                    topics[topic['id']] = topic.get('title', topic['id'])
            except:
                pass
        
        for topic_id, prompt in sorted(TOPIC_PROMPTS.items()):
            title = topics.get(topic_id, topic_id)
            f.write(f"{topic_id}: {title}\n")
            f.write(f"Prompt: {prompt}\n")
            f.write(f"Output file: {topic_id}.png\n")
            f.write("-" * 70 + "\n\n")
    
    safe_print(f"✓ Vytvoren soubor s prompty: {prompts_file}")
    return prompts_file

def create_html_generator():
    """Vytvoří HTML stránku s odkazy pro generování"""
    html_file = PROJECT_ROOT / "generate_images.html"
    
    html_content = """<!DOCTYPE html>
<html lang="cs">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Generátor obrázků pro témata</title>
    <style>
        body {
            font-family: Arial, sans-serif;
            max-width: 1200px;
            margin: 0 auto;
            padding: 20px;
            background: #f5f5f5;
        }
        .topic {
            background: white;
            margin: 15px 0;
            padding: 20px;
            border-radius: 8px;
            box-shadow: 0 2px 4px rgba(0,0,0,0.1);
        }
        .topic-id {
            font-weight: bold;
            color: #7c3aed;
            font-size: 1.2em;
        }
        .prompt {
            background: #f9f9f9;
            padding: 15px;
            border-left: 4px solid #7c3aed;
            margin: 10px 0;
            font-family: monospace;
            word-break: break-word;
        }
        .links {
            margin-top: 10px;
        }
        .links a {
            display: inline-block;
            margin: 5px 10px 5px 0;
            padding: 8px 15px;
            background: #7c3aed;
            color: white;
            text-decoration: none;
            border-radius: 4px;
        }
        .links a:hover {
            background: #6d28d9;
        }
        h1 {
            color: #333;
        }
        .instructions {
            background: #e0f2fe;
            padding: 20px;
            border-radius: 8px;
            margin-bottom: 30px;
        }
    </style>
</head>
<body>
    <h1>🎨 Generátor obrázků pro témata dějin tance a baletu</h1>
    
    <div class="instructions">
        <h2>Návod:</h2>
        <ol>
            <li>Klikněte na odkaz pro generování obrázku</li>
            <li>Zkopírujte prompt do generátoru</li>
            <li>Vygenerujte obrázek (512x512 nebo 1024x1024 pixelů)</li>
            <li>Uložte obrázek jako <code>TXX.png</code> do složky <code>assets/images/topics/</code></li>
            <li>Skript automaticky aktualizuje JSON soubory</li>
        </ol>
        <p><strong>Doporučené služby:</strong></p>
        <ul>
            <li><a href="https://huggingface.co/spaces" target="_blank">Hugging Face Spaces</a> - zdarma, mnoho modelů</li>
            <li><a href="https://www.craiyon.com" target="_blank">Craiyon</a> - zdarma, jednoduché použití</li>
            <li><a href="https://replicate.com" target="_blank">Replicate</a> - zdarma s limity</li>
        </ul>
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
    
    for topic_id, prompt in sorted(TOPIC_PROMPTS.items()):
        title = topics.get(topic_id, topic_id)
        # URL-encode prompt pro odkazy
        import urllib.parse
        encoded_prompt = urllib.parse.quote(prompt)
        
        html_content += f"""
    <div class="topic">
        <div class="topic-id">{topic_id}: {title}</div>
        <div class="prompt">{prompt}</div>
        <div class="links">
            <a href="https://huggingface.co/spaces/stabilityai/stable-diffusion" target="_blank">Hugging Face SD</a>
            <a href="https://www.craiyon.com/?prompt={encoded_prompt}" target="_blank">Craiyon</a>
            <a href="https://replicate.com/stability-ai/stable-diffusion" target="_blank">Replicate</a>
        </div>
        <p><small>Uložit jako: <code>{topic_id}.png</code></small></p>
    </div>
"""
    
    html_content += """
</body>
</html>
"""
    
    with open(html_file, 'w', encoding='utf-8') as f:
        f.write(html_content)
    
    safe_print(f"✓ Vytvoren HTML soubor: {html_file}")
    return html_file

def main():
    """Hlavní funkce"""
    safe_print("=" * 70)
    safe_print("Web-based generator obrazku - vytvori pomocne soubory")
    safe_print("=" * 70)
    safe_print("")
    
    prompts_file = create_prompts_file()
    html_file = create_html_generator()
    
    safe_print("")
    safe_print("=" * 70)
    safe_print("Hotovo!")
    safe_print("=" * 70)
    safe_print("")
    safe_print("Vytvorene soubory:")
    safe_print(f"  1. {prompts_file}")
    safe_print(f"     - Textovy soubor se vsechny prompty")
    safe_print("")
    safe_print(f"  2. {html_file}")
    safe_print(f"     - HTML stranka s odkazy pro generovani")
    safe_print("     - Otevri v prohlizeci pro snadne pouziti")
    safe_print("")
    safe_print("Dalsi kroky:")
    safe_print("  1. Otevri HTML soubor v prohlizeci")
    safe_print("  2. Pouzij odkazy pro generovani obrazku")
    safe_print("  3. Uloz obrazky jako TXX.png do assets/images/topics/")
    safe_print("  4. Spust: python scripts/update_image_paths.py (pokud existuje)")
    safe_print("")

if __name__ == "__main__":
    main()

