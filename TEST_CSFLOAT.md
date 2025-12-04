# 🧪 Test CSFloat API

## Manuální Test

### 1. Spusťte aplikaci
```bash
npm run dev
```

### 2. Otevřete v prohlížeči
```
http://localhost:3000/api/csfloat?inspectLink=steam://rungame/730/76561202255233023/+csgo_econ_action_preview%20S76561198085719073A38748516228D14520433026567224793
```

### 3. Očekávaná odpověď
```json
{
  "success": true,
  "data": {
    "floatValue": 0.15234,
    "paintSeed": 661,
    "paintIndex": 282,
    "defIndex": 7,
    "imageUrl": "https://api.csfloat.com/render/item_xxxxx.png",
    "stickers": [],
    "dopplerPhase": null,
    "wearName": "Field-Tested",
    "fullItemName": "AK-47 | Redline (Field-Tested)",
    "itemName": "AK-47 | Redline",
    "weaponType": "AK-47",
    "rarity": "Classified",
    "rarityColor": "#d32ce6",
    "minFloat": 0.1,
    "maxFloat": 0.7
  }
}
```

## Test v Admin Panelu

### 1. Přihlaste se do admin panelu
```
http://localhost:3000/admin
```

### 2. Klikněte na "Načíst CSFloat obrázky"

### 3. Sledujte konzoli
Měli byste vidět:
```
🔍 [CSFloat] Fetching data for AK-47 | Redline...
✅ [CSFloat] Data received: { floatValue: 0.15, ... }
✅ [CSFloat] Updated AK-47 | Redline
```

### 4. Zkontrolujte Firebase
- Otevřete Firebase Console
- Jděte do Firestore Database
- Zkontrolujte skin collection
- Měli byste vidět nová pole: `csFloatImageUrl`, `dopplerPhase`, atd.

## Test na Frontendu

### 1. Otevřete homepage
```
http://localhost:3000
```

### 2. Zkontrolujte obrázky
- Měly by být high-res
- S přesným opotřebením
- Se stickery na správných pozicích

### 3. Otevřete detail skinu
```
http://localhost:3000/skin/[assetId]
```

### 4. Zkontrolujte CSFloat badge
- Měl by se zobrazit oranžový badge "✨ Přesný in-game vzhled"
- Float value s min/max range
- Doppler phase (pokud je to doppler)

## Troubleshooting

### API vrací 400
- Zkontrolujte, že inspect link je správně URL encoded
- Zkontrolujte, že inspect link je platný

### API vrací 429
- CSFloat rate limit
- Počkejte 1-2 minuty a zkuste znovu

### API vrací 500
- CSFloat API může být dočasně nedostupné
- Zkuste znovu později

### Obrázky se nezobrazují
- Zkontrolujte konzoli pro chyby
- Zkontrolujte Network tab v Developer Tools
- Zkontrolujte, že `csFloatImageUrl` je v Firebase

## Příklad Inspect Linků

### AK-47 | Redline
```
steam://rungame/730/76561202255233023/+csgo_econ_action_preview%20S76561198085719073A38748516228D14520433026567224793
```

### AWP | Dragon Lore
```
steam://rungame/730/76561202255233023/+csgo_econ_action_preview%20S76561198085719073A12345678901D14520433026567224793
```

### Karambit | Doppler
```
steam://rungame/730/76561202255233023/+csgo_econ_action_preview%20S76561198085719073A98765432109D14520433026567224793
```

## Úspěšný Test

✅ API endpoint vrací data  
✅ Admin panel načítá CSFloat data  
✅ Firebase obsahuje nová pole  
✅ Frontend zobrazuje CSFloat obrázky  
✅ Detail stránka zobrazuje CSFloat badge  
✅ Doppler phase se detekuje  

## Poznámky

- CSFloat API je zdarma, ale nemá oficiální dokumentaci
- Rate limiting je implementován (500ms mezi požadavky)
- Chyby se logují, ale nespadne celá aplikace
- Fallback na Steam obrázky funguje automaticky

