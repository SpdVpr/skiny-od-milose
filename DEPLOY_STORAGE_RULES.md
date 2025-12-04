# 🔥 Nasazení Firebase Storage Rules

## Krok 1: Instalace Firebase CLI (pokud ještě nemáte)

```bash
npm install -g firebase-tools
```

## Krok 2: Přihlášení do Firebase

```bash
firebase login
```

## Krok 3: Inicializace projektu (pokud ještě není)

```bash
firebase init
```

Vyberte:
- ✅ Storage: Configure security rules for Cloud Storage
- Vyberte váš projekt: `skiny-od-milose`
- Storage rules file: `storage.rules` (už existuje)

## Krok 4: Nasazení Storage Rules

```bash
firebase deploy --only storage
```

## Krok 5: Ověření

1. Jděte do Firebase Console: https://console.firebase.google.com/
2. Vyberte projekt `skiny-od-milose`
3. Jděte do **Storage** → **Rules**
4. Měli byste vidět nová pravidla ze souboru `storage.rules`

---

## 📝 Co nová pravidla dělají:

### ✅ Čtení (Read)
- **Všichni** mohou číst obrázky z `/skins/{skinId}/{fileName}`
- Veřejně přístupné pro zobrazení na webu

### ✅ Zápis (Write)
- **Prozatím všichni** mohou nahrávat obrázky (pro testování)
- Omezení: Max 10MB, pouze obrázky (image/*)
- Cesta: `/skins/{skinId}/screenshot.jpg`

### ✅ Mazání (Delete)
- **Prozatím všichni** mohou mazat (pro testování)

### ⚠️ TODO: Po spuštění webu
Změňte pravidla na:
```
allow write, delete: if request.auth != null 
  && request.auth.token.admin == true;
```

Tím zajistíte, že pouze přihlášení admini mohou nahrávat/mazat screenshoty.

---

## 🎯 Struktura Storage

```
gs://skiny-od-milose.firebasestorage.app/
└── skins/
    ├── 15623902808/
    │   └── screenshot.jpg
    ├── 15624099189/
    │   └── screenshot.jpg
    └── ...
```

Každý skin má vlastní složku podle `assetId`.

---

## 🧪 Testování

Po nasazení rules:

1. Jděte do admin panelu: `/admin/inventory`
2. Klikněte na řádek se skinem (rozbalí se detail)
3. V pravé části uvidíte "Screenshot Management"
4. Nahrajte screenshot ze hry
5. Jděte na detail stránku skinu: `/skin/{assetId}`
6. Měli byste vidět nahraný screenshot

---

## 🔒 Bezpečnost

**Současný stav (testování):**
- ✅ Kdokoliv může nahrávat/mazat
- ⚠️ Pouze pro vývoj!

**Produkční stav (TODO):**
- ✅ Pouze admini mohou nahrávat/mazat
- ✅ Všichni mohou číst
- ✅ Vyžaduje Firebase Authentication

---

## 📊 Limity Firebase Storage (Free tier)

- **Storage**: 5 GB
- **Downloads**: 1 GB/den
- **Uploads**: 20,000/den

Pro CS:GO skiny (cca 500 KB/screenshot):
- Můžete uložit ~10,000 screenshotů
- Stačí pro tisíce skinů!

---

## 🐛 Troubleshooting

### Chyba: "Permission denied"
- Zkontrolujte, že jste nasadili rules: `firebase deploy --only storage`
- Zkontrolujte Firebase Console → Storage → Rules

### Chyba: "File too large"
- Max velikost je 10 MB
- Zkomprimujte obrázek před nahráním

### Chyba: "Invalid file type"
- Pouze obrázky jsou povoleny (JPG, PNG, GIF, WebP)
- Zkontrolujte MIME type souboru

