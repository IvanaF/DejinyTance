# Shrnutí: Generování obrázků pro témata

## ✅ Co bylo vytvořeno

Vytvořil jsem několik nástrojů pro generování krásných, tematicky relevantních obrázků pro vaše témata:

### 1. **HTML pomocník** (`generate_images.html`)
   - **Nejjednodušší řešení!**
   - Otevřete v prohlížeči
   - Obsahuje všechny prompty pro 25 témat
   - Přímé odkazy na bezplatné generátory obrázků
   - Stačí kliknout a vygenerovat

### 2. **Textový soubor s prompty** (`image_generation_prompts.txt`)
   - Všechny prompty v jednom souboru
   - Snadné kopírování do jakéhokoli generátoru

### 3. **Skript pro aktualizaci JSON** (`scripts/update_image_paths.py`)
   - Automaticky aktualizuje cesty k obrázkům v JSON souborech
   - Spusťte po vygenerování obrázků

## 🚀 Jak použít (doporučený postup)

### Krok 1: Otevřete HTML soubor
```bash
# Otevřete v prohlížeči:
generate_images.html
```

### Krok 2: Vygenerujte obrázky
Pro každé téma:
1. Klikněte na odkaz (např. "Hugging Face SD" nebo "Craiyon")
2. Zkopírujte prompt z HTML stránky
3. Vložte do generátoru a vygenerujte
4. Uložte jako `TXX.png` (např. `T01.png`, `T05.png`)
5. Uložte do složky `assets/images/topics/`

### Krok 3: Aktualizujte JSON soubory
```bash
python scripts/update_image_paths.py
```

Tento skript automaticky:
- Najde všechny PNG obrázky
- Aktualizuje cesty v JSON souborech
- Připraví vše pro použití

## 🎨 Doporučené služby pro generování

### Bezplatné (doporučeno):
1. **Hugging Face Spaces**
   - URL: https://huggingface.co/spaces
   - Vyhledejte: "stable diffusion"
   - Bezplatné, kvalitní výsledky

2. **Craiyon** (dříve DALL-E Mini)
   - URL: https://www.craiyon.com
   - Velmi jednoduché použití
   - Bezplatné s limity

3. **Stable Diffusion Online**
   - Různé online služby
   - Bezplatné s limity

### Placené (pokud chcete nejlepší kvalitu):
- **DALL-E 3** (OpenAI)
- **Midjourney**
- **Stable Diffusion API** (různé služby)

## 📝 Příklady promptů

Každé téma má specifický, detailní prompt:

- **T01 (Pravěk, Egypt)**: "ancient Egyptian dance scene, hieroglyphic style, pyramids in background..."
- **T05 (Renesance)**: "Renaissance court dance, elegant ballroom, Italian Renaissance architecture..."
- **T10 (Romantismus)**: "romantic ballet, ballerina en pointe, white tutu, moonlit forest scene..."
- **T23 (Čeští choreografové)**: "famous Czech choreographers, Jiří Kylián style, contemporary Czech ballet..."

## 🔧 Alternativní metody

### Metoda A: Lokální generování (pokud máte GPU)
```bash
# 1. Nainstalujte závislosti
pip install diffusers transformers torch accelerate pillow

# 2. Spusťte lokální generátor
python scripts/generate_topic_images_local.py
```

**Výhody:**
- Zcela zdarma
- Žádné limity
- Rychlé s GPU

**Nevýhody:**
- Vyžaduje GPU pro rychlost
- Velké stahování modelu (~5GB)

### Metoda B: API (pokud máte API klíč)
Upravte `scripts/generate_topic_images_simple.py` a přidejte API klíč.

## 📋 Checklist

- [ ] Otevřít `generate_images.html` v prohlížeči
- [ ] Vygenerovat obrázky pro všechna témata (T00-T24)
- [ ] Uložit jako `TXX.png` do `assets/images/topics/`
- [ ] Spustit `python scripts/update_image_paths.py`
- [ ] Ověřit, že obrázky se zobrazují na webu

## 💡 Tipy

1. **Velikost obrázků**: 512x512 nebo 1024x1024 pixelů je ideální
2. **Formát**: PNG s transparentním pozadím (pokud je to možné)
3. **Optimalizace**: Použijte TinyPNG.com pro zmenšení velikosti souborů
4. **Konzistence**: Zkuste použít stejný generátor pro všechna témata

## ❓ Řešení problémů

### Obrázky se nezobrazují
- Zkontrolujte, že soubory jsou v `assets/images/topics/`
- Zkontrolujte názvy souborů (musí být `TXX.png`)
- Spusťte `update_image_paths.py`

### JSON není aktualizován
- Spusťte `python scripts/update_image_paths.py` znovu
- Zkontrolujte, že obrázky existují

### Generování je pomalé
- Použijte rychlejší službu (Craiyon je obvykle rychlý)
- Nebo použijte lokální generování s GPU

## 📞 Další pomoc

Všechny skripty jsou v `scripts/`:
- `generate_topic_images_simple.py` - API generování
- `generate_topic_images_local.py` - Lokální generování
- `generate_topic_images_web.py` - Vytvoří HTML pomocník
- `update_image_paths.py` - Aktualizuje JSON soubory

---

**Doporučení**: Začněte s HTML pomocníkem (`generate_images.html`) - je to nejjednodušší a nejspolehlivější metoda!

