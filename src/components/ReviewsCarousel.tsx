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

    // Automatické posouvání - posouváme po jedné recenzi
    useEffect(() => {
        if (!isAutoPlaying || reviews.length <= itemsPerView) return;

        const interval = setInterval(() => {
            setCurrentIndex((prev) => {
                const maxIndex = reviews.length - itemsPerView;
                return prev >= maxIndex ? 0 : prev + 1;
            });
        }, 5000); // Posune každých 5 sekund

        return () => clearInterval(interval);
    }, [isAutoPlaying, reviews.length, itemsPerView]);

    const goToPrevious = () => {
        setIsAutoPlaying(false);
        setCurrentIndex((prev) => {
            const maxIndex = reviews.length - itemsPerView;
            return prev === 0 ? maxIndex : prev - 1;
        });
    };

    const goToNext = () => {
        setIsAutoPlaying(false);
        setCurrentIndex((prev) => {
            const maxIndex = reviews.length - itemsPerView;
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

    return (
        <div className="relative">
            {/* Nadpis */}


            {/* Carousel Container */}
            <div className="relative">
                {/* Navigation Buttons */}
                {reviews.length > itemsPerView && (
                    <>
                        <button
                            onClick={goToPrevious}
                            className="absolute left-2 top-1/2 -translate-y-1/2 z-10 bg-gray-800/90 hover:bg-gray-700 text-white p-3 rounded-full shadow-lg transition-all"
                            aria-label="Previous reviews"
                        >
                            <ChevronLeft size={24} />
                        </button>
                        <button
                            onClick={goToNext}
                            className="absolute right-2 top-1/2 -translate-y-1/2 z-10 bg-gray-800/90 hover:bg-gray-700 text-white p-3 rounded-full shadow-lg transition-all"
                            aria-label="Next reviews"
                        >
                            <ChevronRight size={24} />
                        </button>
                    </>
                )}

                {/* Reviews Grid - Plynulá slideshow */}
                <div className="overflow-hidden">
                    <div
                        className="flex transition-transform duration-700 ease-in-out"
                        style={{
                            transform: `translateX(-${(currentIndex / itemsPerView) * 100}%)`,
                        }}
                    >
                        {reviews.map((review) => (
                            <div
                                key={review.id}
                                className="flex-shrink-0 px-3"
                                style={{ width: `${100 / itemsPerView}%` }}
                            >
                                <div className="bg-[#161616] rounded-2xl p-6 border border-[#161616] hover:border-[#161616] transition-all h-full flex flex-col">
                                    {/* Rating Stars */}
                                    <div className="flex items-center gap-1 mb-3">
                                        {[...Array(5)].map((_, i) => (
                                            <Star
                                                key={i}
                                                size={16}
                                                className={i < review.rating ? 'fill-[#fbbc04] text-[#fbbc04]' : 'fill-gray-600 text-gray-600'}
                                            />
                                        ))}
                                    </div>

                                    {/* Review Text */}
                                    <p className="text-gray-300 text-sm mb-3 flex-1 line-clamp-2">
                                        "{review.text}"
                                    </p>

                                    {/* Author & Date */}
                                    <div className="text-xs text-gray-500 border-t border-[#161616] pt-2">
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
                        {[...Array(reviews.length - itemsPerView + 1)].map((_, index) => (
                            <button
                                key={index}
                                onClick={() => {
                                    setCurrentIndex(index);
                                    setIsAutoPlaying(false);
                                }}
                                className={`w-2 h-2 rounded-full transition-all ${currentIndex === index ? 'bg-white w-8' : 'bg-gray-600 hover:bg-gray-500'
                                    }`}
                                aria-label={`Go to position ${index + 1}`}
                            />
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}

