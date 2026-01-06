# Prompt pro vytváření kvalitních kvízových otázek

## Úvod

Tento prompt slouží k vytváření kvalitních ručně psaných kvízových otázek pro kapitoly z učebnice Dějiny tance a baletu. Otázky musí být formulovány stejně kvalitně jako u T01, T02, T03 a T04.

## Struktura otázky

Každá otázka má formát:
```json
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
```

## Zásady pro kvalitní otázky

### 1. Formulace otázek

✅ **DOBRÉ příklady:**
- "Kdy probíhal raný středověk?"
- "Která nová společenská třída vznikla ve vrcholném středověku?"
- "Jaké městské státy byly nejvýznamnější v Řecku?"
- "Kdo vytvořil teorii čtyř temperamentů?"
- "Co jsou iluminace?"

❌ **ŠPATNÉ příklady (vyvaruj se):**
- "Co je počátek 20. stol.?" (neúplná otázka)
- "Co je > ukázka výtvarného umění?" (nesmyslná formulace)
- "Co je 1770-78 – Vojtěch Morávek?" (neformulovaná otázka)
- "Co se stalo v roce 1906 ?" (nejasná otázka)

### 2. Typy otázek podle obsahu

#### A) Otázky na letopočty a období
- Formulujte jasně: "Kdy...", "V jakém období...", "V kterém století..."
- Příklady:
  - "Kdy probíhalo klasické období v Řecku?"
  - "V kterém roce se konaly první olympijské hry?"
  - "Kdy vznikl Řím podle legendy?"

#### B) Otázky na osoby
- Formulujte: "Kdo...", "Který umělec...", "Kdo byl..."
- Příklady:
  - "Kdo vytvořil teorii čtyř temperamentů?"
  - "Kdo byl prvním římským císařem?"
  - "Který filozof patří do klasického období?"

#### C) Otázky na pojmy a definice
- Formulujte: "Co je...", "Co jsou...", "Jaký je význam..."
- Příklady:
  - "Co je kalokagathia?"
  - "Co jsou iluminace?"
  - "Co je pieta?"

#### D) Otázky na místa a geografii
- Formulujte: "Kde...", "Z jaké země...", "V jakém městě..."
- Příklady:
  - "Kde se poprvé objevil gotický sloh?"
  - "Z jaké kultury vychází románský sloh?"
  - "Kde se nacházejí jeskynní malby z mladšího paleolitu?"

#### E) Otázky na seznamy a počty
- Formulujte: "Kolik...", "Které...", "Jaké jsou..."
- Příklady:
  - "Jaké jsou čtyři temperamenty podle Hippokrata?"
  - "Kolik důležitých slavností se konalo v Athénách?"
  - "Které řecké kmeny osídlily Balkánský poloostrov?"

#### F) Otázky na charakteristiky a popisy
- Formulujte: "Co charakterizovalo...", "Jaké jsou znaky...", "Co je typické pro..."
- Příklady:
  - "Co charakterizovalo raný středověk?"
  - "Jaké jsou znaky gotické architektury?"
  - "Co je typické pro romantismus?"

### 3. Odpovědi

**Správná odpověď:**
- Musí být úplná a přesná
- Měla by obsahovat všechny relevantní informace z materiálu
- **⚠️ DŮLEŽITÉ: Odpověď NESMÍ opakovat část otázky** - odpovědi musí být stručné a neobsahovat redundantní opakování
- Pokud je odpověď delší, měla by být srozumitelná, ale stále stručná

**Příklady správných a špatných odpovědí:**

✅ **DOBRÉ příklady (stručné, bez opakování):**
- Otázka: "Kdy byl uveden první dvorský balet v Rusku a jak se jmenoval?"
  - Odpověď: "1673, Orfeus a Eurydika"
- Otázka: "Kdy byla založena první ruská baletní škola?"
  - Odpověď: "1738"
- Otázka: "Kdo byl prvním ruským baletním mistrem?"
  - Odpověď: "Ivan Ivanovič Valberg"
- Otázka: "Kdy bylo otevřeno Velké divadlo v Moskvě a jak se dnes nazývá?"
  - Odpověď: "1825, dnes Bolshoi Theatre"

❌ **ŠPATNÉ příklady (opakují otázku):**
- Otázka: "Kdy byl uveden první dvorský balet v Rusku a jak se jmenoval?"
  - Odpověď: "V roce 1673 byl uveden první dvorský balet v Rusku, a to Orfeus a Eurydika." ❌
- Otázka: "Kdy byla založena první ruská baletní škola?"
  - Odpověď: "První ruská baletní škola byla založena v roce 1738." ❌
- Otázka: "Kdo byl prvním ruským baletním mistrem?"
  - Odpověď: "Prvním ruským baletním mistrem byl Ivan Ivanovič Valberg." ❌

**Nesprávné odpovědi (distraktory):**
- Musí být věrohodné (ne zjevně špatné)
- Měly by testovat skutečné znalosti, ne jen štěstí
- Můžou být:
  - Opravdu existující fakta, ale nesprávné pro danou otázku
  - Částečně správné, ale neúplné informace
  - Logické alternativy

**Příklady dobrých distraktorů:**
- Pro otázku "Kdy probíhal raný středověk?" (správně: 5. – 11. stol.)
  - ✅ 4. – 10. stol. (blízké období)
  - ✅ 6. – 12. stol. (blízké období)
  - ✅ 3. – 9. stol. (blízké období)

- Pro otázku "Kdo vytvořil teorii čtyř temperamentů?" (správně: Hippokrates)
  - ✅ Aristoteles (také řecký filozof)
  - ✅ Platón (také řecký filozof)
  - ✅ Sokrates (také řecký filozof)

### 4. Počet otázek

- **Minimální počet:** 20 otázek na kapitolu
- **Doporučený počet:** 30-50 otázek na kapitolu
- **Maximum:** 75 otázek na kapitolu (podle složitosti kapitoly)

Otázky by měly pokrýt:
- Letopočty a časové údaje
- Osoby (choreografové, tanečníci, umělci)
- Pojmy a definice
- Místa a geografii
- Charakteristiky období a stylů
- Důležité události
- Díla a jejich autory
- Technické termíny

## Postup při vytváření otázek

### Krok 1: Prostudování materiálu
1. Přečti si celý materiál kapitoly (`data/materials/TXX_materials.json`)
2. Identifikuj klíčové informace:
   - Letopočty
   - Osoby
   - Pojmy
   - Místa
   - Charakteristiky

### Krok 2: Vytvoření seznamu témat
Vytvoř seznam témat pro otázky, například:
- Historie (období, letopočty)
- Architektura (slohy, znaky, představitelé)
- Divadlo (druhy, představitelé, významná díla)
- Tanec (druhy, představitelé, významné tance)
- Umění (sochařství, malířství, literatura)

### Krok 3: Vytváření otázek
Pro každé téma vytvoř 4-8 otázek různých typů:
- 1-2 otázky na letopočty
- 1-2 otázky na osoby
- 1-2 otázky na pojmy
- 1-2 otázky na charakteristiky

### Krok 4: Kontrola kvality
Pro každou otázku zkontroluj:
- ✅ Je otázka jasně formulována?
- ✅ Je správná odpověď úplná a přesná?
- ✅ **Odpověď NESMÍ opakovat část otázky** - odpovědi musí být stručné (např. "1673, Orfeus a Eurydika" místo "V roce 1673 byl uveden první balet v Rusku, a to Orfeus a Eurydika")
- ✅ Jsou nesprávné odpovědi věrohodné?
- ✅ Pokrývá otázka důležitou informaci z materiálu?

## Příklady kvalitních otázek

### Příklad 1: Otázka na letopočet
```json
{
  "question": "Kdy probíhalo klasické období v Řecku?",
  "answers": [
    "480 – 330 př. n. l.",
    "500 – 350 př. n. l.",
    "450 – 300 př. n. l.",
    "400 – 280 př. n. l."
  ],
  "correct": 0
}
```

### Příklad 2: Otázka na osobu
```json
{
  "question": "Kdo vytvořil teorii čtyř temperamentů?",
  "answers": [
    "Hippokrates",
    "Aristoteles",
    "Platón",
    "Sokrates"
  ],
  "correct": 0
}
```

### Příklad 3: Otázka na pojem
```json
{
  "question": "Co je kalokagathia?",
  "answers": [
    "ideál zdraví, krásy a vzdělání (soulad psychického a duševního zdraví)",
    "typ řeckého chrámu",
    "typ řeckého tance",
    "typ řeckého divadla"
  ],
  "correct": 0
}
```

### Příklad 4: Otázka na seznam
```json
{
  "question": "Jaké jsou čtyři temperamenty podle Hippokrata?",
  "answers": [
    "sangvinik, cholerik, melancholik, flegmatik",
    "sangvinik, cholerik, optimista, pesimista",
    "extrovert, introvert, cholerik, flegmatik",
    "aktivní, pasivní, melancholik, flegmatik"
  ],
  "correct": 0
}
```

### Příklad 5: Otázka na charakteristiku
```json
{
  "question": "Co charakterizovalo raný středověk?",
  "answers": [
    "šíření křesťanství, rozvoj románské kultury, vznik samostatných feudálních států",
    "rozvoj gotického umění, vznik měst",
    "první zámořské objevy",
    "vrchol feudalismu"
  ],
  "correct": 0
}
```

## Šablona pro vytváření otázek pro konkrétní kapitolu

```
KAPITOLA: TXX - [NÁZEV KAPITOLY]

MATERIÁL: data/materials/TXX_materials.json

TÉMATA PRO OTÁZKY:
1. [Téma 1 - např. Historie]
   - Letopočty: [seznam důležitých letopočtů]
   - Osoby: [seznam důležitých osob]
   - Pojmy: [seznam důležitých pojmů]

2. [Téma 2 - např. Divadlo]
   - [podobně]

VYTVOŘENÉ OTÁZKY:
[Zde vytvoř 30-50 kvalitních otázek podle vzorů výše]

KONTROLA:
- [ ] Všechny otázky jsou jasně formulované
- [ ] Správné odpovědi jsou úplné a přesné
- [ ] **Odpovědi NESMÍ opakovat část otázky** - všechny odpovědi jsou stručné a neobsahují redundantní opakování
- [ ] Nesprávné odpovědi jsou věrohodné
- [ ] Otázky pokrývají všechny důležité části kapitoly
- [ ] Počet otázek: [X] (doporučeno 30-50)
```

## Formát pro uložení

Po vytvoření otázek je ulož do souboru `data/quizzes/TXX_quiz.json` ve formátu:

```json
{
  "questions": [
    {
      "question": "...",
      "answers": ["...", "...", "...", "..."],
      "correct": 0
    },
    ...
  ]
}
```

## Poznámky

- Vždy používej češtinu
- Respektuj přesné formulace z materiálů
- Při nejasnostech se odkaž na zdrojový materiál
- Otázky musí testovat skutečné znalosti, ne jen štěstí
- Každá otázka by měla mít jednu jasně správnou odpověď

