# 🎮 Skiny od Miloše - CS:GO Skin Shop

Modern CS:GO skin trading platform with **CSFloat API integration** for accurate in-game renders.

## ✨ Features

- 🎨 **CSFloat Integration** - Accurate in-game renders with wear, pattern, and stickers
- 🔄 **Auto Sync** - Automatic Steam inventory synchronization
- 📊 **Detailed Stats** - Float value, paint seed, doppler phase detection
- 🎯 **Admin Panel** - Easy inventory management
- 🔥 **Real-time Updates** - Firebase Firestore integration
- 📱 **Responsive Design** - Works on all devices

## 🚀 Quick Start

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.

## 🎨 CSFloat API Integration

This project uses **CSFloat API** to fetch accurate in-game renders of CS:GO skins.

### Features
- ✅ Accurate float values and paint seeds
- ✅ High-resolution renders with wear
- ✅ Stickers on correct positions
- ✅ Doppler phase detection
- ✅ Automatic synchronization

### Documentation
- 📚 [Technical Documentation](CSFLOAT_INTEGRATION.md)
- 🚀 [Quick Start Guide](CSFLOAT_QUICKSTART.md)
- 🧪 [Testing Guide](TEST_CSFLOAT.md)
- 📝 [Changelog](CHANGELOG_CSFLOAT.md)

### Usage
1. Go to Admin Panel (`/admin`)
2. Click "Sync Inventory (Direct)" for new skins
3. Click "Načíst CSFloat obrázky" for existing skins
4. Done! CSFloat images will be displayed automatically

## 🛠️ Tech Stack

- **Framework:** Next.js 15 (App Router)
- **Database:** Firebase Firestore
- **Storage:** Firebase Storage
- **Styling:** Tailwind CSS
- **UI Components:** Lucide Icons
- **Notifications:** Sonner
- **APIs:** Steam API, CSFloat API

## 📁 Project Structure

```
src/
├── app/
│   ├── (public)/          # Public pages
│   ├── admin/             # Admin panel
│   └── api/               # API routes
│       ├── csfloat/       # CSFloat API endpoint
│       └── steam/         # Steam API endpoints
├── components/
│   ├── admin/             # Admin components
│   └── SkinCard.tsx       # Skin display components
├── lib/
│   └── firebase.ts        # Firebase config
└── types/
    └── skin.ts            # Type definitions
```

## 🔧 Environment Variables

Create a `.env.local` file:

```env
# Firebase
NEXT_PUBLIC_FIREBASE_API_KEY=your_api_key
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your_auth_domain
NEXT_PUBLIC_FIREBASE_PROJECT_ID=your_project_id
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your_storage_bucket
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
NEXT_PUBLIC_FIREBASE_APP_ID=your_app_id

# Steam
STEAM_ID=your_steam_id

# Google Analytics
NEXT_PUBLIC_GA_MEASUREMENT_ID=your_measurement_id
NEXT_PUBLIC_GA_TAG_ID=your_tag_id

# Admin
ADMIN_PASSWORD=your_admin_password
```

## 📊 Google Analytics

Google Analytics is integrated for tracking user behavior and site performance.

- 📚 [Google Analytics Documentation](GOOGLE_ANALYTICS.md)
- 📈 [Analytics Dashboard](https://analytics.google.com/)

## 📄 License

MIT
