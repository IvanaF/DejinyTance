# AKČNÍ PLÁN: T12 - VÝVOJ BALETU V RUSKU

## 📋 SITUACE

**Téma:** T12 - VÝVOJ BALETU V RUSKU  
**PDF stránky:** 80-84  
**Pořadí:** 12

## ✅ EXISTUJÍCÍ SOUBORY

- ✅ `data/materials/T12_materials.json` - **EXISTUJE** (3 sekce: úvod, PETROHRAD, MOSKVA)
- ✅ `assets/images/topics/T12.svg` - **EXISTUJE** (ikona)
- ✅ `data/quizzes/T12_quiz.json` - **EXISTUJE**
- ✅ `data/summaries/T12_summary.txt` - **EXISTUJE**

## ❌ CHYBĚJÍCÍ SOUBORY

- ❌ `data/topics/T12.json` - **CHYBÍ** (hlavní topic soubor)
- ❌ `data/flashcards/T12_flashcards.json` - **CHYBÍ**
- ❌ `data/resources/T12_resources.json` - **CHYBÍ**
- ❌ `data/term_links/T12_terms.json` - **CHYBÍ**
- ❌ `data/audio_scripts/T12*.txt` - **CHYBÍ** (audio-scénáře)
- ❌ `assets/audio/Otazka-12-*.mp3` - **CHYBÍ** (audio soubory)

---

## 🎯 POSTUP PODLE WORKFLOW

### KROK 0.0: PŘIDÁNÍ DO NAVIGACE ✅

- [x] T12 přidáno do `scripts/topic-loader.js` v poli `topicIds`
- [x] Téma je nyní viditelné v navigaci a na hlavní stránce

**Akce:** ✅ DOKONČENO - T12 je v seznamu: `['T01', 'T02', 'T12']`

### KROK 0: PŘÍPRAVA ✅

- [x] Identifikace tématu: **T12 - VÝVOJ BALETU V RUSKU**
- [x] Kontrola existujících souborů: **DOKONČENO**
- [x] Rozhodnutí: **Scénář B - Doplňování chybějících souborů**

**Akce:** Vytvoř pouze chybějící soubory, existující soubory NEPŘEPISUJ.

---

### KROK 2: VYTVOŘENÍ TOPIC JSON ⚠️ PRIORITA 1

**Soubor:** `data/topics/T12.json`

**Postup:**
1. Otevři `data/topics/_TEMPLATE.json` jako šablonu
2. Vyplň základní informace:
   ```json
   {
     "id": "T12",
     "order": 12,
     "title": "VÝVOJ BALETU V RUSKU",
     "image": "assets/images/topics/T12.svg",
     "objectives": [
       "Pochopit vývoj baletu v Rusku od 17. století",
       "Naučit se o rozdílech mezi petrohradským a moskevským baletem",
       "Rozpoznat klíčové osobnosti ruského baletu (Petipa, Ivanov, Valberg, Didelot)"
     ]
   }
   ```
3. Načti existující soubory a vyplň cesty:
   - `materialsSource`: `"data/materials/T12_materials.json"`
   - `summarySource`: `"data/summaries/T12_summary.txt"`
   - `quizSource`: `"data/quizzes/T12_quiz.json"`
   - `flashcardSource`: `"data/flashcards/T12_flashcards.json"` (bude vytvořeno v Kroku 4)
   - `resourcesSource`: `"data/resources/T12_resources.json"` (bude vytvořeno v Kroku 6)
4. Pro `materials.summary`: Načti obsah z `data/summaries/T12_summary.txt` a vlož do pole `summary`
5. Pro `audio`: Nech prázdné nebo připrav strukturu (bude vyplněno v Kroku 10)

**Kontrola:**
- [ ] JSON je validní
- [ ] Všechny cesty k existujícím souborům jsou správné
- [ ] Objectives jsou relevantní k obsahu

**Reference:** `prompts/topic_generation_workflow.md` - Krok 2

---

### KROK 3: GENEROVÁNÍ AUDIO-SCÉNÁŘE ⚠️ PRIORITA 2

**Soubory:** `data/audio_scripts/T12_part1.txt`, `T12_part2.txt`, `T12_part3.txt`

**Rozhodnutí:** Materiály obsahují 3 logické sekce (úvod, PETROHRAD, MOSKVA) → rozděl na 3 části

**Postup:**
1. Otevři `data/materials/T12_materials.json`
2. Pro každou sekci vytvoř samostatný scénář:
   - **Part 1:** Úvod + PETROHRAD (do části o Petipovi)
   - **Part 2:** Marius Petipa (kompletní sekce)
   - **Part 3:** Lev Ivanov + závěr

3. Pro každý scénář:
   - Převeď odrážky na plynulý text
   - Přidej přirozené přechody
   - Zachovej 100% obsahu
   - Přidej závěrečné shrnutí (3-8 vět)

**Pravidla:**
- ✅ 100% pokrytí obsahu
- ✅ Plynulý text (žádné odrážky)
- ✅ Spisovná čeština, gramaticky správné
- ✅ Délka: 7-12 minut na část (cca 1500-2500 slov)

**Kontrola:**
- [ ] Všechny 3 části jsou vytvořeny
- [ ] 100% pokrytí obsahu (systematická kontrola)
- [ ] Gramatika a pravopis jsou správné
- [ ] Text je vhodný pro TTS (žádné odrážky, emoji, markdown)

**Reference:** `prompts/audioscript.md`

---

### KROK 4: GENEROVÁNÍ FLASHCARDS ⚠️ PRIORITA 3

**Soubor:** `data/flashcards/T12_flashcards.json`

**Postup:**
1. Otevři `data/materials/T12_materials.json`
2. Identifikuj klíčové informace:
   - Data a časové údaje (1673, 1738, 1847, atd.)
   - Osoby (Petipa, Ivanov, Valberg, Didelot, atd.)
   - Pojmy a definice
   - Seznamy (balety, choreografové)
   - Charakteristiky (Petrohrad vs. Moskva)

3. Vytvoř 20-30 kartiček podle typů:
   - 30-40%: Data a časové údaje
   - 20-30%: Pojmy a definice
   - 15-25%: Osoby
   - 15-25%: Seznamy a klasifikace
   - 10-15%: Charakteristiky

**Příklad kartiček:**
- "Kdy byl uveden první dvorský balet v Rusku?"
- "Kdo byl prvním ruským baletním mistrem?"
- "Jaké jsou hlavní rozdíly mezi petrohradským a moskevským baletem?"
- "Které balety vytvořil Marius Petipa?"

**Kontrola:**
- [ ] 20-30 kartiček
- [ ] Všechny odpovědi jsou 100% přítomny v materiálech
- [ ] JSON je validní (escapované uvozovky)
- [ ] Otázky jsou jasné a srozumitelné

**Reference:** `prompts/flashcards.md`

---

### KROK 6: GENEROVÁNÍ RESOURCES ⚠️ PRIORITA 4

**Soubor:** `data/resources/T12_resources.json`

**Postup:**
1. Otevři `data/materials/T12_materials.json`
2. Identifikuj sekce: Úvod, PETROHRAD, MOSKVA
3. Pro každou sekci najdi 3-5 relevantních zdrojů:
   - Oficiální stránky divadel (Mariinské divadlo, Bolshoi Theatre)
   - YouTube videa o ruském baletu, Petipovi, Ivanovovi
   - Odborné články o ruském baletu
   - Muzejní kolekce (pokud existují)
   - Dokumentární videa

4. **POVINNĚ:** Ověř každý URL v prohlížeči před přidáním
5. Vytvoř strukturu podle sekcí z materiálů

**Příklad zdrojů:**
- Mariinské divadlo - oficiální stránka
- Bolshoi Theatre - oficiální stránka
- YouTube - dokumenty o Petipovi
- YouTube - představení Petipových baletů
- Odborné články o ruském baletu

**Kontrola:**
- [ ] Všechny URL jsou funkční (ověřeno v prohlížeči)
- [ ] 3-5 zdrojů na sekci
- [ ] Zdroje souvisí PŘÍMO S TANCEM
- [ ] JSON je validní

**Po vytvoření:**
```bash
python scripts/validate_resource_links.py
```

**Reference:** `prompts/resources.md`

---

### KROK 9: PŘIDÁNÍ HYPERLINKŮ ⚠️ PRIORITA 5

**Soubor:** `data/term_links/T12_terms.json`

**Postup:**
1. Projdi `data/materials/T12_materials.json`
2. Identifikuj důležité termíny:
   - Osobnosti: Marius Petipa, Lev Ivanov, Ivan Valberg, Charles Didelot, atd.
   - Místa: Petrohrad, Moskva, Mariinské divadlo, Bolshoi Theatre
   - Balety: Labutí jezero, Louskáček, Spící krasavice, Giselle, atd.
   - Pojmy: ballet d'action, variace, fouetté

3. Pro každý termín najdi Wikipedia článek:
   - Preferuj českou Wikipedii (`cs.wikipedia.org`)
   - Pokud neexistuje, použij anglickou nebo odkaz odstraň
   - **POVINNĚ:** Ověř funkčnost každého odkazu

4. Přidej všechny varianty termínů (velká/malá písmena, jednotné/množné číslo)

**Kontrola:**
- [ ] Všechny odkazy vedou na existující stránky
- [ ] Všechny varianty termínů jsou zahrnuty
- [ ] JSON je validní

**Reference:** `prompts/hyperlinks.md`

---

### KROK 10: GENEROVÁNÍ AUDIO SOUBORŮ ⚠️ PRIORITA 6

**Příprava:**
```bash
# Ověř, že máš nainstalovaný edge-tts
pip install edge-tts
```

**Spuštění:**
```bash
python scripts/generate_audio.py T12
```

**Co skript dělá:**
1. Najde `data/audio_scripts/T12_part1.txt`, `T12_part2.txt`, `T12_part3.txt`
2. Automaticky vybere hlas (T12 = sudé číslo → mužský hlas: AntoninNeural)
3. Vygeneruje 3 audio soubory:
   - `Otazka-12-vyvoj-baletu-v-rusku-cast-1.mp3`
   - `Otazka-12-vyvoj-baletu-v-rusku-cast-2.mp3`
   - `Otazka-12-vyvoj-baletu-v-rusku-cast-3.mp3`
4. Automaticky aktualizuje `data/topics/T12.json` s novými názvy souborů

**Kontrola:**
- [ ] 3 audio soubory byly vytvořeny v `assets/audio/`
- [ ] Topic JSON byl aktualizován (`audio.files`)
- [ ] Audio přehrává správně v prohlížeči
- [ ] Hlas je mužský (AntoninNeural)

**Reference:** `prompts/audio_generation.md`

---

### KROK 11: FINÁLNÍ AKTUALIZACE TOPIC JSON ⚠️ PRIORITA 7

**Ověř, že `data/topics/T12.json` obsahuje všechny správné cesty:**

- [ ] `materialsSource`: `"data/materials/T12_materials.json"`
- [ ] `summarySource`: `"data/summaries/T12_summary.txt"`
- [ ] `quizSource`: `"data/quizzes/T12_quiz.json"`
- [ ] `flashcardSource`: `"data/flashcards/T12_flashcards.json"`
- [ ] `resourcesSource`: `"data/resources/T12_resources.json"`
- [ ] `audio.files`: 3 soubory s názvy částí
- [ ] `image`: `"assets/images/topics/T12.svg"`

---

### KROK 12: VALIDACE A TESTOVÁNÍ ⚠️ PRIORITA 8

**Validace JSON:**
- [ ] `data/topics/T12.json` - validní JSON
- [ ] `data/flashcards/T12_flashcards.json` - validní JSON
- [ ] `data/resources/T12_resources.json` - validní JSON
- [ ] `data/term_links/T12_terms.json` - validní JSON

**Validace odkazů:**
```bash
python scripts/validate_resource_links.py
```

**Testování na webu:**
1. Spusť lokální server:
   ```bash
   python -m http.server 8000
   ```
2. Otevři `http://localhost:8000`
3. Ověř zobrazení T12:
   - [ ] T12 se zobrazuje v seznamu témat
   - [ ] Detail T12 se načítá správně
   - [ ] Materiály se zobrazují s hyperlinky
   - [ ] Audio přehrává správně (3 části)
   - [ ] Flashcards fungují
   - [ ] Kvíz funguje
   - [ ] Zdroje se zobrazují
   - [ ] Shrnutí se zobrazuje
   - [ ] Ikona se zobrazuje

---

### KROK 13: COMMIT ⚠️ PRIORITA 9

```bash
git add data/topics/T12.json
git add data/flashcards/T12_flashcards.json
git add data/resources/T12_resources.json
git add data/term_links/T12_terms.json
git add data/audio_scripts/T12*.txt
git add assets/audio/Otazka-12-*.mp3

git commit -m "Add topic T12: VÝVOJ BALETU V RUSKU"
```

---

## 📊 SHRNUTÍ PROGRESU

### Vytvořené soubory:
- [ ] `data/topics/T12.json`
- [ ] `data/audio_scripts/T12_part1.txt`
- [ ] `data/audio_scripts/T12_part2.txt`
- [ ] `data/audio_scripts/T12_part3.txt`
- [ ] `data/flashcards/T12_flashcards.json`
- [ ] `data/resources/T12_resources.json`
- [ ] `data/term_links/T12_terms.json`
- [ ] `assets/audio/Otazka-12-*.mp3` (3 soubory)

### Existující soubory (nezměněny):
- ✅ `data/materials/T12_materials.json`
- ✅ `assets/images/topics/T12.svg`
- ✅ `data/quizzes/T12_quiz.json`
- ✅ `data/summaries/T12_summary.txt`

---

## 🎯 DOPORUČENÉ POŘADÍ PRACÍ

1. **Krok 2** - Vytvoř `T12.json` (základní struktura)
2. **Krok 3** - Vytvoř audio-scénáře (3 části)
3. **Krok 4** - Vytvoř flashcards
4. **Krok 6** - Vytvoř resources
5. **Krok 9** - Přidej hyperlinky
6. **Krok 10** - Vygeneruj audio soubory
7. **Krok 11** - Finální aktualizace `T12.json`
8. **Krok 12** - Validace a testování
9. **Krok 13** - Commit

---

**Vytvořeno:** 2025-01-27  
**Status:** READY TO START

