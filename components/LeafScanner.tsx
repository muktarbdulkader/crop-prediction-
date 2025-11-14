import React, { useState, useRef, useEffect } from 'react';
import { GoogleGenAI } from '@google/genai';
import { marked } from 'marked';
import { analyzeLeaf, generateSpeech, getTreatmentPlan, extractDiseaseName, generateDiseaseImage } from '../services/geminiService';
import type { Language, User, LeafAnalysisResult, ScanHistoryItem } from '../types';
import LoadingIndicator from './LoadingIndicator';
import ExampleCarousel from './ExampleCarousel';
import ScanHistory from './ScanHistory';

interface LeafScannerProps {
    language: Language;
    t: any; // Translation object
    user: User;
    onNavigateToProfile: () => void;
}

const fileToBase64 = (file: File): Promise<string> =>
  new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve(reader.result as string); // Returns the full data URL
    reader.onerror = (error) => reject(error);
  });

const urlToFile = async (url: string, filename: string, mimeType: string): Promise<File> => {
    const res = await fetch(url);
    const blob = await res.blob();
    return new File([blob], filename, { type: mimeType });
};

const LeafScanner: React.FC<LeafScannerProps> = ({ language, t, user, onNavigateToProfile }) => {
    const [image, setImage] = useState<{ file: File; dataUrl: string } | null>(null);
    const [plantName, setPlantName] = useState('');
    const [prompt, setPrompt] = useState('');
    const [analysis, setAnalysis] = useState<{
        html: string;
        raw: string;
        confidence: number;
    } | null>(null);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [isDragging, setIsDragging] = useState(false);
    const [feedbackGiven, setFeedbackGiven] = useState<'up' | 'down' | null>(null);
    const [isCameraOpen, setIsCameraOpen] = useState(false);

    const [isAudioLoading, setIsAudioLoading] = useState(false);
    const [isPlayingAudio, setIsPlayingAudio] = useState(false);
    
    // State for Pro features
    const [treatmentPlan, setTreatmentPlan] = useState<string | null>(null);
    const [isTreatmentLoading, setIsTreatmentLoading] = useState(false);
    const [treatmentError, setTreatmentError] = useState<string | null>(null);
    const [showUpgradeModal, setShowUpgradeModal] = useState(false);
    const [generatedImageUrl, setGeneratedImageUrl] = useState<string | null>(null);
    const [isGeneratingImage, setIsGeneratingImage] = useState(false);
    const [imageGenError, setImageGenError] = useState<string | null>(null);
    const [showProTooltip, setShowProTooltip] = useState(false);

    // Scan History State
    const [history, setHistory] = useState<ScanHistoryItem[]>(() => {
        try {
            const savedHistory = localStorage.getItem('scanHistory');
            return savedHistory ? JSON.parse(savedHistory) : [];
        } catch (e) {
            console.error("Failed to parse scan history from localStorage", e);
            return [];
        }
    });
    const [showHistory, setShowHistory] = useState(false);

    const videoRef = useRef<HTMLVideoElement>(null);
    const streamRef = useRef<MediaStream | null>(null);

    useEffect(() => {
        setPrompt(t.scanner?.defaultPrompt || 'Analyze this leaf image for any signs of disease.');
    }, [t.scanner?.defaultPrompt, language]);
    
    useEffect(() => {
        const generateImage = async () => {
            if (analysis?.raw && user.plan === 'pro' && plantName) {
                setIsGeneratingImage(true);
                setGeneratedImageUrl(null);
                setImageGenError(null);
                try {
                    if (!process.env.API_KEY) throw new Error("API_KEY_MISSING");
                    const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
                    
                    const diseaseName = await extractDiseaseName(ai, analysis.raw, language);
                    
                    if (diseaseName) {
                        const imageUrl = await generateDiseaseImage(ai, diseaseName, plantName);
                        setGeneratedImageUrl(imageUrl);
                    } else {
                        console.warn("Could not extract a specific disease name to generate an image.");
                    }
                } catch (err) {
                    const errorMessage = err instanceof Error ? err.message : 'UNKNOWN_ERROR';
                    setImageGenError(t.errors[errorMessage] || t.errors.UNKNOWN_ERROR);
                } finally {
                    setIsGeneratingImage(false);
                }
            }
        };

        generateImage();
    }, [analysis, user.plan, plantName, language, t.errors]);

    useEffect(() => {
        if (isCameraOpen && streamRef.current && videoRef.current) {
            videoRef.current.srcObject = streamRef.current;
        }
    }, [isCameraOpen]);

    const handleFileChange = async (files: FileList | null) => {
        if (files && files[0]) {
            const file = files[0];
            if (file.type.startsWith('image/')) {
                const dataUrl = await fileToBase64(file);
                setImage({ file, dataUrl });
                handleResetScanner(false); // Reset without clearing image
            } else {
                setError(t.errors.INVALID_FILE_TYPE);
            }
        }
    };

    const handleDragEvents = (e: React.DragEvent<HTMLLabelElement>) => {
        e.preventDefault();
        e.stopPropagation();
        if (e.type === 'dragenter' || e.type === 'dragover') {
            setIsDragging(true);
        } else if (e.type === 'dragleave') {
            setIsDragging(false);
        }
    };

    const handleDrop = (e: React.DragEvent<HTMLLabelElement>) => {
        e.preventDefault();
        e.stopPropagation();
        setIsDragging(false);
        if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
            handleFileChange(e.dataTransfer.files);
            e.dataTransfer.clearData();
        }
    };
    
    const openCamera = async (e: React.MouseEvent) => {
        e.preventDefault();
        e.stopPropagation();
        if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
            try {
                const stream = await navigator.mediaDevices.getUserMedia({ video: { facingMode: 'environment' } });
                streamRef.current = stream;
                setIsCameraOpen(true);
            } catch (err) {
                console.error("Error accessing camera:", err);
                setError(t.errors.CAMERA_ERROR);
            }
        } else {
            setError(t.errors.CAMERA_UNSUPPORTED);
        }
    };

    const closeCamera = () => {
        if (streamRef.current) {
            streamRef.current.getTracks().forEach(track => track.stop());
        }
        setIsCameraOpen(false);
        streamRef.current = null;
    };

    const capturePhoto = () => {
        const video = videoRef.current;
        if (video) {
            const canvas = document.createElement('canvas');
            canvas.width = video.videoWidth;
            canvas.height = video.videoHeight;
            const context = canvas.getContext('2d');
            if (context) {
                context.drawImage(video, 0, 0, canvas.width, canvas.height);
                canvas.toBlob((blob) => {
                    if (blob) {
                        const file = new File([blob], "camera-capture.jpg", { type: "image/jpeg" });
                        const dataTransfer = new DataTransfer();
                        dataTransfer.items.add(file);
                        handleFileChange(dataTransfer.files);
                    }
                    closeCamera();
                }, 'image/jpeg');
            }
        }
    };

    const handleSubmit = async () => {
        if (!image) {
            setError(t.errors.NO_IMAGE);
            return;
        }
        setIsLoading(true);
        setError(null);
        setAnalysis(null);
        setFeedbackGiven(null);
        setTreatmentPlan(null);
        setTreatmentError(null);
        setGeneratedImageUrl(null);
        setImageGenError(null);

        try {
            if (!process.env.API_KEY) throw new Error("API_KEY_MISSING");
            
            const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
            const imageBase64 = image.dataUrl.split(',')[1];
            const userPrompt = prompt || t.scanner.defaultPrompt;
            const fullPrompt = `${t.scanner.analysisPromptPrefix} "${plantName || 'unspecified plant'}". ${userPrompt}`;
            const result = await analyzeLeaf(ai, imageBase64, image.file.type, fullPrompt, language);
            const htmlResult = await marked.parse(result.analysis);
            setAnalysis({ html: htmlResult, raw: result.analysis, confidence: result.confidence });

            // Save to history
            const newHistoryItem: ScanHistoryItem = {
                id: Date.now().toString(),
                imageDataUrl: image.dataUrl,
                plantName,
                analysis: { raw: result.analysis, confidence: result.confidence },
                timestamp: new Date().toISOString(),
            };
            const updatedHistory = [newHistoryItem, ...history].slice(0, 30);
            setHistory(updatedHistory);
            localStorage.setItem('scanHistory', JSON.stringify(updatedHistory));

        } catch (err) {
            const errorMessage = err instanceof Error ? err.message : 'UNKNOWN_ERROR';
            setError(t.errors[errorMessage] || t.errors.UNKNOWN_ERROR);
        } finally {
            setIsLoading(false);
        }
    };
    
    const handleUseExample = async (example: { name: string; image: string; prompt: string; analysis: LeafAnalysisResult; }) => {
        setIsLoading(true);
        handleResetScanner(true);
        try {
            const filename = example.name.replace(/\s+/g, '-') + '.jpg';
            const file = await urlToFile(example.image, filename, 'image/jpeg');
            const dataUrl = await fileToBase64(file);
            const extractedPlantName = example.name.split(' ')[1] || 'Corn';

            setImage({ file, dataUrl });
            setPlantName(extractedPlantName);
            setPrompt(example.prompt);
            const htmlResult = await marked.parse(example.analysis.analysis);
            setAnalysis({
                html: htmlResult,
                raw: example.analysis.analysis,
                confidence: example.analysis.confidence,
            });
        } catch (e) {
            console.error("Failed to load example image", e);
            setError(t.errors.UNKNOWN_ERROR);
        } finally {
            setIsLoading(false);
        }
    };

    const handleGetTreatment = async () => {
        if (!analysis?.raw) return;
        if (user.plan === 'free') {
            setShowUpgradeModal(true);
            return;
        }
        setIsTreatmentLoading(true);
        setTreatmentError(null);
        setTreatmentPlan(null);
        try {
            if (!process.env.API_KEY) throw new Error("API_KEY_MISSING");
            const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
            const result = await getTreatmentPlan(ai, analysis.raw, language);
            const htmlResult = await marked.parse(result);
            setTreatmentPlan(htmlResult);
        } catch (err) {
            const errorMessage = err instanceof Error ? err.message : 'UNKNOWN_ERROR';
            setTreatmentError(t.errors[errorMessage] || t.errors.UNKNOWN_ERROR);
        } finally {
            setIsTreatmentLoading(false);
        }
    }

    const handlePlayAudio = async () => {
        if (!analysis?.raw || isPlayingAudio || isAudioLoading) return;
        setIsAudioLoading(true);
        try {
            if (!process.env.API_KEY) throw new Error("API_KEY_MISSING");
            const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
            const audioBuffer = await generateSpeech(ai, analysis.raw);
            
            const audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
            const source = audioContext.createBufferSource();
            source.buffer = audioBuffer;
            source.connect(audioContext.destination);
            source.start();
            setIsPlayingAudio(true);
            source.onended = () => setIsPlayingAudio(false);
        } catch (err) {
            const errorMessage = err instanceof Error ? err.message : 'UNKNOWN_ERROR';
            setError(t.errors[errorMessage] || t.errors.UNKNOWN_ERROR);
        } finally {
            setIsAudioLoading(false);
        }
    };

    const handleResetScanner = (clearImage: boolean = true) => {
        if (clearImage) setImage(null);
        setAnalysis(null);
        setError(null);
        setFeedbackGiven(null);
        setTreatmentPlan(null);
        setTreatmentError(null);
        setGeneratedImageUrl(null);
        setImageGenError(null);
        setPlantName('');
        setShowHistory(false);
    };

    const handleClearHistory = () => {
        setHistory([]);
        localStorage.removeItem('scanHistory');
    };

    const handleReloadScan = async (item: ScanHistoryItem) => {
        handleResetScanner(true);
        const htmlAnalysis = await marked.parse(item.analysis.raw);
        const htmlTreatment = item.treatmentPlan ? await marked.parse(item.treatmentPlan) : null;
        
        setImage({ file: new File([], "history.jpg"), dataUrl: item.imageDataUrl });
        setPlantName(item.plantName);
        setAnalysis({ html: htmlAnalysis, raw: item.analysis.raw, confidence: item.analysis.confidence });
        if(htmlTreatment) setTreatmentPlan(htmlTreatment);
        if(item.generatedImageUrl) setGeneratedImageUrl(item.generatedImageUrl);
        setShowHistory(false);
    };
    
    // Fix: Implement UpgradeModal component
    const UpgradeModal = () => (
        <div className="fixed inset-0 z-50 bg-black/60 flex items-center justify-center p-4 animate-fade-in" onClick={() => setShowUpgradeModal(false)}>
            <div className="bg-white rounded-lg shadow-xl p-6 max-w-md w-full text-center relative" onClick={(e) => e.stopPropagation()}>
                <h3 className="text-xl font-bold text-brand-green-dark">{t.upgradeModal.title}</h3>
                <p className="my-4 text-gray-600">{t.upgradeModal.body}</p>
                <div className="flex flex-col sm:flex-row gap-2 mt-6">
                    <button onClick={onNavigateToProfile} className="w-full bg-brand-green hover:bg-brand-green-dark text-white font-bold py-3 px-4 rounded-lg transition-colors">
                        {t.upgradeModal.actionButton}
                    </button>
                    <button onClick={() => setShowUpgradeModal(false)} className="w-full bg-gray-200 hover:bg-gray-300 text-gray-700 font-bold py-3 px-4 rounded-lg transition-colors">
                        {t.upgradeModal.closeButton}
                    </button>
                </div>
            </div>
        </div>
    );
    // Fix: Implement CameraModal component
    const CameraModal = () => (
        <div className="fixed inset-0 z-50 bg-black/90 flex flex-col items-center justify-center p-4 animate-fade-in">
            <button onClick={closeCamera} className="absolute top-4 right-4 text-white/70 hover:text-white text-4xl font-bold z-10" aria-label={t.closeCamera}>
                &times;
            </button>
            <div className="relative w-full max-w-2xl aspect-[4/3] bg-black rounded-lg overflow-hidden shadow-2xl">
                 <video ref={videoRef} autoPlay playsInline className="w-full h-full object-cover"></video>
            </div>
            <div className="absolute bottom-10 flex justify-center w-full">
                <button onClick={capturePhoto} className="w-20 h-20 rounded-full border-4 border-white/80 bg-transparent hover:border-white transition-all transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-black/50 focus:ring-white" aria-label={t.capture}>
                </button>
            </div>
        </div>
    );
    // Fix: Implement FeedbackSection component
    const FeedbackSection = () => (
        <div className="mt-4 text-center">
            <p className="text-sm font-semibold text-text-muted mb-2">{t.feedbackPrompt}</p>
            <div className="flex justify-center gap-3">
                <button onClick={() => setFeedbackGiven('up')} disabled={feedbackGiven !== null} className={`p-2 rounded-full transition-colors ${feedbackGiven === 'up' ? 'bg-green-100 text-green-700' : 'hover:bg-green-50'}`}>
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor"><path d="M2 10.5a1.5 1.5 0 113 0v6a1.5 1.5 0 01-3 0v-6zM6 10.333v5.43a2 2 0 001.106 1.79l.05.025A4 4 0 008.943 18h5.416a2 2 0 001.962-1.608l1.2-6A2 2 0 0015.562 8H12V4a2 2 0 00-2-2 1 1 0 00-1 1v.667a4 4 0 01-.8 2.4L6.8 7.933a4 4 0 00-.8 2.4z" /></svg>
                </button>
                <button onClick={() => setFeedbackGiven('down')} disabled={feedbackGiven !== null} className={`p-2 rounded-full transition-colors ${feedbackGiven === 'down' ? 'bg-red-100 text-red-700' : 'hover:bg-red-50'}`}>
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor"><path d="M18 9.5a1.5 1.5 0 11-3 0v-6a1.5 1.5 0 013 0v6zM14 9.667v-5.43a2 2 0 00-1.106-1.79l-.05-.025A4 4 0 0011.057 2H5.642a2 2 0 00-1.962 1.608l-1.2 6A2 2 0 004.438 12H8v4a2 2 0 002 2 1 1 0 001-1v-.667a4 4 0 01.8-2.4l2.4-3.6a4 4 0 00.8-2.4z" /></svg>
                </button>
            </div>
            {feedbackGiven && <p className="text-xs text-green-600 mt-2 animate-fade-in">{t.feedbackThanks}</p>}
        </div>
    );

    return (
        <div>
            {isCameraOpen && <CameraModal />}
            {showUpgradeModal && <UpgradeModal />}
            <div className="flex justify-between items-center mb-4 border-b-2 border-brand-green/50 pb-3">
                <h2 className="text-2xl font-bold text-brand-green-dark">{t.scannerTitle}</h2>
                <button
                    onClick={() => setShowHistory(!showHistory)}
                    className="text-sm font-semibold text-brand-green hover:underline focus:outline-none"
                >
                    {showHistory ? t.scanHistory.hide : t.scanHistory.show}
                </button>
            </div>
            
            {showHistory ? (
                <ScanHistory history={history} onSelectScan={handleReloadScan} onClear={handleClearHistory} t={t} />
            ) : (
                <>
                    {!image && !isLoading && <ExampleCarousel t={t} onUseExample={handleUseExample} />}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                        {/* Left Column: Image Upload & Form */}
                        <div className="space-y-4">
                             <div className="p-4 border-2 border-dashed rounded-lg border-base-300 bg-base-100">
                                <label
                                    htmlFor="leaf-dropzone-file"
                                    onDragEnter={handleDragEvents}
                                    onDragOver={handleDragEvents}
                                    onDragLeave={handleDragEvents}
                                    onDrop={handleDrop}
                                    className={`relative flex flex-col items-center justify-center w-full min-h-[14rem] cursor-pointer transition-colors ${isDragging ? 'bg-green-50' : 'hover:bg-base-200'}`}
                                >
                                    {image ? (
                                        <img src={image.dataUrl} alt="Leaf preview" className="h-full w-full max-h-56 object-contain rounded-lg p-1" />
                                    ) : (
                                        <div className="flex flex-col items-center justify-center p-5 text-center">
                                            <svg className="w-12 h-12 mb-4 text-base-400" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>
                                            <p className="mb-2 text-sm text-text-muted"><span className="font-semibold">{t.uploadPrompt}</span> {t.uploadPromptDrag}</p>
                                            <p className="text-xs text-text-muted">{t.uploadFileType}</p>
                                        </div>
                                    )}
                                    <input id="leaf-dropzone-file" type="file" accept="image/*" className="hidden" onChange={(e) => handleFileChange(e.target.files)} />
                                </label>
                            </div>
                            
                            {!image && (
                                <div className="text-center">
                                    <div className="relative flex items-center justify-center my-2">
                                        <div className="flex-grow border-t border-base-300"></div>
                                        <span className="flex-shrink mx-4 text-xs text-text-muted uppercase">OR</span>
                                        <div className="flex-grow border-t border-base-300"></div>
                                    </div>
                                    <button
                                        type="button"
                                        onClick={openCamera}
                                        className="px-4 py-2 bg-brand-brown text-white rounded-lg hover:bg-brand-brown/80 transition-colors text-sm font-semibold flex items-center gap-2"
                                    >
                                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M4 5a2 2 0 00-2 2v6a2 2 0 002 2h12a2 2 0 002-2V7a2 2 0 00-2-2H4zm10 4a3 3 0 11-6 0 3 3 0 016 0z" clipRule="evenodd" /></svg>
                                        {t.useCamera}
                                    </button>
                                </div>
                            )}

                            {image && (
                                <div className="animate-fade-in space-y-4">
                                    <div>
                                        <label htmlFor="plantName" className="block text-sm font-medium text-text-muted mb-2">{t.plantNameLabel}</label>
                                        <input
                                            type="text"
                                            id="plantName"
                                            value={plantName}
                                            onChange={(e) => setPlantName(e.target.value)}
                                            placeholder={t.plantNamePlaceholder}
                                            className="form-input"
                                        />
                                    </div>
                                    <div>
                                        <label htmlFor="prompt" className="block text-sm font-medium text-text-muted mb-2">{t.analysisPrompt}</label>
                                        <textarea
                                            id="prompt"
                                            rows={3}
                                            value={prompt}
                                            onChange={(e) => setPrompt(e.target.value)}
                                            className="form-input"
                                        />
                                    </div>
                                </div>
                            )}
                            
                            {analysis && !isLoading ? (
                                <button
                                    onClick={() => handleResetScanner(true)}
                                    className="w-full bg-brand-brown hover:bg-brand-brown/80 text-white font-bold py-3 px-4 rounded-lg transition-all duration-300 ease-in-out transform hover:scale-105 shadow-md"
                                >
                                    {t.scanAnotherLeaf}
                                </button>
                            ) : (
                                <button
                                    onClick={handleSubmit}
                                    disabled={isLoading || !image}
                                    className="w-full bg-brand-green hover:bg-brand-green-dark text-white font-bold py-3 px-4 rounded-lg transition-all duration-300 ease-in-out transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed shadow-md"
                                >
                                    {isLoading ? t.aiInspecting : t.analysisButton}
                                </button>
                            )}
                        </div>
                        
                        {/* Right Column: Results */}
                        <div className="space-y-4">
                           <div className="bg-card border border-base-200 p-4 rounded-lg min-h-[200px] flex flex-col shadow-lg">
                                <div className="flex justify-between items-center mb-2">
                                    <h3 className="text-xl font-bold text-brand-green-dark">{t.analysisResult}</h3>
                                    {analysis && (
                                        <div className="text-right">
                                            <p className="text-sm font-semibold text-text-muted">{t.confidenceScore}</p>
                                            <p className="font-bold text-lg text-brand-green">{analysis.confidence.toFixed(1)}%</p>
                                        </div>
                                    )}
                                </div>
                                <div className="flex-grow overflow-y-auto pr-2">
                                    {isLoading && <LoadingIndicator text={t.aiInspecting} />}
                                    {error && <div className="text-red-600 bg-red-100 p-3 rounded-md">{error}</div>}
                                    {analysis && (
                                        <div className="relative">
                                            <div className="prose max-w-none" dangerouslySetInnerHTML={{ __html: analysis.html }} />
                                            <button onClick={handlePlayAudio} disabled={isAudioLoading || isPlayingAudio} className="absolute top-0 right-0 p-1.5 rounded-full bg-card shadow-md text-text-muted hover:bg-base-200 disabled:opacity-50">
                                                {isAudioLoading ? (
                                                    <div className="w-5 h-5 animate-spin rounded-full border-2 border-brand-green border-t-transparent"></div>
                                                ) : (
                                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                                                        <path d="M10 18a8 8 0 100-16 8 8 0 000 16zM9.555 7.168A1 1 0 008 8v4a1 1 0 001.555.832l3-2a1 1 0 000-1.664l-3-2z" />
                                                    </svg>
                                                )}
                                            </button>
                                        </div>
                                    )}
                                    {!analysis && !isLoading && !error && (
                                        <div className="text-center text-text-muted pt-10">
                                            <p>{t.uploadPrompt} an image to begin analysis.</p>
                                        </div>
                                    )}
                                </div>
                                {analysis && !isLoading && <FeedbackSection />}
                           </div>
                           
                           {user.plan === 'pro' && analysis && !isLoading && (
                            <div className="bg-card border border-base-200 p-4 rounded-lg animate-fade-in shadow-lg relative">
                                <h3 className="text-xl font-bold text-brand-green-dark mb-3 flex items-center gap-2">
                                    {t.visualReferenceTitle}
                                    <span 
                                        className="text-sm font-semibold bg-yellow-400 text-brand-green-dark px-2 py-0.5 rounded-full cursor-pointer"
                                        onMouseEnter={() => setShowProTooltip(true)}
                                        onMouseLeave={() => setShowProTooltip(false)}
                                    >
                                        PRO
                                    </span>
                                </h3>
                                {showProTooltip && (
                                    <div className="absolute z-10 -top-8 left-1/2 -translate-x-1/2 w-48 p-2 text-xs text-center text-white bg-gray-800 rounded-lg shadow-lg animate-fade-in">
                                        {t.visualReferenceProTooltip}
                                        <div className="absolute top-full left-1/2 -translate-x-1/2 w-0 h-0 border-x-4 border-x-transparent border-t-4 border-t-gray-800"></div>
                                    </div>
                                )}
                                {isGeneratingImage && <LoadingIndicator text={t.generatingVisual} />}
                                {imageGenError && <div className="text-red-600 bg-red-100 p-3 rounded-md">{imageGenError}</div>}
                                {generatedImageUrl && !isGeneratingImage && (
                                    <div className="animate-fade-in">
                                        <img src={generatedImageUrl} alt={t.visualReferenceTitle} className="rounded-lg w-full h-auto object-cover border border-base-200" />
                                        <p className="text-xs text-text-muted text-center mt-2">{t.visualReferenceDisclaimer}</p>
                                    </div>
                                )}
                            </div>
                           )}
                           
                           {analysis && !isLoading && (
                                <div className="bg-card border border-base-200 p-4 rounded-lg animate-fade-in shadow-lg">
                                    <h3 className="text-xl font-bold text-brand-green-dark mb-3">{t.treatmentPlanTitle}</h3>
                                    {isTreatmentLoading && <LoadingIndicator text={t.generatingTreatment} />}
                                    {treatmentError && <div className="text-red-600 bg-red-100 p-3 rounded-md">{treatmentError}</div>}
                                    {treatmentPlan && <div className="prose max-w-none" dangerouslySetInnerHTML={{ __html: treatmentPlan }} />}
                                    {!isTreatmentLoading && !treatmentPlan && !treatmentError && (
                                        <div className="text-center">
                                            <button
                                                onClick={handleGetTreatment}
                                                className="w-full sm:w-auto bg-brand-green hover:bg-brand-green-dark text-white font-bold py-2 px-6 rounded-lg transition-colors flex items-center justify-center gap-2"
                                            >
                                                {user.plan === 'free' && <span className="text-yellow-300">⭐</span>}
                                                {t.getTreatmentButton}
                                            </button>
                                        </div>
                                    )}
                                </div>
                           )}
                        </div>
                    </div>
                </>
            )}
        </div>
    );
};

export default LeafScanner;