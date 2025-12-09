'use client';

import { Skin, SkinUtils } from '@/types/skin';
import { useState, useEffect } from 'react';

interface SkinImageWithStickersProps {
  skin: Partial<Skin>;
  className?: string;
  showStickers?: boolean;
  cropTop?: number; // Počet pixelů k ořezu z horní části obrázku
  imageObjectFit?: 'cover' | 'contain' | 'fill' | 'none' | 'scale-down';
  imageObjectPosition?: string;
  imageClassName?: string;
}

/**
 * Komponenta zobrazující skin s překrytými stickery
 * Stickery se načítají ze Steam CDN a překrývají se přes obrázek zbraně pomocí CSS
 */
export default function SkinImageWithStickers({
  skin,
  className = '',
  showStickers = true,
  cropTop = 0,
  imageObjectFit = 'cover',
  imageObjectPosition = 'center 35%',
  imageClassName = ''
}: SkinImageWithStickersProps) {
  const [stickerImages, setStickerImages] = useState<Record<string, string>>({});
  const [imageError, setImageError] = useState(false);

  // Načteme obrázky stickerů ze Steam API
  useEffect(() => {
    console.log('🎨 [SkinImageWithStickers] Debug:', {
      showStickers,
      hasStickers: !!skin.stickers,
      stickerCount: skin.stickers?.length || 0,
      stickers: skin.stickers,
      skinName: skin.name
    });

    if (!showStickers || !skin.stickers || skin.stickers.length === 0) {
      console.log('⚠️ [SkinImageWithStickers] Stickery se nezobrazí:', {
        showStickers,
        hasStickers: !!skin.stickers,
        stickerCount: skin.stickers?.length || 0
      });
      return;
    }

    const loadStickerImages = async () => {
      const images: Record<string, string> = {};

      if (!skin.stickers) return;

      for (const sticker of skin.stickers) {
        try {
          // Steam CDN URL pro sticker obrázek
          // Formát: https://steamcommunity.com/economy/image/class/730/{classId}
          const stickerUrl = `https://steamcommunity.com/economy/image/class/730/${sticker.classId}/96fx96f`;
          images[sticker.classId] = stickerUrl;
          console.log('✅ [SkinImageWithStickers] Načten sticker:', {
            classId: sticker.classId,
            position: sticker.position,
            name: sticker.name,
            url: stickerUrl
          });
        } catch (error) {
          console.error(`❌ [SkinImageWithStickers] Failed to load sticker ${sticker.classId}:`, error);
        }
      }

      console.log('🎨 [SkinImageWithStickers] Všechny stickery načteny:', images);
      setStickerImages(images);
    };

    loadStickerImages();
  }, [skin.stickers, showStickers]);

  // Pozice stickerů podle pozice na zbraní (v procentech)
  // Tyto hodnoty jsou přibližné a liší se podle typu zbraně
  const getStickerPosition = (position: number, weaponType?: string) => {
    // Základní pozice pro většinu zbraní
    const positions: Record<number, { left: string; top: string; size: string }> = {
      0: { left: '15%', top: '45%', size: '15%' },  // Nejblíže k zásobníku/rukojeti
      1: { left: '35%', top: '40%', size: '15%' },  // Střed zbraně
      2: { left: '55%', top: '42%', size: '15%' },  // Blíže k hlavni
      3: { left: '75%', top: '38%', size: '14%' },  // Konec hlavně
      4: { left: '45%', top: '25%', size: '12%' },  // Horní část (méně časté)
    };

    // Speciální pozice pro nože (jiné rozložení)
    if (weaponType?.toLowerCase().includes('knife') || weaponType?.toLowerCase().includes('nůž')) {
      return {
        0: { left: '25%', top: '50%', size: '18%' },
        1: { left: '50%', top: '45%', size: '18%' },
        2: { left: '70%', top: '40%', size: '16%' },
        3: { left: '40%', top: '30%', size: '14%' },
        4: { left: '60%', top: '60%', size: '14%' },
      }[position] || positions[0];
    }

    // Speciální pozice pro pistole (menší, blíže k sobě)
    if (weaponType?.toLowerCase().includes('pistol') || weaponType?.toLowerCase().includes('pistole')) {
      return {
        0: { left: '20%', top: '48%', size: '16%' },
        1: { left: '40%', top: '45%', size: '16%' },
        2: { left: '60%', top: '43%', size: '15%' },
        3: { left: '75%', top: '40%', size: '14%' },
        4: { left: '50%', top: '30%', size: '12%' },
      }[position] || positions[0];
    }

    return positions[position] || positions[0];
  };

  // Použijeme nejlepší dostupný obrázek (CSFloat > Custom Screenshot > Steam)
  const baseImageUrl = SkinUtils.getBestImageUrl(skin);

  return (
    <div className={`relative ${className}`}>
      {/* Rozmazané pozadí CS:GO */}
      <div
        className="absolute inset-0"
        style={{
          backgroundImage: 'url(/bacground-cs.jpg)',
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          filter: 'blur(3px)',
          zIndex: 0
        }}
      />

      {/* Základní obrázek zbraně s ořezem */}
      <div
        className="w-full h-full relative overflow-hidden"
        style={{ zIndex: 1 }}
      >
        <img
          src={baseImageUrl}
          alt={skin.name || 'Skin'}
          className={`w-full h-full ${imageClassName}`}
          style={{
            objectFit: imageObjectFit,
            objectPosition: imageObjectPosition,
            zIndex: 2
          }}
          onError={(e) => {
            if (!imageError) {
              setImageError(true);
              (e.target as HTMLImageElement).src = skin.imageUrl || '';
            }
          }}
        />

        {/* Překryté stickery */}
        {showStickers && skin.stickers && skin.stickers.length > 0 && (
          <>
            {skin.stickers.map((sticker, index) => {
              const stickerUrl = stickerImages[sticker.classId];
              if (!stickerUrl) {
                console.log('⚠️ [SkinImageWithStickers] Sticker URL chybí:', sticker);
                return null;
              }

              const position = getStickerPosition(sticker.position, skin.weaponType);

              console.log('🎯 [SkinImageWithStickers] Renderuji sticker:', {
                index,
                classId: sticker.classId,
                position: sticker.position,
                cssPosition: position,
                url: stickerUrl
              });

              return (
                <div
                  key={`${sticker.classId}-${index}`}
                  className="absolute pointer-events-none"
                  style={{
                    left: position.left,
                    top: position.top,
                    width: position.size,
                    height: position.size,
                    transform: 'translate(-50%, -50%)',
                    zIndex: 10,
                    border: '2px solid red', // DEBUG: Červený border pro viditelnost
                  }}
                >
                  <img
                    src={stickerUrl}
                    alt={sticker.name || `Sticker ${index + 1}`}
                    className="w-full h-full object-contain drop-shadow-lg"
                    style={{
                      filter: 'drop-shadow(0 2px 4px rgba(0,0,0,0.3))',
                    }}
                    onLoad={() => {
                      console.log('✅ [SkinImageWithStickers] Sticker načten:', stickerUrl);
                    }}
                    onError={(e) => {
                      console.error('❌ [SkinImageWithStickers] Sticker se nepodařilo načíst:', stickerUrl);
                      // Skryjeme sticker pokud se nepodaří načíst
                      (e.target as HTMLImageElement).style.display = 'none';
                    }}
                  />
                </div>
              );
            })}
          </>
        )}
      </div>
    </div>
  );
}

