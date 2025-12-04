# 🎨 CSFloat API Integrace

## 📋 Přehled

Aplikace nyní používá **CSFloat API** pro získání přesných in-game obrázků zbraní s:
- ✅ Přesným opotřebením (float value)
- ✅ Přesným patternem (paint seed)
- ✅ Stickery na správných pozicích
- ✅ Doppler phase (pro Doppler skiny)
- ✅ High-resolution renderem

## 🔧 Jak to funguje?

### 1. CSFloat API Endpoint

**Soubor:** `src/app/api/csfloat/route.ts`

API endpoint přijímá Steam inspect link a vrací detailní informace o skinu:

```typescript
GET /api/csfloat?inspectLink=steam://rungame/730/...
```

**Odpověď:**
```json
{
  "success": true,
  "data": {
    "floatValue": 0.15234,
    "paintSeed": 661,
    "imageUrl": "https://api.csfloat.com/render/item_xxxxx.png",
    "dopplerPhase": "Phase 2",
    "stickers": [...],
    "minFloat": 0.0,
    "maxFloat": 1.0
  }
}
```

### 2. Automatická Synchronizace

**Soubor:** `src/components/admin/SyncButtonDirect.tsx`

Při synchronizaci inventáře ze Steamu se automaticky volá CSFloat API pro každý skin s inspect linkem:

```typescript
// Pro každý skin s inspect linkem
const csFloatData = await fetchCSFloatData(inspectLink);

// Uložíme CSFloat data do Firebase
skinData.csFloatImageUrl = csFloatData?.imageUrl;
skinData.floatValue = csFloatData?.floatValue;
skinData.paintSeed = csFloatData?.paintSeed;
skinData.dopplerPhase = csFloatData?.dopplerPhase;
```

### 3. Manuální Refresh

**Soubor:** `src/components/admin/CSFloatRefreshButton.tsx`

Tlačítko "Načíst CSFloat obrázky" v admin panelu:
- Načte všechny skiny s inspect linkem
- Zavolá CSFloat API pro každý skin
- Aktualizuje data v Firebase
- Má rate limiting (500ms pauza mezi požadavky)

### 4. Zobrazení Obrázků

**Soubor:** `src/types/skin.ts` - `SkinUtils.getBestImageUrl()`

Priorita obrázků:
1. **CSFloat obrázek** (nejpřesnější - s floatem, patternem, stickery)
2. **Custom screenshot** (nahraný adminem)
3. **Steam high-res** (fallback)

```typescript
const imageUrl = SkinUtils.getBestImageUrl(skin);
```

## 📊 Nová Pole v Skin Interface

```typescript
interface Skin {
  // CSFloat data
  csFloatImageUrl?: string;      // High-res render z CSFloat
  paintIndex?: number;            // Paint index (ID skinu)
  dopplerPhase?: string;          // "Phase 1", "Ruby", "Sapphire", atd.
  minFloat?: number;              // Min možný float
  maxFloat?: number;              // Max možný float
  
  // Existující pole (nyní s CSFloat prioritou)
  floatValue?: number;            // Přesný float (CSFloat > Steam)
  paintSeed?: number;             // Pattern seed (CSFloat > Steam)
}
```

## 🎯 Použití v Komponentách

### SkinImageWithStickers
```tsx
// Automaticky používá nejlepší dostupný obrázek
<SkinImageWithStickers skin={skin} />
```

### Detail Stránka
```tsx
// Zobrazí CSFloat badge pokud máme CSFloat data
{skin.csFloatImageUrl && (
  <div className="bg-gradient-to-r from-orange-600 to-red-600">
    ✨ Přesný in-game vzhled
  </div>
)}

// Zobrazí Doppler phase
{skin.dopplerPhase && (
  <div>💎 {skin.dopplerPhase}</div>
)}
```

## 🚀 Jak Použít

### Pro Nové Skiny
1. Klikněte na **"Sync Inventory (Direct)"** v admin panelu
2. CSFloat data se automaticky načtou pro všechny skiny s inspect linkem
3. Obrázky se zobrazí na frontendu

### Pro Existující Skiny
1. Klikněte na **"Načíst CSFloat obrázky"** v admin panelu
2. Počkejte na dokončení (může trvat několik minut)
3. Stránka se automaticky obnoví

## ⚠️ Důležité Poznámky

### Rate Limiting
- CSFloat API nemá oficiální rate limit
- Implementovali jsme 500ms pauzu mezi požadavky
- Pro velké inventáře může trvat několik minut

### Chyby
- Pokud CSFloat API selže, použije se Steam obrázek
- Chyby se logují do konzole, ale nespadne celá synchronizace
- Můžete zkusit refresh znovu pro skiny, které selhaly

### Cacheování
- CSFloat obrázky se ukládají do Firebase
- Není potřeba volat API při každém zobrazení
- Obrázky jsou permanentní URL (neexpirují)

## 🔍 Debugging

### Konzole Logy
```
🔍 [CSFloat] Fetching data for AK-47 | Redline...
✅ [CSFloat] Data received: { floatValue: 0.15, ... }
⚠️ [CSFloat] API error: 429 (rate limit)
❌ [CSFloat] Exception: Network error
```

### Kontrola v Firebase
```javascript
// Zkontrolujte, zda skin má CSFloat data
{
  "csFloatImageUrl": "https://api.csfloat.com/render/...",
  "floatValue": 0.15234,
  "paintSeed": 661,
  "dopplerPhase": "Phase 2"
}
```

## 📈 Výhody CSFloat API

✅ **Zdarma** - Žádný API key není potřeba  
✅ **Přesné** - Skutečný in-game vzhled  
✅ **High-res** - Kvalitní obrázky  
✅ **Stickery** - Správné pozice a vzhled  
✅ **Float/Pattern** - Přesné hodnoty  
✅ **Doppler** - Detekce phase  

## 🎨 Příklad Použití

```typescript
// Získání CSFloat dat
const csFloatData = await SkinUtils.fetchCSFloatData(inspectLink);

// Zobrazení nejlepšího obrázku
const imageUrl = SkinUtils.getBestImageUrl(skin);

// Kontrola, zda máme CSFloat data
if (skin.csFloatImageUrl) {
  console.log('Máme přesný in-game render!');
}
```

## 🔗 Odkazy

- CSFloat API: `https://csfloat.com/api/v1/`
- Dokumentace: Neoficiální, ale funguje
- Rate Limit: Není oficiálně uveden

