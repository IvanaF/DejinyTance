# Studijní platforma - Dějiny tance a baletu

Moderní, responzivní samostudijní platforma pro výuku dějin tance a baletu. Postavena jako statická webová stránka s funkcionalitou na straně klienta.

## Struktura projektu

```
/
├── index.html                 # Přehledová/indexová stránka témat
├── topic.html                 # Šablona stránky detailu tématu
├── assets/
│   ├── audio/                 # Audio soubory
│   ├── images/                # Obrázky
│   └── styles/
│       ├── design-tokens.css  # CSS proměnné (barvy, mezery, typografie)
│       ├── base.css           # Základní/resetové styly
│       ├── layout.css         # Layout komponenty (sidebar, hlavní obsah)
│       └── components.css     # UI komponenty (karty témat, flashcards, atd.)
├── data/
│   └── topics/
│       ├── _TEMPLATE.json    # Šablona pro nová témata
│       ├── T01.json          # Soubory jednotlivých témat
│       ├── T02.json
│       └── ...                # Více témat k přidání
├── docs/
│   └── SCALING_GUIDE.md      # Průvodce přidáváním nových témat
├── scripts/
│   ├── topic-loader.js        # Načítání dat témat
│   ├── progress.js            # Sledování pokroku (abstrahované úložiště)
│   ├── flashcards.js          # Interakce s flashcards
│   ├── app.js                 # Hlavní aplikační logika
│   ├── feedback.js            # Systém zpětné vazby
│   └── help.js                # Help modal handler
└── README.md                  # Tento soubor
```

## Jak spustit lokálně

### Možnost 1: Použití Pythonu (doporučeno)

```bash
# Python 3
python -m http.server 8000

# Poté otevřete http://localhost:8000 v prohlížeči
```

### Možnost 2: Použití Node.js (http-server)

```bash
# Nainstalujte http-server globálně (pokud není nainstalován)
npm install -g http-server

# Spusťte server
http-server -p 8000

# Poté otevřete http://localhost:8000 v prohlížeči
```

### Možnost 3: Použití VS Code Live Server

1. Nainstalujte rozšíření "Live Server" ve VS Code
2. Klikněte pravým tlačítkem na `index.html`
3. Vyberte "Open with Live Server"

**Poznámka:** Stránka musí být obsluhována přes HTTP (ne otevřena přímo jako `file://`), protože používá `fetch()` pro načítání JSON souborů.

## Přidávání nových témat

Pro detailní návod, jak přidat nová témata, viz **[Průvodce škálováním (SCALING_GUIDE.md)](docs/SCALING_GUIDE.md)**.

### Rychlý přehled

1. Vytvořte JSON soubor v `data/topics/` (např. `T03.json`)
2. Použijte `data/topics/_TEMPLATE.json` jako šablonu
3. Vyplňte všechna pole podle struktury
4. Přidejte obrázky do `assets/images/topics/`
5. Přidejte audio soubory do `assets/audio/` (volitelné - lze vygenerovat pomocí scripts/generate_audio.py)
6. Témata se automaticky zobrazí v seznamu

### Šablona

Pro rychlý start použijte: `data/topics/_TEMPLATE.json`

### Podporované funkce

- ✅ Studijní materiály (sekce s nadpisy)
- ✅ Shrnutí (automaticky generované 1-2 odstavce)
- ✅ Audio (audio soubory s přepisem)
- ✅ Kvízové otázky (po jedné, náhodné pořadí)
- ✅ Flashcards (po jedné, náhodné pořadí)
- ✅ Myšlenková mapa pojmů
- ✅ Dodatečné zdroje
- ✅ Obrázky témat
- ✅ Help modal s nápovědou a screenshoty

## Funkce

### ✅ Implementováno

- Responzivní layout (desktop sidebar, mobilní drawer)
- Přehledová stránka témat
- Stránky detailů témat
- Navigace (předchozí/následující témata s čísly)
- Interakce s flashcards (po jedné, náhodné pořadí)
- Funkcionalita kvízu (po jedné, náhodné pořadí, okamžitá zpětná vazba)
- Audio přehrávač s přepínačem přepisu
- Podpora myšlenkové mapy
- Sekce shrnutí
- Rychlá navigační lišta
- Moderní designový systém založený na CSS proměnných
- Podpora obrázků pro témata
- Systém zpětné vazby s integrací do GitHub Issues
- Help modal s nápovědou a screenshoty navigace
- Plovoucí tlačítka pro nápovědu a zpětnou vazbu

### 📋 Backlog

Pro aktuální seznam úkolů a oprav viz **[TODO.md](TODO.md)**.

Zpětná vazba od uživatelů se automaticky ukládá do GitHub Issues. Pro více informací o systému zpětné vazby viz **[FEEDBACK_SYSTEM.md](docs/FEEDBACK_SYSTEM.md)**.

## Přizpůsobení designu

Všechny designové tokeny jsou centralizované v `assets/styles/design-tokens.css`. Pro přizpůsobení:

- **Barvy**: Upravte proměnné `--color-*`
- **Typografie**: Upravte proměnné `--font-*` a `--font-size-*`
- **Mezery**: Upravte proměnné `--spacing-*`
- **Layout**: Upravte `--container-max-width`, `--sidebar-width`, atd.

Změny těchto proměnných automaticky aktualizují celý web.

## Podpora prohlížečů

Cíleno na moderní prohlížeče (poslední 2 verze Chrome, Firefox, Safari, Edge). Používá:
- ES6+ JavaScript
- CSS Custom Properties (proměnné)
- Fetch API
- LocalStorage

## Vývojářské poznámky

- **Bez build kroku** - funguje jako statické soubory
- **Bez backendu** - veškerá funkcionalita je na straně klienta
- **Úložiště pokroku**: Aktuálně localStorage (lze později vyměnit za API-based úložiště)
- **Formát obsahu**: JSON soubory (Markdown podporován v textových řetězcích)

## Další kroky (Fáze B)

1. Extrahovat obsah z PDF → vytvořit JSON soubory témat
2. Otestovat s 2 reálnými tématy
3. Ověřit, že všechny funkce fungují s reálným obsahem
4. Pokračovat do Fáze C pro škálování na ~30 témat

## Time Tracker

Pro sledování času stráveného na projektu, počtu promptů a použitých nástrojů viz [PROJECT_TIME_TRACKER.md](PROJECT_TIME_TRACKER.md).

## Licence

Soukromý projekt - všechna práva vyhrazena.
