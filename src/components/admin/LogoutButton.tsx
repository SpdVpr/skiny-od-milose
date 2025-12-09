'use client';

import { LogOut } from 'lucide-react';
import { logout } from '@/app/admin/actions';
import { useRouter } from 'next/navigation';

export default function LogoutButton() {
    const router = useRouter();

    const handleLogout = async () => {
        await logout();
        router.refresh(); // Refresh to catch the cookie change
    };

    return (
        <button
            onClick={handleLogout}
            className="flex items-center gap-3 px-4 py-3 w-full text-slate-300 hover:bg-slate-800 hover:text-white rounded-lg transition-colors text-left"
        >
            <LogOut size={20} />
            Logout
        </button>
    );
}
