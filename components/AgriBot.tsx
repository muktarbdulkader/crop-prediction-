// SpeechRecognition type declarations
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
import { askAgriBotStream } from '../services/geminiService';
import PlayAudioButton from './PlayAudioButton';

interface AgriBotProps {
    language: Language;
    t: any;
    initialPrompt: string | null;
    onPromptSent: () => void;
}

const AgriBot: React.FC<AgriBotProps> = ({ language, t, initialPrompt, onPromptSent }) => {
    const [messages, setMessages] = useState<ChatMessage[]>([]);
    const [userInput, setUserInput] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const [isListening, setIsListening] = useState(false);
    const [speechError, setSpeechError] = useState<string | null>(null);
    const [speechSupported, setSpeechSupported] = useState(false);
    const recognitionRef = useRef<SpeechRecognition | null>(null);
    const textareaRef = useRef<HTMLTextAreaElement>(null);
    const messagesEndRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        setMessages([{ id: 'welcome', role: 'model', text: t.agriBotWelcome }]);
    }, [t.agriBotWelcome]);

    useEffect(() => {
        if (initialPrompt) {
            handleSend(initialPrompt);
            onPromptSent();
        }
    }, [initialPrompt, onPromptSent]);

    const getSpeechLang = (lang: Language): string => {
        switch (lang) {
            case 'am': return 'am-ET';
            case 'om': return 'om-ET';
            default: return 'en-US';
        }
    };

    useEffect(() => {
        const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
        if (!SpeechRecognition) {
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

        return () => recognition.stop();
    }, [language, t.errors]);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    };
    useEffect(scrollToBottom, [messages]);

    useEffect(() => {
        if (textareaRef.current) {
            textareaRef.current.style.height = 'auto';
            textareaRef.current.style.height = `${textareaRef.current.scrollHeight}px`;
        }
    }, [userInput]);

    const handleSend = async (messageText?: string) => {
        const textToSend = messageText || userInput;
        if (!textToSend.trim() || isLoading) return;

        const newUserMessage: ChatMessage = { id: `user-${Date.now()}`, role: 'user', text: textToSend };
        const botMessageId = `bot-${Date.now()}`;
        const newBotMessage: ChatMessage = { id: botMessageId, role: 'model', text: '' };

        setMessages(prev => [...prev, newUserMessage, newBotMessage]);
        setUserInput('');
        setIsLoading(true);
        setError(null);
        setSpeechError(null);

        try {
            if (!process.env.API_KEY) throw new Error("API_KEY_MISSING");
            
            const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
            
            await askAgriBotStream(ai, textToSend, language, (chunk) => {
                setMessages(prev =>
                    prev.map(msg =>
                        msg.id === botMessageId ? { ...msg, text: msg.text + chunk } : msg
                    )
                );
            });
        } catch (err) {
            const errorMessage = err instanceof Error ? err.message : 'UNKNOWN_ERROR';
            const translatedError = t.errors[errorMessage] || t.errors.UNKNOWN_ERROR;
            setError(translatedError);
            setMessages(prev => prev.filter(msg => msg.id !== botMessageId));
            const errorBotMessage: ChatMessage = {
                id: `error-${Date.now()}`,
                role: 'model',
                text: `${t.errors.agriBotErrorPrefix} ${translatedError}`,
                isError: true,
            };
            setMessages(prev => [...prev, errorBotMessage]);
        } finally {
            setIsLoading(false);
        }
    };

    const suggestions = [
        t.agriBotSuggestions.suggestion1,
        t.agriBotSuggestions.suggestion2,
        t.agriBotSuggestions.suggestion3,
    ];

    // Avatars and icons
    const SparkleIcon = ({ className = '' }: { className?: string }) => (
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className={className}>
            <path d="M12,2A3,3,0,0,0,9,5V9a3,3,0,0,0,6,0V5A3,3,0,0,0,12,2Zm5,9H15a3,3,0,0,0,0,6h2a3,3,0,0,0,0-6Zm-6,2V15a3,3,0,0,0-6,0v2a3,3,0,0,0,6,0Zm-2,4a3,3,0,0,0-3-3H2a3,3,0,0,0,0,6H4A3,3,0,0,0,7,17Z" />
        </svg>
    );

    const BotAvatar = () => (
        <div className="w-8 h-8 rounded-full bg-gradient-to-br from-brand-green to-brand-brown text-white flex items-center justify-center flex-shrink-0">
           <SparkleIcon className="w-5 h-5" />
        </div>
    );
    
    const UserAvatar = () => (
        <div className="w-8 h-8 rounded-full bg-base-300 text-text-main flex items-center justify-center font-semibold text-sm flex-shrink-0">
           U
        </div>
    );

    const TypingIndicator = () => (
        <div className="flex gap-1">
            <span className="h-2 w-2 bg-green-400 rounded-full animate-bounce [animation-delay:0s]"></span>
            <span className="h-2 w-2 bg-green-400 rounded-full animate-bounce [animation-delay:0.1s]"></span>
            <span className="h-2 w-2 bg-green-400 rounded-full animate-bounce [animation-delay:0.2s]"></span>
        </div>
    );

    return (
        <div className="flex flex-col h-[75vh] bg-white rounded-lg shadow-inner overflow-hidden border border-base-200">
            {/* Header */}
            <div className="flex items-center p-4 border-b border-gray-200">
                <div className="w-8 h-8 flex items-center justify-center animate-sparkle">
                    <SparkleIcon className="w-7 h-7 text-brand-green"/>
                </div>
                <h2 className="text-xl font-bold text-gray-700 ml-2">{t.agriBotTitle}</h2>
            </div>

            {/* Messages */}
            <div className="flex-1 overflow-y-auto p-6 space-y-4">
                {messages.map((msg) => {
                    const isUser = msg.role === 'user';
                    return (
                        <div key={msg.id} className={`flex ${isUser ? 'justify-end' : 'justify-start'} gap-3`}>
                            {!isUser && <BotAvatar />}
                            <div className="max-w-[70%] relative group">
                                <div className={`px-4 py-3 rounded-2xl shadow-sm ${
                                    isUser
                                        ? 'bg-brand-green/90 text-white rounded-br-lg'
                                        : msg.isError
                                            ? 'bg-red-50 text-red-800 border border-red-100 rounded-bl-lg'
                                            : 'bg-gradient-to-r from-green-50 via-white to-green-50 text-text-main rounded-bl-lg'
                                }`}>
                                    {msg.text ? <p className="whitespace-pre-wrap">{msg.text}</p> : <TypingIndicator />}
                                </div>
                                {!isUser && msg.text && !msg.isError && (
                                    <div className="absolute top-1/2 -translate-y-1/2 -right-12 opacity-0 group-hover:opacity-100 transition-opacity">
                                        <PlayAudioButton textToRead={msg.text} language={language} t={t} />
                                    </div>
                                )}
                            </div>
                            {isUser && <UserAvatar />}
                        </div>
                    );
                })}
                <div ref={messagesEndRef} />
            </div>

            {/* Suggestions */}
            {!isLoading && messages.length <= 1 && (
                <div className="flex flex-wrap items-center justify-center gap-2 mb-3 animate-fade-in px-4">
                    {suggestions.map((s, i) => (
                        <button key={i} onClick={() => handleSend(s)} className="text-sm bg-base-100 hover:bg-base-200 border border-base-300 text-text-main px-3 py-1.5 rounded-full transition-colors">
                            {s}
                        </button>
                    ))}
                </div>
            )}

            {/* Input + mic + send */}
            <div className="px-4 pb-2">
                <div className="bg-base-100 border border-base-300/80 rounded-2xl p-2 flex items-end gap-2 transition-all duration-300 focus-within:border-brand-green focus-within:ring-2 focus-within:ring-brand-green/20">
                    
                    {/* Microphone button */}
                    {speechSupported && (
                        <button
                            onClick={() => {
                                setSpeechError(null);
                                if (isListening) recognitionRef.current?.stop();
                                else {
                                    setUserInput('');
                                    recognitionRef.current?.start();
                                }
                            }}
                            className={`relative flex-shrink-0 flex items-center justify-center h-10 w-10 rounded-full transition-colors duration-200
                                ${isListening ? 'bg-red-500/10 text-red-600 hover:bg-red-500/20' : 'bg-base-100 text-text-muted hover:bg-base-200'}`}
                            aria-label={isListening ? t.stopRecording : t.startRecording}
                        >
                            {isListening && <span className="absolute inset-0 rounded-full animate-ping bg-red-400/30"></span>}
                            {isListening ? (
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 relative" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M6 6h12v12H6z" />
                                </svg>
                            ) : (
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 relative" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M12 1a3 3 0 00-3 3v7a3 3 0 006 0V4a3 3 0 00-3-3z" />
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M5 10v2a7 7 0 0014 0v-2" />
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M12 21v-4" />
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M8 21h8" />
                                </svg>
                            )}
                        </button>
                    )}

                    {/* Textarea */}
                    <textarea
                        ref={textareaRef}
                        rows={1}
                        value={userInput}
                        onChange={(e) => setUserInput(e.target.value)}
                        onKeyDown={(e) => {
                            if (e.key === 'Enter' && !e.shiftKey) {
                                e.preventDefault();
                                handleSend();
                            }
                        }}
                        placeholder={isListening ? t.speakNow : t.agriBotPlaceholder}
                        className="flex-1 bg-transparent resize-none outline-none border-none focus:ring-0 text-text-main placeholder-text-muted max-h-32 py-2"
                        disabled={isLoading}
                    />

                    {/* Send button */}
                    <button
                        onClick={handleSend}
                        disabled={isLoading || !userInput.trim()}
                        className="flex-shrink-0 flex items-center justify-center h-10 w-10 rounded-full bg-brand-green text-white transition-all duration-200 enabled:hover:bg-brand-green-dark enabled:hover:scale-110 disabled:bg-base-300 disabled:text-base-400"
                        aria-label={t.send}
                    >
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                            <path strokeLinecap="round" strokeLinejoin="round" d="M5 10l7-7m0 0l7 7m-7-7v18" />
                        </svg>
                    </button>
                </div>

                {(error || speechError) && <p className="mt-2 text-center text-xs text-red-600 animate-fade-in">{error || speechError}</p>}
            </div>
        </div>
    );
};

export default AgriBot;
