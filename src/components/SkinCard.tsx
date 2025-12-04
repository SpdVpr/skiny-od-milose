"use client";

import React from 'react';
import { useRouter } from 'next/navigation';
import { Award, Hash, Tag } from 'lucide-react';
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
            className="group bg-gray-900 rounded-2xl p-4 shadow-lg hover:shadow-2xl transition-all duration-300 border border-gray-800 hover:border-gray-700 flex flex-col cursor-pointer"
            style={{
                borderTopColor: skin.rarityColor ? `#${skin.rarityColor}` : undefined,
                borderTopWidth: skin.rarityColor ? '3px' : undefined
            }}
        >
            {/* Image with Stickers - Square 1:1 with crop */}
            <div
                className="relative aspect-square mb-4 overflow-hidden rounded-xl flex items-center justify-center"
            >
                <SkinImageWithStickers
                    skin={skin}
                    className="w-full h-full transform group-hover:scale-110 transition-transform duration-500"
                    showStickers={true}
                    cropTop={200}
                />

                {/* Wear Badge */}
                <div className="absolute top-2 right-2 bg-white/90 backdrop-blur px-2 py-1 rounded-lg text-xs font-medium text-slate-600 shadow-sm">
                    {SkinUtils.translateWear(skin.wear)}
                </div>

                {/* Rarity Badge */}
                <div
                    className="absolute top-2 left-2 backdrop-blur px-2 py-1 rounded-lg text-xs font-bold shadow-sm flex items-center gap-1"
                    style={{
                        backgroundColor: `${skin.rarityColor || SkinUtils.getRarityColor(skin.rarity)}20`,
                        color: skin.rarityColor || SkinUtils.getRarityColor(skin.rarity)
                    }}
                >
                    <Award size={12} />
                    {skin.rarity || SkinUtils.getDefaultRarity()}
                </div>

                {/* Name Tag Badge */}
                {skin.nameTag && (
                    <div className="absolute bottom-2 left-2 bg-amber-500/90 backdrop-blur px-2 py-1 rounded-lg text-xs font-bold text-white shadow-sm flex items-center gap-1">
                        <Tag size={12} />
                        Named
                    </div>
                )}

                {/* Stickers Badge */}
                {skin.stickers && skin.stickers.length > 0 && (
                    <div className="absolute bottom-2 right-2 bg-purple-500/90 backdrop-blur px-2 py-1 rounded-lg text-xs font-bold text-white shadow-sm">
                        {skin.stickers.length}x 🎨
                    </div>
                )}
            </div>

            {/* Title */}
            <div className="flex-1">
                <h3
                    className="font-bold line-clamp-1 mb-1"
                    title={skin.name}
                    style={{ color: skin.nameColor ? `#${skin.nameColor}` : '#ffffff' }}
                >
                    {skin.name}
                </h3>

                {/* Stats Row with Price */}
                <div className="flex items-center gap-2 text-xs text-gray-400 flex-wrap">
                    {skin.floatValue !== undefined && (
                        <div className="flex items-center gap-1">
                            <span className="font-medium">Float:</span>
                            <span
                                className={`font-bold ${SkinUtils.isGoodFloat(skin.floatValue, skin.exterior)
                                        ? 'text-green-400'
                                        : 'text-gray-300'
                                    }`}
                            >
                                {SkinUtils.formatFloat(skin.floatValue)}
                            </span>
                        </div>
                    )}
                    {skin.paintSeed !== undefined && (
                        <div className="flex items-center gap-1">
                            <Hash size={12} />
                            <span className="font-bold text-gray-300">{skin.paintSeed}</span>
                        </div>
                    )}
                    {/* Price */}
                    <div className="flex items-center gap-1 ml-auto">
                        <span className="text-base font-bold text-blue-400">
                            {skin.price ? `${skin.price} Kč` : 'na dotaz'}
                        </span>
                    </div>
                </div>
            </div>
        </div>
    );
}
