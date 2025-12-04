# 🐛 Debug: Stickery se nezobrazují

## Problém
Zbraň `assetId: 44622200072` má mít 2 stickery podle Steamu, ale nezobrazují se.

## Možné příčiny:

### 1. **Data nebyla reimportována**
- Stará data v databázi nemají `name` a `imageUrl` pro stickery
- **Řešení**: Reimportujte data

### 2. **Stickery nejsou v datech**
- Import selhal při načítání stickerů
- **Řešení**: Zkontrolujte console log při importu

### 3. **CSS pozice jsou špatně**
- Stickery jsou mimo viditelnou oblast
- **Řešení**: Zkontrolujte pozice v komponentě

### 4. **Obrázky stickerů se nenačítají**
- Steam CDN URL je špatně
- **Řešení**: Zkontrolujte network tab v DevTools

---

## 🔍 Jak debugovat:

### **Krok 1: Zkontrolujte data v Firestore**
```
1. Otevřete Firebase Console
2. Jděte do Firestore Database
3. Najděte dokument s assetId: 44622200072
4. Zkontrolujte pole "stickers"
```

**Co hledat:**
```json
{
  "stickers": [
    {
      "classId": "...",
      "position": 0,
      "name": "Sticker | ...",  // ← Musí být vyplněné!
      "imageUrl": "https://..."  // ← Musí být vyplněné!
    }
  ]
}
```

### **Krok 2: Zkontrolujte console v prohlížeči**
```
1. Otevřete stránku: http://localhost:3000/skin/44622200072
2. Stiskněte F12
3. Jděte do Console
4. Hledejte chyby nebo varování
```

### **Krok 3: Zkontrolujte Network tab**
```
1. F12 → Network tab
2. Filtr: "Img"
3. Obnovte stránku
4. Hledejte requesty na:
   - steamcommunity.com/economy/image/class/730/...
```

**Pokud vidíte 404 nebo 403:**
- Steam CDN URL je špatně
- ClassId je neplatný

### **Krok 4: Přidejte debug log**
Dočasně přidejte do `SkinImageWithStickers.tsx`:

```typescript
useEffect(() => {
  console.log('🎨 Skin stickers:', skin.stickers);
  console.log('🎨 Show stickers:', showStickers);
  // ... rest of code
}, [skin.stickers, showStickers]);
```

---

## 🔧 Rychlé řešení:

### **Řešení 1: Reimportujte data**
```
1. Jděte do admin panelu: /admin/inventory
2. Klikněte "Smazat vše"
3. Klikněte "Manual Import"
4. Nahrajte inventory.json
5. Počkejte na dokončení
6. Zkontrolujte kartu znovu
```

### **Řešení 2: Zkontrolujte inventory.json**
Otevřete `inventory.json` a najděte asset s `assetid: "44622200072"`:

```json
{
  "assets": [
    {
      "assetid": "44622200072",
      "asset_accessories": [  // ← Musí obsahovat stickery!
        {
          "classid": "...",
          "instanceid": "...",
          "parent_relationship_properties": [
            {
              "float_value": 0  // ← Pozice stickeru
            }
          ]
        }
      ]
    }
  ]
}
```

---

## 🧪 Test komponenty:

Vytvořte testovací stránku s hardcoded daty:

```tsx
const testSkin = {
  name: "Test Weapon",
  imageUrl: "https://...",
  stickers: [
    {
      classId: "1989262226",
      position: 0,
      name: "Test Sticker",
      imageUrl: "https://steamcommunity.com/economy/image/class/730/1989262226/96fx96f"
    }
  ]
};

<SkinImageWithStickers skin={testSkin} showStickers={true} />
```

Pokud se zobrazí → komponenta funguje, problém je v datech
Pokud se nezobrazí → problém je v komponentě

---

## 📝 Checklist:

- [ ] Data byla reimportována po změnách kódu
- [ ] Firestore obsahuje `stickers` pole s `name` a `imageUrl`
- [ ] Console neobsahuje chyby
- [ ] Network tab ukazuje requesty na Steam CDN
- [ ] Obrázky stickerů se načítají (status 200)
- [ ] `showStickers={true}` je nastaveno
- [ ] Skin má `stickers.length > 0`

---

## 🎯 Nejčastější chyba:

**Stará data v databázi!**

Pokud jste importovali data PŘED změnami kódu, stickery nemají `name` a `imageUrl`.

**Řešení:**
1. Smažte všechna data
2. Reimportujte znovu
3. Profit! 🎉

