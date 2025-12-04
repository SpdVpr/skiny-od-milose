# 📝 Changelog - CSFloat API Integration

## 🎉 Verze 2.0 - CSFloat API Integration (2025-12-03)

### ✨ Nové Funkce

#### 1. CSFloat API Endpoint
- **Soubor:** `src/app/api/csfloat/route.ts`
- **Endpoint:** `GET /api/csfloat?inspectLink=...`
- Získává detailní informace o skinu z CSFloat API
- Vrací float value, paint seed, high-res obrázek, stickery, doppler phase

#### 2. Automatická Synchronizace
- **Soubor:** `src/components/admin/SyncButtonDirect.tsx`
- Při synchronizaci inventáře se automaticky volá CSFloat API
- CSFloat data se ukládají do Firebase
- Rate limiting (500ms mezi požadavky)
- Fallback na Steam data při chybě

#### 3. Manuální Refresh Tlačítko
- **Soubor:** `src/components/admin/CSFloatRefreshButton.tsx`
- Nové tlačítko "Načíst CSFloat obrázky" v admin panelu
- Aktualizuje existující skiny o CSFloat data
- Zobrazuje progress a statistiky

#### 4. Vylepšené Zobrazení Obrázků
- **Soubor:** `src/components/SkinImageWithStickers.tsx`
- Automaticky používá nejlepší dostupný obrázek
- Priorita: CSFloat > Custom Screenshot > Steam

#### 5. Rozšířený Detail Skinu
- **Soubor:** `src/app/(public)/skin/[assetId]/page.tsx`
- CSFloat badge "✨ Přesný in-game vzhled"
- Float value s min/max range
- Doppler phase detection (💎 Phase 2, Ruby, atd.)

### 🔧 Technické Změny

#### Skin Interface
- **Soubor:** `src/types/skin.ts`
- Nová pole:
  - `csFloatImageUrl?: string` - High-res render z CSFloat
  - `paintIndex?: number` - Paint index (ID skinu)
  - `dopplerPhase?: string` - Doppler phase
  - `minFloat?: number` - Minimální možný float
  - `maxFloat?: number` - Maximální možný float

#### SkinUtils
- **Soubor:** `src/types/skin.ts`
- Nové funkce:
  - `getBestImageUrl()` - Vrátí nejlepší dostupný obrázek
  - `fetchCSFloatData()` - Zavolá CSFloat API

#### Admin Panel
- **Soubory:** 
  - `src/app/admin/page.tsx`
  - `src/app/admin/inventory/page.tsx`
- Přidáno CSFloat refresh tlačítko

### 📚 Dokumentace

#### Nové Soubory
1. **CSFLOAT_INTEGRATION.md** - Technická dokumentace
2. **CSFLOAT_QUICKSTART.md** - Rychlý start pro uživatele
3. **TEST_CSFLOAT.md** - Testovací instrukce
4. **CHANGELOG_CSFLOAT.md** - Tento soubor

### 🎯 Výhody

✅ **Přesné obrázky** - Skutečný in-game vzhled s opotřebením  
✅ **Stickery** - Správné pozice a vzhled  
✅ **Float/Pattern** - Přesné hodnoty místo kategorií  
✅ **Doppler** - Automatická detekce phase  
✅ **High-res** - Kvalitní obrázky  
✅ **Zdarma** - Žádný API key není potřeba  
✅ **Automatické** - Funguje při synchronizaci  
✅ **Fallback** - Steam obrázky jako záloha  

### 📊 Statistiky

- **Nové soubory:** 4
- **Upravené soubory:** 6
- **Nové API endpointy:** 1
- **Nové komponenty:** 1
- **Nová pole v databázi:** 5
- **Řádky kódu:** ~500

### 🔄 Migrace

#### Pro Existující Skiny
1. Jděte do admin panelu
2. Klikněte na "Načíst CSFloat obrázky"
3. Počkejte na dokončení
4. Hotovo!

#### Pro Nové Skiny
- Automaticky se načtou při synchronizaci inventáře
- Žádná další akce není potřeba

### ⚠️ Breaking Changes

**Žádné!** Všechny změny jsou zpětně kompatibilní.

### 🐛 Známé Problémy

1. **Rate Limiting** - CSFloat API může vrátit 429 při příliš mnoha požadavcích
   - **Řešení:** Implementován 500ms delay mezi požadavky

2. **Nedostupnost API** - CSFloat API může být dočasně nedostupné
   - **Řešení:** Automatický fallback na Steam obrázky

3. **Chybějící Inspect Link** - Některé skiny nemají inspect link
   - **Řešení:** Normální, použije se Steam obrázek

### 🚀 Budoucí Vylepšení

- [ ] Cacheování CSFloat obrázků lokálně
- [ ] Batch processing pro rychlejší refresh
- [ ] Retry mechanismus pro selhané požadavky
- [ ] Progress bar pro refresh operaci
- [ ] Filtrování skinů podle doppler phase
- [ ] Zobrazení sticker wear

### 📞 Podpora

Pro technické detaily viz `CSFLOAT_INTEGRATION.md`  
Pro rychlý start viz `CSFLOAT_QUICKSTART.md`  
Pro testování viz `TEST_CSFLOAT.md`

---

**Autor:** Augment AI  
**Datum:** 2025-12-03  
**Verze:** 2.0.0

