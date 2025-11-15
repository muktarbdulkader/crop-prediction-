import React from 'react';
import { useAudioPlayer } from './hooks/useAudioPlayer';
import type { Language } from '../types';

interface PlayAudioButtonProps {
    textToRead: string;
    language: Language;
    t: any;
    className?: string;
}

const PlayAudioButton: React.FC<PlayAudioButtonProps> = ({ textToRead, language, t, className = '' }) => {
    const { play, stop, isLoading, isPlaying, error } = useAudioPlayer(language);

    const handleClick = () => {
        if (isPlaying) {
            stop();
        } else if (!isLoading) {
            play(textToRead);
        }
    };

    return (
        <div className={`relative flex items-center justify-center ${className}`}>
            <button
                onClick={handleClick}
                disabled={isLoading || !textToRead}
                className="p-1.5 rounded-full bg-card shadow-md text-text-muted hover:bg-base-200 disabled:opacity-50"
                aria-label={isPlaying ? t.stopAudio : t.playAudio}
            >
                {isLoading ? (
                    <div className="w-5 h-5 animate-spin rounded-full border-2 border-brand-green border-t-transparent"></div>
                ) : isPlaying ? (
                     <svg xmlns="http://www.w.org/2000/svg" className="h-5 w-5 text-brand-brown" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8 7a1 1 0 00-1 1v4a1 1 0 102 0V8a1 1 0 00-1-1zm4 0a1 1 0 00-1 1v4a1 1 0 102 0V8a1 1 0 00-1-1z" clipRule="evenodd" />
                    </svg>
                ) : (
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                        <path d="M10 18a8 8 0 100-16 8 8 0 000 16zM9.555 7.168A1 1 0 008 8v4a1 1 0 001.555.832l3-2a1 1 0 000-1.664l-3-2z" />
                    </svg>
                )}
            </button>
            {error && <p className="absolute text-xs text-red-500 top-full mt-1 w-max">{error}</p>}
        </div>
    );
};

export default PlayAudioButton;
