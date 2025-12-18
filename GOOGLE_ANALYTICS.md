# 📊 Google Analytics - Dokumentace

## ✅ Implementace

Google Analytics je úspěšně nasazeno na webu **Skiny od Miloše**.

### 🔑 Konfigurace

**Measurement ID:** `G-D37SJ04939`  
**Tag ID:** `13160291471`

### 📁 Soubory

1. **`.env.local`** - Environment proměnné
   ```env
   NEXT_PUBLIC_GA_MEASUREMENT_ID=G-D37SJ04939
   NEXT_PUBLIC_GA_TAG_ID=13160291471
   ```

2. **`src/components/GoogleAnalytics.tsx`** - React komponenta
   - Načítá Google Analytics script
   - Inicializuje gtag
   - Sleduje page views

3. **`src/app/layout.tsx`** - Root layout
   - Importuje GoogleAnalytics komponentu
   - Přidává do `<body>` tagu

## 🚀 Jak to funguje

1. **Client-side tracking** - Komponenta je označena jako `'use client'`
2. **Next.js Script** - Používá `next/script` pro optimalizované načítání
3. **Strategy: afterInteractive** - Script se načte po interaktivitě stránky
4. **Automatické sledování** - Sleduje všechny page views automaticky

## 📈 Co se sleduje

- ✅ **Page Views** - Návštěvy stránek
- ✅ **User Sessions** - Uživatelské relace
- ✅ **Traffic Sources** - Zdroje návštěvnosti
- ✅ **User Demographics** - Demografické údaje
- ✅ **Device Information** - Informace o zařízeních

## 🔍 Ověření

### 1. Zkontrolujte v prohlížeči
Otevřete DevTools (F12) → Network → Filtr: `google-analytics` nebo `gtag`

### 2. Google Analytics Real-Time
1. Přihlaste se na [Google Analytics](https://analytics.google.com/)
2. Vyberte property `13160291471`
3. Klikněte na **Reports** → **Realtime**
4. Otevřete web a sledujte aktivitu v reálném čase

### 3. Google Tag Assistant
Nainstalujte [Google Tag Assistant](https://tagassistant.google.com/) a zkontrolujte, zda se tag správně načítá.

## 🛠️ Troubleshooting

### Analytics se nenačítá
1. Zkontrolujte `.env.local` - jsou proměnné správně nastavené?
2. Restartujte dev server: `npm run dev`
3. Zkontrolujte konzoli prohlížeče na chyby

### Data se nezobrazují
1. Počkejte 24-48 hodin na první data
2. Zkontrolujte Real-Time reports pro okamžitá data
3. Ověřte, že máte správné oprávnění k property

## 📝 Poznámky

- Analytics funguje pouze v **produkci** a **development** módu
- V development módu se data posílají, ale můžete je filtrovat v GA
- Pro vyloučení development dat použijte IP filtr v Google Analytics

## 🔗 Užitečné odkazy

- [Google Analytics Dashboard](https://analytics.google.com/)
- [Google Tag Manager](https://tagmanager.google.com/)
- [Next.js Analytics Docs](https://nextjs.org/docs/app/building-your-application/optimizing/analytics)

