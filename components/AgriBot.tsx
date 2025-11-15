// SpeechRecognition API declarations
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

import React, { useState, useEffect, useRef } from "react";
import { GoogleGenAI } from "@google/genai";
import { marked } from "marked";
import type { ChatMessage, Language, User } from "../types";
import { askAgriBotStream } from "../services/geminiService";
import PlayAudioButton from "./PlayAudioButton";
import PaymentModal from "./PaymentModal";

interface AgriBotProps {
  language: Language;
  t: any;
  initialPrompt: string | null;
  onPromptSent: () => void;
  user: User;
  onUpgrade: () => void;
}

const AgriBot: React.FC<AgriBotProps> = ({
  language,
  t,
  initialPrompt,
  onPromptSent,
  user,
  onUpgrade,
}) => {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [userInput, setUserInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isListening, setIsListening] = useState(false);
  const [speechError, setSpeechError] = useState<string | null>(null);
  const [speechSupported, setSpeechSupported] = useState(false);
  const recognitionRef = useRef<SpeechRecognition | null>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const [isPaymentModalOpen, setIsPaymentModalOpen] = useState(false);

  useEffect(() => {
    setMessages([{ id: "welcome", role: "model", text: t.agriBotWelcome }]);
  }, [t.agriBotWelcome]);

  useEffect(() => {
    if (initialPrompt) {
      handleSend(initialPrompt);
      onPromptSent();
    }
  }, [initialPrompt, onPromptSent]);

  const getSpeechLang = (lang: Language): string => {
    switch (lang) {
      case "am":
        return "am-ET";
      case "om":
        return "om-ET";
      default:
        return "en-US";
    }
  };

  useEffect(() => {
    const SpeechRecognition =
      window.SpeechRecognition || window.webkitSpeechRecognition;
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
      if (event.error === "not-allowed") {
        setSpeechError(t.errors.speechPermissionDenied);
      } else {
        setSpeechError(`${t.errors.speechError}: ${event.error}`);
      }
      setIsListening(false);
    };

    recognition.onresult = (event) => {
      let finalTranscript = "";
      for (let i = 0; i < event.results.length; ++i) {
        finalTranscript += event.results[i][0].transcript;
      }
      setUserInput(finalTranscript);
    };

    recognitionRef.current = recognition;

    return () => recognition.stop();
  }, [language, t.errors]);

  const scrollToBottom = () =>
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  useEffect(scrollToBottom, [messages]);

  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = "auto";
      textareaRef.current.style.height = `${textareaRef.current.scrollHeight}px`;
    }
  }, [userInput]);

  const handleSend = async (messageText?: string) => {
    const textToSend = messageText || userInput;
    if (!textToSend.trim() || isLoading) return;

    const newUserMessage: ChatMessage = {
      id: `user-${Date.now()}`,
      role: "user",
      text: textToSend,
    };
    const botMessageId = `bot-${Date.now()}`;
    const newBotMessage: ChatMessage = {
      id: botMessageId,
      role: "model",
      text: "",
    };

    setMessages((prev) => [...prev, newUserMessage, newBotMessage]);
    setUserInput("");
    setIsLoading(true);
    setError(null);
    setSpeechError(null);

    try {
      if (!process.env.API_KEY) throw new Error("API_KEY_MISSING");
      const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

      await askAgriBotStream(ai, textToSend, language, (chunk) => {
        setMessages((prev) =>
          prev.map((msg) =>
            msg.id === botMessageId ? { ...msg, text: msg.text + chunk } : msg
          )
        );
      });
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "UNKNOWN_ERROR";
      const translatedError = t.errors[errorMessage] || t.errors.UNKNOWN_ERROR;
      setError(translatedError);
      setMessages((prev) => prev.filter((msg) => msg.id !== botMessageId));
      const errorBotMessage: ChatMessage = {
        id: `error-${Date.now()}`,
        role: "model",
        text: `${t.errors.agriBotErrorPrefix} ${translatedError}`,
        isError: true,
      };
      setMessages((prev) => [...prev, errorBotMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleToggleListening = () => {
    if (user.plan === "free") {
      setIsPaymentModalOpen(true);
      return;
    }
    if (!recognitionRef.current) return;
    setSpeechError(null);
    isListening
      ? recognitionRef.current.stop()
      : (setUserInput(""), recognitionRef.current.start());
  };

  const handlePaymentSuccess = () => {
    onUpgrade();
    setIsPaymentModalOpen(false);
  };

  const SparkleIcon = ({ className = "" }: { className?: string }) => (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="currentColor"
      className={className}
    >
      <path d="M12,2A3,3,0,0,0,9,5V9a3,3,0,0,0,6,0V5A3,3,0,0,0,12,2Zm5,9H15a3,3,0,0,0,0,6h2a3,3,0,0,0,0-6Zm-6,2V15a3,3,0,0,0-6,0v2a3,3,0,0,0,6,0Zm-2,4a3,3,0,0,0-3-3H2a3,3,0,0,0,0,6H4A3,3,0,0,0,7,17Z" />
    </svg>
  );

  const BotAvatar = () => (
    <div className="w-8 h-8 rounded-full bg-gradient-to-br from-brand-green to-brand-brown text-white flex items-center justify-center flex-shrink-0 ring-2 ring-white">
      <SparkleIcon className="w-5 h-5" />
    </div>
  );

  const UserAvatar = () => {
    const initial = user.name ? user.name.charAt(0).toUpperCase() : "U";
    return (
      <div className="w-8 h-8 rounded-full bg-base-300 text-text-main flex items-center justify-center font-semibold text-sm flex-shrink-0 ring-2 ring-white">
        {initial}
      </div>
    );
  };

  const TypingIndicator = () => (
    <div className="flex items-center gap-1.5 p-2">
      <div className="h-2 w-2 bg-brand-green-light rounded-full animate-bounce [animation-delay:-0.3s]" />
      <div className="h-2 w-2 bg-brand-green-light rounded-full animate-bounce [animation-delay:-0.15s]" />
      <div className="h-2 w-2 bg-brand-green-light rounded-full animate-bounce" />
    </div>
  );

  const suggestions = [
    t.agriBotSuggestions.suggestion1,
    t.agriBotSuggestions.suggestion2,
    t.agriBotSuggestions.suggestion3,
  ];

  return (
    <div className="flex flex-col h-screen bg-white rounded-lg shadow-inner overflow-hidden border border-base-200">
      {isPaymentModalOpen && (
        <PaymentModal
          isOpen={isPaymentModalOpen}
          onClose={() => setIsPaymentModalOpen(false)}
          onConfirm={handlePaymentSuccess}
          t={t}
        />
      )}

      {/* Header */}
      <div className="flex-shrink-0 flex items-center p-4 border-b border-gray-200 bg-gray-50/90">
        <div className="w-8 h-8 flex items-center justify-center animate-sparkle">
          <SparkleIcon className="w-7 h-7 text-brand-green" />
        </div>
        <h2 className="text-lg sm:text-xl md:text-2xl font-bold text-gray-700 ml-2">
          {t.agriBotTitle}
        </h2>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto px-4 sm:px-6 md:px-8 py-3 space-y-2 sm:space-y-3">
        {messages.map((msg) => (
          <div
            key={msg.id}
            className={`flex items-start gap-2 sm:gap-3 ${
              msg.role === "user" ? "justify-end" : "justify-start"
            }`}
          >
            {msg.role === "model" && <BotAvatar />}
            <div
              className={`relative ${
                msg.role === "user" ? "order-1" : "order-2"
              } max-w-full sm:max-w-[75%] md:max-w-[65%] lg:max-w-[50%]`}
            >
              <div
                className={`px-3 py-2 sm:px-4 sm:py-2.5 rounded-2xl chat-bubble text-sm sm:text-base md:text-lg break-words ${
                  msg.role === "user"
                    ? "bg-gradient-to-br from-brand-green-light to-brand-green text-white rounded-br-lg shadow-md"
                    : msg.isError
                    ? "bg-red-50 text-red-800 border border-red-100 rounded-bl-lg shadow-md"
                    : "bg-base-100 text-text-main rounded-bl-lg shadow-md border border-base-200"
                }`}
              >
                {msg.text ? (
                  <div
                    className="prose max-w-full break-words"
                    dangerouslySetInnerHTML={{ __html: marked.parse(msg.text) }}
                  />
                ) : (
                  <TypingIndicator />
                )}
              </div>
              {msg.role === "model" &&
                msg.id !== "welcome" &&
                !msg.isError &&
                msg.text && (
                  <div className="absolute top-1/2 -translate-y-1/2 -right-10 sm:-right-12 md:-right-14 opacity-0 group-hover:opacity-100 transition-opacity">
                    <PlayAudioButton
                      textToRead={msg.text}
                      language={language}
                      t={t}
                    />
                  </div>
                )}
            </div>
            {msg.role === "user" && <UserAvatar />}
          </div>
        ))}
        <div ref={messagesEndRef} />
      </div>

      {/* Suggestions */}
      {!isLoading && messages.length <= 1 && (
        <div className="flex flex-wrap items-center justify-center gap-2 px-2 sm:px-4 py-1 sm:py-2">
          {suggestions.map((s, i) => (
            <button
              key={i}
              onClick={() => handleSend(s)}
              className="text-xs sm:text-sm md:text-base bg-base-100 hover:bg-base-200 border border-base-300 text-text-main px-2 sm:px-3 py-1 sm:py-1.5 rounded-full"
            >
              {s}
            </button>
          ))}
        </div>
      )}

      {/* Input */}
      <div className="flex-shrink-0 px-3 sm:px-4 md:px-6 pb-3 pt-2 bg-base-100 border-t border-base-200 flex items-end gap-2">
        {/* Microphone with PRO badge */}
        {speechSupported && (
          <div className="relative flex-shrink-0">
            <button
              onClick={handleToggleListening}
              className={`flex items-center justify-center h-10 w-10 sm:h-11 sm:w-11 md:h-12 md:w-12 rounded-full transition-colors ${
                isListening
                  ? "bg-red-500/10 text-red-600"
                  : "text-text-muted hover:bg-base-200"
              }`}
              aria-label={isListening ? t.stopRecording : t.startRecording}
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-6 w-6 sm:h-7 sm:w-7 md:h-8 md:w-8"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth={1.5}
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z"
                />
              </svg>
            </button>
            {user.plan === "free" && (
              <span className="absolute -top-2 -right-2 text-[10px] sm:text-xs md:text-sm bg-yellow-400 text-brand-green-dark font-semibold px-1.5 py-0.5 rounded-full shadow-md">
                PRO
              </span>
            )}
          </div>
        )}
        {/* Textarea */}
        <textarea
          ref={textareaRef}
          value={userInput}
          onChange={(e) => setUserInput(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter" && !e.shiftKey) {
              e.preventDefault();
              handleSend();
            }
          }}
          placeholder={t.agriBotPlaceholder}
          rows={1}
          className="flex-1 bg-transparent p-2 sm:p-2.5 md:p-3 resize-none outline-none text-text-main placeholder-text-muted text-sm sm:text-base md:text-lg max-h-[150px]"
        />
        {/* Send button */}
        <button
          onClick={() => handleSend()}
          disabled={isLoading || !userInput.trim()}
          className="flex-shrink-0 flex items-center justify-center h-10 w-10 sm:h-11 sm:w-11 md:h-12 md:w-12 rounded-full bg-brand-green text-white disabled:bg-base-300 hover:scale-110 transition-transform"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-5 w-5 sm:h-6 sm:w-6 md:h-7 md:w-7"
            viewBox="0 0 20 20"
            fill="currentColor"
          >
            <path d="M10.894 2.553a1 1 0 00-1.788 0l-7 14a1 1 0 001.169 1.409l5-1.428A1 1 0 009 15.571V11a1 1 0 112 0v4.571a1 1 0 00.725.962l5 1.428a1 1 0 001.17-1.408l-7-14z" />
          </svg>
        </button>
      </div>
      {speechError && (
        <p className="text-xs sm:text-sm md:text-base text-red-500 text-center mt-1 sm:mt-2">
          {speechError}
        </p>
      )}
    </div>
  );
};

export default AgriBot;
