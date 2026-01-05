# Feedback System - Test Checklist

## ✅ Konfigurace je hotová!

Všechny potřebné údaje jsou nastavené:
- ✅ GitHub repository: `ifouk/20251227_DejinyTance`
- ✅ Fine-grained token: Nastaven (začíná `github_pat_`)
- ✅ Method: `github` (automatické vytváření issues)
- ✅ HTML elementy: Přítomny v index.html i topic.html

## Před testováním - Ověřte na GitHubu

### 1. Zkontrolujte, že labels existují v repozitáři

Jděte na: https://github.com/ifouk/20251227_DejinyTance/labels

**Požadované labels:**
- ✅ `feedback` (modrá barva)
- ✅ `user-submitted` (šedá barva)

**Volitelné labels (pro automatické přiřazení podle typu):**
- `bug` (pro typ "Nahlásit chybu")
- `enhancement` (pro typ "Návrh na novou funkci" nebo "Návrh na zlepšení rozhraní")
- `documentation` (pro typ "Problém s obsahem")
- `question` (pro typ "Obecná zpětná vazba")

**Pokud labels neexistují:**
1. Jděte na https://github.com/ifouk/20251227_DejinyTance/labels
2. Klikněte "New label"
3. Vytvořte chybějící labels

### 2. Ověřte token oprávnění

Token by měl mít:
- ✅ Repository access: `20251227_DejinyTance`
- ✅ Permissions → Issues: `Read and write`

## Testování

### Krok 1: Otevřete aplikaci

```bash
# Spusťte lokální server (pokud ještě neběží)
python -m http.server 8000
```

Otevřete: http://localhost:8000

### Krok 2: Otevřete Developer Console

- **Chrome/Edge**: F12 nebo Ctrl+Shift+I
- **Firefox**: F12 nebo Ctrl+Shift+K
- **Safari**: Cmd+Option+I

Přejděte na záložku **Console** - budete potřebovat vidět případné chyby.

### Krok 3: Otestujte feedback formulář

1. **Najděte tlačítko zpětné vazby:**
   - Mělo by být v pravém dolním rohu stránky
   - Modrý kruh s ikonou zpětné vazby

2. **Klikněte na tlačítko:**
   - Mělo by se otevřít modální okno s formulářem

3. **Vyplňte formulář:**
   - **Typ zpětné vazby**: Vyberte libovolný (např. "Obecná zpětná vazba")
   - **Nadpis**: `Test feedback - [vaše jméno]`
   - **Popis**: `Toto je testovací zpětná vazba pro ověření funkčnosti systému.`
   - **Jméno**: (volitelné)
   - **Email**: (volitelné)

4. **Klikněte "Odeslat"**

### Krok 4: Ověřte výsledek

**Očekávané chování:**

1. **Úspěch:**
   - ✅ Zobrazí se zelená zpráva: "Zpětná vazba byla úspěšně odeslána! GitHub Issue #[číslo] byla vytvořena."
   - ✅ Modální okno se automaticky zavře po ~1.5 sekundy
   - ✅ Zůstanete na stejné stránce (žádné přesměrování)
   - ✅ V konzoli by měl být log: `GitHub Issue created: https://github.com/ifouk/20251227_DejinyTance/issues/[číslo]`

2. **Chyba:**
   - ❌ Zobrazí se červená chybová zpráva
   - ❌ V konzoli bude chybová zpráva s detaily

### Krok 5: Ověřte na GitHubu

1. Jděte na: https://github.com/ifouk/20251227_DejinyTance/issues
2. Měli byste vidět novou issue s vaším testovacím nadpisem
3. Otevřete issue a zkontrolujte:
   - ✅ Nadpis je správný
   - ✅ Popis obsahuje všechny informace
   - ✅ Labels jsou přiřazeny (`feedback`, `user-submitted`, a případně další podle typu)
   - ✅ Obsahuje informace o stránce, odkud byla zpětná vazba odeslána

## Možné problémy a řešení

### ❌ Chyba: "GitHub Token není nastaven"

**Řešení:**
- Zkontrolujte, že `githubToken` v `scripts/feedback.js` obsahuje váš token
- Token by měl začínat `github_pat_` nebo `ghp_`

### ❌ Chyba: "GitHub API error: 401 Unauthorized"

**Možné příčiny:**
- Token je neplatný nebo expiroval
- Token nemá správná oprávnění

**Řešení:**
1. Zkontrolujte token na https://github.com/settings/tokens
2. Pokud expiroval, vytvořte nový token
3. Ověřte, že má oprávnění "Issues: Read and write"

### ❌ Chyba: "GitHub API error: 403 Forbidden"

**Možné příčiny:**
- Token nemá přístup k repozitáři
- Repozitář je soukromý a token nemá správná oprávnění

**Řešení:**
1. Zkontrolujte, že token má přístup k `20251227_DejinyTance`
2. Pokud je repo soukromý, ujistěte se, že token má scope `repo` (ne jen `public_repo`)

### ❌ Chyba: "GitHub API error: 404 Not Found"

**Možné příčiny:**
- Repozitář neexistuje nebo má špatný název
- Token nemá přístup k repozitáři

**Řešení:**
1. Ověřte, že repozitář `ifouk/20251227_DejinyTance` existuje
2. Zkontrolujte `GITHUB_CONFIG.owner` a `GITHUB_CONFIG.repo` v `scripts/feedback.js`

### ❌ Chyba: "Labels not found" nebo labels se nepřidávají

**Řešení:**
1. Vytvořte chybějící labels v repozitáři
2. Názvy labels musí přesně odpovídat (case-sensitive)
3. Požadované: `feedback`, `user-submitted`

### ❌ Tlačítko zpětné vazby se nezobrazuje

**Řešení:**
1. Zkontrolujte, že `scripts/feedback.js` je načten v HTML
2. Otevřete konzoli a zkontrolujte chyby
3. Zkontrolujte, že `feedbackButton` existuje v HTML

## Úspěšný test

Pokud vše funguje správně, měli byste:
- ✅ Vidět úspěšnou zprávu po odeslání
- ✅ Novou issue v GitHub repozitáři
- ✅ Všechny informace správně vyplněné v issue
- ✅ Správné labels přiřazeny

## Po úspěšném testu

Můžete:
- ✅ Smazat testovací issue na GitHubu
- ✅ Systém je připraven k použití!

---

**Poznámka:** Pokud narazíte na jakýkoli problém, zkontrolujte konzoli prohlížeče (F12) pro detailní chybové zprávy.

