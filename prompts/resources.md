# PROMPT: Vytváření zdrojů (resources) pro studijní materiály

## ÚKOL
Vytvoř kvalitní seznam externích zdrojů pro kapitolu z přiložených studijních materiálů.

**Cíl:** Poskytnout studentům relevantní, konkrétní a užitečné externí zdroje, které rozšiřují a doplňují studijní materiály.

---

## VSTUP

1. **Zdrojový text kapitoly** najdeš v projektu:
   - `data/materials/TXX_materials.json` (kde XX je číslo kapitoly)
   - Tento soubor obsahuje sekce s obsahem kapitoly

2. **Výstupní soubor:**
   - `data/resources/TXX_resources.json`
   - Název souboru musí odpovídat formátu: `TXX_resources.json` (např. `T02_resources.json`)

---

## PŘÍSNÁ PRAVIDLA (MUSÍ BÝT DODRŽENA)

### 1) Relevance a konkrétnost

- ✅ **KONKRÉTNÍ odkazy:** Každý zdroj musí odkazovat na konkrétní téma, ne obecné stránky
- ✅ **KONKRÉTNÍ články, ne obecné časopisy:** Pro odborné časopisy a časopisy **POVINNĚ** použij konkrétní články nebo sekce, ne obecnou hlavní stránku časopisu (např. NE `https://www.tanecniaktuality.cz/` → použij konkrétní článek nebo sekci s tagem/filtrem)
- ✅ **RELEVANTNÍ k obsahu kapitoly:** Zdroj musí přímo souviset s tématem kapitoly - **POVINNĚ se zaměřuj na zdroje přímo o tanci, tanečních formách, tanečních technikách, tanečních představeních, taneční teorii**
- ✅ **PRO ČESKÁ TÉMATA preferuj české zdroje:** Pro česká taneční témata (české balety, české taneční formy) **POVINNĚ** zahrň české odborné zdroje: konkrétní články z odborných časopisů, konkrétní sekce z Institutu umění - Divadelní ústav (IDU), konkrétní publikace, české instituty s konkrétními díly (např. Institut Bohuslava Martinů)
- ❌ **NEPOUŽÍVEJ obecné historické zdroje:** Obecné historické pořady nebo dokumenty, které se netýkají přímo tance (např. "Historie Plus" bez konkrétního zaměření na tanec)
- ❌ **NEPOUŽÍVEJ turistické stránky:** Turistické portály bez konkrétního obsahu o tanci
- ✅ **FUNKČNÍ URL:** **POVINNĚ ověř, že každý URL je funkční a vede na existující stránku** - před přidáním zdroje otevři URL v prohlížeči a ověř, že stránka existuje
- ❌ **NEPOUŽÍVEJ obecné stránky:** Např. `https://isac.uchicago.edu/` (obecná stránka) → použij konkrétní sekci nebo raději jiný zdroj
- ❌ **NEPOUŽÍVEJ Britannica:** Obecné encyklopedické zdroje nejsou dostatečně specifické
- ❌ **NEPOUŽÍVEJ Archive.org:** Obecné digitální archivy nejsou dostatečně specifické a relevantní
- ❌ **NEPOUŽÍVEJ vzdělávací sekce muzeí:** Odkazy typu `britishmuseum.org/learn/schools/...` často mění strukturu a nejsou funkční → použij collection search nebo konkrétní artefakty
- ❌ **NEPOUŽÍVEJ vyhledávání České televize:** Odkazy typu `ceskatelevize.cz/ivysilani/vyhledavani/?q=...` vedou na hlavní stránku, ne na konkrétní dokumenty → použij pouze konkrétní stránky dokumentů nebo pořadů
- ✅ **PREFERUJ:** Konkrétní stránky muzeí (British Museum collection search, Metropolitan Museum konkrétní sekce), oficiální kulturní portály, YouTube vyhledávání (stabilní), dokumentární videa, UNESCO stránky, oficiální stránky institutů a divadel s konkrétními díly

### 2) Typy zdrojů

**Povolené typy:**
1. **Oficiální kulturní portály** - konkrétní sekce o daném tématu
2. **Muzea a galerie** - konkrétní kolekce nebo výstavy
3. **Dokumentární videa** - YouTube kanály s konkrétními videi
4. **Vědecké publikace** - konkrétní články nebo databáze
5. **Národní rozhlas/televize** - konkrétní pořady nebo dokumenty
6. **Odborné taneční časopisy** - konkrétní články z odborných časopisů (např. Taneční aktuality, Dance Context Journal)
7. **Ministerstvo kultury** - konkrétní stránky nebo publikace ministerstva kultury (pro česká témata)
8. **Odborné instituce** - konkrétní stránky institutů a ústavů (např. Institut umění - Divadelní ústav, Institut Bohuslava Martinů)

**Nepoužívej:**
- Obecné encyklopedie (Britannica, Wikipedia jako hlavní zdroj)
- Obecné digitální archivy (Archive.org) - nejsou dostatečně specifické
- Obecné univerzitní stránky bez konkrétního tématu
- Obecné stránky divadel bez konkrétního díla (např. obecná stránka Národního divadla → použij konkrétní stránku o baletu)
- Obecné stránky časopisů bez konkrétního článku (např. obecná stránka Tanečních aktualit → použij konkrétní článek nebo sekci s tagem/filtrem)
- Komerční stránky bez vzdělávací hodnoty

### 3) Jazyk a styl

- ✅ **Čeština:** Všechny popisy a vysvětlení v češtině
- ✅ **Jasné vysvětlení:** Každý zdroj musí mít `explanation`, který vysvětluje, proč je zdroj relevantní
- ✅ **Konkrétní platforma:** Uveď konkrétní platformu nebo instituci

### 4) Formát JSON

**Struktura souboru:**
```json
{
  "sections": [
    {
      "heading": "Název sekce (např. Egypt)",
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

**Důležité:**
- `heading` - název sekce odpovídající struktuře materiálů
- `title` - konkrétní název zdroje
- `platform` - název platformy, instituce nebo kanálu
- `url` - konkrétní URL adresa (ne obecná stránka)
- `explanation` - jasné vysvětlení relevance zdroje

---

## PRAVIDLA PRO TVORBU ZDROJŮ

### Počet zdrojů

- **Minimum:** 2-3 zdroje na sekci
- **Doporučeno:** 3-5 zdrojů na sekci
- **Maximum:** 6 zdrojů na sekci (podle hustoty tématu)

### Organizace podle sekcí

Zdrojové soubory by měly být organizovány podle sekcí v materiálech:
- Každá hlavní sekce v materiálech = jedna sekce v resources
- Např. pokud materiály mají sekce "Pravěk", "Egypt", "Mezopotámie", resources budou mít stejné sekce

### Typy zdrojů podle tématu

**Pro historická témata (pravěk, starověk):**
- Oficiální stránky muzeí s konkrétními kolekcemi zobrazujícími tance (sošky, malby tančících postav)
- UNESCO stránky o památkách s důkazy o tancích (jeskynní malby)
- Digitální archivy s dokumenty o historických tancích
- YouTube videa o rekonstrukcích historických tanců

**Pro taneční témata (klasické tance, divadelní formy):**
- YouTube kanály s konkrétními videi o daném tanci (představení, technika, dokumenty)
- Oficiální stránky divadel s konkrétními představeními
- Oficiální kulturní portály s konkrétními sekcemi o tanci

**Pro česká taneční témata (české balety, české taneční formy):**
- **KONKRÉTNÍ články** z odborných tanečních časopisů (Taneční aktuality - konkrétní článek nebo sekce s tagem, Dance Context Journal - konkrétní článek)
- Institut umění - Divadelní ústav (IDU) - **konkrétní publikace** nebo **konkrétní sekce encyklopedie** o daném díle
- Ministerstvo kultury ČR - **konkrétní stránky nebo publikace** (ne obecná stránka)
- Oficiální stránky českých institutů s **konkrétními díly** (např. Institut Bohuslava Martinů - konkrétní stránka o baletu)
- Český rozhlas/televize - **konkrétní pořady** o daném tématu (ne obecná stránka pořadu)
- Nahrávky a dokumentace - **konkrétní nahrávky** děl (např. Supraphon - konkrétní album)

**Pro kulturní témata:**
- Oficiální kulturní portály s konkrétními sekcemi
- Muzea s konkrétními výstavami nebo kolekcemi
- Vědecké instituce s konkrétními publikacemi

### Kontrola kvality zdrojů

Pro každý zdroj zkontroluj:

- ✅ **Je URL konkrétní?** – Odkazuje na konkrétní téma, ne obecnou stránku?
- ✅ **Je zdroj relevantní?** – Přímo souvisí s obsahem kapitoly?
- ✅ **Je zdroj přístupný?** – URL je funkční a zdroj je dostupný?
- ✅ **Je vysvětlení jasné?** – Student pochopí, proč je zdroj užitečný?
- ✅ **Je platforma uvedena?** – Je jasné, odkud zdroj pochází?

---

## PŘÍKLADY KVALITNÍCH ZDROJŮ

### ✅ DOBRÝ příklad 1: Konkrétní muzejní kolekce
```json
{
  "title": "Egyptské tance - Dokumentace",
  "platform": "Metropolitan Museum of Art",
  "url": "https://www.metmuseum.org/toah/hd/edan/hd_edan.htm",
  "explanation": "Vzdělávací materiál Metropolitního muzea umění o egyptských tancích, jejich druzích (lidové, náboženské, astronomické, dvorské) a jejich významu v egyptské kultuře."
}
```

### ✅ DOBRÝ příklad 2: Konkrétní YouTube video
```json
{
  "title": "Bharata Natyam - Klasický indický tanec",
  "platform": "YouTube - National Geographic India",
  "url": "https://www.youtube.com/results?search_query=bharata+natyam+national+geographic+india",
  "explanation": "Dokumentární videa o klasickém indickém tanci Bharata Natyam z oficiálního kanálu National Geographic India. Ukazuje techniku, mudry a tradiční pózy v kulturním kontextu."
}
```

### ✅ DOBRÝ příklad 3: Konkrétní vědecká publikace
```json
{
  "title": "Mezopotámské taneční školy a chrámové obřady",
  "platform": "ISAC - Institute for the Study of Ancient Cultures",
  "url": "https://isac.uchicago.edu/research/publications",
  "explanation": "Vědecké publikace a výzkumné materiály o mezopotámské kultuře, včetně informací o tanečních školách při chrámech a jejich roli v náboženských obřadech."
}
```

### ❌ ŠPATNÝ příklad 1: Obecná stránka
```json
{
  "title": "Mezopotámské taneční školy",
  "platform": "University of Chicago",
  "url": "https://isac.uchicago.edu/",
  "explanation": "..."
}
```
**Problém:** URL odkazuje na obecnou stránku, ne konkrétní téma.

### ❌ ŠPATNÝ příklad 2: Britannica
```json
{
  "title": "Pravěké umění a tanec",
  "platform": "Britannica",
  "url": "https://www.britannica.com/art/dance/Prehistoric-period",
  "explanation": "..."
}
```
**Problém:** Britannica je obecná encyklopedie, není dostatečně specifická.

---

## POSTUP PŘI VYTVÁŘENÍ ZDROJŮ

### Krok 1: Prostudování materiálů

1. Přečti si celý soubor `data/materials/TXX_materials.json`
2. Identifikuj hlavní sekce a témata
3. Pro každou sekci identifikuj klíčová témata, která by mohla mít externí zdroje

### Krok 2: Hledání relevantních zdrojů

Pro každou sekci hledej:

**Typy zdrojů k hledání:**
- Oficiální stránky muzeí s konkrétními kolekcemi
- YouTube kanály s konkrétními videi
- Oficiální kulturní portály s konkrétními sekcemi
- Vědecké publikace nebo databáze
- Národní rozhlas/televize - konkrétní pořady
- Digitální archivy s konkrétními dokumenty

**Kde hledat:**
- Oficiální stránky muzeí (Metropolitan Museum, British Museum, Louvre, atd.)
- YouTube - oficiální kanály (National Geographic, veřejnoprávní televize)
- Oficiální kulturní portály (China Culture, Japan Tourism, atd.)
- Vědecké instituce - konkrétní sekce publikací
- UNESCO - konkrétní památky
- Národní rozhlas/televize - konkrétní pořady

### Krok 3: Kontrola relevance a funkčnosti

Pro každý zdroj:
- ✅ **OVĚŘ FUNKČNOST URL:** Povinně otevři každý URL v prohlížeči a ověř, že stránka existuje a je přístupná (ne "Page Not Found", "404", "Sorry we can't find that page")
- ✅ **VYHNI SE PROBLEMATICKÝM STRUKTURÁM:** Nepoužívej URL obsahující `/learn/schools/` (vzdělávací sekce muzeí) nebo `/ivysilani/vyhledavani/` (vyhledávání ČT) - tyto často nejsou funkční
- ✅ Ověř, že URL je konkrétní (ne obecná stránka)
- ✅ Ověř, že zdroj přímo souvisí s tématem
- ✅ Ověř, že zdroj je přístupný a funkční (žádné chyby při načítání)
- ✅ Vytvoř jasné vysvětlení relevance
- ✅ **PREFERUJ stabilní zdroje:** YouTube vyhledávání, British Museum collection search, Metropolitan Museum konkrétní sekce, UNESCO, Ancient History Encyclopedia, oficiální stránky institutů

### Krok 4: Vytvoření souboru

1. Vytvoř soubor `data/resources/TXX_resources.json`
2. Organizuj zdroje podle sekcí z materiálů
3. Použij správnou JSON strukturu
4. Ověř validitu JSON

---

## FINÁLNÍ KONTROLA (POVINNĚ PŘED VÝSTUPEM)

Před vytvořením finálního souboru zkontroluj:

### Kontrola relevance a funkčnosti
- ✅ **Jsou VŠECHNY URL FUNKČNÍ?** (POVINNĚ otevři každý URL v prohlížeči a ověř, že stránka existuje - žádné "Page Not Found", "404", "Sorry we can't find that page")
- ✅ **Neobsahují URL problematické struktury?** (žádné `/learn/schools/` nebo `/ivysilani/vyhledavani/` - tyto často nejsou funkční)
- ✅ **Jsou VŠECHNY URL konkrétní?** (ne obecné stránky)
- ✅ **Jsou časopisy a časopisy konkrétní?** (konkrétní články nebo sekce, ne obecná hlavní stránka časopisu)
- ✅ **Souvisí zdroje PŘÍMO S TANCEM?** (každý zdroj musí být o tanci, tanečních formách, tanečních technikách, tanečních představeních, taneční teorii - NE obecné historické nebo kulturní zdroje)
- ✅ **Nejsou v seznamu obecné historické pořady?** (např. "Historie Plus" bez konkrétního zaměření na tanec)
- ✅ **Nejsou v seznamu turistické stránky?** (turistické portály bez konkrétního obsahu o tanci)
- ✅ **Nejsou v seznamu obecné stránky časopisů?** (obecné stránky časopisů bez konkrétního článku)
- ✅ **Nejsou v seznamu zdroje z Britannicy?**
- ✅ **Nejsou v seznamu obecné univerzitní stránky?**
- ✅ **Jsou zdroje stabilní?** (preferuj YouTube vyhledávání, British Museum collection search, Metropolitan Museum konkrétní sekce, UNESCO, Ancient History Encyclopedia)

### Kontrola formátu
- ✅ **Je JSON validní?** (ověř pomocí JSON validátoru)
- ✅ **Je struktura správná?** (sections → resources)
- ✅ **Mají všechny zdroje všechny povinné pole?** (title, platform, url, explanation)

### Kontrola kvality
- ✅ **Jsou vysvětlení jasná a užitečná?**
- ✅ **Je počet zdrojů vhodný?** (2-6 na sekci)
- ✅ **Pokrývají zdroje klíčová témata z kapitoly?**

---

## TECHNICKÉ POZNÁMKY

### Umístění souboru
- Soubor musí být uložen v: `data/resources/TXX_resources.json`
- Název souboru musí přesně odpovídat formátu (např. `T02_resources.json`)

### Integrace s projektem
- Zdroje se načítají automaticky pomocí `topic-loader.js`
- V souboru tématu (`data/topics/TXX.json`) se resources odkazují pomocí pole `resourcesSource`
- Formát: `"resourcesSource": "data/resources/TXX_resources.json"`

### Renderování
- Zdroje se zobrazují ve formátu sekcí s nadpisy
- Každý zdroj se zobrazuje jako odkaz s platformou a vysvětlením

---

## SHRNUTÍ KLÍČOVÝCH PRAVIDEL

1. ✅ **FUNKČNÍ URL** – **POVINNĚ ověř každý URL v prohlížeči** před přidáním (žádné "Page Not Found", "404", "Sorry we can't find that page")
2. ✅ **VYHNI SE PROBLEMATICKÝM STRUKTURÁM** – nepoužívej URL s `/learn/schools/` (vzdělávací sekce muzeí) nebo `/ivysilani/vyhledavani/` (vyhledávání ČT)
3. ✅ **KONKRÉTNÍ URL** – ne obecné stránky
4. ✅ **RELEVANTNÍ k tématu** – přímo souvisí s obsahem
5. ✅ **2-6 zdrojů na sekci** – podle hustoty tématu
6. ✅ **Čeština** – všechny popisy v češtině
7. ✅ **Žádná Britannica** – nepoužívej obecné encyklopedie
8. ✅ **Žádné obecné univerzitní stránky** – preferuj stabilní zdroje
9. ✅ **STABILNÍ ZDROJE** – preferuj YouTube vyhledávání, British Museum collection search, Metropolitan Museum konkrétní sekce, UNESCO, Ancient History Encyclopedia, oficiální stránky institutů

---

## KRITICKÉ PRAVIDLO: OVĚŘENÍ FUNKČNOSTI URL

**PŘED PŘIDÁNÍM KAŽDÉHO ZDROJE:**

1. **Otevři URL v prohlížeči** - zkopíruj URL a otevři ho v novém okně prohlížeče
2. **Ověř, že stránka existuje** - stránka se musí načíst bez chyb (žádné "404 Not Found", "Page Not Found", "Error 404")
3. **Ověř, že obsah je relevantní** - stránka musí skutečně obsahovat informace související s tématem
4. **Pokud URL nefunguje** - najdi alternativní zdroj nebo zdroj úplně vynech

**PREFEROVANÉ STABILNÍ ZDROJE (obvykle funkční):**
- ✅ YouTube vyhledávání (vyhledávací dotazy jsou stabilní a funkční)
- ✅ British Museum Collection Search (např. `britishmuseum.org/collection/search?keyword=...`) - stabilní a funkční
- ✅ Metropolitan Museum of Art konkrétní sekce (např. `metmuseum.org/toah/hd/...`) - stabilní vzdělávací materiály
- ✅ UNESCO World Heritage (oficiální seznamy památek s důkazy o tancích)
- ✅ Oficiální stránky institutů a divadel s konkrétními díly (např. Institut Bohuslava Martinů)
- ✅ Český rozhlas (konkrétní pořady o tanci s plným URL)
- ✅ Česká televize (pouze konkrétní dokumenty s plným URL, NE vyhledávání)
- ✅ Odborné taneční časopisy (Taneční aktuality, Dance Context Journal) - konkrétní články
- ✅ Institut umění - Divadelní ústav (IDU) - publikace a encyklopedie
- ✅ Ministerstvo kultury ČR - konkrétní stránky nebo publikace (pro česká témata)
- ✅ Ancient History Encyclopedia (worldhistory.org) - stabilní a funkční články

**PROBLÉMOVÉ ZDROJE (často nefunkční nebo nerelevantní):**
- ❌ Obecné univerzitní stránky (často mění strukturu)
- ❌ Obecné digitální archivy (Archive.org - nejsou dostatečně specifické)
- ❌ Obecné stránky divadel (např. obecná stránka Národního divadla - použij konkrétní stránku o díle)
- ❌ Neoficiální kulturní portály (mohou být nedostupné)
- ❌ Staré nebo neudržované stránky
- ❌ **Vzdělávací sekce muzeí** (např. `britishmuseum.org/learn/schools/...`) - často mění strukturu a nejsou funkční → použij collection search místo toho
- ❌ **Vyhledávání České televize** (např. `ceskatelevize.cz/ivysilani/vyhledavani/?q=...`) - vedou na hlavní stránku, ne na konkrétní dokumenty → použij pouze konkrétní stránky dokumentů s plným URL

---

**POZOR:** 
- Pokud nemůžeš najít konkrétní zdroj pro téma, je lepší mít méně zdrojů, ale všechny kvalitní a relevantní, než přidat obecný nebo nerelevantní zdroj.
- **NIKDY nepřidávej zdroj bez ověření funkčnosti URL v prohlížeči!**

