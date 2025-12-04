'use client';

import React, { useEffect, useState } from 'react';
import { db } from '@/lib/firebase';
import { collection, query, where, getDocs, orderBy } from 'firebase/firestore';
import SkinCard from '@/components/SkinCard';
import ReviewsCarousel from '@/components/ReviewsCarousel';
import { Search, Facebook, MessageCircle } from 'lucide-react';
import { Skin } from '@/types/skin';

interface Review {
    id: string;
    author: string;
    rating: number;
    text: string;
    date: string;
}

// Kategorie zbraní
const CATEGORIES = [
    { id: 'all', name: 'Vše', icon: '🎯' },
    { id: 'rifle', name: 'Pušky', icon: '🔫' },
    { id: 'pistol', name: 'Pistole', icon: '🔫' },
    { id: 'sniper', name: 'Sniper', icon: '🎯' },
    { id: 'smg', name: 'SMG', icon: '💨' },
    { id: 'knife', name: 'Nože', icon: '🔪' },
    { id: 'gloves', name: 'Rukavice', icon: '🧤' },
];

export default function HomePage() {
    const [skins, setSkins] = useState<Skin[]>([]);
    const [reviews, setReviews] = useState<Review[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchQuery, setSearchQuery] = useState('');
    const [selectedCategory, setSelectedCategory] = useState('all');

    useEffect(() => {
        const fetchData = async () => {
            try {
                // Fetch skins
                console.log('🔍 [FRONT PAGE] Načítám viditelné skiny...');
                const skinsQuery = query(
                    collection(db, 'skins'),
                    where('isVisible', '==', true)
                );
                const skinsSnapshot = await getDocs(skinsQuery);
                console.log(`🔍 [FRONT PAGE] Nalezeno ${skinsSnapshot.docs.length} viditelných skinů`);
                const skinsData = skinsSnapshot.docs.map(doc => doc.data()) as Skin[];
                setSkins(skinsData);

                // Fetch reviews
                const reviewsQuery = query(
                    collection(db, 'reviews'),
                    orderBy('date', 'desc'),
                    orderBy('createdAt', 'desc')
                );
                const reviewsSnapshot = await getDocs(reviewsQuery);
                const reviewsData = reviewsSnapshot.docs.map(doc => ({
                    id: doc.id,
                    ...doc.data()
                })) as Review[];
                console.log('✅ [FRONT PAGE] Loaded reviews:', reviewsData.length);
                setReviews(reviewsData);
            } catch (error) {
                console.error("❌ [FRONT PAGE] Error fetching data:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, []);

    // Mapování Steam kategorií na naše kategorie
    const mapSteamCategory = (steamCategory: string): string => {
        const lower = steamCategory.toLowerCase();
        // Steam API používá různé názvy, musíme je mapovat
        if (lower === 'melee' || lower === 'knife') return 'knife';
        if (lower === 'pistol') return 'pistol';
        if (lower === 'rifle') return 'rifle';
        if (lower === 'sniper rifle' || lower === 'sniperrifle') return 'sniper';
        if (lower === 'smg' || lower === 'submachine gun') return 'smg';
        if (lower === 'gloves') return 'gloves';
        return '';
    };

    // Funkce pro určení kategorie podle názvu zbraně
    const getCategoryFromName = (name: string): string => {
        const lowerName = name.toLowerCase();
        if (lowerName.includes('ak-47') || lowerName.includes('m4a4') || lowerName.includes('m4a1-s') ||
            lowerName.includes('galil') || lowerName.includes('famas') || lowerName.includes('aug') ||
            lowerName.includes('sg 553')) {
            return 'rifle';
        }
        if (lowerName.includes('awp') || lowerName.includes('ssg 08') || lowerName.includes('scar-20') ||
            lowerName.includes('g3sg1')) {
            return 'sniper';
        }
        if (lowerName.includes('glock') || lowerName.includes('usp-s') || lowerName.includes('p250') ||
            lowerName.includes('five-seven') || lowerName.includes('tec-9') || lowerName.includes('cz75') ||
            lowerName.includes('desert eagle') || lowerName.includes('r8 revolver') || lowerName.includes('dual berettas') ||
            lowerName.includes('p2000')) {
            return 'pistol';
        }
        if (lowerName.includes('mp9') || lowerName.includes('mac-10') || lowerName.includes('mp7') ||
            lowerName.includes('ump-45') || lowerName.includes('p90') || lowerName.includes('pp-bizon') ||
            lowerName.includes('mp5-sd')) {
            return 'smg';
        }
        if (lowerName.includes('knife') || lowerName.includes('karambit') || lowerName.includes('bayonet') ||
            lowerName.includes('butterfly') || lowerName.includes('flip') || lowerName.includes('gut') ||
            lowerName.includes('falchion') || lowerName.includes('bowie') || lowerName.includes('shadow daggers') ||
            lowerName.includes('huntsman') || lowerName.includes('m9') || lowerName.includes('stiletto') ||
            lowerName.includes('talon') || lowerName.includes('ursus') || lowerName.includes('navaja') ||
            lowerName.includes('skeleton') || lowerName.includes('survival') || lowerName.includes('paracord') ||
            lowerName.includes('classic') || lowerName.includes('nomad') || lowerName.includes('nůž')) {
            return 'knife';
        }
        if (lowerName.includes('gloves') || lowerName.includes('rukavice')) {
            return 'gloves';
        }
        // Pokud nic neodpovídá, vrátíme prázdný string (ne 'all')
        return '';
    };

    // Filtrování skinů
    const filteredSkins = skins.filter(skin => {
        const matchesSearch = skin.name.toLowerCase().includes(searchQuery.toLowerCase());

        // Určíme kategorii:
        // 1. Pokud má skin.category (ze Steamu nebo manuálně), zmapujeme ho na naši kategorii
        // 2. Jinak určíme podle názvu (fallback)
        let skinCategory = '';
        if (skin.category) {
            // Máme kategorii ze Steamu nebo manuálně - zmapujeme ji
            skinCategory = mapSteamCategory(skin.category);
            // Debug: Vypíšeme kategorii pro nože
            if (skin.name.toLowerCase().includes('knife') || skin.name.toLowerCase().includes('karambit') || skin.name.toLowerCase().includes('bayonet')) {
                console.log(`🔪 [FILTER] Nůž: ${skin.name}, Steam category: "${skin.category}", Mapped: "${skinCategory}"`);
            }
        }
        // Pokud mapování nevrátilo nic, zkusíme určit podle názvu
        if (!skinCategory) {
            skinCategory = getCategoryFromName(skin.name);
            if (skin.name.toLowerCase().includes('knife') || skin.name.toLowerCase().includes('karambit') || skin.name.toLowerCase().includes('bayonet')) {
                console.log(`🔪 [FILTER] Nůž (fallback): ${skin.name}, Category from name: "${skinCategory}"`);
            }
        }

        // Pokud je vybraná kategorie 'all', zobrazíme vše
        // Jinak musí kategorie odpovídat
        const matchesCategory = selectedCategory === 'all' || skinCategory === selectedCategory;

        return matchesSearch && matchesCategory;
    });

    return (
        <div className="min-h-screen bg-black">
            {/* Header / Logo */}
            <header className="py-6 px-4 sm:px-6 lg:px-8">
                <div className="max-w-7xl mx-auto text-center">
                    <h1 className="text-5xl lg:text-6xl text-white tracking-wide" style={{ fontFamily: 'Orbitron, sans-serif', fontWeight: 400 }}>
                        Skiny od Miloše
                    </h1>
                </div>
            </header>

            {/* Hero Section - Představení + Kontakt */}
            <section className="py-6 px-4 sm:px-6 lg:px-8">
                <div className="max-w-7xl mx-auto">
                    <div className="bg-gradient-to-br from-gray-900 to-gray-800 rounded-3xl p-6 lg:p-8 border border-gray-700 shadow-2xl">
                        <div className="text-center max-w-3xl mx-auto">
                            <h2 className="text-2xl lg:text-3xl font-bold text-white mb-3">
                                Vítejte v obchodě s CS:GO skiny
                            </h2>
                            <p className="text-base text-gray-300 mb-6">
                                Nabízím kvalitní CS:GO skiny za férové ceny. Rychlé jednání, ověřené float hodnoty a stovky spokojených zákazníků.
                            </p>
                            <div className="flex flex-wrap justify-center gap-3">
                                <a
                                    href="https://www.facebook.com/skinyodmilose"
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="bg-blue-600 hover:bg-blue-700 text-white px-5 py-2.5 rounded-xl font-semibold transition-all flex items-center gap-2 shadow-lg"
                                >
                                    <Facebook size={18} />
                                    Facebook
                                </a>
                                <a
                                    href="https://www.facebook.com/skinyodmilose"
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="bg-gray-700 hover:bg-gray-600 text-white px-5 py-2.5 rounded-xl font-semibold transition-all flex items-center gap-2 shadow-lg"
                                >
                                    <MessageCircle size={18} />
                                    Kontakt
                                </a>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Reviews Section */}
            <section className="py-6 px-4 sm:px-6 lg:px-8">
                <div className="mx-auto" style={{ maxWidth: '1500px' }}>
                    <ReviewsCarousel reviews={reviews} />
                </div>
            </section>

            {/* Filter Section */}
            <section className="py-4 px-4 sm:px-6 lg:px-8">
                <div className="max-w-7xl mx-auto">
                    {/* Search */}
                    <div className="relative w-full max-w-2xl mx-auto mb-4">
                        <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-500" size={20} />
                        <input
                            type="text"
                            placeholder="Hledej..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="w-full pl-12 pr-4 py-2.5 bg-gray-900 border border-gray-800 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:border-blue-500 transition-all"
                        />
                    </div>

                    {/* Categories */}
                    <div className="flex flex-wrap justify-center gap-2">
                        {CATEGORIES.map(category => (
                            <button
                                key={category.id}
                                onClick={() => setSelectedCategory(category.id)}
                                className={`px-5 py-2.5 rounded-xl font-semibold transition-all flex items-center gap-2 ${selectedCategory === category.id
                                        ? 'bg-blue-600 text-white shadow-lg shadow-blue-500/50'
                                        : 'bg-gray-900 text-gray-300 border border-gray-800 hover:border-gray-700 hover:bg-gray-800'
                                    }`}
                            >
                                <span>{category.icon}</span>
                                <span>{category.name}</span>
                            </button>
                        ))}
                    </div>
                </div>
            </section>

            {/* Products Grid - 5 columns */}
            <section className="py-6 px-4 sm:px-6 lg:px-8">
                <div className="mx-auto" style={{ maxWidth: '1800px' }}>
                    {loading ? (
                        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
                            {[...Array(10)].map((_, i) => (
                                <div key={i} className="h-96 bg-gray-900 rounded-2xl animate-pulse border border-gray-800" />
                            ))}
                        </div>
                    ) : filteredSkins.length > 0 ? (
                        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
                            {filteredSkins.map(skin => (
                                <SkinCard key={skin.assetId} skin={skin} />
                            ))}
                        </div>
                    ) : (
                        <div className="text-center py-20">
                            <p className="text-gray-500 text-lg">
                                {searchQuery || selectedCategory !== 'all'
                                    ? 'Žádné skiny nenalezeny. Zkuste jiné hledání nebo kategorii.'
                                    : 'Momentálně nejsou k dispozici žádné skiny.'}
                            </p>
                        </div>
                    )}
                </div>
            </section>

            {/* Footer */}
            <footer className="py-12 px-4 sm:px-6 lg:px-8 border-t border-gray-900">
                <div className="max-w-7xl mx-auto text-center">
                    <p className="text-gray-500 text-sm">
                        © 2024 Skiny od Miloše. Všechna práva vyhrazena.
                    </p>
                    <div className="flex justify-center gap-6 mt-4">
                        <a href="https://www.facebook.com/skinyodmilose" target="_blank" rel="noopener noreferrer" className="text-gray-500 hover:text-blue-500 transition-colors">
                            <Facebook size={20} />
                        </a>
                    </div>
                </div>
            </footer>
        </div>
    );
}
