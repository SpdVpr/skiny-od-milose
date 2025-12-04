# 🎨 Implementace zobrazení stickerů na zbraních

## ✅ Co bylo implementováno

### 1. **Nová komponenta: `SkinImageWithStickers.tsx`**
Komponenta, která zobrazuje zbraň s překrytými stickery pomocí CSS positioning.

**Funkce:**
- ✅ Načítá obrázky stickerů ze Steam CDN
- ✅ Překrývá stickery přes obrázek zbraně na správných pozicích
- ✅ Podporuje až 5 stickerů (pozice 0-4)
- ✅ Různé pozice pro různé typy zbraní (rifle, pistol, knife)
- ✅ Automatický fallback pokud se sticker nepodaří načíst
- ✅ Drop shadow efekt pro lepší viditelnost

**Použití:**
```tsx
<SkinImageWithStickers 
  skin={skin}
  className="w-full h-full"
  showStickers={true}
/>
```

---

### 2. **Aktualizace `SkinCard.tsx`**
Karty skinů nyní zobrazují stickery přímo na obrázku.

**Změny:**
- ✅ Nahrazena `<img>` za `<SkinImageWithStickers>`
- ✅ Stickery se zobrazují na správných pozicích
- ✅ Hover efekt funguje i se stickery

---

### 3. **Aktualizace detail stránky `/skin/[assetId]`**
Detail stránka nyní zobrazuje stickery na obrázku.

**Změny:**
- ✅ Hlavní obrázek používá `<SkinImageWithStickers>`
- ✅ Pokud existuje vlastní screenshot, stickery se nezobrazují (už jsou na screenshotu)
- ✅ Pokud není screenshot, stickery se překryjí přes Steam CDN obrázek
- ✅ Sekce "Stickery" nyní zobrazuje obrázky stickerů

---

### 4. **Vylepšení importu stickerů**
Import nyní načítá kompletní informace o stickerech.

**Soubory:**
- `src/components/admin/ManualImport.tsx`
- `src/components/admin/SyncButtonDirect.tsx`

**Co se načítá:**
- ✅ `classId` - ID stickeru
- ✅ `position` - Pozice na zbraní (0-4)
- ✅ `name` - Název stickeru (např. "Sticker | Natus Vincere | Katowice 2015")
- ✅ `imageUrl` - URL obrázku stickeru ze Steam CDN

---

## 🎯 Jak to funguje

### **Pozice stickerů**

Stickery se umisťují na základě `position` hodnoty (0-4):

#### **Rifle (AK-47, M4A4, atd.):**
```
Pozice 0: 15% zleva, 45% shora (u zásobníku)
Pozice 1: 35% zleva, 40% shora (střed)
Pozice 2: 55% zleva, 42% shora (blíže k hlavni)
Pozice 3: 75% zleva, 38% shora (konec hlavně)
Pozice 4: 45% zleva, 25% shora (horní část)
```

#### **Pistol:**
```
Pozice 0: 20% zleva, 48% shora
Pozice 1: 40% zleva, 45% shora
Pozice 2: 60% zleva, 43% shora
Pozice 3: 75% zleva, 40% shora
Pozice 4: 50% zleva, 30% shora
```

#### **Knife (Nůž):**
```
Pozice 0: 25% zleva, 50% shora
Pozice 1: 50% zleva, 45% shora
Pozice 2: 70% zleva, 40% shora
Pozice 3: 40% zleva, 30% shora
Pozice 4: 60% zleva, 60% shora
```

**Poznámka:** Tyto pozice jsou přibližné a mohou se lišit podle konkrétního modelu zbraně.

---

### **Steam CDN API pro stickery**

Obrázky stickerů se načítají z:
```
https://steamcommunity.com/economy/image/class/730/{classId}/96fx96f
```

Kde:
- `730` = App ID pro CS:GO
- `{classId}` = Class ID stickeru
- `96fx96f` = Velikost obrázku (96x96 pixels)

---

## 📊 Struktura dat

### **SkinSticker interface:**
```typescript
export interface SkinSticker {
  classId: string;        // "1989262226"
  position: number;       // 0-4
  name?: string;          // "Sticker | Natus Vincere | Katowice 2015"
  imageUrl?: string;      // "https://community.cloudflare.steamstatic.com/economy/image/..."
}
```

### **Příklad v databázi:**
```json
{
  "assetId": "15623902808",
  "name": "AK-47 | Redline (Field-Tested)",
  "stickers": [
    {
      "classId": "1989262226",
      "position": 0,
      "name": "Sticker | Natus Vincere | Katowice 2015",
      "imageUrl": "https://community.cloudflare.steamstatic.com/economy/image/..."
    },
    {
      "classId": "1989262227",
      "position": 2,
      "name": "Sticker | Virtus.Pro | Katowice 2015",
      "imageUrl": "https://community.cloudflare.steamstatic.com/economy/image/..."
    }
  ]
}
```

---

## 🎨 Vizuální efekty

### **CSS efekty:**
- ✅ `drop-shadow` - Stín pro lepší viditelnost
- ✅ `pointer-events: none` - Stickery nepřekážejí kliknutí
- ✅ `transform: translate(-50%, -50%)` - Centrování na pozici
- ✅ `z-index: 10` - Stickery nad obrázkem zbraně

---

## 🧪 Testování

### **Krok 1: Reimportujte data**
Aby se načetly názvy a obrázky stickerů:
```
1. Jděte do admin panelu: /admin/inventory
2. Klikněte "Smazat vše" (pokud chcete čistý start)
3. Klikněte "Manual Import" nebo "Sync with Steam"
4. Nahrajte inventory.json
```

### **Krok 2: Zkontrolujte karty**
```
1. Jděte na hlavní stránku: /
2. Nastavte nějaké skiny jako viditelné
3. Měli byste vidět stickery na kartách
```

### **Krok 3: Zkontrolujte detail**
```
1. Klikněte na skin se stickery
2. Měli byste vidět:
   - Stickery překryté na hlavním obrázku
   - Sekci "Stickery" s obrázky a názvy
```

---

## ⚠️ Omezení

### **1. Pozice nejsou 100% přesné**
- Pozice stickerů jsou přibližné
- Liší se podle modelu zbraně
- Pro přesný vzhled použijte vlastní screenshot

### **2. Steam CDN může být pomalé**
- První načtení může trvat déle
- Obrázky se cachují v prohlížeči

### **3. Některé stickery nemusí mít obrázek**
- Pokud Steam API nevrátí `icon_url`
- Sticker se nezobrazí (automatický fallback)

---

## 🚀 Budoucí vylepšení

### **Možné vylepšení:**
1. **Přesnější pozice** - Načíst pozice z inspect linku
2. **3D rotace** - Umožnit otáčení zbraně
3. **Zoom na sticker** - Kliknutím na sticker zobrazit detail
4. **Sticker wear** - Zobrazit opotřebení stickeru (scraped)
5. **Sticker hodnota** - Zobrazit cenu stickeru

---

## 📝 Závěr

**Nyní máte plně funkční systém zobrazení stickerů!**

✅ Stickery se zobrazují na kartách
✅ Stickery se zobrazují na detail stránce
✅ Stickery mají správné pozice podle typu zbraně
✅ Stickery mají názvy a obrázky
✅ Automatický fallback pokud něco selže

**Pro nejlepší výsledky:**
- Použijte vlastní screenshoty pro drahé skiny
- Nechte automatické stickery pro běžné skiny

