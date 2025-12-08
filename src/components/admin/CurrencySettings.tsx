'use client';

import React, { useEffect, useState } from 'react';
import { db } from '@/lib/firebase';
import { doc, getDoc, setDoc } from 'firebase/firestore';
import { toast } from 'sonner';
import { Coins, Save } from 'lucide-react';

export default function CurrencySettings() {
    const [rate, setRate] = useState<string>('');
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);

    useEffect(() => {
        const fetchRate = async () => {
            try {
                const docRef = doc(db, 'settings', 'currency');
                const docSnap = await getDoc(docRef);

                if (docSnap.exists()) {
                    setRate(docSnap.data().exchangeRate.toString());
                } else {
                    // Default rate if not set
                    setRate('25');
                }
            } catch (error) {
                console.error('Error fetching exchange rate:', error);
                toast.error('Nepodařilo se načíst kurz');
            } finally {
                setLoading(false);
            }
        };

        fetchRate();
    }, []);

    const handleSave = async () => {
        if (!rate || isNaN(parseFloat(rate))) {
            toast.error('Zadejte platné číslo');
            return;
        }

        setSaving(true);
        try {
            await setDoc(doc(db, 'settings', 'currency'), {
                exchangeRate: parseFloat(rate),
                updatedAt: new Date()
            });
            toast.success('Kurz byl uložen');
        } catch (error) {
            console.error('Error saving exchange rate:', error);
            toast.error('Nepodařilo se uložit kurz');
        } finally {
            setSaving(false);
        }
    };

    return (
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
            <div className="flex items-center justify-between mb-4">
                <div className="p-3 bg-yellow-50 text-yellow-600 rounded-lg">
                    <Coins size={24} />
                </div>
                <span className="text-sm text-gray-500">Měna</span>
            </div>

            <h3 className="text-lg font-bold text-gray-900 mb-2">Nastavení kurzu</h3>

            <div className="flex gap-2 items-end">
                <div className="flex-1">
                    <label className="text-xs text-gray-500 block mb-1">Kurz EUR (Kč/€)</label>
                    <input
                        type="number"
                        value={rate}
                        onChange={(e) => setRate(e.target.value)}
                        className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:border-blue-500"
                        placeholder="25.0"
                        step="0.1"
                    />
                </div>
                <button
                    onClick={handleSave}
                    disabled={saving || loading}
                    className="bg-blue-600 text-white p-2 rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50"
                >
                    <Save size={20} />
                </button>
            </div>
            <p className="text-xs text-gray-500 mt-2">Použito pro přepočet cen na webu.</p>
        </div>
    );
}
