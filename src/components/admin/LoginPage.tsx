'use client';

import React, { useState } from 'react';
import { login } from '@/app/admin/actions';
import { toast } from 'sonner';
import { Lock } from 'lucide-react';

export default function LoginPage() {
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setLoading(true);

        const formData = new FormData(e.currentTarget);
        const result = await login(formData);

        if (result.success) {
            toast.success('Logged in successfully');
            // Force refresh to update the layout state (cookies check)
            window.location.reload();
        } else {
            toast.error(result.error || 'Login failed');
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-gray-900 flex items-center justify-center p-4">
            <div className="bg-gray-800 p-8 rounded-2xl shadow-xl w-full max-w-md border border-gray-700">
                <div className="flex flex-col items-center mb-8">
                    <div className="p-3 bg-blue-600 rounded-full mb-4">
                        <Lock className="text-white" size={24} />
                    </div>
                    <h1 className="text-2xl font-bold text-white">Admin Login</h1>
                    <p className="text-gray-400 text-sm mt-2">Pro přístup je vyžadováno heslo</p>
                </div>

                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-300 mb-1">
                            Heslo
                        </label>
                        <input
                            type="password"
                            name="password"
                            required
                            className="w-full px-4 py-2 bg-gray-900 border border-gray-700 rounded-lg text-white focus:ring-2 focus:ring-blue-500 focus:outline-none"
                            placeholder="Zadejte heslo..."
                        />
                    </div>

                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        {loading ? 'Ověřování...' : 'Přihlásit se'}
                    </button>
                </form>
            </div>
        </div>
    );
}
