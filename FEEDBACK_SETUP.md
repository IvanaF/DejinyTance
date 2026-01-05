# Rychlý návod - Nastavení Feedback Systému

## Krok 1: Aktualizujte konfiguraci GitHub repozitáře

Otevřete soubor `scripts/feedback.js` a najděte sekci `GITHUB_CONFIG` na začátku souboru (řádky 10-18).

Změňte tyto hodnoty:

```javascript
const GITHUB_CONFIG = {
  owner: 'YOUR_GITHUB_USERNAME',  // ← Změňte na vaše GitHub username
  repo: 'YOUR_REPO_NAME',          // ← Změňte na název vašeho repozitáře
  labels: ['feedback', 'user-submitted'],
  template: 'feedback.md'
};
```

**Příklad:**
Pokud je váš repozitář na `https://github.com/ifouk/20251227_DejinyTance`, pak:

```javascript
const GITHUB_CONFIG = {
  owner: 'ifouk',
  repo: '20251227_DejinyTance',
  labels: ['feedback', 'user-submitted'],
  template: 'feedback.md'
};
```

## Krok 2: Vytvořte GitHub Labels (volitelné, ale doporučeno)

1. Přejděte na GitHub do vašeho repozitáře
2. Klikněte na **Issues** → **Labels**
3. Klikněte na **New label** a vytvořte:
   - `feedback` (barva: modrá)
   - `user-submitted` (barva: šedá)

## Krok 3: Otestujte

1. Otevřete webovou aplikaci v prohlížeči
2. V levém dolním rohu byste měli vidět tlačítko zpětné vazby (modrý kruh s ikonou)
3. Klikněte na tlačítko
4. Vyplňte formulář a odešlete
5. Měla by se otevřít nová záložka s GitHub "New Issue" stránkou s předvyplněným obsahem

## Formát backlogu

Zpětná vazba se ukládá jako **GitHub Issues**. To je ideální formát pro backlog, protože:

- ✅ Můžete organizovat pomocí Labels
- ✅ Můžete přiřazovat k Milestones
- ✅ Můžete používat GitHub Projects pro vizualizaci
- ✅ Můžete komentovat a diskutovat
- ✅ Můžete uzavírat po dokončení

### Doporučená organizace backlogu:

1. **Labels pro kategorizaci:**
   - `feedback` - Všechna uživatelská zpětná vazba
   - `bug` - Chyby
   - `feature` - Nové funkce
   - `content` - Problémy s obsahem
   - `ui` - Návrhy na UI/UX

2. **Milestones pro plánování:**
   - `v1.1` - Plánované pro další verzi
   - `Backlog` - Dlouhodobé úkoly

3. **GitHub Projects (volitelné):**
   - Kanban board: Backlog → To Do → In Progress → Done

## Více informací

Pro detailní dokumentaci viz **[docs/FEEDBACK_SYSTEM.md](docs/FEEDBACK_SYSTEM.md)**.

