import React from 'react';
import ReviewsManager from '@/components/admin/ReviewsManager';

export default function ReviewsPage() {
    return (
        <div className="space-y-8">
            <div className="flex justify-between items-center">
                <h2 className="text-2xl font-bold text-gray-800">Správa Recenzí</h2>
            </div>
            <ReviewsManager />
        </div>
    );
}
