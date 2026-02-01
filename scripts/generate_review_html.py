#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
Vytvoří HTML stránku pro generování obrázků do review složky
"""

import json
import sys
import urllib.parse
from pathlib import Path

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

def create_review_html():
    """Vytvoří HTML stránku pro generování do review složky"""
    REVIEW_DIR.mkdir(parents=True, exist_ok=True)
    html_file = REVIEW_DIR / "generate_review.html"
    
    # Načti názvy témat
    topics = {}
    for json_file in sorted(TOPICS_DIR.glob("T*.json")):
        try:
            with open(json_file, 'r', encoding='utf-8') as f:
                topic = json.load(f)
                topics[topic['id']] = topic.get('title', topic['id'])
        except:
            pass
    
    html_content = f"""<!DOCTYPE html>
<html lang="cs">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Generátor obrázků - Review</title>
    <style>
        body {{
            font-family: Arial, sans-serif;
            max-width: 1400px;
            margin: 0 auto;
            padding: 20px;
            background: #f5f5f5;
        }}
        .header {{
            background: white;
            padding: 30px;
            border-radius: 8px;
            margin-bottom: 30px;
            box-shadow: 0 2px 4px rgba(0,0,0,0.1);
        }}
        .instructions {{
            background: #e0f2fe;
            padding: 20px;
            border-radius: 8px;
            margin-bottom: 20px;
            border-left: 4px solid #0284c7;
        }}
        .instructions h2 {{
            margin-top: 0;
            color: #0369a1;
        }}
        .instructions ol {{
            margin: 10px 0;
            padding-left: 20px;
        }}
        .instructions code {{
            background: #f0f0f0;
            padding: 2px 6px;
            border-radius: 3px;
            font-family: monospace;
        }}
        .topic {{
            background: white;
            margin: 20px 0;
            padding: 25px;
            border-radius: 8px;
            box-shadow: 0 2px 4px rgba(0,0,0,0.1);
        }}
        .topic-header {{
            display: flex;
            justify-content: space-between;
            align-items: center;
            margin-bottom: 15px;
        }}
        .topic-id {{
            font-weight: bold;
            color: #7c3aed;
            font-size: 1.3em;
        }}
        .topic-title {{
            color: #666;
            font-size: 1.1em;
        }}
        .prompt-box {{
            background: #f9f9f9;
            padding: 15px;
            border-left: 4px solid #7c3aed;
            margin: 15px 0;
            font-family: 'Courier New', monospace;
            word-break: break-word;
            position: relative;
        }}
        .copy-btn {{
            position: absolute;
            top: 10px;
            right: 10px;
            padding: 5px 10px;
            background: #7c3aed;
            color: white;
            border: none;
            border-radius: 4px;
            cursor: pointer;
            font-size: 0.9em;
        }}
        .copy-btn:hover {{
            background: #6d28d9;
        }}
        .links {{
            margin-top: 15px;
            display: flex;
            flex-wrap: wrap;
            gap: 10px;
        }}
        .links a {{
            display: inline-block;
            padding: 10px 20px;
            background: #7c3aed;
            color: white;
            text-decoration: none;
            border-radius: 4px;
            transition: background 0.3s;
        }}
        .links a:hover {{
            background: #6d28d9;
        }}
        .save-info {{
            background: #fef3c7;
            padding: 10px;
            border-radius: 4px;
            margin-top: 10px;
            font-size: 0.9em;
        }}
        .save-info code {{
            background: #f0f0f0;
            padding: 2px 6px;
            border-radius: 3px;
        }}
        .progress {{
            margin-top: 20px;
            padding: 15px;
            background: #f0f9ff;
            border-radius: 8px;
        }}
        .progress-bar {{
            width: 100%;
            height: 30px;
            background: #e5e7eb;
            border-radius: 15px;
            overflow: hidden;
            margin-top: 10px;
        }}
        .progress-fill {{
            height: 100%;
            background: #7c3aed;
            transition: width 0.3s;
            display: flex;
            align-items: center;
            justify-content: center;
            color: white;
            font-weight: bold;
        }}
    </style>
</head>
<body>
    <div class="header">
        <h1>🎨 Generátor obrázků pro témata - Review verze</h1>
        <p>Všechny obrázky budou uloženy do <code>assets/images/topics/review/</code> pro kontrolu před nahrazením.</p>
    </div>
    
    <div class="instructions">
        <h2>📋 Návod k použití:</h2>
        <ol>
            <li>Pro každé téma klikněte na odkaz generátoru (doporučeno: <strong>Hugging Face Spaces</strong>)</li>
            <li>Klikněte na tlačítko "Kopírovat" u promptu pro snadné kopírování</li>
            <li>Vložte prompt do generátoru a vygenerujte obrázek</li>
            <li><strong>DŮLEŽITÉ:</strong> Uložte obrázek jako <code>TXX.png</code> (např. <code>T01.png</code>) do složky:<br>
                <code style="background: #fff; padding: 5px 10px; display: inline-block; margin-top: 5px;">assets/images/topics/review/</code></li>
            <li>Po vygenerování všech obrázků spusťte: <code>python scripts/replace_images.py</code></li>
        </ol>
        <p><strong>💡 Tip:</strong> Můžete vygenerovat několik obrázků najednou v různých záložkách pro rychlejší práci.</p>
    </div>
    
    <div class="progress">
        <p><strong>Průběh:</strong> <span id="progress-text">0 / {len(TOPIC_PROMPTS)}</span></p>
        <div class="progress-bar">
            <div class="progress-fill" id="progress-bar" style="width: 0%">0%</div>
        </div>
    </div>
"""
    
    for topic_id, prompt in sorted(TOPIC_PROMPTS.items()):
        title = topics.get(topic_id, topic_id)
        encoded_prompt = urllib.parse.quote(prompt)
        
        html_content += f"""
    <div class="topic" id="topic-{topic_id}">
        <div class="topic-header">
            <div>
                <span class="topic-id">{topic_id}</span>
                <span class="topic-title">: {title}</span>
            </div>
        </div>
        <div class="prompt-box" id="prompt-{topic_id}">
            {prompt}
            <button class="copy-btn" onclick="copyPrompt('{topic_id}')">📋 Kopírovat</button>
        </div>
        <div class="links">
            <a href="https://huggingface.co/spaces/stabilityai/stable-diffusion-xl-base-1.0" target="_blank">🎨 Hugging Face SD XL</a>
            <a href="https://huggingface.co/spaces/runwayml/stable-diffusion-v1-5" target="_blank">🖼️ Hugging Face SD 1.5</a>
            <a href="https://www.craiyon.com/?prompt={encoded_prompt}" target="_blank">✨ Craiyon</a>
            <a href="https://replicate.com/stability-ai/stable-diffusion" target="_blank">🚀 Replicate</a>
        </div>
        <div class="save-info">
            <strong>Uložit jako:</strong> <code>{topic_id}.png</code><br>
            <strong>Do složky:</strong> <code>assets/images/topics/review/</code>
        </div>
    </div>
"""
    
    html_content += """
    <script>
        function copyPrompt(topicId) {
            const promptBox = document.getElementById('prompt-' + topicId);
            const promptText = promptBox.textContent.trim();
            
            navigator.clipboard.writeText(promptText).then(() => {
                const btn = promptBox.querySelector('.copy-btn');
                const originalText = btn.textContent;
                btn.textContent = '✓ Zkopírováno!';
                btn.style.background = '#10b981';
                setTimeout(() => {
                    btn.textContent = originalText;
                    btn.style.background = '#7c3aed';
                }, 2000);
            });
        }
        
        // Aktualizuj progress
        function updateProgress() {
            // Tato funkce by mohla kontrolovat, které obrázky existují
            // Pro jednoduchost jen zobrazíme statický progress
        }
        
        updateProgress();
    </script>
</body>
</html>
"""
    
    with open(html_file, 'w', encoding='utf-8') as f:
        f.write(html_content)
    
    safe_print(f"✓ Vytvoren HTML soubor: {html_file}")
    safe_print(f"  Otevri v prohlizeci pro generovani obrazku")
    safe_print(f"  Vsechny obrazky uloz do: {REVIEW_DIR}")
    return html_file

if __name__ == "__main__":
    create_review_html()

