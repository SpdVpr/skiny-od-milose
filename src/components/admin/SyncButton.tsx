'use client';

import React, { useState } from 'react';
import { RefreshCw } from 'lucide-react';
import { toast } from 'sonner';

export default function SyncButton() {
    const [isSyncing, setIsSyncing] = useState(false);

    const handleSync = async () => {
        setIsSyncing(true);
        const promise = fetch('/api/steam/inventory');

        toast.promise(promise, {
            loading: 'Syncing with Steam...',
            success: (data) => {
                return 'Inventory synced successfully!';
            },
            error: 'Failed to sync inventory',
        });

        try {
            await promise;
            // Optional: Refresh data on page
            window.location.reload();
        } catch (error) {
            console.error(error);
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
            {isSyncing ? 'Syncing...' : 'Sync Inventory'}
        </button>
    );
}
