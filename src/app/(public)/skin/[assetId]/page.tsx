'use client';

import React, { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { db } from '@/lib/firebase';
import { doc, getDoc } from 'firebase/firestore';
import { Skin, SkinUtils } from '@/types/skin';
import { ArrowLeft, ExternalLink, Award, Hash, Tag, TrendingUp, Shield, Calendar, ArrowLeftRight, Facebook, X } from 'lucide-react';
import SkinStats from '@/components/SkinStats';
import SkinImageWithStickers from '@/components/SkinImageWithStickers';

export default function SkinDetailPage() {
    const params = useParams();
    const router = useRouter();
    const assetId = params.assetId as string;

    const [skin, setSkin] = useState<Skin | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [currency, setCurrency] = useState<'CZK' | 'EUR'>('CZK');
    const [exchangeRate, setExchangeRate] = useState<number>(25);
    const [isImageModalOpen, setIsImageModalOpen] = useState(false);

    useEffect(() => {
        const fetchSkin = async () => {
            try {
                console.log('🔍 [DETAIL] Načítám skin:', assetId);
                const skinDoc = await getDoc(doc(db, 'skins', assetId));

                // Fetch exchange rate
                const settingsDoc = await getDoc(doc(db, 'settings', 'currency'));
                if (settingsDoc.exists()) {
                    setExchangeRate(settingsDoc.data().exchangeRate);
                }

                if (!skinDoc.exists()) {
                    setError('Skin nebyl nalezen');
                    return;
                }

                const skinData = skinDoc.data() as Skin;
                console.log('✅ [DETAIL] Skin načten:', skinData);
                console.log('🎨 [DETAIL] CSFloat Image URL:', skinData.csFloatImageUrl);
                console.log('🖼️ [DETAIL] Best Image URL:', SkinUtils.getBestImageUrl(skinData));
                setSkin(skinData);
            } catch (err: any) {
                console.error('❌ [DETAIL] Chyba při načítání:', err);
                setError(err.message);
            } finally {
                setLoading(false);
            }
        };

        if (assetId) {
            fetchSkin();
        }
    }, [assetId]);

    if (loading) {
        return (
            <div className="min-h-screen bg-black flex items-center justify-center">
                <div className="text-center">
                    <div className="w-16 h-16 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
                    <p className="text-gray-400">Načítám...</p>
                </div>
            </div>
        );
    }

    if (error || !skin) {
        return (
            <div className="min-h-screen bg-black flex items-center justify-center">
                <div className="text-center">
                    <h1 className="text-4xl font-bold text-white mb-4">Skin nenalezen</h1>
                    <p className="text-gray-400 mb-8">{error || 'Tento skin neexistuje'}</p>
                    <button
                        onClick={() => router.push('/')}
                        className="bg-gray-700 text-white px-6 py-3 rounded-lg hover:bg-gray-600 transition-colors flex items-center gap-2 mx-auto"
                    >
                        <ArrowLeft size={20} />
                        Zpět na hlavní stránku
                    </button>
                </div>
            </div>
        );
    }

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
                    maskImage: 'linear-gradient(to right, black 20%, transparent 60%)'
                }}
            />
            <div className="fixed inset-0 z-0 bg-black/86" />

            <div className="relative z-10 mx-auto px-4 sm:px-6 lg:px-8 py-6" style={{ maxWidth: '1500px' }}>
                {/* Back Button */}
                <button
                    onClick={() => router.back()}
                    className="flex items-center gap-2 text-gray-400 hover:text-white mb-3 transition-colors"
                >
                    <ArrowLeft size={20} />
                    Zpět
                </button>

                <div className="grid grid-cols-1 lg:grid-cols-[2fr_1fr] gap-4 h-full">
                    {/* Left Column - Images */}
                    <div className="space-y-4">
                        {/* Main Image - Logika:
                            1. Pokud existuje detailImageUrl → zobrazí se jen tento obrázek
                            2. Jinak: Custom Screenshot OR Steam Image
                        */}
                        <div
                            className="bg-[#161616] rounded-2xl p-1 shadow-lg border border-[#161616] overflow-hidden flex flex-col justify-start h-[50vh] lg:h-auto lg:max-h-[850px] cursor-pointer"
                            onClick={() => setIsImageModalOpen(true)}
                        >
                            {skin.detailImageUrl ? (
                                <>
                                    <div className="flex-1 min-h-0 flex items-start justify-center">
                                        <img
                                            src={skin.detailImageUrl}
                                            alt={`${skin.name} - Detail`}
                                            className="h-full object-cover object-top rounded-lg"
                                            style={{ width: '70%' }}
                                        />
                                    </div>
                                </>
                            ) : (
                                <div className="relative rounded-lg overflow-hidden h-full flex items-center justify-center w-full">
                                    <SkinImageWithStickers
                                        skin={skin}
                                        className="w-full h-full"
                                        showStickers={true}
                                        cropTop={0}
                                        imageObjectFit="cover"
                                        imageObjectPosition="center top"
                                        imageClassName="!object-contain lg:!object-cover"
                                    />
                                </div>
                            )}
                        </div>


                    </div>

                    {/* Right Column - Info */}
                    <div className="space-y-4">
                        {/* Title */}
                        <div>
                            <h1 className="text-xl font-medium text-gray-300 mb-1">
                                {skin.name}
                            </h1>
                        </div>

                        {/* Price - Always First */}
                        <div className="bg-[#161616] text-white rounded-xl p-3 shadow-lg border border-[#161616]">
                            <div className="flex items-center justify-center gap-3 mb-2">
                                <span className="text-lg font-medium text-white">Cena</span>
                            </div>
                            <div className="flex items-center justify-center gap-4 mb-2">
                                <div className="text-2xl font-bold text-center">
                                    {skin.price ? (
                                        (() => {
                                            if (currency === 'CZK') {
                                                return new Intl.NumberFormat('cs-CZ', {
                                                    style: 'currency',
                                                    currency: 'CZK',
                                                    maximumFractionDigits: 0
                                                }).format(skin.price);
                                            } else {
                                                const priceEur = skin.price / exchangeRate;
                                                return new Intl.NumberFormat('de-DE', {
                                                    style: 'currency',
                                                    currency: 'EUR',
                                                    maximumFractionDigits: 2
                                                }).format(priceEur);
                                            }
                                        })()
                                    ) : 'na dotaz'}
                                </div>

                                {skin.price && (
                                    <button
                                        onClick={() => setCurrency(prev => prev === 'CZK' ? 'EUR' : 'CZK')}
                                        className="bg-[#161616] hover:bg-gray-800 text-gray-400 hover:text-white px-3 py-1.5 rounded-lg text-sm font-medium transition-colors border border-gray-800 flex items-center gap-2"
                                        title="Přepnout měnu"
                                    >
                                        <ArrowLeftRight size={14} />
                                        {currency === 'CZK' ? 'EUR' : 'CZK'}
                                    </button>
                                )}
                            </div>

                            {/* Price Disclaimer - MOVED UP */}
                            <div className="mt-3 mb-3 pt-3 border-t border-[#161616] text-center">
                                <p className="text-sm text-white italic">
                                    Tato cena je pouze orientační a je nutné jí ověřit.
                                    <br />
                                    Nacenění skinů vychází z prodejních dat nejověřenějších obchodních stránek.
                                </p>
                            </div>

                            {/* Tradable/Marketable Status */}
                            {(skin.tradable !== undefined || skin.marketable !== undefined) && (() => {
                                // Check if trade restriction date has passed
                                const isTradeRestricted = skin.tradeRestrictionDate &&
                                    new Date(skin.tradeRestrictionDate) > new Date();

                                return (
                                    <div className="pt-4 border-t border-[#161616]">
                                        <div className="flex flex-wrap gap-2 justify-center">
                                            {/* Show trade lock if restriction date is in the future */}
                                            {isTradeRestricted ? (
                                                <span className="bg-red-900/50 text-red-400 px-3 py-1.5 rounded text-xs font-medium border border-red-700">
                                                    🔒 Nelze vyměnit - Obchodovatelné od: {skin.tradeRestrictionDate}
                                                </span>
                                            ) : (
                                                <>
                                                    {/* Show normal badges if no restriction or date has passed */}
                                                    {skin.tradable && (
                                                        <span className="bg-green-900/50 text-green-400 px-3 py-1.5 rounded text-xs font-medium border border-green-700">
                                                            ✅ Lze vyměnit
                                                        </span>
                                                    )}
                                                    {skin.marketable && (
                                                        <span className="bg-blue-900/50 text-blue-400 px-3 py-1.5 rounded text-xs font-medium border border-blue-700">
                                                            💰 Lze prodat
                                                        </span>
                                                    )}
                                                    {!skin.tradable && skin.tradable !== undefined && (
                                                        <span className="bg-red-900/50 text-red-400 px-3 py-1.5 rounded text-xs font-medium border border-red-700">
                                                            🔒 Nelze vyměnit
                                                        </span>
                                                    )}
                                                </>
                                            )}
                                        </div>
                                    </div>
                                );
                            })()}

                            {/* Contact Button */}
                            <div className="mt-4 pt-4 border-t border-[#161616] flex justify-center">
                                <a
                                    href="https://www.facebook.com/skinyodmilose"
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="bg-gray-700 hover:bg-gray-600 text-white px-8 py-3 rounded-xl font-bold flex items-center gap-2 transition-colors shadow-lg"
                                >
                                    <Facebook size={20} />
                                    Kontaktuj mě
                                </a>
                            </div>


                        </div>



                        {/* Float & Pattern Removed as requested */}

                        {/* Doppler Phase (pokud je to doppler) */}
                        {skin.dopplerPhase && (
                            <div className="bg-[#0d0d0e] rounded-xl p-4 border border-[#0d0d0e]">
                                <div className="flex items-center gap-2 mb-2">
                                    <span className="text-2xl">💎</span>
                                    <span className="text-sm font-medium text-gray-400">Doppler Phase</span>
                                </div>
                                <div className="text-2xl font-bold text-blue-400">
                                    {skin.dopplerPhase}
                                </div>
                            </div>
                        )}

                        {/* Stats Component */}
                        <SkinStats skin={skin} />

                        {/* Stickers Detail (if any) */}
                        {skin.stickers && skin.stickers.length > 0 && (
                            <div className="bg-[#0d0d0e] rounded-xl p-6 border border-gray-800">
                                <h3 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
                                    <Shield size={20} className="text-gray-400" />
                                    Stickery ({skin.stickers.length})
                                </h3>
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                    {skin.stickers.map((sticker, idx) => (
                                        <div
                                            key={idx}
                                            className="bg-gray-800 rounded-lg p-4 border border-[#0d0d0e]"
                                        >
                                            <div className="flex items-center gap-3 mb-2">
                                                {/* Sticker Image */}
                                                {sticker.imageUrl && (
                                                    <img
                                                        src={sticker.imageUrl}
                                                        alt={sticker.name || 'Sticker'}
                                                        className="w-12 h-12 object-contain"
                                                    />
                                                )}
                                                <div className="flex-1">
                                                    <div className="text-xs text-gray-400 font-bold">
                                                        Pozice {sticker.position}
                                                    </div>
                                                    {sticker.name && (
                                                        <div className="text-sm font-medium text-white mt-1">
                                                            {sticker.name}
                                                        </div>
                                                    )}
                                                </div>
                                            </div>
                                            <div className="text-xs text-gray-500 font-mono">
                                                ID: {sticker.classId}
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}

                        {/* Inspect in Game Button */}
                        {skin.inspectLink && (
                            <a
                                href={skin.inspectLink}
                                className="block bg-gray-700 rounded-2xl p-6 text-white shadow-lg hover:bg-gray-600 transition-all"
                            >
                                <div className="text-center">
                                    <div className="text-sm font-bold mb-2">
                                        🎮 Prohlédnout ve hře CS:GO
                                    </div>
                                    <div className="text-xs opacity-90">
                                        Otevře se vám hra s přesným náhledem
                                    </div>
                                    <div className="flex items-center justify-center gap-2 mt-3">
                                        <ExternalLink size={18} />
                                        <span className="font-bold">Otevřít CS:GO</span>
                                    </div>
                                </div>
                            </a>
                        )}

                        {/* Additional Info Removed as requested */}
                    </div>
                </div>
            </div>
            {/* Image Modal */}
            {isImageModalOpen && skin && (
                <div
                    className="fixed inset-0 z-50 bg-black/95 backdrop-blur-sm flex items-center justify-center p-4"
                    onClick={() => setIsImageModalOpen(false)}
                >
                    <button
                        onClick={() => setIsImageModalOpen(false)}
                        className="absolute top-4 right-4 text-white hover:text-gray-300 transition-colors z-50 bg-black/50 p-2 rounded-full"
                    >
                        <X size={32} />
                    </button>

                    <div
                        className="relative w-full h-full flex items-center justify-center pointer-events-none"
                        onClick={(e) => e.stopPropagation()}
                    >
                        {skin.detailImageUrl ? (
                            <img
                                src={skin.detailImageUrl}
                                alt={`${skin.name} - Fullscreen`}
                                className="max-w-full max-h-full object-contain pointer-events-auto"
                            />
                        ) : (
                            <SkinImageWithStickers
                                skin={skin}
                                className="w-full h-full pointer-events-auto"
                                showStickers={true}
                                cropTop={0}
                                imageObjectFit="contain"
                                imageObjectPosition="center center"
                            />
                        )}
                    </div>
                </div>
            )}
        </div>
    );
}

