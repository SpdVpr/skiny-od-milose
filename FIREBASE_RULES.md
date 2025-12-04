# Firebase Security Rules - Dokumentace

## Přehled

Tento projekt obsahuje bezpečnostní pravidla pro Firebase Firestore a Storage.

## 🎯 Nové funkce - Hromadné úpravy

V admin panelu (`/admin/inventory`) máte nyní k dispozici:

### Hromadné akce:
- ✅ **Zobrazit vše** - Zobrazí všechny skiny v aktuálním filtru
- ❌ **Skrýt vše** - Skryje všechny skiny v aktuálním filtru
- 👁️ **Zobrazit vybrané** - Zobrazí pouze vybrané skiny (checkbox)
- 🚫 **Skrýt vybrané** - Skryje pouze vybrané skiny (checkbox)

### Jak používat:
1. **Vyhledejte** skiny pomocí vyhledávacího pole
2. **Vyberte** skiny kliknutím na checkbox (nebo vyberte vše)
3. **Klikněte** na příslušné tlačítko pro hromadnou akci
4. Změny se provedou okamžitě v databázi

## Soubory

- `firestore.rules` - Pravidla pro Firestore databázi
- `storage.rules` - Pravidla pro Firebase Storage

## Aktuální konfigurace

### Firestore Rules

**Čtení (read):**
- ✅ Všichni uživatelé mohou číst skiny, které mají `isVisible: true`
- ❌ Skiny s `isVisible: false` jsou skryté pro veřejnost

**Zápis (write):**
- ❌ Zápis je zakázán pro všechny (bezpečnost)
- ✅ Data se zapisují pouze přes API routes (server-side)

### Storage Rules

**Čtení (read):**
- ✅ Všichni mohou číst obrázky

**Zápis (write):**
- ❌ Upload je zakázán (obrázky se načítají ze Steamu)

## Nasazení pravidel

### Pomocí Firebase Console

1. Otevřete [Firebase Console](https://console.firebase.google.com/)
2. Vyberte váš projekt
3. Pro **Firestore**:
   - Jděte do "Firestore Database" → "Rules"
   - Zkopírujte obsah `firestore.rules`
   - Klikněte na "Publish"
4. Pro **Storage**:
   - Jděte do "Storage" → "Rules"
   - Zkopírujte obsah `storage.rules`
   - Klikněte na "Publish"

### Pomocí Firebase CLI

```bash
# Instalace Firebase CLI (pokud ještě nemáte)
npm install -g firebase-tools

# Přihlášení
firebase login

# Inicializace projektu (pokud ještě není)
firebase init

# Nasazení pravidel
firebase deploy --only firestore:rules
firebase deploy --only storage:rules

# Nebo obojí najednou
firebase deploy --only firestore:rules,storage:rules
```

## Přidání autentizace (volitelné)

Pokud chcete přidat admin přístup s autentizací:

### 1. Povolte Firebase Authentication

V Firebase Console → Authentication → Sign-in method → povolte Email/Password

### 2. Nastavte custom claims pro admina

```javascript
// Spusťte v Firebase Functions nebo Admin SDK
const admin = require('firebase-admin');
admin.initializeApp();

// Nastavit uživatele jako admina
admin.auth().setCustomUserClaims('USER_UID', { admin: true });
```

### 3. Upravte pravidla

V `firestore.rules` odkomentujte řádky s admin kontrolou:

```javascript
// Místo:
allow write: if false;

// Použijte:
allow write: if request.auth != null 
  && request.auth.token.admin == true 
  && isValidSkin(request.resource.data);
```

### 4. Přidejte autentizaci do aplikace

```typescript
// src/lib/firebase.ts
import { getAuth } from "firebase/auth";

export const auth = getAuth(app);
```

## Testování pravidel

### V Firebase Console

1. Jděte do Firestore Database → Rules
2. Klikněte na "Rules Playground"
3. Testujte různé scénáře

### Lokálně s emulátory

```bash
# Instalace
npm install -g firebase-tools

# Spuštění emulátorů
firebase emulators:start

# Aplikace bude používat lokální emulátory
```

## Bezpečnostní doporučení

1. ✅ **Nikdy nepovolujte `allow read, write: if true;` v produkci**
2. ✅ **Vždy validujte data na serveru (API routes)**
3. ✅ **Používejte Firebase Admin SDK pro server-side operace**
4. ✅ **Pravidelně kontrolujte Firebase Console → Usage**
5. ✅ **Nastavte billing alerts**
6. ⚠️ **Aktuální konfigurace je bezpečná - zápis pouze přes API**

## Struktura dat v Firestore

### Kolekce: `skins`

```typescript
{
  assetId: string;          // ID z Steam inventáře
  classId: string;          // Steam class ID
  instanceId: string;       // Steam instance ID
  name: string;             // Název skinu
  marketHashName: string;   // Steam market hash name
  wear: string;             // Opotřebení (Factory New, Minimal Wear, atd.)
  imageUrl: string;         // URL obrázku
  inspectLink?: string;     // Inspect link
  inInventory: boolean;     // Je v inventáři
  isVisible: boolean;       // Je viditelný na webu
  price?: number;           // Cena (volitelné)
  updatedAt: Timestamp;     // Čas poslední aktualizace
}
```

## Troubleshooting

### "Missing or insufficient permissions"

- Zkontrolujte, že pravidla jsou správně nasazená
- Ověřte, že čtete pouze dokumenty s `isVisible: true`
- Pro admin operace použijte API routes

### "PERMISSION_DENIED"

- Ujistěte se, že používáte správný Firebase projekt
- Zkontrolujte Firebase Console → Project Settings → General

### Indexy

Pokud používáte složité queries, možná budete potřebovat vytvořit indexy:

```bash
# Firebase vám ukáže link na vytvoření indexu v error message
# Nebo vytvořte firestore.indexes.json
```

## Kontakt

Pro otázky nebo problémy vytvořte issue v repozitáři.

