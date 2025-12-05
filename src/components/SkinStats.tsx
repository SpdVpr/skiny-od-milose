import React from 'react';
import { Skin, SkinUtils } from '@/types/skin';
import { Award, Hash, Tag, TrendingUp, Calendar, Shield } from 'lucide-react';

interface SkinStatsProps {
  skin: Skin;
}

export default function SkinStats({ skin }: SkinStatsProps) {
  return (
    <div className="bg-[#161616] rounded-xl p-4 space-y-3 border border-[#161616]">
      {/* Float Value */}
      {skin.floatValue !== undefined && (
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-lg bg-gray-800 flex items-center justify-center border border-[#161616]">
            <TrendingUp className="text-gray-400" size={20} />
          </div>
          <div className="flex-1">
            <div className="text-xs text-gray-400 font-medium">Float Value</div>
            <div className="text-lg font-bold text-white">
              {SkinUtils.formatFloat(skin.floatValue)}
              {skin.exterior && SkinUtils.isGoodFloat(skin.floatValue, skin.exterior) && (
                <span className="ml-2 text-xs bg-blue-900/50 text-blue-400 px-2 py-0.5 rounded-full border border-blue-700">
                  Dobrý float
                </span>
              )}
            </div>
            {skin.exterior && (
              <div className="text-xs text-gray-500">
                Range: {SkinUtils.getWearRange(skin.exterior)}
              </div>
            )}
          </div>
        </div>
      )}

      {/* Pattern Seed */}
      {skin.paintSeed !== undefined && (
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-lg bg-gray-800 flex items-center justify-center border border-[#161616]">
            <Hash className="text-gray-400" size={20} />
          </div>
          <div className="flex-1">
            <div className="text-xs text-gray-400 font-medium">Pattern Seed</div>
            <div className="text-lg font-bold text-white">#{skin.paintSeed}</div>
          </div>
        </div>
      )}

      {/* Rarity - Always show */}
      <div className="flex items-center gap-3">
        <div
          className="w-10 h-10 rounded-lg flex items-center justify-center"
          style={{ backgroundColor: `${skin.rarityColor || SkinUtils.getRarityColor(skin.rarity)}20` }}
        >
          <Award
            className="text-current"
            size={20}
            style={{ color: skin.rarityColor || SkinUtils.getRarityColor(skin.rarity) }}
          />
        </div>
        <div className="flex-1">
          <div className="text-xs text-gray-400 font-medium">Rarity</div>
          <div
            className="text-lg font-bold"
            style={{ color: skin.rarityColor || SkinUtils.getRarityColor(skin.rarity) }}
          >
            {skin.rarity || SkinUtils.getDefaultRarity()}
          </div>
        </div>
      </div>

      {/* Name Tag */}
      {skin.nameTag && (
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-lg bg-gray-800 flex items-center justify-center border border-[#161616]">
            <Tag className="text-gray-400" size={20} />
          </div>
          <div className="flex-1">
            <div className="text-xs text-gray-400 font-medium">Name Tag</div>
            <div className="text-lg font-bold text-white">"{skin.nameTag}"</div>
          </div>
        </div>
      )}

      {/* Stickers */}
      {skin.stickers && skin.stickers.length > 0 && (
        <div className="pt-2 border-t border-[#161616]">
          <div className="text-xs text-gray-400 font-medium mb-2 flex items-center gap-2">
            <Shield size={14} />
            Stickery ({skin.stickers.length})
          </div>
          <div className="flex flex-wrap gap-2">
            {skin.stickers.map((sticker, idx) => (
              <div
                key={idx}
                className="bg-gray-800 rounded-lg px-3 py-1.5 text-xs font-medium text-gray-300 border border-[#161616]"
              >
                Pozice {sticker.position}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Collection */}
      {skin.collection && (
        <div className="pt-2 border-t border-[#161616]">
          <div className="text-xs text-gray-400 font-medium">Kolekce</div>
          <div className="text-sm font-medium text-gray-300 mt-1">{skin.collection}</div>
        </div>
      )}

      {/* Tournament */}
      {(skin.tournament || skin.tournamentTeam) && (
        <div className="pt-2 border-t border-[#161616]">
          <div className="text-xs text-gray-400 font-medium mb-1">Tournament</div>
          {skin.tournament && (
            <div className="text-sm font-medium text-gray-300">{skin.tournament}</div>
          )}
          {skin.tournamentTeam && (
            <div className="text-sm text-gray-400">{skin.tournamentTeam}</div>
          )}
        </div>
      )}


    </div>
  );
}

