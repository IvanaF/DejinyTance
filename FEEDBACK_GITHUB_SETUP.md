# Nastavení automatického vytváření GitHub Issues

Systém zpětné vazby nyní může automaticky vytvářet GitHub Issues, když uživatel klikne na "Odeslat". Uživatel nemusí dělat nic dalšího - issue se vytvoří automaticky.

## Rychlé nastavení (5 minut)

### Krok 1: Vytvořte GitHub Personal Access Token

1. Jděte na **https://github.com/settings/tokens**
2. Klikněte na **"Generate new token"** → **"Generate new token (classic)"**
3. Vyplňte:
   - **Note**: `Feedback System` (nebo jakýkoli název)
   - **Expiration**: Vyberte dobu platnosti (např. "No expiration" pro dlouhodobé použití)
   - **Scopes**: Zaškrtněte pouze:
     - ✅ **`repo`** (pro soukromé repozitáře) NEBO
     - ✅ **`public_repo`** (pouze pro veřejné repozitáře)
4. Klikněte na **"Generate token"** (dole na stránce)
5. **DŮLEŽITÉ**: Zkopírujte token hned - už ho neuvidíte! Vypadá nějak takto: `ghp_xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx`

### Krok 2: Nastavte v kódu

Otevřete soubor `scripts/feedback.js` a najděte sekci `FEEDBACK_CONFIG` (na začátku souboru, kolem řádku 24).

1. **Nastavte metodu odesílání:**
```javascript
method: 'github', // 'github', 'email', nebo 'both'
```

2. **Vložte váš GitHub token:**
```javascript
githubToken: 'ghp_xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx', // ← VLOŽTE VÁŠ TOKEN
```

**Příklad kompletní konfigurace:**
```javascript
const FEEDBACK_CONFIG = {
  method: 'github', // Pouze GitHub Issues
  githubToken: 'ghp_abc123def456ghi789jkl012mno345pqr678stu901vwx234yz',
  useLocalStorage: true,
  copyToClipboard: false
};
```

### Krok 3: Ověřte GitHub konfiguraci

Ujistěte se, že `GITHUB_CONFIG` je správně nastaven (kolem řádku 12):

```javascript
const GITHUB_CONFIG = {
  owner: 'IvanaF',  // ← Váš GitHub username
  repo: 'DejinyTance-MaturitniOtazky',  // ← Název vašeho repozitáře
  labels: ['feedback', 'user-submitted'],
  template: 'feedback.md'
};
```

### Krok 4: Hotovo!

Teď když uživatel odešle zpětnou vazbu:
- ✅ Automaticky se vytvoří GitHub Issue
- ✅ Uživatel uvidí potvrzení s číslem issue (např. "GitHub Issue #123 byla vytvořena")
- ✅ Uživatel zůstane na stránce (žádné přesměrování)
- ✅ Zpětná vazba se také uloží lokálně jako záloha

## Možnosti konfigurace

### Pouze GitHub Issues (doporučeno)
```javascript
method: 'github',
githubToken: 'your-token-here',
```

### Pouze Email
```javascript
method: 'email',
recipientEmail: 'your-email@example.com',
web3formsAccessKey: 'your-access-key',
```

### Obojí (GitHub + Email)
```javascript
method: 'both',
githubToken: 'your-token-here',
recipientEmail: 'your-email@example.com',
web3formsAccessKey: 'your-access-key',
```

## Co se vytvoří v GitHub Issues?

Každá zpětná vazba vytvoří issue s:
- **Nadpis**: Zpětná vazba od uživatele
- **Popis**: Kompletní informace včetně typu, popisu, uživatelských údajů, URL stránky, atd.
- **Labels**: Automaticky se přidají:
  - `feedback` a `user-submitted` (vždy)
  - `bug` (pro typ "Nahlásit chybu")
  - `enhancement` (pro typ "Návrh na novou funkci" nebo "Návrh na zlepšení rozhraní")
  - `documentation` (pro typ "Problém s obsahem")
  - `question` (pro typ "Obecná zpětná vazba")

## Bezpečnost

⚠️ **DŮLEŽITÉ VAROVÁNÍ:**
- GitHub token je viditelný v JavaScript kódu (veřejně přístupný)
- Token má přístup k vašemu repozitáři (podle zvolených oprávnění)
- **Doporučení**: Používejte token s minimálními oprávněními (`public_repo` pro veřejné repo)
- **Pro produkci**: Zvažte použití backendu, který token skryje

### Bezpečnostní doporučení:

1. **Minimální oprávnění**: Použijte pouze `public_repo` scope (pokud je repo veřejné)
2. **Omezená platnost**: Nastavte expiraci tokenu (např. 1 rok)
3. **Pravidelné rotace**: Občas vyměňte token za nový
4. **Sledování**: Pravidelně kontrolujte aktivitu tokenu na GitHubu

### Pokud je token kompromitován:

1. Jděte na https://github.com/settings/tokens
2. Najděte token a klikněte "Revoke" (odvolat)
3. Vytvořte nový token
4. Aktualizujte `githubToken` v `scripts/feedback.js`

## Řešení problémů

### Chyba "GitHub Token není nastaven"

- Zkontrolujte, že jste nastavili `githubToken` v `FEEDBACK_CONFIG`
- Ujistěte se, že token není prázdný string

### Chyba "GitHub API error: 401 Unauthorized"

- Token je neplatný nebo expiroval
- Vytvořte nový token a aktualizujte `githubToken`

### Chyba "GitHub API error: 403 Forbidden"

- Token nemá dostatečná oprávnění
- Ujistěte se, že máte zaškrtnuté `repo` nebo `public_repo` scope
- Pokud je repo soukromý, musíte použít `repo` scope

### Chyba "GitHub API error: 404 Not Found"

- Repozitář neexistuje nebo token k němu nemá přístup
- Zkontrolujte `owner` a `repo` v `GITHUB_CONFIG`

### Issue se vytváří, ale bez labels

- Zkontrolujte, že labels existují v repozitáři
- Jděte do repozitáře → Issues → Labels
- Vytvořte chybějící labels

## Testování

1. Otevřete webovou aplikaci
2. Klikněte na tlačítko zpětné vazby
3. Vyplňte formulář
4. Klikněte "Odeslat"
5. Měli byste vidět potvrzení s číslem issue
6. Otevřete GitHub repozitář → Issues a ověřte, že issue byla vytvořena

## Alternativy

Pokud nechcete používat GitHub API (kvůli bezpečnosti tokenu), můžete:

1. **Použít pouze email** - Nastavte `method: 'email'`
2. **Použít GitHub Actions** - Složitější, ale bezpečnější (vyžaduje backend)
3. **Použít GitHub App** - Nejsložitější, ale nejbezpečnější

Pro většinu případů je přímé použití GitHub API nejjednodušší volbou.

