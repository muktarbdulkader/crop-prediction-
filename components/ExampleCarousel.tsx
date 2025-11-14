import React, { useState } from 'react';
import type { LeafAnalysisResult } from '../types';

type Example = {
    name: string;
    image: string;
    prompt: string;
    // Fix: Changed analysis type from string to LeafAnalysisResult to match data structure.
    analysis: LeafAnalysisResult;
};

interface ExampleCarouselProps {
    t: any;
    onUseExample: (example: Example) => void;
}

const ExampleCarousel: React.FC<ExampleCarouselProps> = ({ t, onUseExample }) => {
    const [currentIndex, setCurrentIndex] = useState(0);
    const examples: Example[] = t.scanner.examples || [];

    if (!examples.length) {
        return null;
    }

    const goToPrevious = () => {
        const isFirstSlide = currentIndex === 0;
        const newIndex = isFirstSlide ? examples.length - 1 : currentIndex - 1;
        setCurrentIndex(newIndex);
    };

    const goToNext = () => {
        const isLastSlide = currentIndex === examples.length - 1;
        const newIndex = isLastSlide ? 0 : currentIndex + 1;
        setCurrentIndex(newIndex);
    };

    const currentExample = examples[currentIndex];

    return (
        <div className="mb-6 bg-base-100 p-4 rounded-lg border border-base-200 animate-fade-in">
            <h3 className="text-lg font-semibold text-text-muted mb-3 text-center">{t.scanner.useExamples}</h3>
            <div className="relative h-64 w-full group">
                <div 
                    style={{ backgroundImage: `url(${currentExample.image})` }}
                    className="w-full h-full rounded-lg bg-center bg-cover duration-500"
                ></div>
                
                {/* Left Arrow */}
                <div onClick={goToPrevious} className="absolute top-1/2 left-2 -translate-y-1/2 p-2 bg-black/30 rounded-full text-white cursor-pointer opacity-0 group-hover:opacity-100 transition-opacity">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" /></svg>
                </div>
                {/* Right Arrow */}
                <div onClick={goToNext} className="absolute top-1/2 right-2 -translate-y-1/2 p-2 bg-black/30 rounded-full text-white cursor-pointer opacity-0 group-hover:opacity-100 transition-opacity">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" /></svg>
                </div>

                <div className="absolute bottom-0 left-0 right-0 bg-black/50 text-white p-2 text-center rounded-b-lg">
                    {currentExample.name}
                </div>
            </div>
            <button
                onClick={() => onUseExample(currentExample)}
                className="w-full mt-3 bg-brand-brown hover:bg-brand-brown/80 text-white font-semibold py-2 px-4 rounded-lg transition-colors text-sm"
            >
                {t.scanner.useThisExample}
            </button>
        </div>
    );
};

export default ExampleCarousel;
