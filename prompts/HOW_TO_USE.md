# Jak použít workflow pro generování nové kapitoly

## PŘEHLED

Tento dokument popisuje, jak prakticky použít **`prompts/topic_generation_workflow.md`** (definitivní workflow) k vytvoření nové kapitoly v projektu pomocí AI asistenta (např. Cursor AI, ChatGPT, Claude).

---

## PŘÍPRAVA

### 1. Identifikuj téma

1. Otevři `data/topics/_TOPICS.csv`
2. Najdi téma, které ještě není implementováno
3. Zapiš si:
   - **ID tématu** (např. `T15`)
   - **Pořadí** (např. `15`)
   - **Název tématu** (např. `VÝVOJ BALETU V USA`)
   - **PDF stránky** (např. `92-96`)

### 2. Připrav si PDF materiál

Otevři PDF soubor `Dějiny tance a baletu.pdf` na příslušných stránkách - budeš z něj extrahovat obsah.

### 3. Studuj příklady

Před začátkem si projdi několik existujících kapitol:
- `data/topics/T01.json` - příklad s více sekcemi
- `data/topics/T12.json` - příklad kvalitní struktury
- `data/quizzes/T01_quiz.json` nebo `T03_quiz.json` - příklady kvalitních kvízových otázek

---

## WORKFLOW: KROK ZA KROKEM

### KROK 1: Začátek - připojení promptu a identifikace tématu

**Co udělat:**
1. Otevři konverzaci s AI asistentem (např. v Cursor)
2. Připoj soubor `prompts/topic_generation_workflow.md` (definitivní workflow)
3. Řekni AI:

```
Ahoj! Chci vytvořit novou kapitolu podle standardního workflow.

Téma:
- ID: T15
- Název: VÝVOJ BALETU V USA
- Pořadí: 15
- PDF stránky: 92-96

Postupuj podle prompts/topic_generation_workflow.md.
Začni Krokem 0.0 - Přidání tématu do navigace.
```

**Co AI udělá:**
- Přidá téma do navigace (`scripts/topic-loader.js`)
- Zkontroluje existující soubory
- Vysvětlí další kroky

---

### KROK 2: Vytvoření materials.json

**Co udělat:**
1. Zkopíruj text z PDF na příslušných stránkách
2. Pošli AI:

```
Nyní vytvoř materials.json pro T15.

Zdrojový text z PDF (stránky 92-96):
[přilož zde text z PDF]

Vytvoř soubor data/materials/T15_materials.json podle struktury z T01 nebo T12.
Dodržuj pravidla z topic_generation_workflow.md Krok 1.
```

**Co AI udělá:**
- Vytvoří JSON strukturu s sekcemi
- Zachová formátování (odrážky, nadpisy)
- Ověří validitu JSON

**Kontrola:**
- [ ] JSON je validní
- [ ] Všechny informace z PDF jsou zahrnuty
- [ ] Formátování odpovídá existujícím kapitolám

---

### KROK 3: Vytvoření topic.json

**Co udělat:**
Pošli AI:

```
Vytvoř základní topic.json pro T15.

Použij jako referenci data/topics/T12.json nebo T13.json.
Název: VÝVOJ BALETU V USA
Pořadí: 15
ID: T15

Vytvoř 3-5 cílů učení na základě obsahu z materials.json.
Ostatní cesty budou vyplněny později.
```

**Co AI udělá:**
- Vytvoří `data/topics/T15.json`
- Vyplní základní metadata
- Vytvoří relevantní cíle učení

---

### KROK 4: Generování audio-scénáře

**Co udělat:**
Pošli AI:

```
Vytvoř audio-scénář pro T15.

Použij obsah z data/materials/T15_materials.json.
Postupuj podle prompts/audioscript.md.

Požadavky:
- 100% pokrytí obsahu
- Plynulý text (žádné odrážky)
- Závěr s shrnutím (3-8 vět)
- Délka: 7-12 minut (cca 1500-2500 slov)
```

**Co AI udělá:**
- Vytvoří `data/audio_scripts/T15.txt`
- Převede materiály na plynulý text vhodný pro TTS
- Přidá závěrečné shrnutí

---

### KROK 5: Generování flashcards

**Co udělat:**
Pošli AI:

```
Vytvoř flashcards pro T15.

Použij obsah z data/materials/T15_materials.json.
Postupuj podle prompts/flashcards.md.
Studuj příklady z data/flashcards/T01_flashcards.json.

Požadavky:
- 15-35 kartiček
- POUZE fakta z materiálů (žádné doplňování)
- Různé typy: data, osoby, pojmy, seznamy
```

**Co AI udělá:**
- Vytvoří `data/flashcards/T15_flashcards.json`
- Vytvoří 15-35 kvalitních kartiček
- Ověří, že všechny odpovědi jsou v materiálech

---

### KROK 6: Generování kvízových otázek

**⚠️ KRITICKÝ KROK - vyžaduje pečlivou kontrolu**

**Co udělat:**
1. Nejdřív pošli AI:

```
Před vytvářením kvízových otázek si přečti:
- prompts/quiz_questions.md
- data/quizzes/T01_quiz.json (jako příklad)
- data/quizzes/T03_quiz.json (jako příklad)

Pochopil jsi pravidla pro kvalitní otázky?
```

2. Pak pošli:

```
Vytvoř kvízové otázky pro T15.

Použij obsah z data/materials/T15_materials.json.
Postupuj podle prompts/quiz_questions.md.

KRITICKÉ POŽADAVKY:
- 30-50 otázek (doporučeno)
- Jasně formulované otázky (ne neúplné)
- Úplné správné odpovědi (NE opakují otázku)
- Věrohodné distraktory (skutečné fakta, NE "Nelze určit")
- Před uložením zkontroluj všechny otázky

Použij příklady z T01, T03, T12 jako referenci kvality.
```

**Co AI udělá:**
- Vytvoří `data/quizzes/T15_quiz.json`
- Vytvoří 30-50 kvalitních otázek
- Zkontroluje kvalitu podle kritérií

**⚠️ POVINNÁ KONTROLA TEBOU:**
- [ ] Projdi každou otázku - je jasně formulovaná?
- [ ] Ověř distraktory - jsou všechny věrohodné?
- [ ] Ověř, že odpovědi neopakují otázku
- [ ] Ověř JSON validitu

---

### KROK 7: Generování resources

**Co udělat:**
Pošli AI:

```
Vytvoř resources pro T15.

Postupuj podle prompts/resources.md.

Požadavky:
- 2-6 zdrojů na sekci
- Konkrétní funkční odkazy (NE obecné stránky)
- Preferuj Českou televizi a rozhlas
- Témata: VÝVOJ BALETU V USA

Vytvoř seznam kandidátů, ale NE přidávej odkazy, které jsi neověřil!
```

**Co AI udělá:**
- Vytvoří návrh `data/resources/T15_resources.json`
- Navrhne relevantní zdroje

**⚠️ POVINNÁ KONTROLA TEBOU:**
- [ ] Otevři každý URL v prohlížeči - funguje?
- [ ] Video/audio odkazy - lze přehrát?
- [ ] Odstraň nefunkční odkazy
- [ ] Spusť validační skript: `python scripts/validate_resource_links.py`

---

### KROK 8: Generování shrnutí

**Co udělat:**
Pošli AI:

```
Vytvoř shrnutí pro T15.

Použij obsah z data/materials/T15_materials.json.
Postupuj podle topic_generation_workflow.md Krok 7.

Požadavky:
- 1-2 odstavce (200-400 slov)
- Plynulý text (žádné odrážky)
- Klíčové termíny, jména, data
- Shrnutí neobsahuje číslo tématu
```

**Co AI udělá:**
- Vytvoří `data/summaries/T15_summary.txt`
- Vytvoří souhrn kapitoly

---

### KROK 9: Generování topic ikony

**Co udělat:**
1. Zkontroluj `prompts/topicsymbols.md` - je tam definovaný symbol pro T15?
2. Pokud ano, pošli AI:

```
Vygeneruj SVG ikonu pro T15.

Symbol: [symbol z topicsymbols.md]
Použij skript scripts/generate_topic_icons.py nebo vytvoř SVG podle specifikace.
```

**Co AI udělá:**
- Vytvoří nebo spustí generátor ikon
- Vytvoří `assets/images/topics/T15.svg`

**Alternativně:** Spusť ručně:
```bash
python scripts/generate_topic_icons.py
```

---

### KROK 10: Přidání hyperlinků (term links)

**Co udělat:**
Pošli AI:

```
Vytvoř term links pro T15.

Projdi text v data/materials/T15_materials.json.
Identifikuj důležité termíny pro prolinkování:
- Historické osobnosti
- Geografické pojmy
- Kulturní pojmy
- Umělecké pojmy

Vytvoř data/term_links/T15_terms.json podle prompts/hyperlinks.md.

⚠️ DŮLEŽITÉ: Tento krok NESMÍ být přeskočen!
```

**Co AI udělá:**
- Vytvoří `data/term_links/T15_terms.json`
- Identifikuje klíčové termíny
- Vytvoří odkazy na Wikipedia

**⚠️ POVINNÁ KONTROLA:**
- [ ] Otevři odkazy - vedou na správné stránky?
- [ ] Ověř, že všechny varianty termínů jsou zahrnuty

---

### KROK 11: Generování audio souborů

**Co udělat:**
1. Spusť skript ručně (AI nemůže spouštět skripty generující audio):

```bash
python scripts/generate_audio.py T15
```

**Co se stane:**
- Skript najde `data/audio_scripts/T15.txt`
- Vygeneruje audio soubory
- Automaticky aktualizuje `data/topics/T15.json`

**Kontrola:**
- [ ] Audio soubory byly vytvořeny v `assets/audio/`
- [ ] `topic.json` byl aktualizován
- [ ] Audio přehrává správně

---

### KROK 12: Finální aktualizace topic.json

**Co udělat:**
Pošli AI:

```
Aktualizuj data/topics/T15.json.

Zkontroluj a aktualizuj:
1. materials.summary - zkopíruj z T15_summary.txt
2. audio.files - zkontroluj názvy (měly by být smysluplné)
3. Všechny cesty k souborům

Ověř, že všechny soubory existují.
```

**Co AI udělá:**
- Aktualizuje `topic.json` se správnými cestami
- Zkontroluje, že všechny soubory existují

---

### KROK 13: Validace a testování

**Co udělat:**
1. Spusť validační skript:

```bash
python scripts/validate_resource_links.py
```

2. Spusť lokální server:

```bash
python -m http.server 8000
```

3. Otevři `http://localhost:8000` a otestuj:
   - [ ] Téma se zobrazuje v seznamu
   - [ ] Materiály se zobrazují s hyperlinky
   - [ ] Audio přehrává
   - [ ] Flashcards fungují
   - [ ] Kvíz funguje
   - [ ] Zdroje se zobrazují

4. Pošli AI:

```
Projdi validaci T15 podle topic_generation_workflow.md Krok 12.

Zkontroluj:
- Validitu všech JSON souborů
- Kvalitu kvízových otázek
- Kvalitu obsahu (100% pokrytí)
- Existenci všech souborů
```

---

### KROK 14: Dokumentace a commit

**Co udělat:**
1. Commitni změny:

```bash
git add scripts/topic-loader.js
git add data/topics/T15.json
git add data/materials/T15_materials.json
git add data/audio_scripts/T15.txt
git add data/flashcards/T15_flashcards.json
git add data/quizzes/T15_quiz.json
git add data/resources/T15_resources.json
git add data/summaries/T15_summary.txt
git add data/term_links/T15_terms.json
git add assets/images/topics/T15.svg
git add assets/audio/Otazka-15-*.mp3

git commit -m "Add topic T15: VÝVOJ BALETU V USA"
```

---

## DOPORUČENÝ WORKFLOW S AI

### Varianta 1: Postupné vytváření (doporučeno)

1. **Začni jednou zprávou:**
   ```
   Chci vytvořit kapitolu T15 podle standardního workflow.
   Připojil jsem prompts/topic_generation_workflow.md.
   
   Začni Krokem 0.0 - přidání do navigace a kontrola existujících souborů.
   ```

2. **Postupuj krok za krokem:**
   - Po dokončení každého kroku požádej AI o další krok
   - Kontroluj každý vytvořený soubor
   - Nech AI vytvořit soubor, pak ho zkontroluj, pak pokračuj

3. **Pro kvízové otázky:** Požádej AI o kontrolu kvality před uložením

### Varianta 2: Vytvoření více souborů najednou

```
Vytvoř pro T15 najednou:
1. materials.json
2. topic.json (základní struktura)
3. audio-scénář
4. flashcards
5. shrnutí

Postupuj podle standardního workflow.
```

**Poznámka:** Tato varianta je rychlejší, ale vyžaduje více kontroly najednou.

---

## DŮLEŽITÉ TIPY

### ✅ Co dělat:

1. **Připojuj vždy relevantní prompty** - AI potřebuje kontext
2. **Kontroluj každý soubor** - AI může udělat chyby
3. **Studuj příklady** - ukazuj AI existující kapitoly jako referenci
4. **Postupuj systematicky** - krok za krokem podle workflow
5. **Validuj JSON** - vždy ověř validitu před uložením

### ❌ Co nedělat:

1. **Nepřeskakuj kroky** - workflow má svůj řád
2. **Nevytvářej kvízové otázky bez kontroly** - kritický krok
3. **Nepřidávej neověřené odkazy** - všechny odkazy musí fungovat
4. **Nezapomínej na term links** - povinný krok
5. **Nezapomínej aktualizovat navigaci** - téma nebude viditelné

---

## TROUBLESHOOTING

### AI vytvořil nevalidní JSON
```
JSON není validní. Oprav podle příkladu z [T01 nebo T12].
```

### Kvízové otázky jsou nekvalitní
```
Kvízové otázky nesplňují kritéria. Přepiš podle prompts/quiz_questions.md.
Použij T01, T03 jako referenci kvality.
```

### Chybí nějaký soubor
```
Zkontroluj, zda všechny povinné soubory byly vytvořeny podle standardní struktury.
Viz prompts/topic_generation_workflow.md - sekce "STANDARDNÍ STRUKTURA KAPITOLY".
```

### Odkazy nefungují
```
Spusť validační skript: python scripts/validate_resource_links.py
Odstraň nefunkční odkazy z resources.json.
```

---

## ZÁVĚR

Tento workflow je navržen pro použití s AI asistentem. Klíčové je:
- ✅ Postupovat systematicky krok za krokem
- ✅ Kontrolovat každý vytvořený soubor
- ✅ Odkazovat na existující příklady
- ✅ Dodržovat pravidla z promptů

**Pro úspěšné vytvoření kapitoly potřebuješ:**
- PDF materiál
- Přístup k AI asistentovi
- Základní znalost JSON formátu
- Schopnost otestovat funkčnost na webu

**Doba vytvoření:** 2-4 hodiny (v závislosti na délce kapitoly a kvalitě kontroly)

---

**Poslední aktualizace:** 2025-01-27

