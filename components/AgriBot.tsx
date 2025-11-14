// Fix for SpeechRecognition API not being in standard TS lib.
// These declarations provide the necessary types for the Web Speech API
// to resolve "Cannot find name 'SpeechRecognition'" and "property does not exist on 'Window'" errors.
declare global {
    interface SpeechRecognitionAlternative {
        readonly transcript: string;
        readonly confidence: number;
    }

    interface SpeechRecognitionResult {
        readonly isFinal: boolean;
        readonly length: number;
        item(index: number): SpeechRecognitionAlternative;
        [index: number]: SpeechRecognitionAlternative;
    }

    interface SpeechRecognitionResultList {
        readonly length: number;
        item(index: number): SpeechRecognitionResult;
        [index: number]: SpeechRecognitionResult;
    }

    interface SpeechRecognitionEvent extends Event {
        readonly resultIndex: number;
        readonly results: SpeechRecognitionResultList;
    }

    interface SpeechRecognitionErrorEvent extends Event {
        readonly error: string;
        readonly message: string;
    }

    interface SpeechRecognition extends EventTarget {
        continuous: boolean;
        interimResults: boolean;
        lang: string;
        start(): void;
        stop(): void;
        onstart: (this: SpeechRecognition, ev: Event) => any;
        onend: (this: SpeechRecognition, ev: Event) => any;
        onerror: (this: SpeechRecognition, ev: SpeechRecognitionErrorEvent) => any;
        onresult: (this: SpeechRecognition, ev: SpeechRecognitionEvent) => any;
    }
    
    interface Window {
        SpeechRecognition: new () => SpeechRecognition;
        webkitSpeechRecognition: new () => SpeechRecognition;
    }
}


import React, { useState, useEffect, useRef } from 'react';
import { GoogleGenAI } from '@google/genai';
import type { ChatMessage, Language } from '../types';
import { askAgriBot, generateSpeech } from '../services/geminiService';

interface AgriBotProps {
    language: Language;
    t: any; // Translation object
}

const AgriBot: React.FC<AgriBotProps> = ({ language, t }) => {
    const [messages, setMessages] = useState<ChatMessage[]>([]);
    const [userInput, setUserInput] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [playingMessageIndex, setPlayingMessageIndex] = useState<number | null>(null);
    const [audioLoading, setAudioLoading] = useState<number | null>(null);
    
    // Speech-to-text state
    const [isListening, setIsListening] = useState(false);
    const [speechError, setSpeechError] = useState<string | null>(null);
    const [speechSupported, setSpeechSupported] = useState(false);
    // Fix for line 24: Cannot find name 'SpeechRecognition'. The type is now defined globally.
    const recognitionRef = useRef<SpeechRecognition | null>(null);

    const messagesEndRef = useRef<HTMLDivElement>(null);

    // Reset chat and show welcome message when language changes
    useEffect(() => {
        setMessages([{ role: 'model', text: t.agriBotWelcome }]);
    }, [t.agriBotWelcome]);

    const getSpeechLang = (lang: Language): string => {
        switch (lang) {
            case 'am': return 'am-ET';
            case 'om': return 'om-ET';
            default: return 'en-US';
        }
    };

    // Initialize Speech Recognition
    useEffect(() => {
        // Fix for line 43: Property 'SpeechRecognition' does not exist on type 'Window & typeof globalThis'.
        // With the global types defined, we can safely access window.SpeechRecognition and remove the 'any' cast.
        const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
        if (!SpeechRecognition) {
            console.warn("Speech recognition not supported in this browser.");
            setSpeechSupported(false);
            return;
        }
        setSpeechSupported(true);

        const recognition = new SpeechRecognition();
        recognition.continuous = true;
        recognition.interimResults = true;
        recognition.lang = getSpeechLang(language);

        recognition.onstart = () => setIsListening(true);
        recognition.onend = () => setIsListening(false);
        recognition.onerror = (event) => {
            if (event.error === 'not-allowed') {
                setSpeechError(t.errors.speechPermissionDenied);
            } else {
                 setSpeechError(`${t.errors.speechError}: ${event.error}`);
            }
            console.error('Speech recognition error:', event.error);
            setIsListening(false);
        };
        
        recognition.onresult = (event) => {
            let finalTranscript = '';
            for (let i = 0; i < event.results.length; ++i) {
                finalTranscript += event.results[i][0].transcript;
            }
            setUserInput(finalTranscript);
        };

        recognitionRef.current = recognition;

        return () => {
            recognition.stop();
        };
    }, [language, t.errors]);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    };

    useEffect(scrollToBottom, [messages]);

    const handlePlayAudio = async (text: string, index: number) => {
        if (playingMessageIndex === index || audioLoading !== null) {
            return;
        }
        setAudioLoading(index);
        setError(null);
        try {
            if (!process.env.API_KEY) {
                throw new Error("API_KEY_MISSING");
            }
            const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
            const audioBuffer = await generateSpeech(ai, text);
            
            const audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
            const source = audioContext.createBufferSource();
            source.buffer = audioBuffer;
            source.connect(audioContext.destination);
            source.start();
            setPlayingMessageIndex(index);
            source.onended = () => {
                setPlayingMessageIndex(null);
            };
        } catch (err) {
            const errorMessage = err instanceof Error ? err.message : 'UNKNOWN_ERROR';
            setError(t.errors[errorMessage] || t.errors.UNKNOWN_ERROR);
        } finally {
            setAudioLoading(null);
        }
    }

    const handleSend = async () => {
        if (!userInput.trim() || isLoading) return;

        const newUserMessage: ChatMessage = { role: 'user', text: userInput };
        setMessages(prev => [...prev, newUserMessage]);
        const currentInput = userInput;
        setUserInput('');
        setIsLoading(true);
        setError(null);
        setSpeechError(null);

        try {
            if (!process.env.API_KEY) {
                throw new Error("API_KEY_MISSING");
            }
            const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
            const botResponse = await askAgriBot(ai, currentInput, language);
            const newBotMessage: ChatMessage = { role: 'model', text: botResponse };
            setMessages(prev => [...prev, newBotMessage]);
        } catch (err) {
            console.error("Error in AgriBot conversation:", err); // Log detailed error
            const errorMessage = err instanceof Error ? err.message : 'UNKNOWN_ERROR';
            const translatedError = t.errors[errorMessage] || t.errors.UNKNOWN_ERROR;
            setError(translatedError);
            const errorBotMessage: ChatMessage = {
                role: 'model',
                text: `${t.errors.agriBotErrorPrefix} ${translatedError}`,
                isError: true,
            };
            setMessages(prev => [...prev, errorBotMessage]);
        } finally {
            setIsLoading(false);
        }
    };
    
    const handleToggleListening = () => {
        if (!recognitionRef.current) return;
        setSpeechError(null);
        if (isListening) {
            recognitionRef.current.stop();
        } else {
            setUserInput('');
            recognitionRef.current.start();
        }
    };

    const BotAvatar = () => (
        <div className="w-8 h-8 rounded-full bg-brand-green flex items-center justify-center text-white font-bold text-sm flex-shrink-0">
           AI
        </div>
    );
    
    const UserAvatar = () => (
        <div className="w-8 h-8 rounded-full bg-brand-brown flex items-center justify-center text-white font-bold text-sm flex-shrink-0">
           U
        </div>
    );

    return (
        <div className="flex flex-col h-[75vh]">
            <h2 className="text-2xl font-bold mb-4 text-brand-green-dark border-b-2 border-brand-green/50 pb-3">{t.agriBotTitle}</h2>
            <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-base-100 rounded-lg">
                {messages.map((msg, index) => (
                    <div key={index} className={`flex items-end gap-3 ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                       {msg.role === 'model' && <BotAvatar />}
                        <div className={`max-w-lg p-3 rounded-2xl relative ${
                            msg.role === 'user' 
                            ? 'bg-brand-green text-white rounded-br-none' 
                            : msg.isError
                            ? 'bg-red-100 text-red-800 border border-red-200 rounded-bl-none'
                            : 'bg-base-200 text-text-main rounded-bl-none'
                        }`}>
                             {msg.isError && (
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 inline-block mr-2 text-red-600" viewBox="0 0 20 20" fill="currentColor">
                                    <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                                </svg>
                            )}
                            <p className={`whitespace-pre-wrap ${msg.isError ? 'inline' : ''}`}>{msg.text}</p>
                             {msg.role === 'model' && index > 0 && !msg.isError && (
                                <button
                                    onClick={() => handlePlayAudio(msg.text, index)}
                                    disabled={audioLoading !== null}
                                    className="absolute -bottom-3 -right-3 p-1.5 rounded-full bg-card shadow-md text-text-muted hover:bg-base-200 disabled:opacity-50"
                                    aria-label={t.playAudio}
                                >
                                    {audioLoading === index ? (
                                        <div className="w-5 h-5 animate-spin rounded-full border-2 border-brand-green border-t-transparent"></div>
                                    ) : (
                                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                                            <path d="M10 18a8 8 0 100-16 8 8 0 000 16zM9.555 7.168A1 1 0 008 8v4a1 1 0 001.555.832l3-2a1 1 0 000-1.664l-3-2z" />
                                        </svg>
                                    )}
                                </button>
                            )}
                        </div>
                        {msg.role === 'user' && <UserAvatar />}
                    </div>
                ))}
                {isLoading && (
                     <div className="flex justify-start gap-3">
                        <BotAvatar />
                        <div className="max-w-lg p-3 rounded-2xl bg-base-200 text-text-main rounded-bl-none">
                            <div className="flex items-center gap-2">
                                <div className="h-2 w-2 bg-brand-green rounded-full animate-bounce [animation-delay:-0.3s]"></div>
                                <div className="h-2 w-2 bg-brand-green rounded-full animate-bounce [animation-delay:-0.15s]"></div>
                                <div className="h-2 w-2 bg-brand-green rounded-full animate-bounce"></div>
                            </div>
                        </div>
                    </div>
                )}
                <div ref={messagesEndRef} />
            </div>
            {(error || speechError) && <div className="mt-2 text-center text-sm text-red-600 animate-fade-in">{error || speechError}</div>}
            <div className="mt-4 relative">
                {speechSupported && (
                    <button
                        onClick={handleToggleListening}
                        className={`absolute inset-y-0 left-0 flex items-center justify-center w-12 text-text-muted hover:text-brand-green transition-colors ${isListening ? 'text-red-500' : ''}`}
                        aria-label={isListening ? t.stopRecording : t.startRecording}
                    >
                        {isListening ? (
                            <span className="relative flex h-5 w-5">
                                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
                                <svg xmlns="http://www.w3.org/2000/svg" className="relative h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8 9a1 1 0 011-1h2a1 1 0 110 2H9a1 1 0 01-1-1z" clipRule="evenodd" />
                                </svg>
                            </span>
                        ) : (
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                <path strokeLinecap="round" strokeLinejoin="round" d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z" />
                            </svg>
                        )}
                    </button>
                )}
                <input
                    type="text"
                    value={userInput}
                    onChange={(e) => setUserInput(e.target.value)}
                    onKeyPress={(e) => e.key === 'Enter' && handleSend()}
                    placeholder={isListening ? t.speakNow : t.agriBotPlaceholder}
                    className={`form-input !pr-12 !py-3 !bg-card ${speechSupported ? '!pl-12' : '!pl-4'}`}
                    disabled={isLoading}
                />
                <button
                    onClick={handleSend}
                    disabled={isLoading || !userInput.trim()}
                    className="absolute inset-y-0 right-0 flex items-center justify-center w-12 text-brand-green-dark hover:text-brand-green disabled:text-base-400 transition-colors"
                    aria-label={t.send}
                >
                   <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-8.707l-3-3a1 1 0 00-1.414 1.414L10.586 9H7a1 1 0 100 2h3.586l-1.293 1.293a1 1 0 101.414 1.414l3-3a1 1 0 000-1.414z" clipRule="evenodd" />
                   </svg>
                </button>
            </div>
        </div>
    );
};

export default AgriBot;