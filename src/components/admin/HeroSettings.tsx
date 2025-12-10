'use client';

import React, { useState, useEffect } from 'react';
import { db } from '@/lib/firebase';
import { doc, getDoc, setDoc } from 'firebase/firestore';
import { toast } from 'sonner';
import { Save, Loader2 } from 'lucide-react';

interface HeroText {
    headline: string;
    line1: string;
    line2: string;
    line3: string;
}

const DEFAULT_TEXT: HeroText = {
    headline: 'Výkup, prodej i skiny na objednávku – vše na jednom místě.',
    line1: 'Bezpečnost, rychlost a spolehlivost.',
    line2: 'Tisíce uzavřených obchodů a stovky spokojených zákazníků.',
    line3: 'S Vámi od roku 2023 jako ověřený partner na cestě k vašemu vysněnému skinu do hry Counter Strike 2.'
};

export default function HeroSettings() {
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [text, setText] = useState<HeroText>(DEFAULT_TEXT);

    useEffect(() => {
        fetchSettings();
    }, []);

    const fetchSettings = async () => {
        try {
            const docRef = doc(db, 'settings', 'hero');
            const docSnap = await getDoc(docRef);

            if (docSnap.exists()) {
                const data = docSnap.data() as HeroText;
                setText({ ...DEFAULT_TEXT, ...data });
            }
        } catch (error) {
            console.error('Error fetching hero settings:', error);
            toast.error('Nepodařilo se načíst nastavení textů');
        } finally {
            setLoading(false);
        }
    };

    const handleSave = async () => {
        setSaving(true);
        try {
            await setDoc(doc(db, 'settings', 'hero'), text);
            toast.success('Texty byly úspěšně uloženy');
        } catch (error) {
            console.error('Error saving hero settings:', error);
            toast.error('Nepodařilo se uložit texty');
        } finally {
            setSaving(false);
        }
    };

    if (loading) {
        return <div className="p-8 flex justify-center"><Loader2 className="animate-spin" /></div>;
    }

    return (
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 max-w-2xl">
            <h2 className="text-xl font-bold mb-6">Texty na hlavní stránce</h2>

            <div className="space-y-4">
                <div>
                    <label className="block text-sm font-medium text-gray-900 mb-1">
                        Hlavní nadpis (H1)
                    </label>
                    <textarea
                        value={text.headline}
                        onChange={(e) => setText({ ...text, headline: e.target.value })}
                        className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 min-h-[80px] text-gray-900"
                    />
                </div>

                <div>
                    <label className="block text-sm font-medium text-gray-900 mb-1">
                        Podnadpis 1
                    </label>
                    <input
                        type="text"
                        value={text.line1}
                        onChange={(e) => setText({ ...text, line1: e.target.value })}
                        className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 text-gray-900"
                    />
                </div>

                <div>
                    <label className="block text-sm font-medium text-gray-900 mb-1">
                        Podnadpis 2
                    </label>
                    <input
                        type="text"
                        value={text.line2}
                        onChange={(e) => setText({ ...text, line2: e.target.value })}
                        className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 text-gray-900"
                    />
                </div>

                <div>
                    <label className="block text-sm font-medium text-gray-900 mb-1">
                        Podnadpis 3
                    </label>
                    <textarea
                        value={text.line3}
                        onChange={(e) => setText({ ...text, line3: e.target.value })}
                        className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 min-h-[80px] text-gray-900"
                    />
                </div>

                <div className="pt-4 flex justify-end">
                    <button
                        onClick={handleSave}
                        disabled={saving}
                        className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50"
                    >
                        {saving ? <Loader2 className="animate-spin" size={20} /> : <Save size={20} />}
                        Uložit změny
                    </button>
                </div>
            </div>
        </div>
    );
}
