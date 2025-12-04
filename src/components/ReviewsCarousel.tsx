'use client';

import React, { useState, useEffect } from 'react';
import { Star, ChevronLeft, ChevronRight } from 'lucide-react';

interface Review {
    id: string;
    author: string;
    rating: number;
    text: string;
    date: string;
}

interface ReviewsCarouselProps {
    reviews: Review[];
}

export default function ReviewsCarousel({ reviews }: ReviewsCarouselProps) {
    const [currentIndex, setCurrentIndex] = useState(0);
    const [isAutoPlaying, setIsAutoPlaying] = useState(true);

    // Počet recenzí zobrazených najednou (responzivní)
    const [itemsPerView, setItemsPerView] = useState(4);

    useEffect(() => {
        const handleResize = () => {
            if (window.innerWidth < 640) {
                setItemsPerView(1);
            } else if (window.innerWidth < 1024) {
                setItemsPerView(2);
            } else if (window.innerWidth < 1280) {
                setItemsPerView(3);
            } else {
                setItemsPerView(4);
            }
        };

        handleResize();
        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, []);

    // Automatické posouvání
    useEffect(() => {
        if (!isAutoPlaying || reviews.length <= itemsPerView) return;

        const interval = setInterval(() => {
            setCurrentIndex((prev) => {
                const maxIndex = Math.max(0, reviews.length - itemsPerView);
                return prev >= maxIndex ? 0 : prev + 1;
            });
        }, 5000); // Posune každých 5 sekund

        return () => clearInterval(interval);
    }, [isAutoPlaying, reviews.length, itemsPerView]);

    const goToPrevious = () => {
        setIsAutoPlaying(false);
        setCurrentIndex((prev) => (prev === 0 ? Math.max(0, reviews.length - itemsPerView) : prev - 1));
    };

    const goToNext = () => {
        setIsAutoPlaying(false);
        setCurrentIndex((prev) => {
            const maxIndex = Math.max(0, reviews.length - itemsPerView);
            return prev >= maxIndex ? 0 : prev + 1;
        });
    };

    if (reviews.length === 0) {
        return (
            <div className="text-center py-12">
                <p className="text-gray-500">Zatím nejsou žádné recenze.</p>
            </div>
        );
    }

    const maxIndex = Math.max(0, reviews.length - itemsPerView);

    return (
        <div className="relative">
            {/* Nadpis */}
            <div className="text-center mb-8">
                <div className="flex items-center justify-center gap-3 mb-2">
                    <Star className="text-yellow-400 fill-yellow-400" size={28} />
                    <h2 className="text-3xl font-bold text-white">Reputace</h2>
                    <Star className="text-yellow-400 fill-yellow-400" size={28} />
                </div>
                <p className="text-gray-400">Co o nás říkají naši zákazníci</p>
            </div>

            {/* Carousel Container */}
            <div className="relative overflow-hidden">
                {/* Navigation Buttons */}
                {reviews.length > itemsPerView && (
                    <>
                        <button
                            onClick={goToPrevious}
                            className="absolute left-0 top-1/2 -translate-y-1/2 z-10 bg-gray-800/90 hover:bg-gray-700 text-white p-3 rounded-full shadow-lg transition-all -ml-4"
                            aria-label="Previous reviews"
                        >
                            <ChevronLeft size={24} />
                        </button>
                        <button
                            onClick={goToNext}
                            className="absolute right-0 top-1/2 -translate-y-1/2 z-10 bg-gray-800/90 hover:bg-gray-700 text-white p-3 rounded-full shadow-lg transition-all -mr-4"
                            aria-label="Next reviews"
                        >
                            <ChevronRight size={24} />
                        </button>
                    </>
                )}

                {/* Reviews Grid */}
                <div className="overflow-hidden px-2">
                    <div
                        className="flex transition-transform duration-500 ease-in-out gap-6"
                        style={{
                            transform: `translateX(-${currentIndex * (100 / itemsPerView)}%)`,
                        }}
                    >
                        {reviews.map((review) => (
                            <div
                                key={review.id}
                                className="flex-shrink-0"
                                style={{ width: `calc(${100 / itemsPerView}% - ${(itemsPerView - 1) * 24 / itemsPerView}px)` }}
                            >
                                <div className="bg-gray-900 rounded-2xl p-6 border border-gray-800 hover:border-gray-700 transition-all h-full flex flex-col">
                                    {/* Rating Stars */}
                                    <div className="flex items-center gap-1 mb-3">
                                        {[...Array(5)].map((_, i) => (
                                            <Star
                                                key={i}
                                                size={16}
                                                className={i < review.rating ? 'fill-yellow-400 text-yellow-400' : 'text-gray-600'}
                                            />
                                        ))}
                                    </div>

                                    {/* Review Text */}
                                    <p className="text-gray-300 text-base font-bold mb-4 flex-1 line-clamp-4">
                                        "{review.text}"
                                    </p>

                                    {/* Author & Date */}
                                    <div className="text-xs text-gray-500 border-t border-gray-800 pt-3">
                                        <div className="font-semibold text-gray-400">{review.author}</div>
                                        <div>{new Date(review.date).toLocaleDateString('cs-CZ')}</div>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Dots Indicator */}
                {reviews.length > itemsPerView && (
                    <div className="flex justify-center gap-2 mt-6">
                        {[...Array(maxIndex + 1)].map((_, index) => (
                            <button
                                key={index}
                                onClick={() => {
                                    setCurrentIndex(index);
                                    setIsAutoPlaying(false);
                                }}
                                className={`w-2 h-2 rounded-full transition-all ${index === currentIndex ? 'bg-blue-500 w-8' : 'bg-gray-600 hover:bg-gray-500'
                                    }`}
                                aria-label={`Go to slide ${index + 1}`}
                            />
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}

