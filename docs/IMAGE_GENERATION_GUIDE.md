# Průvodce generováním obrázků pro témata

Tento průvodce vysvětluje, jak vygenerovat krásné, tematicky relevantní obrázky pro všechna témata projektu.

## Přehled

Místo jednoduchých SVG ikon můžete nyní vygenerovat profesionální obrázky pomocí AI, které lépe odrážejí obsah každého tématu.

## Možnosti generování

### Možnost 1: Hugging Face API (Doporučeno pro začátek)

**Výhody:**
- Bezplatné (s určitými limity)
- Nevyžaduje výkonný počítač
- Rychlé nastavení

**Nevýhody:**
- Může být pomalé při prvním použití (model se musí načíst)
- Rate limiting (omezení počtu požadavků)

**Použití:**
```bash
python scripts/generate_topic_images_simple.py
```

### Možnost 2: Lokální Stable Diffusion

**Výhody:**
- Rychlejší po prvním načtení
- Žádné rate limity
- Plná kontrola

**Nevýhody:**
- Vyžaduje GPU pro rychlé generování (CPU je pomalé)
- Vyžaduje více místa na disku (~5-10 GB)
- Složitější instalace

**Instalace:**
```bash
pip install diffusers transformers torch torchvision accelerate
```

**Použití:**
Stejný skript automaticky použije lokální model, pokud je nainstalován.

### Možnost 3: Jiné služby

Můžete také použít:
- **DALL-E API** (OpenAI) - placené, ale velmi kvalitní
- **Midjourney** - vyžaduje Discord a předplatné
- **Stable Diffusion WebUI** - lokální řešení s GUI

## Postup

1. **Nainstaluj závislosti:**
   ```bash
   pip install -r requirements.txt
   ```

2. **Spusť generátor:**
   ```bash
   python scripts/generate_topic_images_simple.py
   ```

3. **Pro každé téma:**
   - Skript se zeptá, jestli chcete přepsat existující obrázek
   - Obrázek se vygeneruje a uloží jako PNG
   - JSON soubor tématu se automaticky aktualizuje

## Formát obrázků

- **Formát:** PNG
- **Rozměry:** 512x512 pixelů
- **Umístění:** `assets/images/topics/TXX.png`
- **Optimalizace:** Automaticky optimalizováno pro web

## Přizpůsobení promptů

Pokud chcete upravit prompty pro generování, editujte slovník `TOPIC_PROMPTS` v souboru:
- `scripts/generate_topic_images_simple.py`

Každý prompt by měl:
- Být v angličtině (modely lépe rozumí angličtině)
- Obsahovat klíčová slova související s tématem
- Zahrnovat styl (např. "historical illustration", "artistic style")
- Specifikovat barvy a atmosféru

## Řešení problémů

### Model se načítá příliš dlouho
- Počkejte, skript automaticky čeká na načtení modelu
- Nebo použijte lokální model

### Chyba "Rate limit exceeded"
- Počkejte několik minut a zkuste znovu
- Nebo použijte lokální model

### Obrázky nejsou dostatečně kvalitní
- Upravte prompty v souboru skriptu
- Zkuste jiný model (změňte `model` parametr)
- Zvyšte `num_inference_steps` pro lepší kvalitu (ale pomalejší generování)

### Lokální model je pomalý
- Použijte GPU (CUDA) místo CPU
- Snižte `num_inference_steps`
- Použijte menší model

## Příklady promptů

**Dobrý prompt:**
```
"Renaissance court dance, elegant ballroom, Italian Renaissance architecture, 
dancers in elaborate Renaissance costumes, Leonardo da Vinci style, 
warm golden light, artistic masterpiece"
```

**Špatný prompt:**
```
"dance"  # Příliš obecný
```

## Tipy

1. **Generujte postupně:** Nenechte skript běžet na všechna témata najednou, pokud používáte API
2. **Kontrolujte výsledky:** Po vygenerování zkontrolujte obrázky a případně je přegenerujte
3. **Backup:** Před spuštěním si zálohujte existující obrázky
4. **Testování:** Nejdřív vygenerujte jedno téma, abyste viděli výsledek

## Alternativní řešení

Pokud AI generování nefunguje dobře, můžete:
1. Použít stock fotky z Unsplash, Pexels (zdarma)
2. Vytvořit vlastní ilustrace
3. Použít historické obrázky z veřejných archivů

## Podpora

Pokud narazíte na problémy:
1. Zkontrolujte, že máte nainstalované všechny závislosti
2. Zkontrolujte připojení k internetu (pro API)
3. Zkontrolujte dostatek místa na disku
4. Zkontrolujte logy skriptu pro chybové zprávy


