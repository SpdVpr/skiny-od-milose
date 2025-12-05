'use client';

import React, { useState } from 'react';
import { Sparkles } from 'lucide-react';
import { toast } from 'sonner';
import { db } from '@/lib/firebase';
import { collection, getDocs, doc, updateDoc, query, where } from 'firebase/firestore';
import { Skin } from '@/types/skin';

/**
 * Tlačítko pro načtení CSFloat dat pro všechny skiny s inspect linkem
 * Aktualizuje existující skiny o CSFloat obrázky a detaily
 */
export default function CSFloatRefreshButton() {
    const [isRefreshing, setIsRefreshing] = useState(false);

    const handleRefresh = async () => {
        setIsRefreshing(true);

        try {
            toast.loading('Načítám skiny s inspect linkem...');

            // Načteme všechny skiny, které mají inspect link
            const q = query(
                collection(db, 'skins'),
                where('inspectLink', '!=', null)
            );
            const querySnapshot = await getDocs(q);
            const skins = querySnapshot.docs.map(doc => ({
                id: doc.id,
                ...doc.data()
            })) as (Skin & { id: string })[];

            console.log(`🔍 [CSFloat Refresh] Nalezeno ${skins.length} skinů s inspect linkem`);

            if (skins.length === 0) {
                toast.dismiss();
                toast.info('Žádné skiny s inspect linkem nenalezeny');
                return;
            }

            toast.loading(`Načítám CSFloat data pro ${skins.length} skinů...`);

            let updated = 0;
            let failed = 0;

            // Zpracujeme každý skin
            for (const skin of skins) {
                try {
                    console.log(`🔍 [CSFloat] Fetching data for ${skin.name}...`);

                    const response = await fetch(`/api/csfloat?inspectLink=${encodeURIComponent(skin.inspectLink!)}`);
                    
                    if (!response.ok) {
                        console.warn(`⚠️ [CSFloat] API error for ${skin.name}:`, response.status);
                        failed++;
                        continue;
                    }

                    const result = await response.json();
                    
                    if (!result.success) {
                        console.warn(`⚠️ [CSFloat] Failed for ${skin.name}:`, result.error);
                        failed++;
                        continue;
                    }

                    const csFloatData = result.data;

                    // Aktualizujeme skin v databázi
                    const updateData: Partial<Skin> = {
                        csFloatImageUrl: csFloatData.imageUrl,
                        floatValue: csFloatData.floatValue ?? skin.floatValue,
                        paintSeed: csFloatData.paintSeed ?? skin.paintSeed,
                        paintIndex: csFloatData.paintIndex,
                        dopplerPhase: csFloatData.dopplerPhase,
                        minFloat: csFloatData.minFloat,
                        maxFloat: csFloatData.maxFloat,
                    };

                    // Odstraníme undefined hodnoty
                    const cleanedData = Object.fromEntries(
                        Object.entries(updateData).filter(([_, v]) => v !== undefined)
                    );

                    await updateDoc(doc(db, 'skins', skin.id), cleanedData);
                    
                    console.log(`✅ [CSFloat] Updated ${skin.name}`);
                    updated++;

                    // Malá pauza mezi požadavky (rate limiting)
                    await new Promise(resolve => setTimeout(resolve, 500));

                } catch (error) {
                    console.error(`❌ [CSFloat] Exception for ${skin.name}:`, error);
                    failed++;
                }
            }

            toast.dismiss();
            toast.success(`Aktualizováno ${updated} skinů! (${failed} selhalo)`);

            // Reload stránky
            setTimeout(() => window.location.reload(), 1500);

        } catch (error: any) {
            toast.dismiss();
            toast.error(`Chyba: ${error.message}`);
            console.error('CSFloat refresh error:', error);
        } finally {
            setIsRefreshing(false);
        }
    };

    return (
        <button
            onClick={handleRefresh}
            disabled={isRefreshing}
            className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-orange-600 to-red-600 text-white rounded-lg hover:from-orange-700 hover:to-red-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all shadow-lg"
        >
            <Sparkles size={20} className={isRefreshing ? 'animate-spin' : ''} />
            {isRefreshing ? 'Načítám CSFloat data...' : 'Načíst CSFloat obrázky'}
        </button>
    );
}

