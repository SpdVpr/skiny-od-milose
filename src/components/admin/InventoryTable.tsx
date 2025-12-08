'use client';

import React, { useState, useEffect, useRef } from 'react';
import { db } from '@/lib/firebase';
import { collection, getDocs, doc, updateDoc, setDoc, query, orderBy, writeBatch, deleteDoc, Timestamp } from 'firebase/firestore';
import { Eye, EyeOff, Save, Search, CheckSquare, Square, Sparkles, Edit, X, Trash2, Copy, Plus } from 'lucide-react';
import { toast } from 'sonner';
import { Skin, SkinUtils, SkinSticker } from '@/types/skin';
import SkinStats from '@/components/SkinStats';
import ScreenshotUpload from '@/components/admin/ScreenshotUpload';
import { POPULAR_STICKERS, searchStickers, StickerData } from '@/data/stickers';

// Mapování opotřebení
const WEAR_OPTIONS = [
    { value: 'Factory New', internal: 'WearCategory0', label: 'Factory New (Zbrusu nový)' },
    { value: 'Minimal Wear', internal: 'WearCategory1', label: 'Minimal Wear (Téměř bez známek)' },
    { value: 'Field-Tested', internal: 'WearCategory2', label: 'Field-Tested (Opotřebený)' },
    { value: 'Well-Worn', internal: 'WearCategory3', label: 'Well-Worn (Hodně opotřebený)' },
    { value: 'Battle-Scarred', internal: 'WearCategory4', label: 'Battle-Scarred (Poničený bojem)' },
];

// Kategorie zbraní
const CATEGORIES = [
    { id: 'all', name: 'Vše' },
    { id: 'rifle', name: 'Pušky' },
    { id: 'pistol', name: 'Pistole' },
    { id: 'sniper', name: 'Odstřelovací pušky' },
    { id: 'smg', name: 'Samopaly' },
    { id: 'knife', name: 'Nože' },
    { id: 'gloves', name: 'Rukavice' },
    { id: 'agent', name: 'Agenti' },
    { id: 'other', name: 'Ostatní' },
];

export default function InventoryTable() {
    const [skins, setSkins] = useState<Skin[]>([]);
    const [loading, setLoading] = useState(true);
    const [filter, setFilter] = useState('');
    const [selectedCategory, setSelectedCategory] = useState('all');
    const [selectedSkins, setSelectedSkins] = useState<Set<string>>(new Set());
    const [isBulkUpdating, setIsBulkUpdating] = useState(false);
    const [expandedRow, setExpandedRow] = useState<string | null>(null);
    const [editingSkin, setEditingSkin] = useState<Skin | null>(null);
    const [showEditModal, setShowEditModal] = useState(false);

    // Edit form localized state for split name
    const [editWeaponType, setEditWeaponType] = useState('');
    const [editSkinName, setEditSkinName] = useState('');
    const [editIsStatTrak, setEditIsStatTrak] = useState(false);

    // Sticker management state
    const [stickerSearchQuery, setStickerSearchQuery] = useState<string[]>([]);
    const [showStickerDropdown, setShowStickerDropdown] = useState<number | null>(null);

    useEffect(() => {
        fetchSkins();
    }, []);

    // Initialize sticker search queries when opening edit modal
    useEffect(() => {
        if (editingSkin && editingSkin.stickers) {
            setStickerSearchQuery(editingSkin.stickers.map(s => s.name || ''));
        } else {
            setStickerSearchQuery([]);
        }
    }, [editingSkin]);

    const fetchSkins = async () => {
        try {
            const q = query(collection(db, 'skins'), orderBy('updatedAt', 'desc'));
            const querySnapshot = await getDocs(q);
            const skinsData = querySnapshot.docs.map(doc => ({
                assetId: doc.id,
                ...doc.data()
            })) as Skin[];
            setSkins(skinsData);
        } catch (error) {
            console.error("Error fetching skins:", error);
            toast.error("Failed to load inventory");
        } finally {
            setLoading(false);
        }
    };

    const handlePriceChange = (assetId: string, newPrice: string) => {
        const price = parseFloat(newPrice);
        if (isNaN(price)) return;

        setSkins(prev => prev.map(skin =>
            skin.assetId === assetId ? { ...skin, price } : skin
        ));
    };

    const savePrice = async (skin: Skin) => {
        try {
            await updateDoc(doc(db, 'skins', skin.assetId), {
                price: skin.price
            });
            toast.success(`Price updated for ${skin.name}`);
        } catch (error) {
            toast.error("Failed to update price");
        }
    };

    const toggleVisibility = async (skin: Skin) => {
        try {
            const newVisibility = !skin.isVisible;
            await updateDoc(doc(db, 'skins', skin.assetId), {
                isVisible: newVisibility
            });
            setSkins(prev => prev.map(s =>
                s.assetId === skin.assetId ? { ...s, isVisible: newVisibility } : s
            ));
            toast.success(`Visibility ${newVisibility ? 'enabled' : 'disabled'} for ${skin.name}`);
        } catch (error) {
            toast.error("Failed to update visibility");
        }
    };

    const toggleSelectSkin = (assetId: string) => {
        setSelectedSkins(prev => {
            const newSet = new Set(prev);
            if (newSet.has(assetId)) {
                newSet.delete(assetId);
            } else {
                newSet.add(assetId);
            }
            return newSet;
        });
    };

    const toggleSelectAll = () => {
        if (selectedSkins.size === filteredSkins.length) {
            setSelectedSkins(new Set());
        } else {
            setSelectedSkins(new Set(filteredSkins.map(s => s.assetId)));
        }
    };

    const bulkUpdateVisibility = async (isVisible: boolean) => {
        if (selectedSkins.size === 0) {
            toast.error('Nevybrali jste žádné skiny');
            return;
        }

        setIsBulkUpdating(true);
        try {
            const batch = writeBatch(db);

            selectedSkins.forEach(assetId => {
                const skinRef = doc(db, 'skins', assetId);
                batch.update(skinRef, { isVisible });
            });

            await batch.commit();

            setSkins(prev => prev.map(skin =>
                selectedSkins.has(skin.assetId) ? { ...skin, isVisible } : skin
            ));

            toast.success(`${selectedSkins.size} skinů ${isVisible ? 'zobrazeno' : 'skryto'}`);
            setSelectedSkins(new Set());
        } catch (error) {
            console.error('Bulk update error:', error);
            toast.error('Chyba při hromadné aktualizaci');
        } finally {
            setIsBulkUpdating(false);
        }
    };

    const bulkUpdateCategory = async (category: string) => {
        if (!category || category === 'all') return;
        if (selectedSkins.size === 0) {
            toast.error('Nevybrali jste žádné skiny');
            return;
        }

        setIsBulkUpdating(true);
        try {
            const batch = writeBatch(db);

            selectedSkins.forEach(assetId => {
                const skinRef = doc(db, 'skins', assetId);
                batch.update(skinRef, { category });
            });

            await batch.commit();

            setSkins(prev => prev.map(skin =>
                selectedSkins.has(skin.assetId) ? { ...skin, category } : skin
            ));

            toast.success(`Kategorie změněna pro ${selectedSkins.size} skinů`);
            setSelectedSkins(new Set());
        } catch (error) {
            console.error('Bulk category update error:', error);
            toast.error('Chyba při změně kategorie');
        } finally {
            setIsBulkUpdating(false);
        }
    };

    const openEditModal = (skin: Skin) => {
        setEditingSkin({ ...skin });

        // Detect StatTrak
        const isStatTrak = skin.name.includes('StatTrak™');
        setEditIsStatTrak(isStatTrak);

        // Clean name for splitting (remove StatTrak prefix and trim)
        let cleanName = skin.name.replace('StatTrak™', '').trim();

        // Initialize split name fields
        // 1. Try to use existing database structure
        if (skin.weaponType) {
            setEditWeaponType(skin.weaponType);
            // If cleanName contains weaponType, remove it to get skinName
            if (cleanName.startsWith(skin.weaponType + ' | ')) {
                setEditSkinName(cleanName.substring(skin.weaponType.length + 3));
            } else {
                setEditSkinName(cleanName);
            }
        } else {
            // 2. Fallback: Parse from string split if weaponType is missing
            const parts = cleanName.split(' | ');
            if (parts.length >= 2) {
                setEditWeaponType(parts[0]);
                setEditSkinName(parts.slice(1).join(' | '));
            } else {
                setEditWeaponType(cleanName); // Default to whole name as type if no split
                setEditSkinName('');
            }
        }

        setShowEditModal(true);
    };

    // Sticker handlers
    const handleAddSticker = () => {
        if (!editingSkin) return;
        const currentStickers = editingSkin.stickers || [];
        if (currentStickers.length >= 5) return;

        const newSticker: SkinSticker = {
            position: currentStickers.length,
            classId: '',
            name: '',
        };

        setEditingSkin({
            ...editingSkin,
            stickers: [...currentStickers, newSticker]
        });
        setStickerSearchQuery([...stickerSearchQuery, '']);
    };

    const handleRemoveSticker = (index: number) => {
        if (!editingSkin || !editingSkin.stickers) return;

        const newStickers = editingSkin.stickers.filter((_, i) => i !== index);
        setEditingSkin({
            ...editingSkin,
            stickers: newStickers
        });

        const newQueries = stickerSearchQuery.filter((_, i) => i !== index);
        setStickerSearchQuery(newQueries);
    };

    const handleSelectSticker = (index: number, sticker: StickerData) => {
        if (!editingSkin || !editingSkin.stickers) return;

        const newStickers = [...editingSkin.stickers];
        newStickers[index] = {
            ...newStickers[index],
            classId: sticker.classId,
            name: sticker.name,
            imageUrl: `https://steamcommunity.com/economy/image/class/730/${sticker.classId}/96fx96f`
        };

        setEditingSkin({
            ...editingSkin,
            stickers: newStickers
        });

        const newQueries = [...stickerSearchQuery];
        newQueries[index] = sticker.name;
        setStickerSearchQuery(newQueries);
        setShowStickerDropdown(null);
    };

    const handleStickerSearchChange = (index: number, value: string) => {
        const newQueries = [...stickerSearchQuery];
        newQueries[index] = value;
        setStickerSearchQuery(newQueries);
        setShowStickerDropdown(index);
    };

    const saveEdit = async () => {
        if (!editingSkin) return;

        try {
            // Připravíme data bez undefined hodnot
            const prefix = editIsStatTrak ? 'StatTrak™ ' : '';
            const finalName = `${prefix}${editWeaponType.trim()} | ${editSkinName.trim()}`;

            const updateData: any = {
                name: finalName,
                weaponType: editWeaponType.trim(),
                updatedAt: Timestamp.now(), // Aktualizujeme čas poslední úpravy
            };

            // Přidáme základní hodnoty
            if (editingSkin.price !== undefined && editingSkin.price !== null && !isNaN(Number(editingSkin.price))) {
                updateData.price = Number(editingSkin.price);
            }
            if (editingSkin.category) updateData.category = editingSkin.category;
            if (editingSkin.floatValue !== undefined && editingSkin.floatValue !== null) updateData.floatValue = editingSkin.floatValue;
            if (editingSkin.paintSeed !== undefined && editingSkin.paintSeed !== null) updateData.paintSeed = editingSkin.paintSeed;
            if (editingSkin.inspectLink) updateData.inspectLink = editingSkin.inspectLink;
            if (editingSkin.phase) updateData.phase = editingSkin.phase;

            // Wear
            if (editingSkin.wear) {
                updateData.wear = editingSkin.wear;
                const exterior = WEAR_OPTIONS.find(w => w.value === editingSkin.wear)?.internal;
                if (exterior) updateData.exterior = exterior;
            }

            // Stickers
            if (editingSkin.stickers && editingSkin.stickers.length > 0) {
                // Filter out empty stickers
                const validStickers = editingSkin.stickers.filter(s => s.classId && s.name);
                if (validStickers.length > 0) {
                    updateData.stickers = validStickers;
                } else {
                    updateData.stickers = []; // Remove if all deleted/invalid
                }
            } else {
                updateData.stickers = []; // Clear stickers if empty array
            }

            // Market info
            if (editingSkin.tradable !== undefined) updateData.tradable = editingSkin.tradable;
            if (editingSkin.marketable !== undefined) updateData.marketable = editingSkin.marketable;
            if (editingSkin.tradeRestrictionDate) updateData.tradeRestrictionDate = editingSkin.tradeRestrictionDate;

            await updateDoc(doc(db, 'skins', editingSkin.assetId), updateData);

            setSkins(prev => prev.map(s =>
                s.assetId === editingSkin.assetId ? { ...s, ...updateData, name: finalName, weaponType: editWeaponType.trim() } : s
            ));

            toast.success('Produkt úspěšně upraven!');
            setShowEditModal(false);
            setEditingSkin(null);
        } catch (error) {
            console.error('Edit error:', error);
            toast.error('Chyba při úpravě produktu');
        }
    };

    const handleDeleteSelected = async () => {
        if (selectedSkins.size === 0) {
            toast.error('Nevybrali jste žádné skiny');
            return;
        }

        if (!confirm(`Opravdu chcete smazat ${selectedSkins.size} označených skinů? Tato akce je nevratná.`)) {
            return;
        }

        setIsBulkUpdating(true);
        try {
            const batch = writeBatch(db);

            selectedSkins.forEach(assetId => {
                const skinRef = doc(db, 'skins', assetId);
                batch.delete(skinRef);
            });

            await batch.commit();

            setSkins(prev => prev.filter(skin => !selectedSkins.has(skin.assetId)));

            toast.success(`${selectedSkins.size} skinů bylo úspěšně smazáno`);
            setSelectedSkins(new Set());
        } catch (error) {
            console.error('Bulk delete error:', error);
            toast.error('Chyba při mazání skinů');
        } finally {
            setIsBulkUpdating(false);
        }
    };

    const copySkin = async (skin: Skin) => {
        try {
            // Vytvoříme nové unikátní ID pro kopii
            const timestamp = Date.now();
            const randomStr = Math.random().toString(36).substring(2, 10);
            const newAssetId = `copy_${timestamp}_${randomStr}`;

            // Vytvoříme kopii skinu s novým ID a nastavíme jako neviditelný
            const skinCopy: Partial<Skin> = {
                ...skin,
                assetId: newAssetId,
                isVisible: false, // Skryjeme kopii, aby ji admin mohl upravit před zveřejněním
                name: `${skin.name} (Kopie)`, // Přidáme "(Kopie)" do názvu
                updatedAt: Timestamp.now(), // Aktualizujeme timestamp
            };

            // Odstraníme undefined hodnoty
            const cleanedData = Object.fromEntries(
                Object.entries(skinCopy).filter(([_, v]) => v !== undefined)
            );

            // Uložíme do Firestore (použijeme setDoc pro vytvoření nového dokumentu)
            await setDoc(doc(db, 'skins', newAssetId), cleanedData);

            toast.success(`Skin "${skin.name}" byl zkopírován! Kopie je skrytá a můžete ji upravit.`);

            // Obnovíme data z databáze
            fetchSkins();
        } catch (error) {
            console.error('Copy error:', error);
            toast.error('Chyba při kopírování skinu');
        }
    };

    const bulkFetchCSFloat = async () => {
        if (selectedSkins.size === 0) {
            toast.error('Nevybrali jste žádné skiny');
            return;
        }

        const selectedSkinsArray = skins.filter(s => selectedSkins.has(s.assetId));
        const skinsWithInspectLink = selectedSkinsArray.filter(s => s.inspectLink);

        if (skinsWithInspectLink.length === 0) {
            toast.error('Žádný z vybraných skinů nemá inspect link');
            return;
        }

        setIsBulkUpdating(true);
        let successCount = 0;
        let errorCount = 0;

        toast.info(`Načítám CSFloat data pro ${skinsWithInspectLink.length} skinů...`);

        try {
            for (const skin of skinsWithInspectLink) {
                try {
                    console.log(`🔍 [CSFloat] Fetching data for ${skin.name}...`);

                    const csFloatData = await SkinUtils.fetchCSFloatData(skin.inspectLink!);

                    if (csFloatData) {
                        // Připravíme data pro update - odstraníme undefined hodnoty
                        const updateData: any = {
                            updatedAt: new Date().toISOString()
                        };

                        // Přidáme pouze definované hodnoty
                        if (csFloatData.imageUrl !== undefined) updateData.csFloatImageUrl = csFloatData.imageUrl;
                        if (csFloatData.floatValue !== undefined) updateData.floatValue = csFloatData.floatValue;
                        if (csFloatData.paintSeed !== undefined) updateData.paintSeed = csFloatData.paintSeed;
                        if (csFloatData.paintIndex !== undefined) updateData.paintIndex = csFloatData.paintIndex;
                        if (csFloatData.dopplerPhase !== undefined) updateData.dopplerPhase = csFloatData.dopplerPhase;
                        if (csFloatData.minFloat !== undefined) updateData.minFloat = csFloatData.minFloat;
                        if (csFloatData.maxFloat !== undefined) updateData.maxFloat = csFloatData.maxFloat;

                        await updateDoc(doc(db, 'skins', skin.assetId), updateData);

                        setSkins(prev => prev.map(s =>
                            s.assetId === skin.assetId
                                ? {
                                    ...s,
                                    csFloatImageUrl: csFloatData.imageUrl,
                                    floatValue: csFloatData.floatValue,
                                    paintSeed: csFloatData.paintSeed,
                                    paintIndex: csFloatData.paintIndex,
                                    dopplerPhase: csFloatData.dopplerPhase,
                                    minFloat: csFloatData.minFloat,
                                    maxFloat: csFloatData.maxFloat
                                }
                                : s
                        ));

                        successCount++;
                        console.log(`✅ [CSFloat] Updated ${skin.name}`);
                    } else {
                        errorCount++;
                        console.warn(`⚠️ [CSFloat] No data for ${skin.name}`);
                    }

                    // Rate limiting - 500ms delay between requests
                    await new Promise(resolve => setTimeout(resolve, 500));

                } catch (error) {
                    errorCount++;
                    console.error(`❌ [CSFloat] Error for ${skin.name}:`, error);
                }
            }

            if (successCount > 0) {
                toast.success(`✅ CSFloat data načtena pro ${successCount} skinů`);
            }
            if (errorCount > 0) {
                toast.warning(`⚠️ ${errorCount} skinů selhalo`);
            }

            setSelectedSkins(new Set());

        } catch (error) {
            console.error('Bulk CSFloat fetch error:', error);
            toast.error('Chyba při načítání CSFloat dat');
        } finally {
            setIsBulkUpdating(false);
        }
    };

    // Mapování Steam kategorií na naše kategorie (zkopírováno z page.tsx pro konzistenci)
    const mapSteamCategory = (steamCategory: string): string => {
        const lower = steamCategory.toLowerCase();
        if (lower === 'melee' || lower === 'knife') return 'knife';
        if (lower === 'pistol') return 'pistol';
        if (lower === 'rifle') return 'rifle';
        if (lower === 'sniper rifle' || lower === 'sniperrifle') return 'sniper';
        if (lower === 'smg' || lower === 'submachine gun') return 'smg';
        if (lower === 'gloves') return 'gloves';
        if (lower === 'agent') return 'agent';
        // Pokud je to naše interní ID (např. 'other', 'agent'), vrátíme ho
        if (CATEGORIES.some(c => c.id === lower)) return lower;

        return 'other';
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
            lowerName.includes('classic') || lowerName.includes('nomad')) {
            return 'knife';
        }
        if (lowerName.includes('gloves') || lowerName.includes('rukavice')) {
            return 'gloves';
        }
        if (lowerName.includes('agent') || lowerName.includes('sir') || lowerName.includes('doctor') ||
            lowerName.includes('commander')) { // Basic agent checks
            return 'agent';
        }
        return 'other';
    };

    const filteredSkins = skins.filter(skin => {
        const matchesSearch = skin.name.toLowerCase().includes(filter.toLowerCase());

        // Určení kategorie (priorita: manuálně nastavená -> steam kategorie -> podle názvu)
        let skinCategory = '';

        if (skin.category) {
            skinCategory = mapSteamCategory(skin.category);
        }

        if (!skinCategory || skinCategory === 'other') {
            // Pokud nemáme kategorii nebo je 'other', zkusíme ještě detekci z názvu, 
            // ale pouze pokud detekce najde něco konkrétního (ne 'other')
            const nameCategory = getCategoryFromName(skin.name);
            if (nameCategory !== 'other') {
                skinCategory = nameCategory;
            } else if (!skinCategory) {
                skinCategory = 'other';
            }
        }

        const matchesCategory = selectedCategory === 'all' || skinCategory === selectedCategory;
        return matchesSearch && matchesCategory;
    });

    const csFloatStats = {
        total: filteredSkins.length,
        withCSFloat: filteredSkins.filter(s => s.csFloatImageUrl).length,
        withInspectLink: filteredSkins.filter(s => s.inspectLink).length,
        selected: selectedSkins.size,
        selectedWithInspectLink: skins.filter(s => selectedSkins.has(s.assetId) && s.inspectLink).length
    };

    if (loading) return <div>Loading inventory...</div>;

    return (
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
            {/* Search and Bulk Actions */}
            <div className="p-4 border-b border-gray-100 space-y-3">
                <div className="flex gap-4 items-center">
                    <div className="relative flex-1">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
                        <input
                            type="text"
                            placeholder="Hledat skiny..."
                            className="w-full pl-10 pr-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                            value={filter}
                            onChange={(e) => setFilter(e.target.value)}
                        />
                    </div>

                    {/* Category Filter */}
                    <select
                        value={selectedCategory}
                        onChange={(e) => setSelectedCategory(e.target.value)}
                        className="px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white text-gray-900"
                    >
                        {CATEGORIES.map(category => (
                            <option key={category.id} value={category.id} className="text-gray-900">
                                {category.name}
                            </option>
                        ))}
                    </select>

                    {/* CSFloat Stats */}
                    <div className="flex items-center gap-3 text-sm">
                        <div className="flex items-center gap-1.5 px-3 py-1.5 bg-gradient-to-r from-orange-50 to-red-50 rounded-lg border border-orange-200">
                            <Sparkles size={14} className="text-orange-600" />
                            <span className="text-gray-700">
                                <span className="font-bold text-orange-600">{csFloatStats.withCSFloat}</span>
                                <span className="text-gray-500">/{csFloatStats.total}</span>
                            </span>
                        </div>
                    </div>
                </div>

                {/* Bulk Actions */}
                <div className="flex flex-wrap gap-2">
                    <button
                        onClick={handleDeleteSelected}
                        disabled={isBulkUpdating || selectedSkins.size === 0}
                        className="flex items-center gap-2 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed text-sm"
                    >
                        <Trash2 size={16} />
                        Smazat označené ({selectedSkins.size})
                    </button>

                    <div className="h-8 w-px bg-gray-300 mx-2" />

                    <button
                        onClick={() => bulkUpdateVisibility(true)}
                        disabled={isBulkUpdating || selectedSkins.size === 0}
                        className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed text-sm"
                    >
                        <Eye size={16} />
                        Zobrazit vybrané ({selectedSkins.size})
                    </button>

                    <button
                        onClick={() => bulkUpdateVisibility(false)}
                        disabled={isBulkUpdating || selectedSkins.size === 0}
                        className="flex items-center gap-2 px-4 py-2 bg-orange-600 text-white rounded-lg hover:bg-orange-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed text-sm"
                    >
                        <EyeOff size={16} />
                        Skrýt vybrané ({selectedSkins.size})
                    </button>

                    <div className="h-8 w-px bg-gray-300 mx-2" />

                    <select
                        onChange={(e) => {
                            if (e.target.value !== 'default') {
                                if (confirm(`Opravdu chcete nastavit kategorii "${CATEGORIES.find(c => c.id === e.target.value)?.name}" pro ${selectedSkins.size} skinů?`)) {
                                    bulkUpdateCategory(e.target.value);
                                }
                                e.target.value = 'default';
                            }
                        }}
                        disabled={isBulkUpdating || selectedSkins.size === 0}
                        className="px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white text-gray-900 text-sm disabled:opacity-50"
                        defaultValue="default"
                    >
                        <option value="default" disabled>Nastavit kategorii...</option>
                        {CATEGORIES.filter(c => c.id !== 'all').map(category => (
                            <option key={category.id} value={category.id}>
                                {category.name}
                            </option>
                        ))}
                    </select>

                    <div className="h-8 w-px bg-gray-300 mx-2" />

                    <button
                        onClick={bulkFetchCSFloat}
                        disabled={isBulkUpdating || selectedSkins.size === 0}
                        className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-orange-600 to-red-600 text-white rounded-lg hover:from-orange-700 hover:to-red-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed text-sm font-medium"
                        title={`Načíst CSFloat obrázky pro ${csFloatStats.selectedWithInspectLink} skinů s inspect linkem`}
                    >
                        <Sparkles size={16} />
                        {isBulkUpdating ? 'Načítám...' : `Načíst CSFloat (${csFloatStats.selectedWithInspectLink})`}
                    </button>

                    {selectedSkins.size > 0 && (
                        <button
                            onClick={() => setSelectedSkins(new Set())}
                            className="px-4 py-2 text-gray-600 hover:bg-gray-100 rounded-lg transition-colors text-sm"
                        >
                            Zrušit výběr
                        </button>
                    )}
                </div>
            </div>

            <div className="overflow-x-auto">
                <table className="w-full text-left">
                    <thead className="bg-gray-50 text-gray-500 text-sm">
                        <tr>
                            <th className="p-4 w-12">
                                <button
                                    onClick={toggleSelectAll}
                                    className="text-gray-600 hover:text-gray-900"
                                    title={selectedSkins.size === filteredSkins.length ? "Zrušit výběr všech" : "Vybrat vše"}
                                >
                                    {selectedSkins.size === filteredSkins.length ? (
                                        <CheckSquare size={20} />
                                    ) : (
                                        <Square size={20} />
                                    )}
                                </button>
                            </th>
                            <th className="p-4">Item</th>
                            <th className="p-4">Wear / Float</th>
                            <th className="p-4">Rarity</th>
                            <th className="p-4">Price (Kč)</th>
                            <th className="p-4">Status</th>
                            <th className="p-4">Actions</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100">
                        {filteredSkins.map(skin => (
                            <React.Fragment key={skin.assetId}>
                                <tr
                                    className={`hover:bg-gray-50 cursor-pointer ${expandedRow === skin.assetId ? 'bg-blue-50' : ''}`}
                                    onClick={() => setExpandedRow(expandedRow === skin.assetId ? null : skin.assetId)}
                                >
                                    <td className="p-4">
                                        <button
                                            onClick={(e) => {
                                                e.stopPropagation();
                                                toggleSelectSkin(skin.assetId);
                                            }}
                                            className="text-gray-600 hover:text-gray-900"
                                        >
                                            {selectedSkins.has(skin.assetId) ? (
                                                <CheckSquare size={20} className="text-blue-600" />
                                            ) : (
                                                <Square size={20} />
                                            )}
                                        </button>
                                    </td>
                                    <td className="p-4 flex items-center gap-3">
                                        <div className="relative">
                                            <img
                                                src={SkinUtils.getBestImageUrl(skin)}
                                                alt={skin.name}
                                                className="w-16 h-12 object-contain rounded"
                                                style={{ backgroundColor: skin.backgroundColor ? `#${skin.backgroundColor}` : '#f8fafc' }}
                                            />
                                            {skin.csFloatImageUrl && (
                                                <div className="absolute -top-1 -right-1 bg-gradient-to-r from-orange-600 to-red-600 rounded-full p-1" title="Má CSFloat obrázek">
                                                    <Sparkles size={12} className="text-white" />
                                                </div>
                                            )}
                                        </div>
                                        <div>
                                            <div
                                                className="font-medium"
                                                style={{ color: skin.nameColor ? `#${skin.nameColor}` : '#111827' }}
                                            >
                                                {skin.name}
                                            </div>
                                            {skin.weaponType && (
                                                <div className="text-xs text-gray-500">{skin.weaponType}</div>
                                            )}
                                            {skin.csFloatImageUrl && (
                                                <div className="text-xs text-orange-600 font-medium flex items-center gap-1 mt-0.5">
                                                    <Sparkles size={10} />
                                                    CSFloat
                                                </div>
                                            )}
                                        </div>
                                    </td>
                                    <td className="p-4">
                                        <div className="text-gray-900">{skin.wear}</div>
                                        {skin.floatValue !== undefined && (
                                            <div className={`text-xs font-mono ${SkinUtils.isGoodFloat(skin.floatValue, skin.exterior)
                                                ? 'text-green-600 font-bold'
                                                : 'text-gray-500'
                                                }`}>
                                                {SkinUtils.formatFloat(skin.floatValue)}
                                            </div>
                                        )}
                                    </td>
                                    <td className="p-4">
                                        {skin.rarity && (
                                            <span
                                                className="px-2 py-1 rounded-full text-xs font-bold"
                                                style={{
                                                    backgroundColor: `${skin.rarityColor || '#b0c3d9'}20`,
                                                    color: skin.rarityColor || '#b0c3d9'
                                                }}
                                            >
                                                {skin.rarity}
                                            </span>
                                        )}
                                    </td>
                                    <td className="p-4" onClick={(e) => e.stopPropagation()}>
                                        <div className="flex items-center gap-2">
                                            <input
                                                type="number"
                                                value={skin.price || ''}
                                                onChange={(e) => handlePriceChange(skin.assetId, e.target.value)}
                                                className="w-24 px-2 py-1 border rounded"
                                                placeholder="0"
                                            />
                                            <button
                                                onClick={() => savePrice(skin)}
                                                className="p-1 text-blue-600 hover:bg-blue-50 rounded"
                                                title="Save Price"
                                            >
                                                <Save size={18} />
                                            </button>
                                        </div>
                                    </td>
                                    <td className="p-4">
                                        {skin.inInventory ? (
                                            <span className="px-2 py-1 bg-green-100 text-green-700 rounded-full text-xs">In Stock</span>
                                        ) : (
                                            <span className="px-2 py-1 bg-red-100 text-red-700 rounded-full text-xs">Sold</span>
                                        )}
                                    </td>
                                    <td className="p-4" onClick={(e) => e.stopPropagation()}>
                                        <div className="flex items-center gap-2">
                                            <button
                                                onClick={() => openEditModal(skin)}
                                                className="p-2 rounded-lg transition-colors bg-blue-100 text-blue-700 hover:bg-blue-200"
                                                title="Upravit produkt"
                                            >
                                                <Edit size={18} />
                                            </button>
                                            <button
                                                onClick={() => copySkin(skin)}
                                                className="p-2 rounded-lg transition-colors bg-purple-100 text-purple-700 hover:bg-purple-200"
                                                title="Kopírovat produkt"
                                            >
                                                <Copy size={18} />
                                            </button>
                                            <button
                                                onClick={() => toggleVisibility(skin)}
                                                className={`p-2 rounded-lg transition-colors ${skin.isVisible
                                                    ? 'bg-green-100 text-green-700 hover:bg-green-200'
                                                    : 'bg-gray-100 text-gray-500 hover:bg-gray-200'
                                                    }`}
                                                title={skin.isVisible ? "Visible on public site" : "Hidden from public site"}
                                            >
                                                {skin.isVisible ? <Eye size={20} /> : <EyeOff size={20} />}
                                            </button>
                                        </div>
                                    </td>
                                </tr>

                                {/* Expanded Row with Stats & Screenshot Upload */}
                                {expandedRow === skin.assetId && (
                                    <tr>
                                        <td colSpan={6} className="p-6 bg-slate-50">
                                            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                                                {/* Left: Stats */}
                                                <div>
                                                    <h3 className="text-sm font-bold text-slate-700 mb-3">📊 Statistiky</h3>
                                                    <SkinStats skin={skin} />
                                                </div>

                                                {/* Right: Screenshot Upload */}
                                                <div className="space-y-4">
                                                    <div>
                                                        <h3 className="text-sm font-bold text-slate-700 mb-3">📸 Screenshot Management</h3>
                                                        <ScreenshotUpload
                                                            skinId={skin.assetId}
                                                            currentScreenshotUrl={skin.customScreenshotUrl}
                                                            onUploadComplete={() => fetchSkins()}
                                                        />
                                                    </div>
                                                    <div>
                                                        <h3 className="text-sm font-bold text-slate-700 mb-3">🖼️ Detail Image</h3>
                                                        <ScreenshotUpload
                                                            skinId={skin.assetId}
                                                            currentScreenshotUrl={skin.detailImageUrl}
                                                            onUploadComplete={() => fetchSkins()}
                                                            fieldName="detailImageUrl"
                                                            storagePath={`skins/${skin.assetId}/detail.jpg`}
                                                        />
                                                    </div>
                                                </div>
                                            </div>
                                        </td>
                                    </tr>
                                )}
                            </React.Fragment>
                        ))}
                    </tbody>
                </table>
            </div>

            {/* Edit Modal */}
            {showEditModal && editingSkin && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
                    <div className="bg-white rounded-xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
                        <div className="sticky top-0 bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between">
                            <h2 className="text-2xl font-bold text-gray-800">Upravit produkt</h2>
                            <button
                                onClick={() => {
                                    setShowEditModal(false);
                                    setEditingSkin(null);
                                }}
                                className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                            >
                                <X size={24} />
                            </button>
                        </div>

                        <div className="p-6 space-y-4">
                            {/* Název - Split into two fields */}
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        Typ zbraně (Weapon Type)
                                    </label>
                                    <input
                                        type="text"
                                        value={editWeaponType}
                                        onChange={(e) => setEditWeaponType(e.target.value)}
                                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500 text-gray-900"
                                        placeholder="např. AK-47"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        Název skinu (Skin Name)
                                    </label>
                                    <input
                                        type="text"
                                        value={editSkinName}
                                        onChange={(e) => setEditSkinName(e.target.value)}
                                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500 text-gray-900"
                                        placeholder="např. Redline"
                                    />
                                </div>
                            </div>
                            <div className="text-xs text-gray-500 -mt-2 mb-2">
                                Výsledek: <span className="font-semibold">{editIsStatTrak ? 'StatTrak™ ' : ''}{editWeaponType} | {editSkinName}</span>
                            </div>

                            {/* StatTrak checkbox */}
                            <div className="flex items-center gap-2">
                                <input
                                    type="checkbox"
                                    id="edit-statTrak"
                                    checked={editIsStatTrak}
                                    onChange={(e) => setEditIsStatTrak(e.target.checked)}
                                    className="w-4 h-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                                />
                                <label htmlFor="edit-statTrak" className="text-sm text-gray-700 font-medium">
                                    StatTrak™
                                </label>
                            </div>

                            {/* Cena */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Cena (Kč)
                                </label>
                                <input
                                    type="number"
                                    step="0.01"
                                    value={editingSkin.price || ''}
                                    onChange={(e) => setEditingSkin({ ...editingSkin, price: e.target.value ? parseFloat(e.target.value) : undefined })}
                                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500 text-gray-900"
                                    placeholder="Pokud nevyplníte, zobrazí se 'na dotaz'"
                                />
                            </div>

                            {/* Kategorie */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Kategorie
                                </label>
                                <select
                                    value={editingSkin.category || 'rifle'}
                                    onChange={(e) => setEditingSkin({ ...editingSkin, category: e.target.value })}
                                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500 text-gray-900"
                                >
                                    {CATEGORIES.filter(c => c.id !== 'all').map(category => (
                                        <option key={category.id} value={category.id}>
                                            {category.name}
                                        </option>
                                    ))}
                                </select>
                            </div>

                            {/* Opotřebení (Wear) */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Opotřebení (Wear)
                                </label>
                                <select
                                    value={editingSkin.wear || 'Field-Tested'}
                                    onChange={(e) => setEditingSkin({ ...editingSkin, wear: e.target.value })}
                                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500 text-gray-900"
                                >
                                    {WEAR_OPTIONS.map(option => (
                                        <option key={option.value} value={option.value}>
                                            {option.label}
                                        </option>
                                    ))}
                                </select>
                            </div>

                            {/* Phase */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Phase (Fáze)
                                </label>
                                <input
                                    type="text"
                                    value={editingSkin.phase || ''}
                                    onChange={(e) => setEditingSkin({ ...editingSkin, phase: e.target.value })}
                                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500 text-gray-900"
                                    placeholder="např. Phase 4, 95% Fade"
                                />
                            </div>

                            {/* Float Value */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Float (Opotřebení)
                                </label>
                                <input
                                    type="text"
                                    value={editingSkin.floatValue || ''}
                                    onChange={(e) => setEditingSkin({ ...editingSkin, floatValue: e.target.value ? parseFloat(e.target.value) : undefined })}
                                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500 text-gray-900"
                                    placeholder="např. 0.173908353"
                                />
                            </div>

                            {/* Pattern Seed */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Pattern Seed
                                </label>
                                <input
                                    type="number"
                                    value={editingSkin.paintSeed || ''}
                                    onChange={(e) => setEditingSkin({ ...editingSkin, paintSeed: e.target.value ? parseInt(e.target.value) : undefined })}
                                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500 text-gray-900"
                                    placeholder="např. 661"
                                />
                            </div>

                            {/* Inspect Link */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Inspect Link (Odkaz na prohlédnutí ve hře)
                                </label>
                                <input
                                    type="text"
                                    value={editingSkin.inspectLink || ''}
                                    onChange={(e) => setEditingSkin({ ...editingSkin, inspectLink: e.target.value })}
                                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500 text-gray-900"
                                    placeholder="steam://rungame/730/..."
                                />
                            </div>

                            {/* Stickers Section */}
                            <div className="border border-gray-200 rounded-lg p-4 bg-gray-50">
                                <label className="block text-sm font-medium text-gray-700 mb-3">
                                    Stickery (Samolepky)
                                </label>
                                <div className="space-y-3">
                                    {(editingSkin.stickers || []).map((sticker, index) => (
                                        <div key={index} className="flex gap-2 items-start">
                                            <div className="flex-1 relative">
                                                <div className="flex items-center gap-2 mb-2">
                                                    <Search className="w-4 h-4 text-gray-500" />
                                                    <input
                                                        type="text"
                                                        value={stickerSearchQuery[index] || sticker.name}
                                                        onChange={(e) => handleStickerSearchChange(index, e.target.value)}
                                                        onFocus={() => setShowStickerDropdown(index)}
                                                        placeholder={`Vyhledat sticker (pozice ${index + 1})`}
                                                        className="flex-1 px-3 py-2 bg-white border border-gray-300 rounded-lg text-gray-900 text-sm focus:outline-none focus:border-blue-500"
                                                    />
                                                </div>

                                                {/* Dropdown with results */}
                                                {showStickerDropdown === index && (
                                                    <div className="absolute z-10 w-full mt-1 bg-white border border-gray-200 rounded-lg shadow-lg max-h-60 overflow-y-auto">
                                                        {searchStickers(stickerSearchQuery[index] || '').map((stickerData) => (
                                                            <button
                                                                key={stickerData.classId}
                                                                type="button"
                                                                onClick={() => handleSelectSticker(index, stickerData)}
                                                                className="w-full px-4 py-2 text-left hover:bg-gray-50 transition-colors text-sm border-b border-gray-100 last:border-0"
                                                            >
                                                                <div className="text-gray-900 font-medium">{stickerData.name}</div>
                                                                {stickerData.tournament && (
                                                                    <div className="text-xs text-gray-500">
                                                                        {stickerData.tournament}
                                                                        {stickerData.team && ` • ${stickerData.team}`}
                                                                        {stickerData.player && ` • ${stickerData.player}`}
                                                                    </div>
                                                                )}
                                                            </button>
                                                        ))}
                                                        {searchStickers(stickerSearchQuery[index] || '').length === 0 && (
                                                            <div className="px-4 py-2 text-sm text-gray-500 italic">
                                                                Žádné stickery nenalezeny
                                                            </div>
                                                        )}
                                                    </div>
                                                )}

                                                {/* Selected sticker preview */}
                                                {sticker.classId && (
                                                    <div className="mt-2 p-2 bg-white border border-gray-200 rounded-lg shadow-sm">
                                                        <div className="flex items-center gap-2">
                                                            <img
                                                                src={`https://steamcommunity.com/economy/image/class/730/${sticker.classId}/96fx96f`}
                                                                alt={sticker.name}
                                                                className="w-12 h-12 object-contain"
                                                                onError={(e) => {
                                                                    e.currentTarget.style.display = 'none';
                                                                }}
                                                            />
                                                            <div className="flex-1 text-xs">
                                                                <div className="text-gray-900 font-medium">{sticker.name}</div>
                                                                <div className="text-gray-500">Class ID: {sticker.classId}</div>
                                                            </div>
                                                        </div>
                                                    </div>
                                                )}
                                            </div>
                                            <button
                                                type="button"
                                                onClick={() => handleRemoveSticker(index)}
                                                className="p-2 text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                                                title="Odstranit sticker"
                                            >
                                                <X className="w-5 h-5" />
                                            </button>
                                        </div>
                                    ))}

                                    {(editingSkin.stickers || []).length < 5 && (
                                        <button
                                            type="button"
                                            onClick={handleAddSticker}
                                            className="w-full px-4 py-2 bg-white border border-gray-300 border-dashed rounded-lg text-gray-500 hover:text-blue-600 hover:border-blue-500 transition-colors flex items-center justify-center gap-2"
                                        >
                                            <Plus className="w-4 h-4" />
                                            Přidat sticker
                                        </button>
                                    )}
                                </div>
                            </div>

                            {/* Market Info - Tradable & Marketable */}
                            <div className="border border-gray-300 rounded-lg p-4 bg-gray-50">
                                <h3 className="text-sm font-medium text-gray-700 mb-3">📊 Informace o obchodovatelnosti</h3>

                                <div className="space-y-3">
                                    {/* Tradable */}
                                    <div className="flex items-center gap-3">
                                        <input
                                            type="checkbox"
                                            id="edit-tradable"
                                            checked={editingSkin.tradable}
                                            onChange={(e) => setEditingSkin({ ...editingSkin, tradable: e.target.checked })}
                                            className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500"
                                        />
                                        <label htmlFor="edit-tradable" className="text-sm text-gray-700">
                                            Tradable (Lze vyměnit)
                                        </label>
                                    </div>

                                    {/* Marketable */}
                                    <div className="flex items-center gap-3">
                                        <input
                                            type="checkbox"
                                            id="edit-marketable"
                                            checked={editingSkin.marketable}
                                            onChange={(e) => setEditingSkin({ ...editingSkin, marketable: e.target.checked })}
                                            className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500"
                                        />
                                        <label htmlFor="edit-marketable" className="text-sm text-gray-700">
                                            Marketable (Lze prodat na marketu)
                                        </label>
                                    </div>

                                    {/* Trade Restriction Date */}
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">
                                            Obchodovatelné od (datum)
                                        </label>
                                        <input
                                            type="date"
                                            value={editingSkin.tradeRestrictionDate || ''}
                                            onChange={(e) => setEditingSkin({ ...editingSkin, tradeRestrictionDate: e.target.value })}
                                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500 text-gray-900"
                                        />
                                        <p className="text-xs text-gray-500 mt-1">
                                            Volitelné - pokud má item trade lock, zadejte datum, od kdy bude možné ho vyměnit
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="sticky bottom-0 bg-gray-50 px-6 py-4 flex items-center justify-end gap-3 border-t border-gray-200">
                            <button
                                onClick={() => {
                                    setShowEditModal(false);
                                    setEditingSkin(null);
                                }}
                                className="px-6 py-2 border border-gray-300 rounded-lg hover:bg-gray-100 transition-colors"
                            >
                                Zrušit
                            </button>
                            <button
                                onClick={saveEdit}
                                className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                            >
                                Uložit změny
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
