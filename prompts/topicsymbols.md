# Generování SVG ikon pro témata

## Cíl
Vygenerovat malé, esteticky příjemné SVG ikony pro každé téma (T00-T24), které se dynamicky zobrazují:
- Vedle nadpisu tématu na stránce detailu (`pages/topic_template.html`)
- V seznamu témat v postranním panelu (sidebar)
- V seznamu témat na indexové stránce (`index.html`)

## Designové požadavky

### Velikost a čitelnost
- **Malé ikony** - optimalizované pro zobrazení 35x35px (podle CSS `topic-image` a `topic-header-image`)
- **Čitelné** - symboly musí být rozpoznatelné i v malé velikosti
- **Jednoduché** - minimální detaily, čisté tvary

### Barevnost
- **Minimální barvy** - každá ikona používá jednu hlavní barvu (fill)
- **Paleta barev** - harmonické odstíny fialové, zelené, indigo a teal
- **Ladění s designem** - barvy ladí s:
  - Fialovou barvou z `design-tokens.css` (`--color-secondary: #7c3aed`)
  - Zelenou barvou nadpisů materiálů (`materials-heading: #059669`)
- **Rozmanitost** - každé téma má jiný odstín pro rozlišení, ale barvy jsou harmonické

**Použitá paleta:**
- Fialové: `#7c3aed`, `#8b5cf6`, `#6d28d9`, `#a78bfa`, `#5b21b6`
- Fialovorůžové: `#9333ea`, `#c084fc`
- Zelené: `#059669`, `#10b981`, `#047857`, `#34d399`
- Modrozelené (teal): `#0d9488`, `#14b8a6`
- Indigo: `#6366f1`, `#818cf8`
- Šedá (neutrální): `#64748b`

### Estetika
- **Esteticky jednoduché a příjemné** - čisté, minimalistické designy
- **Konzistentní styl** - všechny ikony používají podobný styl (fill, jednoduché tvary)
- **Vizuální harmonie** - ikony vypadají dobře dohromady jako sada

## Obsahová relevance

### Symboly musí odpovídat tématu
Každý symbol by měl být tematicky relevantní k obsahu tématu:

**Příklady relevancí:**
- Pravěk, Egypt → pyramida (triangle)
- Indie, Čína, Japonsko → pagoda (layers)
- Antika → sloup (pillar)
- Středověk → věž hradu (tower)
- Renesance → květ (petals)
- Dvorský balet → koruna (crown)
- Baroko/Rokoko → svitek (scroll)
- Rusko → kupole (dome)
- Čechy → srdce (heart - lidový symbol)
- Anglie → štít (shield)
- atd.

### Unikátnost symbolů
**Každý symbol musí být unikátní** - žádné téma nesmí mít stejný symbol jako jiné téma (ani v jiné barvě).

## Technická implementace

### Formát
- **SVG soubory** - uloženy v `assets/images/topics/`
- **Názvosloví**: `T00.svg`, `T01.svg`, ..., `T24.svg`
- **ViewBox**: `0 0 100 100` pro snadné škálování
- **Rozměry**: `width="100" height="100"` (škáluje se pomocí CSS)

### Dynamické načítání
- Ikony se načítají z pole `image` v JSON souboru tématu
- Cesta: `"image": "assets/images/topics/TXX.svg"`
- Pokud obrázek neexistuje, zobrazí se fallback ikona (SVG placeholder)
- Změna obrázku ve složce se automaticky projeví při obnovení stránky

### Přidání do JSON tématu
V každém JSON souboru tématu (např. `data/topics/T01.json`) přidej pole:
```json
{
  "id": "T01",
  "order": 1,
  "title": "...",
  "image": "assets/images/topics/T01.svg",
  ...
}
```

Pole `image` se vkládá **hned za `title`**, před `objectives`.

## Seznam témat a jejich symbolů

| ID | Název tématu | Symbol | Popis symbolu |
|----|--------------|--------|---------------|
| T00 | Úvod | star | Hvězda |
| T01 | PRAVĚK, EGYPT, MEZOPOTÁMIE | triangle | Pyramida (trojúhelník) |
| T02 | INDIE, ČÍNA, JAPONSKO | layers | Pagoda (vrstvy) |
| T03 | ANTIKA (Řecko, Řím) | pillar | Sloup |
| T04 | STŘEDOVĚK (Feudalismus) | tower | Věž hradu |
| T05 | RENESANCE | petals | Květ (okvětní lístky) |
| T06 | POČÁTKY BALETU – DVORSKÝ BALET | crown | Koruna |
| T07 | BAROKO A ROKOKO | scroll | Svitok |
| T08 | KLASICISMUS | temple | Chrám |
| T09 | PREROMANTISMUS | crescent | Měsíc (srpek) |
| T10 | ROMANTISMUS | flower | Květ |
| T11 | VÝZNAMNÍ CHOREOGRAFOVÉ A TANEČNICE (ROMANTISMUS) | figure | Figura (tanečník/tanečnice) |
| T12 | VÝVOJ BALETU V RUSKU | dome | Kupole |
| T13 | SOUBOR RUSKÉ BALETY SERGEJE ĎAGILEVA | group | Skupina (více figur) |
| T14 | VÝZNAMNÍ CHOREOGRAFOVÉ SOUBORU RUSKÉ BALETY | medal | Medaile |
| T15 | VÝVOJ BALETU V USA | lines | Pruhy (vlajka) |
| T16 | VÝVOJ MODERNÍHO TANCE V EVROPĚ | curve | Křivka |
| T17 | VÝVOJ MODERNÍHO TANCE V USA | wave | Vlna |
| T18 | VÝVOJ BALETU V ANGLII | shield | Štít |
| T19 | VÝZNAMNÍ SVĚTOVÍ CHOREOGRAFOVÉ | world | Zeměkoule |
| T20 | POČÁTKY TANCE V ČECHÁCH | heart | Srdce (lidový symbol) |
| T21 | BALETNÍ MISTŘI ND DO ROKU 1945 | building | Budova (divadlo) |
| T22 | ZAKLADATELÉ ČESKÉ CHOREOGRAFICKÉ TVORBY | tree | Strom (růst, kořeny) |
| T23 | VÝZNAMNÍ ČEŠTÍ CHOREOGRAFOVÉ | stars | Více hvězd |
| T24 | BALETNÍ MISTŘI A REPEROTÁR ND OD R. 1959 | modern | Moderní symbol (abstraktní tvar) |

## Generování ikon

### Skript
Ikony se generují pomocí Python skriptu `scripts/generate_topic_icons.py`.

**Spuštění:**
```bash
python scripts/generate_topic_icons.py
```

Skript:
1. Načte definice ikon z `ICON_DESIGN` dictionary
2. Vygeneruje SVG soubory pro každé téma (T00-T24)
3. Uloží je do `assets/images/topics/`

### Přidání nového symbolu
Pokud potřebuješ přidat nový typ symbolu:

1. **Přidej definici do `ICON_DESIGN`** v `scripts/generate_topic_icons.py`:
```python
"TXX": {
    "symbol": "novy_symbol",
    "color": COLORS["violet_1"]
}
```

2. **Přidej implementaci do `generate_svg_icon()`**:
```python
elif symbol_type == "novy_symbol":
    svg_parts = [
        f'<path d="..." fill="{color}"/>',
        # další SVG elementy
    ]
```

3. **Spusť generátor** a zkontroluj výsledek

### Přidání ikony do existujícího tématu
Pokud téma ještě nemá ikonu v JSON souboru, použij pomocný skript:
```bash
python scripts/add_images_to_topics.py
```

Tento skript automaticky přidá pole `image` do všech JSON souborů témat, které ho ještě nemají.

## Kontrolní seznam

Před dokončením zkontroluj:

- [ ] Všechny ikony jsou vygenerované (T00-T24)
- [ ] Všechny symboly jsou unikátní (žádné opakování)
- [ ] Barvy ladí s designovým systémem (fialová/zelená paleta)
- [ ] Ikony jsou čitelné v malé velikosti (35x35px)
- [ ] Symboly jsou tematicky relevantní
- [ ] Pole `image` je přidáno do JSON souborů témat
- [ ] Cesty k obrázkům jsou správné (`assets/images/topics/TXX.svg`)
- [ ] Ikony se správně zobrazují na webu

## Poznámky

- Ikony jsou jednoduché SVG s jednou hlavní barvou
- Opacity se používá jen pro vrstvení/efekty uvnitř jednoho symbolu
- Všechny ikony mají konzistentní styl (fill-based, žádné složité gradienty)
- Barvy jsou harmonické a ladí s celkovým designem webu
- Dynamické načítání znamená, že změna SVG souboru se projeví po obnovení stránky (bez potřeby rebuild)

