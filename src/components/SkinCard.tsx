"use client";

import React from 'react';
import { useRouter } from 'next/navigation';
import { Award, Hash, Tag, Camera } from 'lucide-react';
import { Skin, SkinUtils } from '@/types/skin';
import SkinImageWithStickers from './SkinImageWithStickers';

interface SkinProps {
    skin: Skin;
}

export default function SkinCard({ skin }: SkinProps) {
    const router = useRouter();

    const handleCardClick = () => {
        router.push(`/skin/${skin.assetId}`);
    };

    return (
        <div
            onClick={handleCardClick}
            className="group bg-[#161616] rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 border border-[#161616] hover:border-[#161616] flex flex-col cursor-pointer relative overflow-hidden"
            style={{
                borderTopColor: skin.rarityColor ? `#${skin.rarityColor}` : undefined,
                borderTopWidth: skin.rarityColor ? '3px' : undefined,
                padding: 'calc(var(--spacing) * 2)',
                transform: 'translateZ(0)' // iOS/Safari: vynutí kompozitní vrstvu, ať se ořežou zaoblené rohy
            }}
        >
            {/* Shine Effect */}
            <div className="absolute inset-0 opacity-0 group-hover:opacity-100 pointer-events-none transition-opacity duration-500 z-0">
                <div className="absolute inset-0 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-1000 bg-gradient-to-r from-transparent via-white/10 to-transparent skew-x-12" />
            </div>
            {/* Image with Stickers - Square 1:1 with crop */}
            <div
                className="relative aspect-square mb-4 overflow-hidden rounded-xl flex items-center justify-center"
                style={{ transform: 'translateZ(0)', WebkitMaskImage: '-webkit-radial-gradient(white, black)' }} // iOS/Safari: ořez zaoblených rohů u škálovaného obrázku
            >
                <SkinImageWithStickers
                    skin={skin}
                    className="w-full h-full transform group-hover:scale-110 transition-transform duration-500"
                    showStickers={true}
                    cropTop={0}
                    imageObjectFit="contain"
                    imageObjectPosition="center center"
                />




                {/* StatTrak Badge - Top Left */}
                {skin.name.includes('StatTrak™') && (
                    <div className="absolute top-2 left-2 bg-orange-500/90 backdrop-blur px-2 py-1 rounded-lg text-xs font-bold text-white shadow-sm">
                        StatTrak™
                    </div>
                )}
                {skin.name.includes('Souvenir') && (
                    <div className="absolute top-2 left-2 bg-[#b8a335]/90 backdrop-blur px-2 py-1 rounded-lg text-xs font-bold text-white shadow-sm">
                        Souvenir
                    </div>
                )}

                {/* Wear Badge - Top Right (sjednocená neutrální šedá jako cena) */}
                {skin.wear && (
                    <div className="absolute top-2 right-2 bg-[#161616]/95 backdrop-blur px-2 py-1 rounded-lg text-xs font-bold text-white shadow-sm border border-white/10">
                        {SkinUtils.translateWear(skin.wear)}
                    </div>
                )}

                {/* Bottom-left stack: Name Tag + Cena */}
                <div className="absolute bottom-2 left-2 z-10 flex flex-col items-start gap-1">
                    {skin.nameTag && (
                        <div className="bg-amber-500/90 backdrop-blur px-2 py-1 rounded-lg text-xs font-bold text-white shadow-sm flex items-center gap-1">
                            <Tag size={12} />
                            Named
                        </div>
                    )}
                    {/* Cena */}
                    {skin.price ? (
                        <div className="bg-[#161616]/95 backdrop-blur px-3 py-1.5 rounded-xl text-sm font-bold text-white shadow-md border border-white/10">
                            {new Intl.NumberFormat('cs-CZ', {
                                style: 'currency',
                                currency: 'CZK',
                                maximumFractionDigits: 0,
                            }).format(skin.price)}
                        </div>
                    ) : (
                        <div className="bg-[#161616]/95 backdrop-blur px-3 py-1.5 rounded-xl text-sm font-semibold text-gray-300 shadow-md border border-white/10">
                            Cena na dotaz
                        </div>
                    )}
                </div>

                {/* Stickers Badge */}
                {skin.stickers && skin.stickers.length > 0 && (
                    <div className="absolute bottom-2 right-2 bg-purple-500/90 backdrop-blur px-2 py-1 rounded-lg text-xs font-bold text-white shadow-sm">
                        {skin.stickers.length}x 🎨
                    </div>
                )}
            </div>

            {/* Title */}
            <div className="flex-1 relative z-10">
                <div className="mb-2">
                    {(() => {
                        // Odstraní závorky s opotřebením z konce názvu, např. " (Zbrusu nový)"
                        const cleanName = skin.name.replace(/\s*\([^)]*\)\s*$/, '');

                        return cleanName.includes('|') ? (
                            <>
                                <h3 className="font-bold text-white text-sm opacity-90 leading-tight">
                                    {cleanName.split('|')[0].trim()}
                                </h3>
                                <h4 className="text-white text-base leading-tight mb-2">
                                    {cleanName.split('|')[1].trim()}
                                </h4>
                            </>
                        ) : (
                            <h3 className="font-bold text-white text-lg leading-tight mb-2">
                                {cleanName}
                            </h3>
                        );
                    })()}


                    {/* Float / Pattern + foťák (vizuální pobídka, že celá karta vede na detail) */}
                    <div className="flex items-center justify-between gap-2">
                        <div className="flex flex-wrap gap-x-4 gap-y-0.5 text-xs text-white opacity-90 min-w-0">
                            {skin.floatValue !== undefined && (
                                <span>Float: {(() => {
                                    // Truncate to 4 decimal places without rounding
                                    const str = skin.floatValue.toString();
                                    const decimalIndex = str.indexOf('.');
                                    return decimalIndex === -1 ? str : str.substring(0, decimalIndex + 5);
                                })()}</span>
                            )}
                            {skin.paintSeed !== undefined && (
                                <span>Pattern: {skin.paintSeed}</span>
                            )}
                        </div>

                        {/* Foťák – nemá vlastní akci, klik probublá na kartu a otevře detail. Rozsvítí se při najetí na kartu. */}
                        <div
                            className="shrink-0 flex items-center justify-center bg-[#161616] group-hover:bg-white/5 text-white/60 group-hover:text-white p-1.5 sm:p-2 rounded-lg border border-white/10 group-hover:border-white/20 transition-colors"
                            title="Zobrazit detail"
                            aria-hidden="true"
                        >
                            <Camera className="w-[18px] h-[18px] sm:w-[22px] sm:h-[22px]" />
                        </div>
                    </div>
                </div>

            </div>
        </div >
    );
}
