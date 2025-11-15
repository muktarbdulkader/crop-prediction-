import { useState, useEffect } from 'react';
import { GoogleGenAI } from '@google/genai';
import { generateSpeech } from '../../services/geminiService';
import { translations } from '../../translations';
import type { Language } from '../../types';

export const useAudioPlayer = (language: Language) => {
    const [isLoading, setIsLoading] = useState(false);
    const [isPlaying, setIsPlaying] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [activeAudio, setActiveAudio] = useState<AudioBufferSourceNode | null>(null);
    const [audioContext, setAudioContext] = useState<AudioContext | null>(null);
    const t = translations[language];

    const stop = () => {
        if (activeAudio) {
            activeAudio.stop();
            // The onended event will handle cleanup and state changes
        }
    };
    
    const play = async (text: string) => {
        if (isPlaying) {
            stop();
            return;
        }
        if (isLoading) return;

        setIsLoading(true);
        setError(null);

        try {
            if (!process.env.API_KEY) {
                throw new Error("API_KEY_MISSING");
            }
            const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
            const audioBuffer = await generateSpeech(ai, text);
            
            const context = new (window.AudioContext || (window as any).webkitAudioContext)();
            setAudioContext(context);

            const source = context.createBufferSource();
            source.buffer = audioBuffer;
            source.connect(context.destination);
            source.start();
            
            setIsPlaying(true);
            setActiveAudio(source);

            source.onended = () => {
                setIsPlaying(false);
                setActiveAudio(null);
                context.close();
                setAudioContext(null);
            };

        } catch (err) {
            const errorMessage = err instanceof Error ? err.message : 'UNKNOWN_ERROR';
            setError(t.errors[errorMessage] || t.errors.UNKNOWN_ERROR);
            setIsPlaying(false);
        } finally {
            setIsLoading(false);
        }
    };
    
    useEffect(() => {
        // Cleanup function to stop audio and close context when component unmounts
        return () => {
            if (activeAudio) {
                activeAudio.stop();
            }
            if (audioContext) {
                audioContext.close();
            }
        };
    }, [activeAudio, audioContext]);

    return { play, stop, isLoading, isPlaying, error };
};
