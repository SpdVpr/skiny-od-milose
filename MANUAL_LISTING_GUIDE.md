# 📝 Průvodce manuálním přidáním skinů

## 🎯 Přehled

Systém manuálního listingu umožňuje přidat CS:GO skiny do inventáře **bez nutnosti importu ze Steamu**. Ideální pro:
- Skiny, které nejsou ve vašem Steam inventáři
- Testování nových položek
- Přidání skinů od jiných prodejců

---

## 🚀 Jak přidat skin manuálně

### **Krok 1: Otevřete admin panel**
```
http://localhost:3000/admin/inventory
```

### **Krok 2: Klikněte na "Manuální přidání"**
Zelené tlačítko v pravém horním rohu.

---

## 📋 Vyplnění formuláře

### **1. Název zbraně** *(povinné)*
Zadejte název **bez** opotřebení a StatTrak.

**Příklady:**
- ✅ `AK-47 | Redline`
- ✅ `AWP | Asiimov`
- ✅ `Karambit | Fade`
- ❌ `AK-47 | Redline (Field-Tested)` - špatně!
- ❌ `StatTrak™ AWP | Asiimov` - špatně!

---

### **2. StatTrak™** *(volitelné)*
Zaškrtněte checkbox, pokud je zbraň StatTrak™.

---

### **3. Opotřebení** *(povinné)*
Vyberte z dropdownu:
- **Factory New** (Zbrusu nový) - 0.00 - 0.07
- **Minimal Wear** (Téměř bez známek) - 0.07 - 0.15
- **Field-Tested** (Opotřebený) - 0.15 - 0.38
- **Well-Worn** (Hodně opotřebený) - 0.38 - 0.45
- **Battle-Scarred** (Poničený bojem) - 0.45 - 1.00

---

### **4. Pattern Seed (Číslo šablony vzoru)** *(povinné)*
Najdete v Steam inventáři u každé zbraně.

**Kde najít:**
1. Otevřete Steam inventář
2. Klikněte na zbraň
3. Najděte "Číslo šablony vzoru" nebo "Pattern Seed"

**Příklad:** `661`, `387`, `42`

**Proč je důležité:**
- Určuje vzor na zbrani (např. blue gem na Case Hardened)
- Ovlivňuje vzhled fade, marble fade, atd.

---

### **5. Float (Opotřebení)** *(volitelné)*
Přesná hodnota opotřebení (0.00 - 1.00).

**Kde najít:**
- Steam inventář (někdy)
- CSGOFloat extension
- Inspect link v CS:GO

**Příklady:**
- `0.0012` - velmi nízký float (Factory New)
- `0.2534` - průměrný float (Field-Tested)
- `0.9999` - velmi vysoký float (Battle-Scarred)

**Tip:** Nízký float = lepší vzhled = vyšší cena!

---

### **6. Cena (Kč)** *(povinné)*
Zadejte cenu v korunách.

**Příklad:** `5000`, `12500.50`

---

### **7. Stickery** *(volitelné)*
Můžete přidat až **5 stickerů**.

#### **Jak přidat sticker:**

1. **Klikněte "Přidat sticker"**
2. **Začněte psát název stickeru** - zobrazí se autocomplete s populárními stickery
3. **Vyberte sticker ze seznamu** - automaticky se doplní Class ID
4. **Opakujte pro další stickery**

#### **Populární stickery v databázi:**
- iBUYPOWER | Katowice 2014
- Titan | Katowice 2014
- Natus Vincere | Katowice 2015
- s1mple | Atlanta 2017
- Crown (Foil)
- Howling Dawn

#### **Kde najít Class ID stickeru:**
Pokud sticker není v seznamu:
1. **Steam Community Market** - v URL: `...classid=1989262226...`
2. **CSGOStash** - na stránce stickeru
3. **Steam inventář** - inspect element

**Příklad Class ID:** `1989262226` (iBUYPOWER | Katowice 2014)

---

## ✅ Odeslání formuláře

1. **Zkontrolujte všechny údaje**
2. **Klikněte "Přidat skin"**
3. **Počkejte na potvrzení** - zobrazí se toast notifikace
4. **Stránka se automaticky obnoví** - nový skin se zobrazí v tabulce

---

## 🎨 Co se stane po přidání?

### **Automaticky se vytvoří:**
- ✅ Unikátní `assetId` (např. `manual_1234567890_abc123`)
- ✅ Market hash name (např. `StatTrak™ AK-47 | Redline (Field-Tested)`)
- ✅ Fotka ze Steam CDN (pokud existuje)
- ✅ Metadata (rarity, kategorie, atd.)

### **Defaultní nastavení:**
- ⚠️ `isVisible: false` - **skin je skrytý** (nezobrazí se na webu)
- ⚠️ `inInventory: false` - označeno jako manuálně přidané

### **Jak zviditelnit skin:**
1. Najděte skin v tabulce
2. Zaškrtněte checkbox ve sloupci "Visible"
3. Klikněte "Save Changes"

---

## 💡 Tipy a triky

### **Tip 1: Rychlé přidání více skinů**
Formulář se po úspěšném přidání **automaticky vymaže**, takže můžete hned přidat další skin.

### **Tip 2: Kontrola před přidáním**
Zkontrolujte název na **Steam Community Market** - musí být přesně stejný!

### **Tip 3: Stickery zvyšují cenu**
Přidejte stickery, pokud je má originální skin - zvyšují hodnotu!

### **Tip 4: Pattern Seed je důležitý**
Pro Case Hardened, Fade, Marble Fade - pattern seed **výrazně ovlivňuje cenu**!

---

## 🐛 Řešení problémů

### **Problém: "Nepodařilo se načíst metadata ze Steam API"**
**Řešení:** Zkontrolujte název zbraně - musí být přesně stejný jako na Steam Market.

### **Problém: "Fotka se nenačítá"**
**Řešení:** 
1. Zkontrolujte název zbraně
2. Můžete nahrát vlastní screenshot pomocí "Screenshot Upload"

### **Problém: "Sticker se nezobrazuje"**
**Řešení:**
1. Zkontrolujte Class ID stickeru
2. Reimportujte data
3. Obnovte stránku

---

## 📸 Screenshot

Po přidání skinu můžete nahrát vlastní screenshot:
1. Najděte skin v tabulce
2. Klikněte na řádek pro rozbalení
3. Použijte "Screenshot Upload"
4. Nahrajte fotku ze hry (max 10MB)

---

## 🎯 Příklad kompletního formuláře

```
Název zbraně: AK-47 | Redline
StatTrak™: ✓
Opotřebení: Field-Tested
Pattern Seed: 387
Float: 0.2534
Cena: 8500

Stickery:
  Pozice 0: s1mple | Atlanta 2017
  Pozice 1: flamie | Atlanta 2017
  Pozice 2: Edward | Atlanta 2017
  Pozice 3: Natus Vincere | Katowice 2014
```

**Výsledek:**
```
StatTrak™ AK-47 | Redline (Field-Tested)
Pattern: 387
Float: 0.2534
Cena: 8,500 Kč
4 stickery
```

---

## 🚀 Hotovo!

Nyní můžete přidávat skiny manuálně bez nutnosti importu ze Steamu! 🎉

