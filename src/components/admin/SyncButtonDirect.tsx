'use client';

import React, { useState } from 'react';
import { RefreshCw } from 'lucide-react';
import { toast } from 'sonner';
import { db } from '@/lib/firebase';
import { doc, setDoc, Timestamp } from 'firebase/firestore';
import { Skin, SkinSticker } from '@/types/skin';

const STEAM_ID = '76561198085719073';

// Helper funkce pro odstranění undefined hodnot
function removeUndefined<T extends Record<string, any>>(obj: T): Partial<T> {
    const result: any = {};
    for (const key in obj) {
        if (obj[key] !== undefined) {
            result[key] = obj[key];
        }
    }
    return result;
}

// Helper funkce pro získání CSFloat dat
async function fetchCSFloatData(inspectLink: string): Promise<any | null> {
    try {
        const response = await fetch(`/api/csfloat?inspectLink=${encodeURIComponent(inspectLink)}`);

        if (!response.ok) {
            console.warn('⚠️ [CSFloat] API error:', response.status);
            return null;
        }

        const result = await response.json();

        if (!result.success) {
            console.warn('⚠️ [CSFloat] Failed:', result.error);
            return null;
        }

        console.log('✅ [CSFloat] Data received:', result.data);
        return result.data;
    } catch (error) {
        console.warn('⚠️ [CSFloat] Exception:', error);
        return null;
    }
}

export default function SyncButtonDirect() {
    const [isSyncing, setIsSyncing] = useState(false);

    const handleSync = async () => {
        setIsSyncing(true);

        try {
            toast.loading('Načítám inventář ze Steamu...');

            // Zkusíme načíst data přímo ze Steamu bez proxy
            const steamUrl = `https://steamcommunity.com/inventory/${STEAM_ID}/730/2?l=english&count=5000`;

            console.log('Fetching from Steam:', steamUrl);

            let data;

            // Pokus 1: Přímý požadavek (může selhat kvůli CORS)
            try {
                const directResponse = await fetch(steamUrl);
                if (directResponse.ok) {
                    data = await directResponse.json();
                    console.log('Direct fetch successful!', data);
                }
            } catch (e) {
                console.log('Direct fetch failed (expected), trying proxy...');
            }

            // Pokus 2: Použijeme CORS proxy
            if (!data) {
                const corsProxy = 'https://corsproxy.io/?';
                console.log('Fetching via proxy:', `${corsProxy}${encodeURIComponent(steamUrl)}`);

                const response = await fetch(`${corsProxy}${encodeURIComponent(steamUrl)}`);

                if (!response.ok) {
                    throw new Error(`Chyba při načítání: ${response.status}`);
                }

                data = await response.json();
                console.log('Proxy fetch successful!', data);
            }

            if (!data || !data.assets || !data.descriptions) {
                console.error('Invalid data structure:', data);
                throw new Error('Inventář je prázdný nebo soukromý');
            }

            toast.loading(`Ukládám ${data.assets.length} položek...`);

            // Vytvoříme mapu descriptions
            const descriptionMap = new Map();
            data.descriptions.forEach((desc: any) => {
                const key = `${desc.classid}_${desc.instanceid}`;
                descriptionMap.set(key, desc);
            });

            // Uložíme každý item do Firebase
            let saved = 0;
            for (const asset of data.assets) {
                const key = `${asset.classid}_${asset.instanceid}`;
                const desc = descriptionMap.get(key);

                if (!desc) continue;

                // ===== EXTRAKCE VŠECH STATISTIK (stejně jako v ManualImport) =====

                // Float value a pattern seed z asset_properties
                const floatProp = asset.asset_properties?.find((p: any) => p.propertyid === 2);
                const patternProp = asset.asset_properties?.find((p: any) => p.propertyid === 1);
                const nameTagProp = asset.asset_properties?.find((p: any) => p.propertyid === 5);

                // Tags
                const exteriorTag = desc.tags?.find((t: any) => t.category === 'Exterior');
                const weaponTag = desc.tags?.find((t: any) => t.category === 'Weapon');
                const typeTag = desc.tags?.find((t: any) => t.category === 'Type');
                const rarityTag = desc.tags?.find((t: any) => t.category === 'Rarity');
                const collectionTag = desc.tags?.find((t: any) => t.category === 'ItemSet');
                const tournamentTag = desc.tags?.find((t: any) => t.category === 'Tournament');
                const teamTag = desc.tags?.find((t: any) => t.category === 'TournamentTeam');

                // Stickery z asset_accessories
                const stickers: SkinSticker[] = [];
                if (asset.asset_accessories) {
                    asset.asset_accessories.forEach((acc: any) => {
                        const position = acc.parent_relationship_properties?.[0]?.float_value || 0;

                        // Najdeme description stickeru v descriptions array
                        const stickerDesc = data.descriptions?.find((d: any) =>
                            d.classid === acc.classid && d.instanceid === acc.instanceid
                        );

                        stickers.push({
                            classId: acc.classid,
                            position: position,
                            name: stickerDesc?.market_name || stickerDesc?.name,
                            imageUrl: stickerDesc?.icon_url
                                ? `https://community.cloudflare.steamstatic.com/economy/image/${stickerDesc.icon_url}`
                                : undefined,
                        });
                    });
                }

                // Popis
                const descriptionObj = desc.descriptions?.find((d: any) => d.name === 'description');

                // Inspect link
                const inspectLink = desc.actions?.[0]?.link?.replace('%owner_steamid%', STEAM_ID).replace('%assetid%', asset.assetid);

                // Zkusíme získat CSFloat data (pokud má inspect link)
                let csFloatData = null;
                if (inspectLink) {
                    console.log(`🔍 [CSFloat] Fetching data for ${desc.market_name}...`);
                    csFloatData = await fetchCSFloatData(inspectLink);
                }

                const skinData: Partial<Skin> = {
                    // Základní ID
                    assetId: asset.assetid,
                    classId: asset.classid,
                    instanceId: asset.instanceid,

                    // Názvy
                    name: desc.market_name || desc.name,
                    marketHashName: desc.market_hash_name,
                    marketName: desc.market_name,
                    type: desc.type,

                    // Vizuální
                    imageUrl: `https://community.cloudflare.steamstatic.com/economy/image/${desc.icon_url}`,
                    iconUrl: desc.icon_url,
                    backgroundColor: desc.background_color,
                    nameColor: desc.name_color,
                    csFloatImageUrl: csFloatData?.imageUrl, // CSFloat high-res obrázek

                    // Float & Pattern (priorita CSFloat data > Steam data)
                    floatValue: csFloatData?.floatValue ?? floatProp?.float_value,
                    paintSeed: csFloatData?.paintSeed ?? patternProp?.int_value,
                    paintIndex: csFloatData?.paintIndex,
                    wear: exteriorTag?.localized_tag_name || csFloatData?.wearName || 'Unknown',
                    exterior: exteriorTag?.internal_name,
                    dopplerPhase: csFloatData?.dopplerPhase,
                    minFloat: csFloatData?.minFloat,
                    maxFloat: csFloatData?.maxFloat,

                    // Kategorizace
                    weaponType: weaponTag?.localized_tag_name,
                    category: typeTag?.localized_tag_name,
                    rarity: rarityTag?.localized_tag_name,
                    rarityColor: rarityTag?.color,
                    collection: collectionTag?.localized_tag_name,

                    // Stickery & Nametag
                    stickers: stickers.length > 0 ? stickers : undefined,
                    nameTag: nameTagProp?.string_value,

                    // Market info
                    tradable: desc.tradable === 1,
                    marketable: desc.marketable === 1,
                    commodity: desc.commodity === 1,
                    tradeRestrictionDays: desc.market_tradable_restriction,
                    marketRestrictionDays: desc.market_marketable_restriction,

                    // Tournament
                    tournament: tournamentTag?.localized_tag_name,
                    tournamentTeam: teamTag?.localized_tag_name,

                    // Popis
                    description: descriptionObj?.value,

                    // Ostatní
                    inspectLink: inspectLink,

                    // Systémové
                    inInventory: true,
                    isVisible: false, // Defaultně skryté
                    updatedAt: Timestamp.now(),
                };

                // Odstraníme undefined hodnoty před uložením
                const cleanedData = removeUndefined(skinData);

                await setDoc(doc(db, 'skins', asset.assetid), cleanedData, { merge: true });
                saved++;
            }

            toast.dismiss();
            toast.success(`Úspěšně synchronizováno ${saved} položek!`);

            // Reload stránky pro zobrazení nových dat
            setTimeout(() => window.location.reload(), 1000);

        } catch (error: any) {
            toast.dismiss();
            toast.error(`Chyba: ${error.message}`);
            console.error('Sync error:', error);
        } finally {
            setIsSyncing(false);
        }
    };

    return (
        <button
            onClick={handleSync}
            disabled={isSyncing}
            className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        >
            <RefreshCw size={18} className={isSyncing ? 'animate-spin' : ''} />
            {isSyncing ? 'Synchronizuji...' : 'Sync Inventory (Direct)'}
        </button>
    );
}
