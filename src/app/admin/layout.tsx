import React from 'react';
import Link from 'next/link';
import { LayoutDashboard, Package, Settings, MessageSquare } from 'lucide-react';
import { Toaster } from 'sonner';
import { cookies } from 'next/headers';
import LoginPage from '@/components/admin/LoginPage';
import LogoutButton from '@/components/admin/LogoutButton';

export default async function AdminLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    const cookieStore = await cookies();
    const isAuthenticated = cookieStore.get('admin_authenticated')?.value === 'true';

    if (!isAuthenticated) {
        return (
            <>
                <LoginPage />
                <Toaster />
            </>
        );
    }

    return (
        <div className="min-h-screen bg-gray-100 flex">
            {/* Sidebar */}
            <aside className="w-64 bg-slate-900 text-white hidden md:flex flex-col">
                <div className="p-6 border-b border-slate-800">
                    <h1 className="text-xl font-bold">Miloš Skins</h1>
                    <p className="text-xs text-slate-400">Admin Panel</p>
                </div>

                <nav className="flex-1 p-4 space-y-2">
                    <Link href="/admin" className="flex items-center gap-3 px-4 py-3 text-slate-300 hover:bg-slate-800 hover:text-white rounded-lg transition-colors">
                        <LayoutDashboard size={20} />
                        Dashboard
                    </Link>
                    <Link href="/admin/inventory" className="flex items-center gap-3 px-4 py-3 text-slate-300 hover:bg-slate-800 hover:text-white rounded-lg transition-colors">
                        <Package size={20} />
                        Inventory
                    </Link>
                    <Link href="/admin/settings" className="flex items-center gap-3 px-4 py-3 text-slate-300 hover:bg-slate-800 hover:text-white rounded-lg transition-colors">
                        <Settings size={20} />
                        Settings
                    </Link>
                    <Link href="/admin/reviews" className="flex items-center gap-3 px-4 py-3 text-slate-300 hover:bg-slate-800 hover:text-white rounded-lg transition-colors">
                        <MessageSquare size={20} />
                        Recenze
                    </Link>
                </nav>

                <div className="p-4 border-t border-slate-800">
                    <LogoutButton />
                </div>
            </aside>

            {/* Main Content */}
            <main className="flex-1 overflow-auto">
                <header className="bg-white shadow-sm p-4 flex justify-between items-center md:hidden">
                    <h1 className="font-bold">Admin</h1>
                </header>
                <div className="p-8">
                    {children}
                </div>
            </main>
            <Toaster />
        </div>
    );
}
