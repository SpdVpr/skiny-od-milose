'use client';

import React, { useState } from 'react';
import { Trash2, AlertTriangle } from 'lucide-react';
import { toast } from 'sonner';
import { db } from '@/lib/firebase';
import { collection, getDocs, writeBatch, doc } from 'firebase/firestore';

export default function DeleteAllButton() {
    const [isDeleting, setIsDeleting] = useState(false);
    const [showConfirmModal, setShowConfirmModal] = useState(false);
    const [confirmText, setConfirmText] = useState('');

    const handleDeleteAll = async () => {
        // Kontrola potvrzovacího textu
        if (confirmText !== 'SMAZAT VŠE') {
            toast.error('Musíte napsat "SMAZAT VŠE" pro potvrzení');
            return;
        }

        setIsDeleting(true);
        setShowConfirmModal(false);

        try {
            toast.loading('Načítám všechny položky...');

            // Načteme všechny dokumenty
            const querySnapshot = await getDocs(collection(db, 'skins'));
            const totalDocs = querySnapshot.docs.length;

            if (totalDocs === 0) {
                toast.dismiss();
                toast.info('Databáze je již prázdná');
                return;
            }

            toast.loading(`Mažu ${totalDocs} položek...`);
            console.log(`🗑️ Začínám mazat ${totalDocs} dokumentů`);

            // Firebase batch má limit 500 operací
            const batchSize = 500;
            let deleted = 0;

            // Rozdělíme do batch operací
            for (let i = 0; i < querySnapshot.docs.length; i += batchSize) {
                const batch = writeBatch(db);
                const batchDocs = querySnapshot.docs.slice(i, i + batchSize);

                batchDocs.forEach((document) => {
                    batch.delete(doc(db, 'skins', document.id));
                });

                await batch.commit();
                deleted += batchDocs.length;

                console.log(`🗑️ Smazáno ${deleted}/${totalDocs}`);
                toast.loading(`Mažu ${deleted}/${totalDocs} položek...`);
            }

            toast.dismiss();
            toast.success(`✅ Úspěšně smazáno ${deleted} položek!`);
            console.log(`✅ Všechny dokumenty smazány`);

            // Reload stránky
            setTimeout(() => window.location.reload(), 1000);

        } catch (error: any) {
            console.error('❌ Chyba při mazání:', error);
            toast.dismiss();
            toast.error(`Chyba při mazání: ${error.message}`);
        } finally {
            setIsDeleting(false);
            setConfirmText('');
        }
    };

    return (
        <>
            <button
                onClick={() => setShowConfirmModal(true)}
                disabled={isDeleting}
                className="flex items-center gap-2 bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
                <Trash2 size={18} />
                Smazat vše
            </button>

            {/* Confirmation Modal */}
            {showConfirmModal && (
                <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
                    <div className="bg-white rounded-xl p-6 max-w-md w-full">
                        <div className="flex items-center gap-3 mb-4">
                            <div className="w-12 h-12 rounded-full bg-red-100 flex items-center justify-center">
                                <AlertTriangle className="text-red-600" size={24} />
                            </div>
                            <div>
                                <h3 className="text-xl font-bold text-gray-900">Smazat všechny skiny?</h3>
                                <p className="text-sm text-gray-500">Tato akce je nevratná!</p>
                            </div>
                        </div>

                        <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-4">
                            <p className="text-sm text-red-800 font-medium mb-2">
                                ⚠️ VAROVÁNÍ: Tímto smažete VŠECHNY skiny z databáze!
                            </p>
                            <ul className="text-xs text-red-700 space-y-1 list-disc list-inside">
                                <li>Všechny položky budou trvale smazány</li>
                                <li>Ztratíte všechny nastavené ceny</li>
                                <li>Ztratíte všechna nastavení viditelnosti</li>
                                <li>Tuto akci NELZE vrátit zpět</li>
                            </ul>
                        </div>

                        <div className="mb-4">
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Pro potvrzení napište: <span className="font-bold text-red-600">SMAZAT VŠE</span>
                            </label>
                            <input
                                type="text"
                                value={confirmText}
                                onChange={(e) => setConfirmText(e.target.value)}
                                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500"
                                placeholder="SMAZAT VŠE"
                                autoFocus
                            />
                        </div>

                        <div className="flex gap-3">
                            <button
                                onClick={handleDeleteAll}
                                disabled={confirmText !== 'SMAZAT VŠE' || isDeleting}
                                className="flex-1 bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed font-medium"
                            >
                                {isDeleting ? 'Mažu...' : 'Ano, smazat vše'}
                            </button>
                            <button
                                onClick={() => {
                                    setShowConfirmModal(false);
                                    setConfirmText('');
                                }}
                                disabled={isDeleting}
                                className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50"
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

