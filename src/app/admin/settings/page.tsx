import React from 'react';
import HeroSettings from '@/components/admin/HeroSettings';
import CurrencySettings from '@/components/admin/CurrencySettings';

export default function SettingsPage() {
    return (
        <div className="space-y-8">
            <h1 className="text-2xl font-bold text-gray-900">Nastavení</h1>

            <div className="grid gap-8">
                <HeroSettings />
                <CurrencySettings />
            </div>
        </div>
    );
}
