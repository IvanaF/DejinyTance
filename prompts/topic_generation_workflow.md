# WORKFLOW: Generování nové kapitoly (Topic Page)

## PŘEHLED

Tento dokument popisuje kompletní postup pro vytvoření nové kapitoly v projektu Dějiny tance a baletu. Workflow kombinuje všechny specializované prompty z `prompts/` složky do jednoho systematického procesu.

**⚠️ DŮLEŽITÉ:** Tento dokument je pouze PLÁN/PROMPT. Nevykonávej žádné kroky, dokud nebude workflow schválen a zkontrolován.

---

## KROK 0: PŘÍPRAVA A IDENTIFIKACE TÉMATU

### 0.1 Identifikace tématu
1. Otevři `data/topics/_TOPICS.csv`
2. Najdi další téma, které ještě není implementováno
3. Zapiš si:
   - **ID tématu** (např. `T03`)
   - **Pořadí** (např. `3`)
   - **Název tématu** (např. `ANTIKA (Řecko, Řím)`)
   - **PDF stránky** (např. `20-27`)

### 0.0 Přidání tématu do navigace (POVINNÉ - na začátku)

**⚠️ DŮLEŽITÉ:** Tento krok musí být proveden **PŘED** vytvářením souborů, aby bylo téma viditelné v navigaci a na hlavní stránce.

**Soubor:** `scripts/topic-loader.js`

**Postup:**
1. Otevři `scripts/topic-loader.js`
2. Najdi funkci `loadAllTopics()` (kolem řádku 16-19)
3. Najdi řádek s `const topicIds = [...]`
4. Přidej ID nového tématu do pole:
   ```javascript
   const topicIds = ['T01', 'T02', 'T12', 'TXX']; // List of available topics
   ```
   Kde `TXX` je ID nového tématu (např. `T03`, `T04`, atd.)

**Příklad:**
```javascript
// Před:
const topicIds = ['T01', 'T02', 'T12'];

// Po přidání T03:
const topicIds = ['T01', 'T02', 'T12', 'T03'];
```

**Kontrola:**
- [ ] ID tématu bylo přidáno do pole `topicIds`
- [ ] Pole je seřazeno podle pořadí témat (volitelné, ale doporučené)
- [ ] Syntaxe JavaScript je správná (čárky, uvozovky)

**Poznámka:** Témata se automaticky načítají a zobrazují v:
- Postranním panelu (desktop sidebar)
- Mobilním menu
- Seznamu témat na hlavní stránce (`index.html`)

**⚠️ BEZ tohoto kroku nebude nové téma viditelné v navigaci, i když všechny soubory budou vytvořeny!**

### 0.2 Kontrola existujících souborů

**Ověř existenci všech souborů pro dané téma:**

| Soubor | Cesta | Status |
|--------|-------|--------|
| Topic JSON | `data/topics/TXX.json` | ☐ Existuje / ☐ Neexistuje |
| Materiály | `data/materials/TXX_materials.json` | ☐ Existuje / ☐ Neexistuje |
| Audio-scénáře | `data/audio_scripts/TXX.txt` nebo `TXX_part*.txt` | ☐ Existuje / ☐ Neexistuje |
| Flashcards | `data/flashcards/TXX_flashcards.json` | ☐ Existuje / ☐ Neexistuje |
| Kvíz | `data/quizzes/TXX_quiz.json` | ☐ Existuje / ☐ Neexistuje |
| Resources | `data/resources/TXX_resources.json` | ☐ Existuje / ☐ Neexistuje |
| Shrnutí | `data/summaries/TXX_summary.txt` | ☐ Existuje / ☐ Neexistuje |
| Termíny | `data/term_links/TXX_terms.json` | ☐ Existuje / ☐ Neexistuje |
| Ikona | `assets/images/topics/TXX.svg` | ☐ Existuje / ☐ Neexistuje |
| Audio | `assets/audio/Otazka-X-*.mp3` | ☐ Existuje / ☐ Neexistuje |

### 0.3 Postup, když soubory už existují

**Pokud některé soubory už existují, rozhodni se podle situace:**

#### Scénář A: Kompletní přepracování kapitoly
- **Kdy:** Chceš kompletně přepsat/opravit celou kapitolu
- **Postup:**
  1. **ZÁLOHUJ** existující soubory (zkopíruj do `_backup/` nebo přejmenuj s příponou `.old`)
  2. Pokračuj podle workflow od **Kroku 1** - všechny soubory budou přepsány
  3. Po dokončení porovnej nové a staré verze, zkontroluj, že nic důležitého nechybí

#### Scénář B: Doplňování chybějících souborů
- **Kdy:** Některé soubory existují, některé chybí
- **Postup:**
  1. **NEZASAHUJ** do existujících souborů (pokud nejsou chybné)
  2. Pokračuj pouze u **chybějících souborů** podle příslušných kroků workflow
  3. Příklad: Pokud existuje `materials.json` a `topic.json`, ale chybí `flashcards.json`, vytvoř pouze flashcards

#### Scénář C: Oprava konkrétního souboru
- **Kdy:** Chceš opravit/aktualizovat pouze jeden konkrétní soubor
- **Postup:**
  1. **ZÁLOHUJ** soubor, který budeš opravovat
  2. Přejdi přímo na příslušný krok workflow (např. Krok 4 pro flashcards)
  3. Aktualizuj pouze tento soubor podle pravidel z příslušného promptu

#### Scénář D: Aktualizace topic.json (cesty k souborům)
- **Kdy:** Přidal jsi nové soubory a potřebuješ aktualizovat cesty v `topic.json`
- **Postup:**
  1. Otevři `data/topics/TXX.json`
  2. Aktualizuj pouze příslušné cesty (např. `flashcardSource`, `quizSource`)
  3. Ověř, že všechny cesty jsou správné a soubory existují

#### Scénář E: Validace a kontrola existujících souborů
- **Kdy:** Chceš zkontrolovat kvalitu existujících souborů
- **Postup:**
  1. Projdi každý existující soubor podle příslušného promptu
  2. Zkontroluj:
     - Formát (validní JSON, správná struktura)
     - Obsah (100% pokrytí, gramatika, kvalita)
     - Funkčnost (odkazy fungují, audio přehrává)
  3. Oprav chyby, pokud jsou nalezeny

### 0.4 Matice rozhodování

**Použij tuto matici pro rychlé rozhodnutí:**

| Situace | Existující soubory | Akce |
|---------|-------------------|------|
| Nová kapitola | Žádné | Pokračuj od **Kroku 1** |
| Doplňování | Některé (např. materials, topic) | Vytvoř pouze **chybějící** soubory |
| Přepracování | Všechny | **ZÁLOHUJ** → Pokračuj od **Kroku 1** |
| Oprava | Jeden konkrétní | **ZÁLOHUJ** → Přejdi na **příslušný krok** |
| Validace | Všechny | Projdi **Krok 12** (validace) |

### 0.5 Zálohování (POVINNÉ před přepsáním)

**Před přepsáním existujících souborů VŽDY vytvoř zálohu:**

```bash
# Vytvoř zálohovací složku
mkdir -p _backup/TXX_$(date +%Y%m%d)

# Zkopíruj existující soubory
cp data/topics/TXX.json _backup/TXX_$(date +%Y%m%d)/
cp data/materials/TXX_materials.json _backup/TXX_$(date +%Y%m%d)/
# ... další soubory
```

**Nebo použij Git:**
```bash
# Vytvoř novou branch pro změny
git checkout -b update/TXX

# Nebo commit před změnami
git add .
git commit -m "Backup before updating TXX"
```

---

## KROK 1: VYTVOŘENÍ MATERIÁLŮ (materials.json)

**⚠️ Pokud soubor už existuje:**
- **ZÁLOHUJ** existující soubor před přepsáním (viz Krok 0.5)
- Pokud existující soubor je správný a kompletní, **PŘESKOČ** tento krok
- Pokud potřebuješ opravit/aktualizovat, pokračuj podle tohoto kroku

### 1.1 Extrakce obsahu
**Zdroj:** PDF soubor `Dějiny tance a baletu.pdf`, stránky podle `_TOPICS.csv`

**Postup:**
1. Otevři PDF na příslušných stránkách
2. Extrahuj veškerý text kapitoly
3. Zachovej strukturu (nadpisy sekcí, odrážky, seznamy)

### 1.2 Vytvoření JSON souboru
**Soubor:** `data/materials/TXX_materials.json`

**Struktura:**
```json
{
  "sections": [
    {
      "heading": "NÁZEV SEKCE",
      "content": "Obsah sekce s odrážkami a textem.\n\n- odrážka 1\n- odrážka 2\n\nDalší odstavec..."
    }
  ]
}
```

**Pravidla:**
- Každá logická sekce = jeden objekt v `sections`
- `heading` = název sekce (VELKÁ PÍSMENA, pokud je v originále)
- **⚠️ DŮLEŽITÉ:** `heading` NESMÍ obsahovat číslo tématu (např. "12.)" nebo "T12 -"). Použij pouze název sekce (např. "VÝVOJ BALETU V RUSKU", ne "12.) VÝVOJ BALETU V RUSKU")
- `content` = celý obsah sekce (zachovej odrážky, odstavce, formátování)
- Použij `\n` pro nové řádky
- Zachovej všechny informace (data, jména, pojmy, seznamy)

**Kontrola:**
- [ ] Všechny sekce z PDF jsou zahrnuty
- [ ] Všechna data, jména, pojmy jsou zachována
- [ ] JSON je validní (ověř pomocí JSON validátoru)
- [ ] Formátování odpovídá struktuře (sections → heading + content)

---

## KROK 2: VYTVOŘENÍ TOPIC JSON (topic.json)

**⚠️ Pokud soubor už existuje:**
- **ZÁLOHUJ** existující soubor před přepsáním
- Pokud aktualizuješ pouze cesty k souborům, uprav pouze příslušná pole
- Pokud přepisuješ celý soubor, použij existující jako referenci pro správné hodnoty

### 2.1 Použití šablony
**Zdroj:** `data/topics/_TEMPLATE.json`

**Soubor:** `data/topics/TXX.json`

### 2.2 Vyplnění základních informací
```json
{
  "id": "TXX",                    // ID tématu (např. "T03")
  "order": X,                      // Pořadí z _TOPICS.csv
  "title": "NÁZEV TÉMATU",        // Název z _TOPICS.csv
  "image": "assets/images/topics/TXX.svg",  // Bude vygenerováno v Kroku 9
  "objectives": [                  // 3-5 cílů učení (vytvoř na základě obsahu)
    "Cíl 1",
    "Cíl 2",
    "Cíl 3"
  ],
  "materials": {
    "summary": "..."               // Bude vygenerováno v Kroku 7
  },
  "audio": {                       // Bude vyplněno v Kroku 5 a 12
    "title": "Otázka X - NÁZEV",
    "src": "assets/audio/...",
    "transcript": "...",
    "files": [...]
  },
  "resourcesSource": "data/resources/TXX_resources.json",
  "flashcardSource": "data/flashcards/TXX_flashcards.json",
  "mindmap": {
    "description": "...",          // Volitelné
    "image": "assets/images/mindmaps/TXX.png"  // Volitelné
  },
  "materialsSource": "data/materials/TXX_materials.json",
  "summarySource": "data/summaries/TXX_summary.txt",
  "quizSource": "data/quizzes/TXX_quiz.json"
}
```

**Pravidla:**
- `objectives`: Vytvoř 3-5 cílů učení na základě obsahu kapitoly
- `image`: Cesta k SVG ikoně (bude vygenerována v Kroku 9)
- Ostatní cesty budou vyplněny v dalších krocích

**Kontrola:**
- [ ] ID a order odpovídají `_TOPICS.csv`
- [ ] Název je přesně z `_TOPICS.csv`
- [ ] Objectives jsou relevantní k obsahu
- [ ] JSON je validní

---

## KROK 3: GENEROVÁNÍ AUDIO-SCÉNÁŘE

**Prompt:** `prompts/audioscript.md`

**⚠️ Pokud soubory už existují:**
- **ZÁLOHUJ** existující scénáře před přepsáním
- Pokud existující scénáře jsou správné a kompletní, **PŘESKOČ** tento krok
- Pokud potřebuješ opravit/aktualizovat, pokračuj podle tohoto kroku

### 3.1 Analýza materiálů
1. Otevři `data/materials/TXX_materials.json`
2. Identifikuj logické sekce (země, regiony, období, témata)
3. Rozhodni, zda rozdělit na části:
   - **VÍCE ČÁSTÍ:** Pokud materiály obsahují logicky oddělené sekce (např. různé země, regiony, období)
   - **JEDNA ČÁST:** Pokud je téma ucelené a nelze logicky rozdělit

### 3.2 Vytvoření scénáře
**Pro více částí:**
- `data/audio_scripts/TXX_part1.txt` (první logická sekce)
- `data/audio_scripts/TXX_part2.txt` (druhá logická sekce)
- `data/audio_scripts/TXX_part3.txt` (třetí logická sekce)
- ...

**Pro jednu část:**
- `data/audio_scripts/TXX.txt` (celé téma)

**Pravidla (viz `prompts/audioscript.md`):**
- ✅ **100% pokrytí obsahu** - všechny body z materiálů musí být zahrnuty
- ✅ **Plynulý text** - žádné odrážky, pouze souvislé věty
- ✅ **Spisovná čeština** - gramaticky správná, bez chyb
- ✅ **Přirozené přechody** - "Nyní se zaměříme na...", "Dalším tématem je..."
- ✅ **Závěr s shrnutím** - "Závěrem si připomeňme, co jsme v této části probrali..." (3-8 vět)
- ✅ **Délka:** 7-12 minut na část (cca 1500-2500 slov)

**Systematická kontrola (POVINNÁ):**
- [ ] Projdi každou sekci materiálů a ověř 100% pokrytí
- [ ] Zkontroluj všechna data, jména, místa, díla
- [ ] Ověř gramatiku a pravopis (všechny chyby opraveny)
- [ ] Zkontroluj formát (žádné odrážky, emoji, markdown)
- [ ] Ověř závěrečné shrnutí (3-8 vět, pouze obsah dané části)

**Kontrola kvality:**
- [ ] Text je plynulý a přirozený
- [ ] Všechny informace jsou zahrnuty (100% pokrytí)
- [ ] Text je gramaticky správný
- [ ] Vhodný pro TTS (žádné odrážky, emoji, markdown)
- [ ] Délka je vhodná (7-12 minut na část)

---

## KROK 4: GENEROVÁNÍ FLASHCARDS

**Prompt:** `prompts/flashcards.md`

**⚠️ Pokud soubor už existuje:**
- **ZÁLOHUJ** existující soubor před přepsáním
- Pokud existující flashcards jsou správné a kompletní, **PŘESKOČ** tento krok
- Pokud potřebuješ přidat/opravit kartičky, můžeš upravit existující soubor nebo přepsat celý

### 4.1 Vytvoření flashcards
**Soubor:** `data/flashcards/TXX_flashcards.json`

**Struktura:**
```json
{
  "flashcards": [
    {
      "q": "Text otázky?",
      "a": "Text odpovědi."
    }
  ]
}
```

**Pravidla (viz `prompts/flashcards.md`):**
- ✅ **POUZE fakta z materiálů** - žádné doplňování nebo vyvozování
- ✅ **15-35 kartiček** na kapitolu (podle hustoty obsahu)
- ✅ **Jeden fakt na kartičku** (nebo těsně související fakta)
- ✅ **Čeština, faktický styl** - vhodné pro zkoušky
- ✅ **Validní JSON formát** - správná struktura, escapované uvozovky (`\"`)

**Typy kartiček:**
- 30-40%: Data a časové údaje
- 20-30%: Pojmy a definice
- 15-25%: Osoby
- 15-25%: Seznamy a klasifikace
- 10-15%: Charakteristiky a popisy

**Kontrola:**
- [ ] Všechny odpovědi jsou 100% přítomny v materiálech
- [ ] 15-35 kartiček
- [ ] JSON je validní (escapované uvozovky)
- [ ] Otázky jsou jasné a srozumitelné
- [ ] Odpovědi jsou úplné a přesné

---

## KROK 5: GENEROVÁNÍ KVIZOVÝCH OTÁZEK

**Prompt:** `prompts/quiz_questions.md`

**⚠️ Pokud soubor už existuje:**
- **ZÁLOHUJ** existující soubor před přepsáním
- Pokud existující otázky jsou kvalitní a kompletní, **PŘESKOČ** tento krok
- Pokud potřebuješ přidat/opravit otázky, můžeš upravit existující soubor nebo přepsat celý

### 5.1 Vytvoření kvízových otázek
**Soubor:** `data/quizzes/TXX_quiz.json`

**Struktura:**
```json
{
  "questions": [
    {
      "question": "Kvalitně formulovaná otázka v češtině",
      "answers": [
        "Správná odpověď (úplná a přesná)",
        "Chybná odpověď (ale věrohodná)",
        "Chybná odpověď (ale věrohodná)",
        "Chybná odpověď (ale věrohodná)"
      ],
      "correct": 0
    }
  ]
}
```

**Pravidla (viz `prompts/quiz_questions.md`):**
- ✅ **20-75 otázek** na kapitolu (doporučeno 30-50)
- ✅ **Kvalitní formulace** - jasné, srozumitelné otázky
- ✅ **Věrohodné distraktory** - nesprávné odpovědi musí být logické
- ✅ **Úplné správné odpovědi** - obsahují všechny relevantní informace
- ✅ **Stručné odpovědi bez opakování otázky** - odpovědi NESMÍ opakovat část otázky (např. pokud otázka zní "Kdy byl uveden první balet?", odpověď by měla být "1673, Orfeus a Eurydika", ne "V roce 1673 byl uveden první balet v Rusku, a to Orfeus a Eurydika")

**Typy otázek:**
- Letopočty a období
- Osoby (choreografové, tanečníci, umělci)
- Pojmy a definice
- Místa a geografie
- Charakteristiky období a stylů
- Důležité události
- Díla a jejich autoři
- Technické termíny

**Kontrola:**
- [ ] Všechny otázky jsou **jasně formulované** (ne neúplné nebo nesmyslné)
- [ ] **Otázky NESMÍ obsahovat číslo tématu** (např. "12.)" nebo "T12 -")
- [ ] Správné odpovědi jsou **úplné a přesné** (ne zkrácené nebo neúplné)
- [ ] **Odpovědi NESMÍ opakovat část otázky** - odpovědi musí být stručné a neobsahovat redundantní opakování (např. pokud otázka zní "Kdy byl uveden první balet?", odpověď "1673, Orfeus a Eurydika" je správně, ale "V roce 1673 byl uveden první balet v Rusku, a to Orfeus a Eurydika" je špatně)
- [ ] Nesprávné odpovědi jsou **věrohodné** (ne zjevně špatné jako "Nelze určit" nebo "Informace nejsou k dispozici")
- [ ] **Kvalita otázek odpovídá standardu** - viz příklady v `data/quizzes/T01_quiz.json` a `data/quizzes/T12_quiz.json`
- [ ] 20-75 otázek (doporučeno 30-50)
- [ ] JSON je validní

---

## KROK 6: GENEROVÁNÍ ZDROJŮ (resources)

**Prompt:** `prompts/resources.md`

**⚠️ Pokud soubor už existuje:**
- **ZÁLOHUJ** existující soubor před přepsáním
- **POVINNĚ** spusť validační skript pro kontrolu funkčnosti odkazů
- Pokud existující zdroje jsou funkční a relevantní, můžeš je doplnit nebo **PŘESKOČ** tento krok
- Pokud potřebuješ přidat/opravit zdroje, můžeš upravit existující soubor

### 6.1 Vytvoření resources
**Soubor:** `data/resources/TXX_resources.json`

**Struktura:**
```json
{
  "sections": [
    {
      "heading": "Název sekce (např. Řecko)",
      "resources": [
        {
          "title": "Název zdroje",
          "platform": "Platforma nebo instituce",
          "url": "https://konkretni-url.cz/sekce",
          "explanation": "Vysvětlení, proč je tento zdroj relevantní a užitečný pro dané téma."
        }
      ]
    }
  ]
}
```

**Pravidla (viz `prompts/resources.md`):**
- ✅ **KONKRÉTNÍ odkazy** - ne obecné stránky
- ✅ **RELEVANTNÍ k obsahu** - přímo souvisí s tématem kapitoly
- ✅ **FUNKČNÍ URL** - POVINNĚ ověř každý URL v prohlížeči před přidáním
- ✅ **2-6 zdrojů na sekci** (podle hustoty tématu)
- ✅ **Čeština** - všechny popisy v češtině

**Typy zdrojů:**
- Oficiální kulturní portály (konkrétní sekce)
- Muzea a galerie (konkrétní kolekce)
- Dokumentární videa (YouTube - konkrétní videa)
- Vědecké publikace (konkrétní články)
- Národní rozhlas/televize (konkrétní pořady)
- Odborné taneční časopisy (konkrétní články)
- Ministerstvo kultury (konkrétní stránky)
- Odborné instituce (konkrétní stránky)

**⚠️ KRITICKÉ: VALIDACE ODKAZŮ**
1. **PŘED přidáním:** Otevři každý URL v prohlížeči a ověř, že stránka existuje
2. **PO vytvoření souboru:** Spusť validační skript:
   ```bash
   python scripts/validate_resource_links.py
   ```
3. Skript automaticky odstraní nefunkční odkazy (404, 403, connection errors, timeouts)

**Kontrola:**
- [ ] Všechny URL jsou funkční (ověřeno v prohlížeči)
- [ ] Validační skript byl spuštěn
- [ ] Všechny URL jsou konkrétní (ne obecné stránky)
- [ ] Zdroje souvisí PŘÍMO S TANCEM
- [ ] 2-6 zdrojů na sekci
- [ ] JSON je validní

---

## KROK 7: GENEROVÁNÍ SHRNUTÍ (summary)

**⚠️ Pokud soubor už existuje:**
- **ZÁLOHUJ** existující soubor před přepsáním
- Pokud existující shrnutí je správné a kompletní, **PŘESKOČ** tento krok
- Pokud potřebuješ opravit/aktualizovat, pokračuj podle tohoto kroku

### 7.1 Vytvoření shrnutí
**Soubor:** `data/summaries/TXX_summary.txt`

**Postup:**
1. Přečti si celý obsah `data/materials/TXX_materials.json`
2. Vytvoř 1-2 odstavce shrnutí (cca 200-400 slov)
3. Zachovej klíčové informace a souvislosti
4. Použij spisovnou češtinu

**Formát:**
- Čistý text (ne JSON, ne markdown)
- 1-2 odstavce
- Zachovej klíčové termíny, jména, data
- Plynulý text (žádné odrážky)
- **⚠️ DŮLEŽITÉ:** Shrnutí NESMÍ obsahovat číslo tématu (např. "12.)" nebo "T12 -"). Začni přímo obsahem.

**Kontrola:**
- [ ] Shrnutí pokrývá hlavní témata kapitoly
- [ ] 1-2 odstavce (200-400 slov)
- [ ] Spisovná čeština, gramaticky správné
- [ ] Klíčové informace jsou zahrnuty
- [ ] **Shrnutí neobsahuje číslo tématu**

---

## KROK 8: GENEROVÁNÍ TOPIC IKONY

**Prompt:** `prompts/topicsymbols.md`

**⚠️ Pokud soubor už existuje:**
- Pokud existující ikona je správná a tematicky relevantní, **PŘESKOČ** tento krok
- Pokud potřebuješ změnit ikonu, můžeš přepsat existující soubor

### 8.1 Generování SVG ikony
**Soubor:** `assets/images/topics/TXX.svg`

**Postup:**
1. Otevři `prompts/topicsymbols.md` a najdi symbol pro dané téma
2. Spusť generátor ikon:
   ```bash
   python scripts/generate_topic_icons.py
   ```
3. Nebo vytvoř SVG ručně podle specifikace v `prompts/topicsymbols.md`

**Pravidla:**
- **Velikost:** 100x100 viewBox, škáluje se na 35x35px
- **Barva:** Jedna hlavní barva z palety (fialová/zelená/indigo/teal)
- **Styl:** Jednoduchý, čistý, čitelný i v malé velikosti
- **Relevance:** Symbol musí odpovídat tématu
- **Unikátnost:** Žádné téma nesmí mít stejný symbol

**Kontrola:**
- [ ] SVG soubor existuje v `assets/images/topics/TXX.svg`
- [ ] Symbol je tematicky relevantní
- [ ] Symbol je unikátní (žádné opakování)
- [ ] Barva ladí s designovým systémem
- [ ] Ikona je čitelná v malé velikosti (35x35px)

### 8.2 Aktualizace topic JSON
Ověř, že v `data/topics/TXX.json` je správně nastaveno:
```json
{
  "image": "assets/images/topics/TXX.svg"
}
```

---

## KROK 9: PŘIDÁNÍ HYPERLINKŮ (term links)

**Prompt:** `prompts/hyperlinks.md`

**⚠️ Pokud soubor už existuje:**
- Pokud existující termíny jsou kompletní a funkční, můžeš je doplnit nebo **PŘESKOČ** tento krok
- Pokud potřebuješ přidat nové termíny, uprav existující soubor (přidej do objektu `terms`)
- **POVINNĚ** ověř funkčnost všech odkazů (i existujících)

### 9.1 Identifikace termínů
1. Projdi text v `data/materials/TXX_materials.json`
2. Identifikuj důležité pojmy pro prolinkování:
   - Historické osobnosti
   - Geografické pojmy (řeky, města, regiony)
   - Kulturní a náboženské pojmy
   - Umělecké pojmy
   - Historické události a období
   - Literární díla
   - Technické termíny

### 9.2 Vytvoření souboru s termíny
**Soubor:** `data/term_links/TXX_terms.json`

**Struktura:**
```json
{
  "terms": {
    "termín 1": "https://cs.wikipedia.org/wiki/Termín_1",
    "termín 2": "https://cs.wikipedia.org/wiki/Termín_2",
    "víceslovný termín": "https://cs.wikipedia.org/wiki/Víceslovný_termín"
  }
}
```

**Pravidla (viz `prompts/hyperlinks.md`):**
- ✅ **Ověř funkčnost** - každý odkaz musí vést na existující Wikipedia stránku
- ✅ **Česká Wikipedie** - preferuj `cs.wikipedia.org`, pokud neexistuje, použij anglickou nebo odkaz odstraň
- ✅ **Varianty termínů** - přidej všechny varianty (velká/malá písmena, jednotné/množné číslo)
- ✅ **Konkrétní termíny** - ne obecná slova

**Kontrola:**
- [ ] Všechny odkazy vedou na existující stránky (ověřeno v prohlížeči)
- [ ] Pro neexistující české stránky je použita anglická verze nebo odkaz odstraněn
- [ ] Všechny varianty termínů jsou zahrnuty
- [ ] JSON je validní

---

## KROK 10: GENEROVÁNÍ AUDIO SOUBORŮ

**Prompt:** `prompts/audio_generation.md`

**⚠️ Pokud soubory už existují:**
- Pokud existující audio soubory jsou kvalitní a kompletní, **PŘESKOČ** tento krok
- Pokud potřebuješ regenerovat audio (např. po úpravě scénáře), můžeš přepsat existující soubory
- Skript automaticky aktualizuje `topic.json` s novými názvy souborů

### 10.1 Příprava
1. Ověř, že existují audio-scénáře:
   - `data/audio_scripts/TXX.txt` (jeden soubor), nebo
   - `data/audio_scripts/TXX_part1.txt`, `TXX_part2.txt`, ... (více souborů)

2. Nainstaluj závislosti (pokud ještě nejsou):
   ```bash
   pip install edge-tts
   ```

### 10.2 Generování audio
**Spuštění:**
```bash
python scripts/generate_audio.py TXX
```

**Co skript dělá automaticky:**
1. Najde audio-scénáře
2. Načte informace o tématu z `data/topics/TXX.json`
3. Automaticky vybere hlas (lichá čísla = ženský, sudá = mužský)
4. Vygeneruje audio soubory s automatickými názvy
5. Automaticky aktualizuje `data/topics/TXX.json` s novými názvy souborů

**Výstup:**
- `assets/audio/Otazka-X-nazev-tematu.mp3` (jeden soubor), nebo
- `assets/audio/Otazka-X-nazev-tematu-cast-1.mp3`, `cast-2.mp3`, ... (více souborů)

**Kontrola:**
- [ ] Audio soubory byly vytvořeny v `assets/audio/`
- [ ] Názvy souborů odpovídají formátu
- [ ] Topic JSON byl aktualizován (`audio.src` a `audio.files`)
- [ ] Audio přehrává správně v prohlížeči
- [ ] Hlas odpovídá očekávání (střídá se podle čísla tématu)

---

## KROK 11: FINÁLNÍ AKTUALIZACE TOPIC JSON

### 11.1 Kontrola audio názvů
**⚠️ DŮLEŽITÉ:** Po vygenerování audio souborů zkontroluj názvy v `audio.files`:
- Názvy musí být **smysluplné a popisné** (např. "Otázka 12 - Úvod a Petrohrad", "Otázka 12 - Moskva a Marius Petipa")
- Názvy NESMÍ být neúplné nebo nesmyslné (např. "Otázka 12 - Vývoj baletu v", "Otázka 12 - Lva Ivanoviče Ivanova")
- Pokud skript vygeneroval špatné názvy, **ručně oprav** pole `title` v `audio.files` v `data/topics/TXX.json`

**Příklad správných názvů:**
```json
"files": [
  {
    "src": "assets/audio/Otazka-12-vyvoj-baletu-v-rusku-cast-1.mp3",
    "title": "Otázka 12 - Úvod a Petrohrad",
    "part": 1
  },
  {
    "src": "assets/audio/Otazka-12-vyvoj-baletu-v-rusku-cast-2.mp3",
    "title": "Otázka 12 - Moskva a Marius Petipa",
    "part": 2
  }
]
```

### 11.2 Kontrola všech polí
Ověř, že `data/topics/TXX.json` obsahuje všechny správné cesty:

```json
{
  "id": "TXX",
  "order": X,
  "title": "NÁZEV TÉMATU",
  "image": "assets/images/topics/TXX.svg",
  "objectives": [...],
  "materials": {
    "summary": "1-2 odstavce shrnutí"
  },
  "audio": {
    "title": "Otázka X - NÁZEV",
    "src": "assets/audio/...",
    "transcript": "...",
    "files": [...]
  },
  "resourcesSource": "data/resources/TXX_resources.json",
  "flashcardSource": "data/flashcards/TXX_flashcards.json",
  "mindmap": {
    "description": "...",
    "image": "assets/images/mindmaps/TXX.png"
  },
  "materialsSource": "data/materials/TXX_materials.json",
  "summarySource": "data/summaries/TXX_summary.txt",
  "quizSource": "data/quizzes/TXX_quiz.json"
}
```

### 11.2 Kontrola všech souborů
Ověř existenci všech souborů:
- [ ] `data/topics/TXX.json`
- [ ] `data/materials/TXX_materials.json`
- [ ] `data/audio_scripts/TXX.txt` nebo `TXX_part*.txt`
- [ ] `data/flashcards/TXX_flashcards.json`
- [ ] `data/quizzes/TXX_quiz.json`
- [ ] `data/resources/TXX_resources.json`
- [ ] `data/summaries/TXX_summary.txt`
- [ ] `data/term_links/TXX_terms.json`
- [ ] `assets/images/topics/TXX.svg`
- [ ] `assets/audio/Otazka-X-*.mp3`

---

## KROK 12: VALIDACE A TESTOVÁNÍ

### 12.1 Validace JSON souborů
Ověř validitu všech JSON souborů:
- [ ] `data/topics/TXX.json` - validní JSON
- [ ] `data/materials/TXX_materials.json` - validní JSON
- [ ] `data/flashcards/TXX_flashcards.json` - validní JSON
- [ ] `data/quizzes/TXX_quiz.json` - validní JSON
- [ ] `data/resources/TXX_resources.json` - validní JSON
- [ ] `data/term_links/TXX_terms.json` - validní JSON

### 12.2 Validace odkazů
Spusť validační skript pro resources:
```bash
python scripts/validate_resource_links.py
```

### 12.3 Testování na webu
1. Spusť lokální server:
   ```bash
   python -m http.server 8000
   ```
2. Otevři `http://localhost:8000`
3. Ověř zobrazení tématu:
   - [ ] Téma se zobrazuje v seznamu témat
   - [ ] Detail tématu se načítá správně
   - [ ] Materiály se zobrazují s hyperlinky
   - [ ] Audio přehrává správně
   - [ ] Flashcards fungují
   - [ ] Kvíz funguje
   - [ ] Zdroje se zobrazují
   - [ ] Shrnutí se zobrazuje
   - [ ] Ikona se zobrazuje

### 12.4 Kontrola kvality obsahu
- [ ] Všechny informace z PDF jsou zahrnuty
- [ ] Audio-scénář pokrývá 100% obsahu
- [ ] Flashcards pokrývají klíčové informace
- [ ] Kvízové otázky jsou kvalitní a relevantní
- [ ] Zdroje jsou funkční a relevantní
- [ ] Hyperlinky fungují správně

---

## KROK 13: DOKUMENTACE A COMMIT

### 13.1 Aktualizace dokumentace
Pokud je potřeba, aktualizuj:
- `README.md` (pokud se změnila struktura)
- `docs/SCALING_GUIDE.md` (pokud se změnily postupy)

### 13.2 Git commit
```bash
git add scripts/topic-loader.js
git add data/topics/TXX.json
git add data/materials/TXX_materials.json
git add data/audio_scripts/TXX*.txt
git add data/flashcards/TXX_flashcards.json
git add data/quizzes/TXX_quiz.json
git add data/resources/TXX_resources.json
git add data/summaries/TXX_summary.txt
git add data/term_links/TXX_terms.json
git add assets/images/topics/TXX.svg
git add assets/audio/Otazka-X-*.mp3

git commit -m "Add topic TXX: NÁZEV TÉMATU"
```

**Poznámka:** Nezapomeň commitnout také `scripts/topic-loader.js`, kde bylo přidáno ID tématu do navigace.

---

## RYCHLÝ PRŮVODCE: CO DĚLAT, KDYŽ SOUBORY UŽ EXISTUJÍ

### ✅ Nová kapitola (žádné soubory neexistují)
→ **ZAČNI Krokem 0.0** (přidání do navigace) → Pak pokračuj od **Kroku 1** a vytvoř všechny soubory podle workflow

### ✅ Doplňování (některé soubory existují, některé chybí)
→ **NEPŘESKAKUJ** existující soubory, vytvoř pouze **chybějící** soubory podle příslušných kroků

### ✅ Přepracování (všechny soubory existují, chceš je přepsat)
→ **ZÁLOHUJ** všechny existující soubory → Pokračuj od **Kroku 1** a přepiš všechny soubory

### ✅ Oprava (chceš opravit pouze jeden konkrétní soubor)
→ **ZÁLOHUJ** soubor → Přejdi na **příslušný krok** workflow → Oprav pouze tento soubor

### ✅ Aktualizace (přidal jsi nové soubory, potřebuješ aktualizovat cesty)
→ Přejdi na **Krok 11** → Aktualizuj pouze příslušné cesty v `topic.json`

### ✅ Validace (chceš zkontrolovat kvalitu existujících souborů)
→ Přejdi na **Krok 12** → Projdi validaci a testování

### 📋 Kontrolní seznam před úpravou existujících souborů

- [ ] **Téma přidáno do navigace** (Krok 0.0 - `topic-loader.js`) - **POVINNÉ pro nová témata**
- [ ] **ZÁLOHA vytvořena** (viz Krok 0.5)
- [ ] **Rozhodnutí učiněno** (přepsat / doplnit / opravit / validovat)
- [ ] **Příslušný krok identifikován** (který krok workflow použít)
- [ ] **Existující soubory zkontrolovány** (co je správné, co potřebuje opravu)

---

## SHRNUTÍ KROKŮ

1. ✅ **Krok 0.0:** Přidání tématu do navigace (`topic-loader.js`) - **POVINNÉ NA ZAČÁTKU**
2. ✅ **Krok 0:** Identifikace tématu a kontrola
3. ✅ **Krok 1:** Vytvoření `materials.json`
4. ✅ **Krok 2:** Vytvoření `topic.json` (základní struktura)
5. ✅ **Krok 3:** Generování audio-scénáře
6. ✅ **Krok 4:** Generování flashcards
7. ✅ **Krok 5:** Generování kvízových otázek
8. ✅ **Krok 6:** Generování resources
9. ✅ **Krok 7:** Generování shrnutí
10. ✅ **Krok 8:** Generování topic ikony
11. ✅ **Krok 9:** Přidání hyperlinků
12. ✅ **Krok 10:** Generování audio souborů
13. ✅ **Krok 11:** Finální aktualizace topic JSON
14. ✅ **Krok 12:** Validace a testování
15. ✅ **Krok 13:** Dokumentace a commit

---

## DŮLEŽITÉ POZNÁMKY

### Před zahájením práce
- ⚠️ **NEPOKRAČUJ** bez schválení tohoto workflow
- ⚠️ **ZKONTROLUJ** všechny existující soubory před vytvořením nových
- ⚠️ **POUŽIJ** specializované prompty z `prompts/` pro každý krok

### Během práce
- ✅ **DODRŽUJ** všechny pravidla z jednotlivých promptů
- ✅ **VALIDUJ** všechny JSON soubory před uložením
- ✅ **OVĚŘUJ** funkčnost všech odkazů (resources, hyperlinky)
- ✅ **KONTROLUJ** kvalitu obsahu (100% pokrytí, gramatika, formát)

### Po dokončení
- ✅ **TESTOVAT** na webu před commitem
- ✅ **VALIDOVAT** všechny soubory
- ✅ **DOKUMENTOVAT** změny (pokud je potřeba)

---

## REFERENCE NA SPECIALIZOVANÉ PROMPTY

- **Audio-scénář:** `prompts/audioscript.md`
- **Flashcards:** `prompts/flashcards.md`
- **Kvízové otázky:** `prompts/quiz_questions.md`
- **Resources:** `prompts/resources.md`
- **Topic ikony:** `prompts/topicsymbols.md`
- **Hyperlinky:** `prompts/hyperlinks.md`
- **Audio generování:** `prompts/audio_generation.md`

---

**Vytvořeno:** 2025-01-27  
**Verze:** 1.0  
**Status:** K REVIZI - NEPROVÁDĚT BEZ SCHVÁLENÍ

