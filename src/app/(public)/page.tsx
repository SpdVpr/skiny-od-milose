'use client';

import React, { useEffect, useState } from 'react';
import { db } from '@/lib/firebase';
import { collection, query, where, getDocs, orderBy } from 'firebase/firestore';
import SkinCard from '@/components/SkinCard';
import ReviewsCarousel from '@/components/ReviewsCarousel';
import { Search, Facebook } from 'lucide-react';
import Image from 'next/image';
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
    { id: 'all', name: 'Vše' },
    { id: 'knife', name: 'Nože' },
    { id: 'gloves', name: 'Rukavice' },
    { id: 'sniper', name: 'Odstřelovací pušky' },
    { id: 'rifle', name: 'Pušky' },
    { id: 'pistol', name: 'Pistole' },
    { id: 'smg', name: 'Samopaly' },
    { id: 'agent', name: 'Agenti' },
    { id: 'other', name: 'Ostatní' },
];

type SortOption = 'newest' | 'tradable' | 'alphabetical';

export default function HomePage() {
    const [skins, setSkins] = useState<Skin[]>([]);
    const [reviews, setReviews] = useState<Review[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchQuery, setSearchQuery] = useState('');
    const [selectedCategory, setSelectedCategory] = useState('all');
    const [sortBy, setSortBy] = useState<SortOption>('newest');

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
        if (lower === 'agent') return 'agent';
        // Add more mappings if needed for "other"
        return 'other'; // Default to other if no specific match
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
        if (lowerName.includes('agent') || lowerName.includes('sir') || lowerName.includes('doctor') ||
            lowerName.includes('commander')) { // Basic agent checks
            return 'agent';
        }

        // Pokud nic neodpovídá, vrátíme 'other'
        return 'other';
    };

    // Filtrování a řazení skinů
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
    }).sort((a, b) => {
        if (sortBy === 'newest') {
            return (b.updatedAt?.seconds || 0) - (a.updatedAt?.seconds || 0);
        }
        if (sortBy === 'tradable') {
            // Tradable first
            if (a.tradable === b.tradable) {
                return (b.updatedAt?.seconds || 0) - (a.updatedAt?.seconds || 0); // Then by date
            }
            return (a.tradable ? -1 : 1);
        }
        if (sortBy === 'alphabetical') {
            return a.name.localeCompare(b.name);
        }
        return 0;
    });

    return (
        <div className="min-h-screen bg-black relative">
            {/* Background Image - Left */}
            <div
                className="fixed inset-0 z-0"
                style={{
                    backgroundImage: 'url("/bg-front-left3.png")',
                    backgroundSize: '70% auto',
                    backgroundPosition: 'left top',
                    backgroundRepeat: 'no-repeat',
                    WebkitMaskImage: 'linear-gradient(to right, black 20%, transparent 60%)',
                    maskImage: 'linear-gradient(to right, black 20%, transparent 60%)'
                }}
            />
            {/* Background Image - Right (Mirrored) */}
            <div
                className="fixed inset-0 z-0"
                style={{
                    backgroundImage: 'url("/bg-front-left3.png")',
                    backgroundSize: '70% auto',
                    backgroundPosition: 'left top',
                    backgroundRepeat: 'no-repeat',
                    transform: 'scaleX(-1)',
                    WebkitMaskImage: 'linear-gradient(to right, black 20%, transparent 60%)',
                    maskImage: 'linear-gradient(to right, black 20%, transparent 60%)',
                }}
            />
            <div className="fixed inset-0 z-0 bg-black/91" />

            {/* Content Wrapper */}
            <div className="relative z-10">
                {/* Header / Logo */}
                <header className="py-6 px-4 sm:px-6 lg:px-8">
                    <div className="max-w-7xl mx-auto text-center">
                        <h1 className="text-3xl lg:text-5xl text-white tracking-wide" style={{ fontFamily: "'SF Orson Casual', sans-serif", fontWeight: 300 }}>
                            skiny od miloše
                        </h1>
                    </div>
                </header>

                {/* Hero Section - Představení + Kontakt */}
                <section className="py-6 px-4 sm:px-6 lg:px-8">
                    <div className="max-w-7xl mx-auto">
                        <div className="bg-[#161616]/20 rounded-3xl p-6 lg:p-8 border border-[#161616]/20 shadow-2xl backdrop-blur-sm">
                            <div className="text-center max-w-5xl mx-auto">
                                <h2 className="text-xl lg:text-2xl font-bold text-white mb-3">
                                    Výkup, prodej i skiny na objednávku – vše na jednom místě.
                                </h2>
                                <div className="space-y-2 mb-6">
                                    <p className="text-base text-gray-300">
                                        Bezpečnost, rychlost a spolehlivost.
                                    </p>
                                    <p className="text-base text-gray-300">
                                        Tisíce uzavřených obchodů a stovky spokojených zákazníků.
                                    </p>
                                    <p className="text-base text-gray-300">
                                        S Vámi od roku 2023 jako ověřený partner na cestě k vašemu vysněnému skinu do hry Counter Strike 2.<br />
                                    </p>
                                </div>
                                <div className="flex flex-col items-center gap-4 mt-6">
                                    <h3 className="text-lg font-bold text-white">Kontaktuj mě:</h3>
                                    <div className="flex justify-center gap-4">
                                        <a
                                            href="https://www.facebook.com/skinyodmilose"
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="bg-[#161616]/20 hover:bg-[#161616]/40 text-white p-4 rounded-2xl transition-all shadow-lg border border-[#161616] backdrop-blur-sm"
                                            aria-label="Facebook"
                                        >
                                            <Facebook size={24} />
                                        </a>
                                        <a
                                            href="https://steamcommunity.com/id/skinyodmilose"
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="bg-[#161616]/20 hover:bg-[#161616]/40 text-white p-4 rounded-2xl transition-all shadow-lg flex items-center justify-center border border-[#161616] backdrop-blur-sm"
                                            aria-label="Steam"
                                        >
                                            <Image
                                                src="/steam_black_logo_icon_147078.png"
                                                alt="Steam"
                                                width={24}
                                                height={24}
                                                className="invert select-none pointer-events-none"
                                            />
                                        </a>
                                    </div>
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
                    <div className="mx-auto flex flex-col md:flex-row gap-4 items-center justify-between" style={{ maxWidth: '1500px' }}>
                        {/* Search and Sort */}
                        <div className="flex flex-col sm:flex-row gap-4 w-full md:w-auto">
                            {/* Search */}
                            <div className="relative w-full sm:w-64 shrink-0">
                                <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-500" size={20} />
                                <input
                                    type="text"
                                    placeholder="Hledej..."
                                    value={searchQuery}
                                    onChange={(e) => setSearchQuery(e.target.value)}
                                    className="w-full pl-12 pr-4 py-2.5 bg-[#161616] border border-[#161616] rounded-xl text-white placeholder-gray-500 focus:outline-none focus:border-gray-500 transition-all"
                                />
                            </div>

                            {/* Sort Dropdown */}
                            <select
                                value={sortBy}
                                onChange={(e) => setSortBy(e.target.value as SortOption)}
                                className="px-4 py-2.5 bg-[#161616] border border-[#161616] text-white rounded-xl focus:outline-none focus:border-gray-500 transition-all cursor-pointer"
                            >
                                <option value="newest">Nejnovější</option>
                                <option value="tradable">Tradable</option>
                                <option value="alphabetical">Abecedně</option>
                            </select>
                        </div>

                        {/* Categories */}
                        <div className="flex flex-wrap justify-center md:justify-end gap-2 flex-grow">
                            {CATEGORIES.map(category => (
                                <button
                                    key={category.id}
                                    onClick={() => setSelectedCategory(category.id)}
                                    className={`px-5 py-2.5 rounded-xl font-semibold transition-all flex items-center gap-2 ${selectedCategory === category.id
                                        ? 'bg-gray-200 text-gray-900 shadow-lg shadow-white/10'
                                        : 'bg-[#161616] text-gray-300 border border-[#161616] hover:border-[#161616] hover:bg-gray-800'
                                        }`}
                                >
                                    <span>{category.name}</span>
                                </button>
                            ))}
                        </div>
                    </div>
                </section>

                {/* Products Grid - 7 columns */}
                <section className="py-6 px-4 sm:px-6 lg:px-8">
                    <div className="mx-auto" style={{ maxWidth: '1500px' }}>
                        {loading ? (
                            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 xl:grid-cols-6 gap-4">
                                {[...Array(12)].map((_, i) => (
                                    <div key={i} className="h-96 bg-[#161616] rounded-2xl animate-pulse border border-[#161616]" />
                                ))}
                            </div>
                        ) : filteredSkins.length > 0 ? (
                            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 xl:grid-cols-6 gap-4">
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
                <footer className="py-12 px-4 sm:px-6 lg:px-8 border-t border-[#161616]">
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
        </div>
    );
}
