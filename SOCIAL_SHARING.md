# 📱 Social Media Sharing - Open Graph & Twitter Cards

## ✅ Implementace

Open Graph a Twitter Card meta tagy jsou úspěšně nasazeny pro optimální sdílení na sociálních sítích.

## 🎯 Co je nastaveno

### 📊 Open Graph (Facebook, LinkedIn, WhatsApp)
- **Typ:** Website
- **Název:** Skiny od Miloše CS2 Skiny
- **Popis:** Výkup, prodej i skiny na objednávku – vše na jednom místě. Bezpečnost, rychlost a spolehlivost.
- **URL:** https://www.skinyodmilose.cz
- **Obrázek:** 1200x630px (optimální rozměr pro Facebook)
- **Locale:** cs_CZ

### 🐦 Twitter Card
- **Typ:** Summary Large Image
- **Název:** Skiny od Miloše CS2 Skiny
- **Popis:** Výkup, prodej i skiny na objednávku – vše na jednom místě.
- **Obrázek:** 1200x630px

### 🔍 SEO Meta Tags
- **Title:** Skiny od Miloše CS2 Skiny
- **Description:** Kompletní popis služeb
- **Keywords:** CS2 skiny, Counter Strike 2, CS:GO skiny, nože CS2, rukavice CS2, výkup skinů, prodej skinů
- **Canonical URL:** https://www.skinyodmilose.cz
- **Robots:** Index, Follow

## 📁 Soubory

1. **`src/app/layout.tsx`** - Metadata konfigurace
2. **`public/og-image.jpg`** - Open Graph obrázek (1200x630px)

## 🧪 Testování

### 1. Facebook Sharing Debugger
1. Otevřete [Facebook Sharing Debugger](https://developers.facebook.com/tools/debug/)
2. Vložte URL: `https://www.skinyodmilose.cz`
3. Klikněte na "Debug"
4. Zkontrolujte náhled a metadata

### 2. Twitter Card Validator
1. Otevřete [Twitter Card Validator](https://cards-dev.twitter.com/validator)
2. Vložte URL: `https://www.skinyodmilose.cz`
3. Zkontrolujte náhled karty

### 3. LinkedIn Post Inspector
1. Otevřete [LinkedIn Post Inspector](https://www.linkedin.com/post-inspector/)
2. Vložte URL: `https://www.skinyodmilose.cz`
3. Zkontrolujte náhled

### 4. Open Graph Debugger (univerzální)
1. Otevřete [OpenGraph.xyz](https://www.opengraph.xyz/)
2. Vložte URL: `https://www.skinyodmilose.cz`
3. Zkontrolujte všechny meta tagy

## 📸 Open Graph Obrázek

### Požadavky:
- **Rozměry:** 1200x630px (doporučeno)
- **Formát:** JPG nebo PNG
- **Velikost:** Max 8 MB
- **Poměr stran:** 1.91:1

### Aktuální obrázek:
- **Soubor:** `public/og-image.jpg`
- **Popis:** Background obrázek webu

### Jak změnit obrázek:
1. Vytvořte nový obrázek 1200x630px
2. Uložte jako `public/og-image.jpg`
3. Vyčistěte cache na Facebook Debugger

## 🎨 Jak vypadá sdílení

### Facebook / WhatsApp
```
┌─────────────────────────────────┐
│                                 │
│     [OG Image 1200x630]        │
│                                 │
├─────────────────────────────────┤
│ Skiny od Miloše CS2 Skiny      │
│ Výkup, prodej i skiny na       │
│ objednávku – vše na jednom...  │
│ skinyodmilose.cz               │
└─────────────────────────────────┘
```

### Twitter
```
┌─────────────────────────────────┐
│                                 │
│     [Twitter Card Image]       │
│                                 │
├─────────────────────────────────┤
│ Skiny od Miloše CS2 Skiny      │
│ Výkup, prodej i skiny na       │
│ objednávku – vše na jednom...  │
└─────────────────────────────────┘
```

## 🔧 Troubleshooting

### Obrázek se nezobrazuje
1. Zkontrolujte, že `og-image.jpg` existuje v `public/`
2. Zkontrolujte rozměry obrázku (1200x630px)
3. Vyčistěte cache na Facebook Debugger
4. Počkejte 24 hodin na aktualizaci cache

### Starý obsah se stále zobrazuje
1. Použijte Facebook Sharing Debugger → "Scrape Again"
2. Vyčistěte cache prohlížeče
3. Zkuste sdílet v anonymním režimu

### Popis je zkrácený
- Facebook zobrazuje max ~300 znaků
- Twitter zobrazuje max ~200 znaků
- To je normální chování

## 📝 Poznámky

- Meta tagy jsou nastaveny v `src/app/layout.tsx`
- Používáme Next.js Metadata API
- Open Graph obrázek je sdílený pro všechny platformy
- Metadata se aplikují na všechny stránky webu

## 🔗 Užitečné odkazy

- [Open Graph Protocol](https://ogp.me/)
- [Twitter Cards Documentation](https://developer.twitter.com/en/docs/twitter-for-websites/cards/overview/abouts-cards)
- [Facebook Sharing Best Practices](https://developers.facebook.com/docs/sharing/webmasters)
- [Next.js Metadata API](https://nextjs.org/docs/app/api-reference/functions/generate-metadata)

