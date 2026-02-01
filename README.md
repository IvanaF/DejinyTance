# Studijní platforma - Dějiny tance a baletu

Moderní, responzivní samostudijní platforma pro výuku dějin tance a baletu. Postavena jako statická webová stránka s funkcionalitou na straně klienta.

![Tech Stack](https://img.shields.io/badge/HTML5-E34F26?style=flat&logo=html5&logoColor=white)
![CSS3](https://img.shields.io/badge/CSS3-1572B6?style=flat&logo=css3&logoColor=white)
![JavaScript](https://img.shields.io/badge/JavaScript-F7DF1E?style=flat&logo=javascript&logoColor=black)
![Python](https://img.shields.io/badge/Python-3776AB?style=flat&logo=python&logoColor=white)

---

## 📸 Screenshots

> **Poznámka:** Screenshoty budou přidány do `docs/screenshots/`. Pro návod jak je pořídit viz [docs/screenshots/README.md](docs/screenshots/README.md)

### Homepage - Přehled témat
![Homepage](docs/screenshots/homepage.png)
*Přehledová stránka se seznamem všech 25+ maturitních otázek*

### Detail tématu - Kompletní stránka
![Topic Detail](docs/screenshots/topic-detail.png)
*Detailní stránka tématu s všemi sekcemi: shrnutí, studijní materiály, audio, kvíz, flashcards*

### Kvíz - Interaktivní otázky
![Quiz](docs/screenshots/quiz.png)
*Kvízový systém s náhodným pořadím otázek a okamžitou zpětnou vazbou*

### Flashcards - Studijní kartičky
![Flashcards](docs/screenshots/flashcards.png)
*Interaktivní flashcards pro upevnění znalostí*

### Mobilní zobrazení
![Mobile View](docs/screenshots/mobile.png)
*Responzivní design s mobilním drawer menu*

---

## Struktura projektu

```
/
├── index.html                 # Přehledová/indexová stránka témat
├── topic.html                 # Šablona stránky detailu tématu
Γö£ΓöÇΓöÇ assets/
Γöé   Γö£ΓöÇΓöÇ audio/                 # Audio soubory
│   ├── images/                # Obrázky
Γöé   ΓööΓöÇΓöÇ styles/
│       ├── design-tokens.css  # CSS proměnné (barvy, mezery, typografie)
│       ├── base.css           # Základní/resetové styly
│       ├── layout.css         # Layout komponenty (sidebar, hlavní obsah)
│       └── components.css     # UI komponenty (karty témat, flashcards, atd.)
Γö£ΓöÇΓöÇ data/
Γöé   ΓööΓöÇΓöÇ topics/
│       ├── _TEMPLATE.json    # Šablona pro nová témata
│       ├── T01.json          # Soubory jednotlivých témat
Γöé       Γö£ΓöÇΓöÇ T02.json
│       └── ...                # Více témat k přidání
Γö£ΓöÇΓöÇ docs/
│   └── SCALING_GUIDE.md      # Průvodce přidáváním nových témat
Γö£ΓöÇΓöÇ scripts/
│   ├── topic-loader.js        # Načítání dat témat
│   ├── progress.js            # Sledování pokroku (abstrahované úložiště)
Γöé   Γö£ΓöÇΓöÇ flashcards.js          # Interakce s flashcards
│   ├── app.js                 # Hlavní aplikační logika
│   ├── feedback.js            # Systém zpětné vazby
Γöé   ΓööΓöÇΓöÇ help.js                # Help modal handler
ΓööΓöÇΓöÇ README.md                  # Tento soubor
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

Pro rychl├╜ start pou┼╛ijte: `data/topics/_TEMPLATE.json`

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

## ✨ Hlavní funkce

### 📚 Kompletní studijní obsah
- **25+ témat** pokrývajících celou historii tance a baletu
- **Studijní materiály** s strukturovanými sekcemi
- **Shrnutí** každého tématu pro rychlý přehled
- **Myšlenkové mapy** pro vizualizaci pojmů

### 🎯 Interaktivní nástroje pro učení
- **Kvízový systém** - náhodné pořadí otázek s okamžitou zpětnou vazbou
- **Flashcards** - studijní kartičky pro upevnění znalostí
- **Audio nahrávky** - poslech s přepisem pro různé styly učení
- **Externí zdroje** - odkazy na videa, články a další materiály

### 🎨 Uživatelské rozhraní
- **Responzivní design** - desktop sidebar, mobilní drawer menu
- **Rychlá navigace** - přímý přechod mezi sekcemi tématu
- **Help systém** - kontextová nápověda s vizuálními průvodci
- **Zpětná vazba** - integrace s GitHub Issues pro hlášení problémů

### 🛠️ Technické vlastnosti
- **Zero build step** - funguje jako statické soubory
- **Bez backendu** - veškerá funkcionalita na straně klienta
- **Designový systém** - CSS custom properties pro snadné přizpůsobení
- **Škálovatelná architektura** - template systém pro rychlé přidávání obsahu
- **Automatizace** - Python skripty pro generování audia a validaci odkazů

### 📋 Backlog

Pro aktuální seznam úkolů a oprav viz **[TODO.md](TODO.md)**.

Zpětná vazba od uživatelů se automaticky ukládá do GitHub Issues. Pro více informací o nastavení systému zpětné vazby viz **[FEEDBACK_SETUP.md](docs/FEEDBACK_SETUP.md)**.

## Přizpůsobení designu

Všechny designové tokeny jsou centralizované v `assets/styles/design-tokens.css`. Pro přizpůsobení:

- **Barvy**: Upravte proměnné `--color-*`
- **Typografie**: Upravte proměnné `--font-*` a `--font-size-*`
- **Mezery**: Upravte proměnné `--spacing-*`
- **Layout**: Upravte `--container-max-width`, `--sidebar-width`, atd.

Změny těchto proměnných automaticky aktualizují celý web.

## 🏗️ Architektura

### Frontend
- **HTML5** - sémantický markup s ARIA labely pro přístupnost
- **CSS3** - custom properties, Flexbox, Grid pro responzivní layout
- **Vanilla JavaScript (ES6+)** - modulární architektura bez frameworků
- **Fetch API** - načítání JSON dat
- **LocalStorage** - ukládání pokroku uživatele

### Automatizace & Nástroje
- **Python 3** - skripty pro generování obsahu
- **Edge TTS** - automatické generování audio nahrávek
- **Link validation** - automatická kontrola a oprava odkazů
- **Content generation** - SVG ikony, audio soubory, validace dat

### Struktura dat
- **JSON-based CMS** - strukturované soubory pro obsah
- **Template systém** - snadné přidávání nových témat
- **Modulární design** - flashcards a resources v externích souborech

## 🌐 Podpora prohlížečů

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

## 📊 Statistiky projektu

- **25+ témat** s kompletním obsahem
- **100+ kvízových otázek** na téma
- **28 hodin** vývoje
- **8 Python skriptů** pro automatizaci
- **Zero build step** - okamžité nasazení

## 📖 Dokumentace

- **[Time Tracker](PROJECT_TIME_TRACKER.md)** - sledování času a vývoje
- **[Case Study](CASE_STUDY.md)** - detailní popis projektu

## 🚀 Demo

*[Přidat odkaz na live demo po nasazení]*

## 📝 Licence

Soukromý projekt - všechna práva vyhrazena.
