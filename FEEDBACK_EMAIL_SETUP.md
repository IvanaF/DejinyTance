# Nastavení automatického odesílání zpětné vazby emailem

Systém zpětné vazby nyní automaticky odesílá emaily, když uživatel klikne na "Odeslat". Uživatel nemusí dělat nic dalšího - vše proběhne automaticky.

> **Alternativa**: Pokud chcete ukládat zpětnou vazbu do GitHub Issues místo emailu, viz **[FEEDBACK_GITHUB_SETUP.md](FEEDBACK_GITHUB_SETUP.md)**.

## Rychlé nastavení (2 minuty)

### Krok 1: Získejte Web3Forms Access Key

1. Jděte na **https://web3forms.com**
2. Zadejte svou emailovou adresu
3. Klikněte na "Get Your Access Key"
4. Zkopírujte Access Key, který dostanete emailem nebo přímo na stránce

### Krok 2: Nastavte v kódu

Otevřete soubor `scripts/feedback.js` a najděte sekci `FEEDBACK_CONFIG` (na začátku souboru, kolem řádku 26).

Změňte tyto dva řádky:

```javascript
recipientEmail: 'vas-email@example.com',        // ← ZMĚŇTE NA SVŮJ EMAIL
web3formsAccessKey: 'paste-your-access-key-here', // ← VLOŽTE VÁŠ ACCESS KEY
```

**Příklad:**
```javascript
recipientEmail: 'ivana.foukalova@example.com',
web3formsAccessKey: 'a1b2c3d4-e5f6-7890-abcd-ef1234567890',
```

### Krok 3: Hotovo!

Teď když uživatel odešle zpětnou vazbu:
- ✅ Automaticky se odešle email na vaši adresu
- ✅ Uživatel uvidí potvrzení "Zpětná vazba byla úspěšně odeslána!"
- ✅ Uživatel zůstane na stránce (žádné přesměrování)
- ✅ Zpětná vazba se také uloží lokálně jako záloha

## Co dostanete v emailu?

Email bude obsahovat:
- Typ zpětné vazby (bug, feature, content, ui, general)
- Nadpis a popis
- Jméno a email uživatele (pokud vyplnil)
- URL stránky, odkud byla zpětná vazba odeslána
- Datum a čas odeslání
- Technické detaily (prohlížeč, atd.)

## Bezplatné limity Web3Forms

Web3Forms má bezplatný tier s:
- ✅ 250 emailů/měsíc zdarma
- ✅ Žádné závazky
- ✅ Žádná kreditní karta
- ✅ Okamžité nastavení

Pro více emailů můžete upgradovat na placený plán, ale pro osobní projekty obvykle 250/měsíc stačí.

## Řešení problémů

### Email nepřichází

1. Zkontrolujte, že jste správně zkopírovali Access Key (bez mezer na začátku/konci)
2. Zkontrolujte, že jste správně nastavili email adresu
3. Zkontrolujte spam složku
4. Otevřete konzoli prohlížeče (F12) a podívejte se, jestli nejsou chyby

### Chyba "Access Key není nastaven"

Zkontrolujte, že jste nastavili `web3formsAccessKey` v `scripts/feedback.js`. Musí to být přesně ten klíč, který jste dostali z web3forms.com.

### Chcete použít jinou email službu?

Pokud chcete použít jinou službu (např. EmailJS, Formspree), upravte funkci `sendFeedbackEmail()` v `scripts/feedback.js`. Web3Forms je však doporučeno, protože je nejjednodušší na nastavení.

## Bezpečnost

- Access Key je veřejně viditelný v JavaScript kódu (to je v pořádku pro Web3Forms)
- Web3Forms automaticky blokuje spam a abuse
- Email adresa uživatele je volitelná - může odeslat zpětnou vazbu anonymně
- Všechna data jsou zasílána přes HTTPS

## Alternativy (pokud nechcete používat Web3Forms)

Můžete také:
- **EmailJS** - vyžaduje API klíč a registraci
- **Formspree** - vyžaduje registraci a form setup
- **GitHub Issues API** - vyžaduje GitHub Personal Access Token (bezpečnější, ale složitější)
- **Backend endpoint** - pokud máte vlastní server

Pro většinu případů je Web3Forms nejjednodušší volbou.

