'use client';

import React, { useState } from 'react';
import { Upload } from 'lucide-react';
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

export default function ManualImport() {
    const [isImporting, setIsImporting] = useState(false);
    const [showModal, setShowModal] = useState(false);

    const handleImport = async (jsonText: string) => {
        setIsImporting(true);

        try {
            console.log('🔵 [DEBUG] Začínám import...');
            toast.loading('Zpracovávám data...');

            console.log('🔵 [DEBUG] Parsování JSON...');
            const data = JSON.parse(jsonText);
            console.log('🔵 [DEBUG] JSON naparsován:', {
                hasAssets: !!data.assets,
                hasDescriptions: !!data.descriptions,
                assetsCount: data.assets?.length,
                descriptionsCount: data.descriptions?.length
            });

            if (!data || !data.assets || !data.descriptions) {
                throw new Error('Neplatný formát dat');
            }

            toast.loading(`Ukládám ${data.assets.length} položek...`);
            console.log(`🔵 [DEBUG] Začínám ukládat ${data.assets.length} položek...`);

            // Vytvoříme mapu descriptions
            const descriptionMap = new Map();
            data.descriptions.forEach((desc: any) => {
                const key = `${desc.classid}_${desc.instanceid}`;
                descriptionMap.set(key, desc);
            });
            console.log('🔵 [DEBUG] Mapa descriptions vytvořena, velikost:', descriptionMap.size);

            // Uložíme každý item do Firebase
            let saved = 0;
            let skipped = 0;
            let errors = 0;

            console.log('🔵 [DEBUG] Začínám smyčku pro ukládání...');

            for (let i = 0; i < data.assets.length; i++) {
                const asset = data.assets[i];
                const key = `${asset.classid}_${asset.instanceid}`;
                const desc = descriptionMap.get(key);

                if (!desc) {
                    console.warn(`⚠️ [DEBUG] Přeskakuji asset ${i}: nenalezen popis pro key ${key}`);
                    skipped++;
                    continue;
                }

                // ===== EXTRAKCE VŠECH STATISTIK =====

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
                    console.log(`🎨 [IMPORT] Asset ${asset.assetid} má ${asset.asset_accessories.length} accessories`);

                    asset.asset_accessories.forEach((acc: any) => {
                        const position = acc.parent_relationship_properties?.[0]?.float_value || 0;

                        // Najdeme description stickeru v descriptions array
                        const stickerDesc = data.descriptions?.find((d: any) =>
                            d.classid === acc.classid && d.instanceid === acc.instanceid
                        );

                        console.log(`🎨 [IMPORT] Sticker:`, {
                            classId: acc.classid,
                            instanceId: acc.instanceid,
                            position,
                            foundDesc: !!stickerDesc,
                            name: stickerDesc?.market_name || stickerDesc?.name,
                            hasIconUrl: !!stickerDesc?.icon_url
                        });

                        stickers.push({
                            classId: acc.classid,
                            position: position,
                            name: stickerDesc?.market_name || stickerDesc?.name,
                            imageUrl: stickerDesc?.icon_url
                                ? `https://community.cloudflare.steamstatic.com/economy/image/${stickerDesc.icon_url}`
                                : undefined,
                        });
                    });

                    console.log(`✅ [IMPORT] Asset ${asset.assetid} má ${stickers.length} stickerů:`, stickers);
                } else {
                    console.log(`⚠️ [IMPORT] Asset ${asset.assetid} NEMÁ asset_accessories`);
                }

                // Popis (první description s type="html" a name="description")
                const descriptionObj = desc.descriptions?.find((d: any) => d.name === 'description');

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

                    // Float & Pattern
                    floatValue: floatProp?.float_value,
                    paintSeed: patternProp?.int_value,
                    wear: exteriorTag?.localized_tag_name || 'Unknown',
                    exterior: exteriorTag?.internal_name,

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
                    inspectLink: desc.actions?.[0]?.link?.replace('%owner_steamid%', STEAM_ID).replace('%assetid%', asset.assetid),

                    // Systémové
                    inInventory: true,
                    isVisible: false, // Defaultně skryté
                    updatedAt: Timestamp.now(),
                };

                try {
                    console.log(`🔵 [DEBUG] Ukládám položku ${i + 1}/${data.assets.length}: ${asset.assetid}`);

                    // Odstraníme undefined hodnoty před uložením
                    const cleanedData = removeUndefined(skinData);

                    await setDoc(doc(db, 'skins', asset.assetid), cleanedData, { merge: true });
                    saved++;
                    console.log(`✅ [DEBUG] Uloženo: ${asset.assetid} (celkem: ${saved})`);

                    // Aktualizujeme progress každých 10 položek
                    if (saved % 10 === 0) {
                        toast.loading(`Ukládám ${saved}/${data.assets.length} položek...`);
                        console.log(`📊 [DEBUG] Progress: ${saved}/${data.assets.length}`);
                    }
                } catch (saveError: any) {
                    errors++;
                    console.error(`❌ [DEBUG] Chyba při ukládání ${asset.assetid}:`, saveError);
                    console.error(`❌ [DEBUG] Error code:`, saveError.code);
                    console.error(`❌ [DEBUG] Error message:`, saveError.message);
                    console.error(`❌ [DEBUG] Full error:`, JSON.stringify(saveError, null, 2));

                    // Pokud je to permission error, zastavíme celý import
                    if (saveError.code === 'permission-denied') {
                        throw new Error(`Firebase permission denied! Zkontrolujte pravidla v Firebase Console. Chyba: ${saveError.message}`);
                    }
                }
            }

            console.log('🔵 [DEBUG] Smyčka dokončena!');
            console.log(`📊 [DEBUG] Statistiky: Uloženo: ${saved}, Přeskočeno: ${skipped}, Chyby: ${errors}`);

            toast.dismiss();
            toast.success(`Úspěšně importováno ${saved} z ${data.assets.length} položek! (Přeskočeno: ${skipped}, Chyby: ${errors})`);

            // Zavřeme modal a reload stránky
            setShowModal(false);
            setTimeout(() => window.location.reload(), 1000);

        } catch (error: any) {
            console.error('❌ [DEBUG] Kritická chyba v handleImport:', error);
            console.error('❌ [DEBUG] Error stack:', error.stack);
            toast.dismiss();
            toast.error(`Chyba: ${error.message}`);
            console.error('Import error:', error);
        } finally {
            console.log('🔵 [DEBUG] Import ukončen (finally block)');
            setIsImporting(false);
        }
    };

    return (
        <>
            <button
                onClick={() => setShowModal(true)}
                className="flex items-center gap-2 bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors"
            >
                <Upload size={18} />
                Ruční Import
            </button>

            {showModal && (
                <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
                    <div className="bg-white rounded-xl p-6 max-w-2xl w-full max-h-[80vh] overflow-y-auto">
                        <h3 className="text-xl font-bold mb-4">Ruční Import Inventáře</h3>

                        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-4 text-sm">
                            <p className="font-semibold mb-2">Postup:</p>
                            <ol className="list-decimal list-inside space-y-1">
                                <li>Nahraj stažený <code>inventory.json</code> soubor pomocí tlačítka níže</li>
                                <li><strong>NEBO</strong> otevři <a href={`https://steamcommunity.com/inventory/${STEAM_ID}/730/2`} target="_blank" rel="noopener noreferrer" className="text-blue-600 underline">Steam Inventář</a>, zkopíruj text (Ctrl+A, Ctrl+C) a vlož níže</li>
                            </ol>
                        </div>

                        <div className="mb-4">
                            <label className="block text-sm font-medium mb-2">📁 Nahrát JSON soubor:</label>
                            <input
                                type="file"
                                accept=".json"
                                onChange={(e) => {
                                    const file = e.target.files?.[0];
                                    if (file) {
                                        const reader = new FileReader();
                                        reader.onload = (event) => {
                                            const content = event.target?.result as string;
                                            if (content) {
                                                handleImport(content);
                                            }
                                        };
                                        reader.readAsText(file);
                                    }
                                }}
                                className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100 cursor-pointer"
                            />
                        </div>

                        <div className="relative">
                            <label className="block text-sm font-medium mb-2">📝 Nebo vlož JSON text:</label>
                            <textarea
                                className="w-full h-40 border rounded-lg p-3 font-mono text-sm"
                                placeholder='{"assets":[...],"descriptions":[...],...}'
                                id="jsonInput"
                            />
                        </div>

                        <div className="flex gap-3 mt-4">
                            <button
                                onClick={() => {
                                    const textarea = document.getElementById('jsonInput') as HTMLTextAreaElement;
                                    handleImport(textarea.value);
                                }}
                                disabled={isImporting}
                                className="flex-1 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50"
                            >
                                {isImporting ? 'Importuji...' : 'Importovat z textu'}
                            </button>
                            <button
                                onClick={() => setShowModal(false)}
                                disabled={isImporting}
                                className="px-4 py-2 border rounded-lg hover:bg-gray-50 disabled:opacity-50"
                            >
                                Zrušit
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </>
    );
}
