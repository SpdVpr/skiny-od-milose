import React from 'react';
import InventoryTable from '@/components/admin/InventoryTable';
import DeleteAllButton from '@/components/admin/DeleteAllButton';
import ManualListing from '@/components/admin/ManualListing';
import CSFloatRefreshButton from '@/components/admin/CSFloatRefreshButton';


export default function InventoryPage() {
    return (
        <div className="space-y-8">
            {/* Inventory Section */}
            <div className="space-y-6">
                <div className="flex justify-between items-center">
                    <h2 className="text-2xl font-bold text-gray-800">Inventory Management</h2>
                    <div className="flex gap-3">
                        <ManualListing />
                        <CSFloatRefreshButton />
                        <DeleteAllButton />
                    </div>
                </div>
                <InventoryTable />
            </div>
        </div>
    );
}
