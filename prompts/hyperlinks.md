# Přidávání hyperlinků na termíny do studijních materiálů

## Cíl
Přidat odkazy na Wikipedia (nebo jiné kvalitní zdroje) k důležitým pojmům v sekcích studijních materiálů. Odkazy se automaticky zobrazí při zobrazení materiálů - termíny budou klikatelné, ale zobrazí se pouze původní text termínu.

## Struktura souborů

Termíny jsou organizovány podle témat v souborech:
- `data/term_links/common_terms.json` - společné termíny používané napříč tématy (např. buddhismus, hinduismus, islám, křesťanství)
- `data/term_links/{TOPIC_ID}_terms.json` - termíny specifické pro dané téma (např. `T02_terms.json`, `T03_terms.json`)

## Postup pro přidání termínů do nové kapitoly

### 1. Identifikace termínů
Projdi text kapitoly v `data/materials/{TOPIC_ID}_materials.json` a identifikuj důležité pojmy, které by měly mít odkaz na Wikipedia:

**Typy termínů k prolinkování:**
- Historické osobnosti (např. "Alexandr Veliký", "Ašóka")
- Geografické pojmy (řeky, města, regiony - např. "řeka Indus", "Peking")
- Kulturní a náboženské pojmy (např. "buddhismus", "hinduismus", "kasty")
- Umělecké pojmy (např. "Bharata Natyam", "Pekingská opera")
- Historické události a období (např. "dynastie Tchang", "Harappská kultura")
- Literární díla (např. "Mahabharáta", "Rámajána")
- Technické termíny specifické pro dané téma (např. "mudry", "natya", "nrtta")

**Co NEPROLINKOVAT:**
- Obecná slova (např. "tanec", "hudba", "umění" - pokud nejsou specifickým termínem)
- Velmi krátké nebo běžné pojmy, které nemají samostatný článek na Wikipedii

### 2. Vyhledání Wikipedia odkazů

Pro každý termín:
1. Otevři českou Wikipedii: https://cs.wikipedia.org
2. Vyhledej termín
3. Zkopíruj URL stránky (např. `https://cs.wikipedia.org/wiki/Indus`)
4. **Důležité:** Ověř, že článek skutečně existuje a je relevantní

**Co znamená "nefunkční odkaz":**
- Odkaz může vracet chybu 404 (stránka neexistuje)
- **ALE také:** Odkaz může technicky fungovat, ale stránka neexistuje v daném jazyce (např. česká Wikipedie nemá článek, i když URL nevrací chybu)
- V takovém případě použij anglickou verzi Wikipedie nebo odkaz úplně odstraň

**Jak ověřit, že článek existuje:**
- Otevři odkaz v prohlížeči a zkontroluj, že se zobrazuje skutečný článek s obsahem
- Pokud se zobrazí pouze prázdná stránka, přesměrování na jiný článek, nebo zpráva "článek neexistuje", stránka neexistuje
- Nepoužívej odkazy, které vedou na neexistující stránky - i když URL nevrací technickou chybu

**Tipy:**
- Pokud termín nemá český článek, použij anglickou verzi (`https://en.wikipedia.org/wiki/...`) nebo odkaz úplně odstraň
- Pro varianty termínu (např. "Harappské kultury" vs "Harappská kultura") použij stejný odkaz
- Pro víceslovné termíny zkontroluj přesný název článku (např. "řeka Indus" → článek může být jen "Indus")

### 3. Vytvoření/úprava souboru s termíny

#### Pro nové téma:
Vytvoř nový soubor `data/term_links/{TOPIC_ID}_terms.json`:

```json
{
  "terms": {
    "termín 1": "https://cs.wikipedia.org/wiki/Termín_1",
    "termín 2": "https://cs.wikipedia.org/wiki/Termín_2",
    "víceslovný termín": "https://cs.wikipedia.org/wiki/Víceslovný_termín"
  }
}
```

#### Pro existující téma:
Otevři existující soubor `data/term_links/{TOPIC_ID}_terms.json` a přidej nové termíny do objektu `terms`.

### 4. Formátování

**Důležité pravidla:**
- Každý termín na novém řádku pro lepší čitelnost
- Termíny seřaď abecedně (nebo logicky podle sekcí)
- Pro varianty termínu přidej více záznamů:
  ```json
  "Harappské kultury": "https://cs.wikipedia.org/wiki/Harappská_kultura",
  "harappské kultury": "https://cs.wikipedia.org/wiki/Harappská_kultura",
  "Harappská kultura": "https://cs.wikipedia.org/wiki/Harappská_kultura",
  "harappská kultura": "https://cs.wikipedia.org/wiki/Harappská_kultura"
  ```
- Pro víceslovné termíny zachovej přesný tvar, jak se vyskytuje v textu (např. "řeka Indus", "poloostrov Přední Indie")

### 5. Ověření

Po přidání termínů:
1. Otevři aplikaci v prohlížeči
2. Načti příslušnou kapitolu
3. Zkontroluj, že termíny jsou klikatelné a vedou na správné stránky
4. Ověř, že se zobrazuje pouze původní text termínu (ne URL)
5. **Kontrola funkčnosti odkazů:** Klikni na každý odkaz a ověř, že vede na existující Wikipedia stránku s obsahem (ne na prázdnou stránku nebo chybovou hlášku)

### 6. Příklady

**Příklad pro T02 (Indie, Čína, Japonsko):**

```json
{
  "terms": {
    "řeka Indus": "https://cs.wikipedia.org/wiki/Indus",
    "Indus": "https://cs.wikipedia.org/wiki/Indus",
    "Harappské kultury": "https://cs.wikipedia.org/wiki/Harappská_kultura",
    "Ašóka": "https://cs.wikipedia.org/wiki/Ašóka",
    "buddhismus": "https://cs.wikipedia.org/wiki/Buddhismus",
    "Bharata Natyam": "https://cs.wikipedia.org/wiki/Bharata_Natyam",
    "Pekingská opera": "https://cs.wikipedia.org/wiki/Pekingská_opera",
    "Divadlo Nó": "https://cs.wikipedia.org/wiki/Nó"
  }
}
```

## Tipy pro efektivní práci

1. **Batch processing**: Místo přidávání jednoho termínu najednou, projdi celou kapitolu a vytvoř seznam všech termínů, pak je přidej najednou
2. **Kontrola duplicit**: Před přidáním zkontroluj, zda termín už není v `common_terms.json` nebo v souboru tématu
3. **Konzistence**: Používej stejné termíny pro stejné pojmy napříč kapitolami (např. "buddhismus" by měl být vždy stejný)
4. **Priorita**: Začni s nejdůležitějšími termíny (osobnosti, místa, klíčové pojmy), méně důležité termíny můžeš přidat později

## Kontrola a oprava term links

### Automatická kontrola

Pro kontrolu a opravu term links souborů lze použít skript `scripts/check_all_term_links.py`:
```bash
python scripts/check_all_term_links.py
```

Skript automaticky:
- Opravuje chyby v pravopisu (např. `Fokin` → `Fokine`, `Vaclav` → `Vaslav`)
- Opravuje nejednoznačná jména osob (např. `Taglioni` může odkazovat na více osob - upravuje podle kontextu)
- Upřednostňuje taneční osobnosti při více možnostech se stejným jménem
- Kontroluje všechny soubory v `data/term_links/`

### Běžné problémy a řešení

**1. Ambiguální jména osob:**
- Pokud více osob má stejné jméno, použij kontext pro rozhodnutí
- Např. `Taglioni` může odkazovat na:
  - `Filippo_Taglioni` (choreograf, otec) - pro obecný kontext choreografie
  - `Paolo_Taglioni` (tanečník, syn) - pro kontext amerického baletu
  - `Marie_Taglioni` (tanečnice, dcera) - když je explicitně uvedena
  - `Paulina_Taglioni` (vnučka) - když je explicitně uvedena

**2. Chyby v pravopisu:**
- `Michail_Fokin` → `Michail_Fokine`
- `Vaclav_Nižinskij` → `Vaslav_Nižinskij`

**3. Zkratky vyžadující kontext:**
- `M. Ek` může být `Mats_Ek` (choreograf) nebo `Malin_Ek` (kostymérka) - preferuj choreografa
- Pokud je explicitně uvedeno "Malin Ek", použij `Malin_Ek`

## Technické poznámky

- Systém automaticky načte termíny při načtení kapitoly
- Termíny jsou tříděny podle délky (delší první), aby se předešlo částečným shodám
- Odkazy se přidávají pouze při renderování HTML, původní text v JSON souborech zůstává nezměněn
- Pokud soubor `{TOPIC_ID}_terms.json` neexistuje, systém použije pouze společné termíny (bez chyby)
- **Důležité:** Vždy ověřuj, že odkazy vedou na skutečně existující stránky. Nefunkční odkaz může znamenat jak technickou chybu (404), tak i stránku, která neexistuje v daném jazyce (i když URL nevrací chybu)

## Kontrolní seznam

- [ ] Prošel jsem text kapitoly a identifikoval důležité termíny
- [ ] Pro každý termín jsem našel relevantní Wikipedia článek
- [ ] Ověřil jsem, že všechny odkazy vedou na skutečně existující stránky (ne jen technicky funkční URL)
- [ ] Pro neexistující české stránky jsem použil anglickou verzi nebo odkaz odstranil
- [ ] Vytvořil jsem/upravil jsem soubor `data/term_links/{TOPIC_ID}_terms.json`
- [ ] Přidal jsem všechny varianty termínů (velká/malá písmena, jednotné/množné číslo)
- [ ] Ověřil jsem JSON formát (validní JSON)
- [ ] Otestoval jsem v aplikaci, že odkazy fungují správně
- [ ] Zkontroloval jsem, že se zobrazuje pouze text termínu (ne URL)
- [ ] Klikl jsem na každý odkaz a ověřil, že vede na existující stránku s obsahem

