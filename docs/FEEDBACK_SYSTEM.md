# Feedback System Documentation

## Přehled

Systém zpětné vazby umožňuje uživatelům odesílat zpětnou vazbu přímo do GitHub Issues. Když uživatel odešle zpětnou vazbu, otevře se nová stránka GitHubu s předvyplněným formulářem pro vytvoření issue.

## Jak to funguje

1. Uživatel klikne na tlačítko zpětné vazby (levý dolní roh)
2. Otevře se modální okno s formulářem
3. Uživatel vyplní typ zpětné vazby, nadpis a popis
4. Po odeslání se otevře nová záložka s GitHub "New Issue" stránkou
5. Formulář je předvyplněn s obsahem zpětné vazby
6. Uživatel může upravit obsah a odeslat issue

## Nastavení

### 1. Konfigurace GitHub repozitáře

Otevřete soubor `scripts/feedback.js` a upravte konfiguraci na začátku souboru:

```javascript
const GITHUB_CONFIG = {
  // Váš GitHub username nebo organizace
  owner: 'YOUR_GITHUB_USERNAME',
  // Název repozitáře
  repo: 'YOUR_REPO_NAME',
  // Štítky, které se přidají k issue (volitelné)
  labels: ['feedback', 'user-submitted'],
  // Šablona issue (volitelné, musí existovat v .github/ISSUE_TEMPLATE/)
  template: 'feedback.md'
};
```

**Příklad:**
```javascript
const GITHUB_CONFIG = {
  owner: 'ifouk',
  repo: '20251227_DejinyTance',
  labels: ['feedback', 'user-submitted'],
  template: 'feedback.md'
};
```

### 2. GitHub Issue Template (volitelné)

Šablona pro zpětnou vazbu je již vytvořena v `.github/ISSUE_TEMPLATE/feedback.md`. Tato šablona se automaticky použije při vytváření nového issue.

Můžete upravit šablonu podle svých potřeb nebo vytvořit další šablony pro různé typy zpětné vazby.

### 3. GitHub Labels (volitelné)

Doporučujeme vytvořit následující štítky v GitHub repozitáři:

- `feedback` - Obecná zpětná vazba
- `user-submitted` - Odesláno uživatelem
- `bug` - Chyba (můžete přidat automaticky podle typu)
- `feature` - Návrh na novou funkci
- `content` - Problém s obsahem
- `ui` - Návrh na zlepšení rozhraní

**Jak vytvořit štítky v GitHubu:**
1. Přejděte do repozitáře na GitHubu
2. Klikněte na "Issues" → "Labels"
3. Klikněte na "New label"
4. Vytvořte štítky s požadovanými názvy a barvami

## Formát zpětné vazby

Každá zpětná vazba vytvoří GitHub issue s následujícím formátem:

```markdown
## [Typ zpětné vazby]

### Description
[Popis od uživatele]

### Context
- **Page URL**: [URL stránky, kde byla zpětná vazba odeslána]
- **Submitted**: [Datum a čas]
- **User Agent**: [Informace o prohlížeči]

---
*This feedback was submitted through the web application feedback form.*
```

## Typy zpětné vazby

Systém podporuje následující typy zpětné vazby:

- **Obecná zpětná vazba** (`general`) - Obecné komentáře a návrhy
- **Nahlásit chybu** (`bug`) - Hlášení chyb a problémů
- **Návrh na novou funkci** (`feature`) - Návrhy na nové funkce
- **Problém s obsahem** (`content`) - Chyby nebo problémy v obsahu
- **Návrh na zlepšení rozhraní** (`ui`) - Návrhy na zlepšení UI/UX

## Použití jako backlog

GitHub Issues lze použít jako efektivní backlog:

### Organizace

1. **Labels** - Používejte štítky pro kategorizaci:
   - `feedback` - Všechna uživatelská zpětná vazba
   - `bug` - Chyby k opravě
   - `feature` - Nové funkce k implementaci
   - `enhancement` - Vylepšení existujících funkcí

2. **Milestones** - Vytvářejte milníky pro plánování:
   - `v1.1` - Plánované pro další verzi
   - `Backlog` - Dlouhodobé úkoly
   - `In Progress` - Právě se pracuje

3. **Projects** - Používejte GitHub Projects pro vizualizaci:
   - Kanban board s kolonkami: Backlog, To Do, In Progress, Done
   - Automatické propojení s issues

### Workflow

1. **Přijetí zpětné vazby** - Uživatel odešle zpětnou vazbu → vytvoří se issue
2. **Třídění** - Pravidelně kontrolujte nové issues a přiřaďte štítky
3. **Prioritizace** - Používejte GitHub priority nebo vlastní štítky (`priority: high`, `priority: low`)
4. **Plánování** - Přiřaďte issues k milníkům nebo projektům
5. **Implementace** - Při práci na issue změňte status na "In Progress"
6. **Uzavření** - Po dokončení issue uzavřete s komentářem

### Automatizace (volitelné)

Můžete nastavit GitHub Actions pro automatizaci:

- Automatické přiřazení štítků podle typu zpětné vazby
- Automatické přiřazení k projektu
- Odesílání notifikací při vytvoření nové zpětné vazby

## Bezpečnost

- **Žádné API klíče v kódu** - Systém používá pouze URL parametry, žádné autentizační tokeny
- **Uživatel musí být přihlášen na GitHubu** - Pro odeslání issue musí být uživatel přihlášen
- **Veřejný repozitář** - Pokud je repozitář veřejný, kdokoli může vytvářet issues (doporučeno pro zpětnou vazbu)
- **Soukromý repozitář** - Pokud je repozitář soukromý, pouze přispěvatelé mohou vytvářet issues

## Testování

Pro testování systému:

1. Otevřete webovou aplikaci
2. Klikněte na tlačítko zpětné vazby (levý dolní roh)
3. Vyplňte formulář
4. Odeslat - měla by se otevřít nová záložka s GitHub "New Issue" stránkou
5. Zkontrolujte, že formulář je předvyplněn správně
6. Otestujte různé typy zpětné vazby

## Řešení problémů

### Tlačítko zpětné vazby se nezobrazuje
- Zkontrolujte, zda je `scripts/feedback.js` načten v HTML
- Otevřete konzoli prohlížeče a zkontrolujte chyby

### GitHub issue se nevytváří správně
- Zkontrolujte konfiguraci `GITHUB_CONFIG` v `scripts/feedback.js`
- Ověřte, že `owner` a `repo` jsou správně nastaveny
- Zkontrolujte, zda existuje šablona `.github/ISSUE_TEMPLATE/feedback.md` (pokud je použita)

### Štítky se nepřidávají
- Zkontrolujte, zda štítky existují v GitHub repozitáři
- Názvy štítků musí přesně odpovídat (case-sensitive)

## Rozšíření

Systém lze rozšířit o:

1. **Automatické vytváření issues** - Použití GitHub API s Personal Access Token (vyžaduje backend)
2. **Email notifikace** - Odesílání emailů při vytvoření nové zpětné vazby
3. **Analytika** - Sledování počtu odeslaných zpětných vazeb
4. **Více jazyků** - Překlad formuláře do dalších jazyků
5. **Přílohy** - Možnost přidat screenshoty nebo soubory

## Podpora

Pro otázky nebo problémy s feedback systémem vytvořte issue v repozitáři s label `documentation` nebo `question`.

