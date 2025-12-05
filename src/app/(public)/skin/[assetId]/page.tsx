'use client';

import React, { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { db } from '@/lib/firebase';
import { doc, getDoc } from 'firebase/firestore';
import { Skin, SkinUtils } from '@/types/skin';
import { ArrowLeft, ExternalLink, Award, Hash, Tag, TrendingUp, Shield, Calendar, DollarSign } from 'lucide-react';
import SkinStats from '@/components/SkinStats';
import SkinImageWithStickers from '@/components/SkinImageWithStickers';

export default function SkinDetailPage() {
    const params = useParams();
    const router = useRouter();
    const assetId = params.assetId as string;

    const [skin, setSkin] = useState<Skin | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchSkin = async () => {
            try {
                console.log('🔍 [DETAIL] Načítám skin:', assetId);
                const skinDoc = await getDoc(doc(db, 'skins', assetId));

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
        <div className="min-h-screen bg-black">
            <div className="mx-auto px-4 sm:px-6 lg:px-8 py-12 overflow-hidden" style={{ maxWidth: '1500px', maxHeight: '1050px' }}>
                {/* Back Button */}
                <button
                    onClick={() => router.back()}
                    className="flex items-center gap-2 text-gray-400 hover:text-white mb-8 transition-colors"
                >
                    <ArrowLeft size={20} />
                    Zpět
                </button>

                <div className="grid grid-cols-1 lg:grid-cols-[2fr_1fr] gap-8 h-full">
                    {/* Left Column - Images */}
                    <div className="space-y-4">
                        {/* Main Image - Logika:
                            1. Pokud existuje detailImageUrl → zobrazí se jen tento obrázek
                            2. Jinak: Custom Screenshot OR Steam Image
                        */}
                        <div
                            className="bg-gray-900 rounded-2xl p-1 shadow-lg border-t-4 border border-gray-800 overflow-hidden h-full flex flex-col justify-center"
                            style={{
                                borderTopColor: skin.rarityColor ? `#${skin.rarityColor}` : '#3b82f6'
                            }}
                        >
                            {skin.detailImageUrl ? (
                                <>
                                    <div className="flex-1 min-h-0 flex items-center justify-center">
                                        <img
                                            src={skin.detailImageUrl}
                                            alt={`${skin.name} - Detail`}
                                            className="max-w-full max-h-full object-contain rounded-lg"
                                        />
                                    </div>
                                </>
                            ) : skin.customScreenshotUrl ? (
                                <>
                                    <div className="flex-1 min-h-0 flex items-center justify-center">
                                        <img
                                            src={skin.customScreenshotUrl}
                                            alt={`${skin.name} - Screenshot ze hry`}
                                            className="max-w-full max-h-full object-contain rounded-lg"
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
                                        imageObjectFit="contain"
                                        imageObjectPosition="center center"
                                    />
                                </div>
                            )}
                        </div>


                    </div>

                    {/* Right Column - Info */}
                    <div className="space-y-6">
                        {/* Title */}
                        <div>
                            <h1
                                className="text-4xl font-bold mb-2"
                                style={{ color: skin.nameColor ? `#${skin.nameColor}` : '#ffffff' }}
                            >
                                {skin.name}
                            </h1>
                            {skin.marketHashName && skin.marketHashName !== skin.name && (
                                <p className="text-gray-400">{skin.marketHashName}</p>
                            )}
                        </div>

                        {/* Price - Always First */}
                        <div className="bg-gray-900 text-white rounded-xl p-6 shadow-lg border border-gray-800">
                            <div className="flex items-center justify-center gap-3 mb-2">
                                <DollarSign size={24} className="text-gray-400" />
                                <span className="text-lg font-medium text-gray-400">Cena</span>
                            </div>
                            <div className="text-4xl font-bold mb-4 text-center">
                                {skin.price ? `${skin.price} Kč` : 'na dotaz'}
                            </div>

                            {/* Tradable/Marketable Status */}
                            {(skin.tradable !== undefined || skin.marketable !== undefined) && (() => {
                                // Check if trade restriction date has passed
                                const isTradeRestricted = skin.tradeRestrictionDate &&
                                    new Date(skin.tradeRestrictionDate) > new Date();

                                return (
                                    <div className="pt-4 border-t border-gray-800">
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
                        </div>



                        {/* Float & Pattern Removed as requested */}

                        {/* Doppler Phase (pokud je to doppler) */}
                        {skin.dopplerPhase && (
                            <div className="bg-gray-900 rounded-xl p-4 border border-gray-800">
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
                            <div className="bg-gray-900 rounded-xl p-6 border border-gray-800">
                                <h3 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
                                    <Shield size={20} className="text-gray-400" />
                                    Stickery ({skin.stickers.length})
                                </h3>
                                <div className="grid grid-cols-2 gap-4">
                                    {skin.stickers.map((sticker, idx) => (
                                        <div
                                            key={idx}
                                            className="bg-gray-800 rounded-lg p-4 border border-gray-700"
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
        </div>
    );
}

