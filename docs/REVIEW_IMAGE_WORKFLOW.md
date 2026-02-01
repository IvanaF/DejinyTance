# Workflow: Generování obrázků do review složky

## 📋 Přehled

Tento workflow umožňuje vygenerovat všechny obrázky najednou do **review složky** pro kontrolu před nahrazením originálů.

## 🚀 Krok 1: Vygenerujte obrázky

### Metoda A: HTML pomocník (Doporučeno)

1. **Otevřete HTML soubor:**
   ```
   assets/images/topics/review/generate_review.html
   ```
   (Otevřete v prohlížeči)

2. **Pro každé téma:**
   - Klikněte na "📋 Kopírovat" u promptu
   - Klikněte na odkaz generátoru (doporučeno: Hugging Face Spaces)
   - Vložte prompt a vygenerujte obrázek
   - **Uložte jako `TXX.png` do `assets/images/topics/review/`**

3. **Tip:** Můžete otevřít více záložek najednou pro rychlejší práci

### Metoda B: Automatické generování (pokud máte GPU)

```bash
# Nainstalujte závislosti
pip install diffusers transformers torch accelerate pillow

# Spusťte generátor
python scripts/generate_all_images_review.py
```

## 👀 Krok 2: Zkontrolujte obrázky

1. **Otevřete review HTML:**
   ```
   assets/images/topics/review/review.html
   ```
   (Vytvoří se automaticky po spuštění generátoru)

2. **Nebo zkontrolujte přímo ve složce:**
   ```
   assets/images/topics/review/
   ```

3. **Zkontrolujte:**
   - Kvalitu obrázků
   - Relevanci k tématu
   - Konzistenci stylu

## ✅ Krok 3: Nahraďte originály (až budete spokojeni)

Po kontrole všech obrázků:

```bash
python scripts/replace_images.py
```

Tento skript:
- ✅ Vytvoří zálohu originálních obrázků do `assets/images/topics/backup/`
- ✅ Zkopíruje obrázky z review do hlavní složky
- ✅ Aktualizuje JSON soubory s novými cestami

## 📁 Struktura složek

```
assets/images/topics/
├── T00.svg          # Původní SVG ikony (zůstanou)
├── T01.svg
├── ...
├── review/          # Nové obrázky pro kontrolu
│   ├── T00.png
│   ├── T01.png
│   ├── ...
│   ├── generate_review.html  # HTML pro generování
│   └── review.html           # HTML pro review
└── backup/          # Záloha originálů (vytvoří se při nahrazení)
    ├── T00.png
    └── ...
```

## 🔄 Pokud chcete přegenerovat některé obrázky

1. Smažte obrázek z `review/` složky
2. Znovu vygenerujte pomocí HTML pomocníka
3. Uložte do `review/` složky
4. Spusťte `replace_images.py` znovu (přepíše jen existující)

## 📝 Poznámky

- **Originální SVG ikony zůstanou nedotčené** - nahradí se jen pokud existuje PNG verze
- **Záloha se vytvoří automaticky** při prvním nahrazení
- **JSON soubory se aktualizují automaticky** při nahrazení
- **Review složka zůstane** - můžete ji smazat po kontrole

## ❓ Řešení problémů

### Obrázky se nezobrazují v review HTML
- Zkontrolujte, že jsou v `assets/images/topics/review/`
- Zkontrolujte názvy souborů (musí být `TXX.png`)

### Chci použít jiný generátor
- HTML obsahuje odkazy na více služeb
- Můžete použít jakýkoli generátor - stačí zkopírovat prompt

### Chci změnit některé prompty
- Editujte `TOPIC_PROMPTS` v `scripts/generate_review_html.py`
- Spusťte skript znovu pro aktualizaci HTML

---

**Doporučení:** Začněte s několika obrázky pro test, pak pokračujte se všemi.

