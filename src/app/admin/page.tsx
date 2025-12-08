import React from 'react';
import { Package, Eye, DollarSign } from 'lucide-react';
import SyncButtonDirect from '@/components/admin/SyncButtonDirect';
import ManualImport from '@/components/admin/ManualImport';
import DeleteAllButton from '@/components/admin/DeleteAllButton';
import CSFloatRefreshButton from '@/components/admin/CSFloatRefreshButton';
import CurrencySettings from '@/components/admin/CurrencySettings';

export default function AdminDashboard() {
    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <h2 className="text-2xl font-bold text-gray-800">Dashboard Overview</h2>
                <div className="flex gap-3">
                    <DeleteAllButton />
                    <ManualImport />
                    <CSFloatRefreshButton />
                    <SyncButtonDirect />
                </div>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                <CurrencySettings />
                <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
                    <div className="flex items-center justify-between mb-4">
                        <div className="p-3 bg-blue-50 text-blue-600 rounded-lg">
                            <Package size={24} />
                        </div>
                        <span className="text-sm text-gray-500">Total Items</span>
                    </div>
                    <h3 className="text-3xl font-bold text-gray-900">--</h3>
                    <p className="text-sm text-gray-500 mt-1">In Steam Inventory</p>
                </div>

                <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
                    <div className="flex items-center justify-between mb-4">
                        <div className="p-3 bg-green-50 text-green-600 rounded-lg">
                            <Eye size={24} />
                        </div>
                        <span className="text-sm text-gray-500">Public Visible</span>
                    </div>
                    <h3 className="text-3xl font-bold text-gray-900">--</h3>
                    <p className="text-sm text-gray-500 mt-1">Active on website</p>
                </div>

                <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
                    <div className="flex items-center justify-between mb-4">
                        <div className="p-3 bg-purple-50 text-purple-600 rounded-lg">
                            <DollarSign size={24} />
                        </div>
                        <span className="text-sm text-gray-500">Total Value</span>
                    </div>
                    <h3 className="text-3xl font-bold text-gray-900">-- Kč</h3>
                    <p className="text-sm text-gray-500 mt-1">Estimated market value</p>
                </div>
            </div>
        </div>
    );
}
