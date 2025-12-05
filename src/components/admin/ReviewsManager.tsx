'use client';

import React, { useState, useEffect } from 'react';
import { db } from '@/lib/firebase';
import { collection, addDoc, getDocs, deleteDoc, doc, Timestamp, query, orderBy } from 'firebase/firestore';
import { Star, Trash2, Plus } from 'lucide-react';
import { toast } from 'sonner';

interface Review {
    id: string;
    author: string;
    rating: number;
    text: string;
    date: string;
    createdAt?: any;
}

export default function ReviewsManager() {
    const [reviews, setReviews] = useState<Review[]>([]);
    const [loading, setLoading] = useState(true);
    const [showAddForm, setShowAddForm] = useState(false);

    // Form state
    const [author, setAuthor] = useState('');
    const [rating, setRating] = useState(5);
    const [text, setText] = useState('');
    const [date, setDate] = useState(new Date().toISOString().split('T')[0]);

    useEffect(() => {
        loadReviews();
    }, []);

    const loadReviews = async () => {
        try {
            const q = query(collection(db, 'reviews'), orderBy('date', 'desc'), orderBy('createdAt', 'desc'));
            const snapshot = await getDocs(q);
            const reviewsData = snapshot.docs.map(doc => ({
                id: doc.id,
                ...doc.data()
            })) as Review[];
            setReviews(reviewsData);
        } catch (error) {
            console.error('Error loading reviews:', error);
            toast.error('Chyba při načítání recenzí');
        } finally {
            setLoading(false);
        }
    };

    const handleAddReview = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!author.trim() || !text.trim()) {
            toast.error('Vyplňte všechna pole');
            return;
        }

        try {
            await addDoc(collection(db, 'reviews'), {
                author: author.trim(),
                rating,
                text: text.trim(),
                date,
                createdAt: Timestamp.now(),
            });

            toast.success('Recenze přidána!');
            setAuthor('');
            setRating(5);
            setText('');
            setDate(new Date().toISOString().split('T')[0]);
            setShowAddForm(false);
            loadReviews();
        } catch (error) {
            console.error('Error adding review:', error);
            toast.error('Chyba při přidávání recenze');
        }
    };

    const handleDeleteReview = async (id: string) => {
        if (!confirm('Opravdu chcete smazat tuto recenzi?')) return;

        try {
            await deleteDoc(doc(db, 'reviews', id));
            toast.success('Recenze smazána');
            loadReviews();
        } catch (error) {
            console.error('Error deleting review:', error);
            toast.error('Chyba při mazání recenze');
        }
    };

    if (loading) {
        return <div className="text-white">Načítám recenze...</div>;
    }

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex items-center justify-between">
                <h2 className="text-2xl font-bold text-white">Správa recenzí</h2>
                <button
                    onClick={() => setShowAddForm(!showAddForm)}
                    className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg flex items-center gap-2 transition-colors"
                >
                    <Plus size={20} />
                    Přidat recenzi
                </button>
            </div>

            {/* Add Form */}
            {showAddForm && (
                <form onSubmit={handleAddReview} className="bg-gray-900 rounded-xl p-6 border border-gray-800 space-y-4">
                    <h3 className="text-xl font-bold text-white mb-4">Nová recenze</h3>

                    {/* Author */}
                    <div>
                        <label className="block text-sm font-medium text-gray-300 mb-2">
                            Jméno autora *
                        </label>
                        <input
                            type="text"
                            value={author}
                            onChange={(e) => setAuthor(e.target.value)}
                            className="w-full px-4 py-2 bg-[#0f1117] border border-gray-700 rounded-lg text-white focus:outline-none focus:border-blue-500"
                            placeholder="Jan Novák"
                            required
                        />
                    </div>

                    {/* Rating */}
                    <div>
                        <label className="block text-sm font-medium text-gray-300 mb-2">
                            Hodnocení *
                        </label>
                        <div className="flex gap-2">
                            {[1, 2, 3, 4, 5].map((star) => (
                                <button
                                    key={star}
                                    type="button"
                                    onClick={() => setRating(star)}
                                    className="transition-transform hover:scale-110"
                                >
                                    <Star
                                        size={32}
                                        className={star <= rating ? 'fill-yellow-400 text-yellow-400' : 'text-gray-600'}
                                    />
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* Text */}
                    <div>
                        <label className="block text-sm font-medium text-gray-300 mb-2">
                            Text recenze *
                        </label>
                        <textarea
                            value={text}
                            onChange={(e) => setText(e.target.value)}
                            className="w-full px-4 py-2 bg-[#0f1117] border border-gray-700 rounded-lg text-white focus:outline-none focus:border-blue-500 min-h-[100px]"
                            placeholder="Skvělý obchod! Rychlé jednání..."
                            required
                        />
                    </div>

                    {/* Date */}
                    <div>
                        <label className="block text-sm font-medium text-gray-300 mb-2">
                            Datum *
                        </label>
                        <input
                            type="date"
                            value={date}
                            onChange={(e) => setDate(e.target.value)}
                            className="w-full px-4 py-2 bg-[#0f1117] border border-gray-700 rounded-lg text-white focus:outline-none focus:border-blue-500"
                            required
                        />
                    </div>

                    {/* Buttons */}
                    <div className="flex gap-3">
                        <button
                            type="submit"
                            className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg transition-colors"
                        >
                            Přidat recenzi
                        </button>
                        <button
                            type="button"
                            onClick={() => setShowAddForm(false)}
                            className="bg-gray-700 hover:bg-gray-600 text-white px-6 py-2 rounded-lg transition-colors"
                        >
                            Zrušit
                        </button>
                    </div>
                </form>
            )}

            {/* Reviews List */}
            <div className="space-y-4">
                {reviews.length === 0 ? (
                    <div className="text-center py-12 text-gray-500">
                        Zatím nejsou žádné recenze. Přidejte první!
                    </div>
                ) : (
                    reviews.map((review) => (
                        <div key={review.id} className="bg-gray-900 rounded-xl p-6 border border-gray-800">
                            <div className="flex items-start justify-between">
                                <div className="flex-1">
                                    {/* Rating */}
                                    <div className="flex items-center gap-1 mb-2">
                                        {[...Array(5)].map((_, i) => (
                                            <Star
                                                key={i}
                                                size={16}
                                                className={i < review.rating ? 'fill-yellow-400 text-yellow-400' : 'text-gray-600'}
                                            />
                                        ))}
                                    </div>

                                    {/* Text */}
                                    <p className="text-gray-300 mb-3">"{review.text}"</p>

                                    {/* Author & Date */}
                                    <div className="text-sm text-gray-500">
                                        <span className="font-semibold text-gray-400">{review.author}</span>
                                        {' • '}
                                        <span>{new Date(review.date).toLocaleDateString('cs-CZ')}</span>
                                    </div>
                                </div>

                                {/* Delete Button */}
                                <button
                                    onClick={() => handleDeleteReview(review.id)}
                                    className="text-red-400 hover:text-red-300 p-2 hover:bg-red-900/20 rounded-lg transition-colors"
                                    title="Smazat recenzi"
                                >
                                    <Trash2 size={20} />
                                </button>
                            </div>
                        </div>
                    ))
                )}
            </div>
        </div>
    );
}

