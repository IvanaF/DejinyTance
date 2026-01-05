# Nastavení Fine-Grained Personal Access Token pro GitHub Issues

Fine-grained personal access tokens poskytují lepší bezpečnost a granularitu oprávnění než classic tokens. Toto je doporučené nastavení pro feedback systém.

## Krok 1: Vytvoření Fine-Grained Token

1. **Jděte na GitHub Settings:**
   - https://github.com/settings/tokens
   - Nebo: GitHub → Settings → Developer settings → Personal access tokens → Fine-grained tokens

2. **Klikněte na "Generate new token"**

3. **Vyplňte základní informace:**
   - **Token name**: `Feedback System - 20251227_DejinyTance`
   - **Description**: `Token for automatically creating feedback issues in 20251227_DejinyTance repository`
   - **Expiration**: 
     - ✅ **Doporučeno**: `90 days` nebo `1 year` (pro lepší bezpečnost)
     - ⚠️ **Nedoporučeno**: `No expiration` (bezpečnostní riziko)

4. **Repository access:**
   - ✅ Vyberte **"Only select repositories"**
   - ✅ Vyberte pouze: **`20251227_DejinyTance`**
   - ⚠️ **NEPOUŽÍVEJTE** "All repositories" (zbytečně široké oprávnění)

5. **Repository permissions:**
   - **Issues**: 
     - ✅ **Access**: `Read and write`
     - **Důvod**: Potřebujeme vytvářet issues a přidávat labels
   
   - **Metadata**: 
     - ✅ **Access**: `Read-only` (automaticky zaškrtnuto)
     - **Důvod**: Základní informace o repozitáři

6. **Account permissions:**
   - ✅ Všechny ponechte na **"No access"** (nepotřebujeme přístup k účtu)

7. **Klikněte na "Generate token"**

8. **DŮLEŽITÉ**: Zkopírujte token hned - už ho neuvidíte!
   - Token začíná `github_pat_` (fine-grained) nebo `ghp_` (classic)

## Krok 2: Nastavení v kódu

Otevřete `scripts/feedback.js` a nastavte:

```javascript
const FEEDBACK_CONFIG = {
  method: 'github',
  githubToken: 'github_pat_xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx', // ← Vložte váš token
  // ...
};
```

## Výhody Fine-Grained Tokenů

✅ **Lepší bezpečnost:**
- Oprávnění pouze pro konkrétní repozitář
- Minimální potřebná oprávnění
- Možnost nastavit expiraci

✅ **Lepší kontrola:**
- Vidíte přesně, co token může dělat
- Můžete snadno zrušit přístup k jednomu repozitáři
- Podrobné audit logy

✅ **Doporučeno GitHubem:**
- GitHub doporučuje fine-grained tokens pro nové projekty
- Classic tokens jsou stále podporovány, ale fine-grained jsou preferované

## Porovnání s Classic Token

| Vlastnost | Fine-Grained | Classic |
|-----------|--------------|---------|
| Oprávnění | Granulární (repo-level) | Široká (account-level) |
| Repository access | Konkrétní repozitáře | Všechny nebo žádné |
| Expirace | Doporučeno nastavit | Volitelné |
| Bezpečnost | ✅ Vyšší | ⚠️ Nižší |
| Podpora | ✅ Doporučeno | ⚠️ Legacy |

## Bezpečnostní doporučení

1. **Nastavte expiraci:**
   - Pro produkci: 90 dní nebo 1 rok
   - Token můžete obnovit před expirací

2. **Použijte pouze potřebná oprávnění:**
   - ✅ Issues: Read and write
   - ❌ NEPOUŽÍVEJTE: Contents, Pull requests, atd.

3. **Omezte na konkrétní repozitář:**
   - ✅ Only select repositories → `20251227_DejinyTance`
   - ❌ NEPOUŽÍVEJTE: All repositories

4. **Pravidelně kontrolujte:**
   - Jděte na https://github.com/settings/tokens
   - Zkontrolujte aktivitu tokenu
   - Pokud je podezřelá aktivita, okamžitě token zrušte

5. **Rotace tokenu:**
   - Vytvořte nový token před expirací
   - Aktualizujte `githubToken` v kódu
   - Zrušte starý token

## Řešení problémů

### Token nefunguje s "token" autentizací

Fine-grained tokens podporují oba formáty:
- `Authorization: token <token>` ✅
- `Authorization: Bearer <token>` ✅ (doporučeno)

Kód automaticky podporuje oba formáty.

### Chyba "Resource not accessible by integration"

- Zkontrolujte, že máte správné oprávnění "Issues: Read and write"
- Ověřte, že je repozitář vybrán v "Repository access"

### Token expiroval

1. Vytvořte nový token
2. Aktualizujte `githubToken` v `scripts/feedback.js`
3. Zrušte starý token

## Aktualizace tokenu

Pokud potřebujete aktualizovat token:

1. Vytvořte nový token (stejný postup jako výše)
2. Aktualizujte `githubToken` v `scripts/feedback.js`
3. Otestujte odeslání zpětné vazby
4. Zrušte starý token na https://github.com/settings/tokens

## Doporučená konfigurace (Shrnutí)

```
Token name: Feedback System - 20251227_DejinyTance
Expiration: 1 year (nebo 90 days)
Repository access: Only select repositories → 20251227_DejinyTance
Permissions:
  ✅ Issues: Read and write
  ✅ Metadata: Read-only (automaticky)
  ❌ Všechno ostatní: No access
```

Tato konfigurace poskytuje minimální potřebná oprávnění pro vytváření issues v konkrétním repozitáři.

