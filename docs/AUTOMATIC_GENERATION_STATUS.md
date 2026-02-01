# Status automatického generování obrázků

## ⚠️ Aktuální situace

Automatické generování všech obrázků najednou pomocí **bezplatných API služeb není momentálně možné** z následujících důvodů:

1. **Hugging Face API** - Změnili endpointy a vyžadují autentizaci
2. **Replicate API** - Vyžaduje API klíč (i když mají free tier)
3. **Craiyon API** - Změnili API nebo vyžadují autentizaci
4. **Jiné bezplatné služby** - Buď nejsou dostupné nebo mají přísné limity

## ✅ Dostupné řešení

### Možnost 1: Lokální generování (Nejlepší pro automatizaci)

**Výhody:**
- ✅ Plně automatické
- ✅ Žádné limity
- ✅ Zcela zdarma
- ✅ Funguje offline (po stažení modelu)

**Nevýhody:**
- ⚠️ Vyžaduje instalaci (~5-10 GB místa)
- ⚠️ Pomalé na CPU (30-60 sekund na obrázek)
- ⚠️ Rychlé jen s GPU

**Instalace:**
```bash
pip install diffusers transformers torch accelerate pillow
```

**Použití:**
```bash
python scripts/generate_all_images_auto.py
```

**Odhadovaný čas:**
- S GPU: ~15-20 minut pro všech 25 obrázků
- Bez GPU: ~25-40 minut pro všech 25 obrázků

### Možnost 2: HTML pomocník (Nejspolehlivější)

**Výhody:**
- ✅ Funguje vždy
- ✅ Bez instalace
- ✅ Kvalitní výsledky
- ✅ Různé generátory k dispozici

**Nevýhody:**
- ⚠️ Vyžaduje manuální práci
- ⚠️ Trvá déle (závisí na vás)

**Použití:**
1. Otevřete `assets/images/topics/review/generate_review.html`
2. Pro každé téma zkopírujte prompt a vygenerujte
3. Uložte do `assets/images/topics/review/`

**Tip:** Můžete otevřít více záložek najednou pro rychlejší práci.

### Možnost 3: Placené služby (Nejrychlejší)

Pokud máte rozpočet, můžete použít:

- **Replicate API** - ~$0.0025 za obrázek (celkem ~$0.06)
- **OpenAI DALL-E** - ~$0.04 za obrázek (celkem ~$1.00)
- **Stability AI API** - různé ceny

S API klíčem by automatické generování fungovalo.

## 🎯 Doporučení

### Pro rychlé výsledky:
1. **Zkuste lokální generování** (pokud máte GPU nebo čas)
   ```bash
   pip install diffusers transformers torch accelerate pillow
   python scripts/generate_all_images_auto.py
   ```

### Pro nejspolehlivější výsledky:
2. **Použijte HTML pomocník**
   - Otevřete `assets/images/topics/review/generate_review.html`
   - Vygenerujte obrázky postupně
   - Uložte do review složky

### Pro nejlepší kvalitu:
3. **Zvažte placenou službu** (pokud máte rozpočet)
   - Replicate je nejlevnější
   - DALL-E má nejlepší kvalitu

## 📊 Srovnání metod

| Metoda | Rychlost | Cena | Automatizace | Kvalita |
|--------|---------|------|--------------|---------|
| Lokální (GPU) | ⭐⭐⭐⭐⭐ | Zdarma | ✅ Plná | ⭐⭐⭐⭐ |
| Lokální (CPU) | ⭐⭐ | Zdarma | ✅ Plná | ⭐⭐⭐⭐ |
| HTML pomocník | ⭐⭐⭐ | Zdarma | ❌ Manuální | ⭐⭐⭐⭐⭐ |
| Placené API | ⭐⭐⭐⭐⭐ | $0.06-$1 | ✅ Plná | ⭐⭐⭐⭐⭐ |

## 🔮 Budoucí možnosti

Pokud se objeví nové bezplatné API služby, můžeme je přidat do `generate_all_images_auto.py`.

## 💡 Tip

Pokud chcete použít HTML pomocník efektivněji:
1. Otevřete více záložek najednou (např. 5-10)
2. Vygenerujte obrázky paralelně
3. Uložte všechny najednou

---

**Závěr:** Pro plně automatické generování je momentálně nejlepší použít lokální model (pokud máte GPU) nebo zvážit placenou službu.

