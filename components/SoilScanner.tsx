import React, { useState, useRef, useEffect } from 'react';
import { GoogleGenAI } from '@google/genai';
import { marked } from 'marked';
import { analyzeSoil } from '../services/geminiService';
import type { Language } from '../types';
import LoadingIndicator from './LoadingIndicator';

interface SoilScannerProps {
    language: Language;
    t: any; // Translation object
}

const fileToBase64 = (file: File): Promise<string> =>
  new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve((reader.result as string).split(',')[1]);
    reader.onerror = (error) => reject(error);
  });

const SoilScanner: React.FC<SoilScannerProps> = ({ language, t }) => {
    const [image, setImage] = useState<{ file: File; previewUrl: string } | null>(null);
    const [prompt, setPrompt] = useState('');
    const [analysis, setAnalysis] = useState<string | null>(null);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [isDragging, setIsDragging] = useState(false);
    const [isCameraOpen, setIsCameraOpen] = useState(false);

    const videoRef = useRef<HTMLVideoElement>(null);
    const streamRef = useRef<MediaStream | null>(null);

    useEffect(() => {
        setPrompt(t.soilScannerDefaultPrompt || 'Provide a full analysis of this soil.');
    }, [t.soilScannerDefaultPrompt, language]);

    // Effect to attach camera stream to video element reliably
    useEffect(() => {
        if (isCameraOpen && streamRef.current && videoRef.current) {
            videoRef.current.srcObject = streamRef.current;
        }
    }, [isCameraOpen]);

    const handleFileChange = (files: FileList | null) => {
        if (files && files[0]) {
            const file = files[0];
            if (file.type.startsWith('image/')) {
                const previewUrl = URL.createObjectURL(file);
                setImage({ file, previewUrl });
                setAnalysis(null);
                setError(null);
                setPrompt(t.soilScannerDefaultPrompt || 'Provide a full analysis of this soil.');
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

        try {
            if (!process.env.API_KEY) {
                throw new Error("API_KEY_MISSING");
            }
            const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
            const imageBase64 = await fileToBase64(image.file);
            const userPrompt = prompt || t.soilScannerDefaultPrompt;
            const result = await analyzeSoil(ai, imageBase64, image.file.type, userPrompt, language);
            const htmlResult = await marked.parse(result);
            setAnalysis(htmlResult);
        } catch (err) {
            const errorMessage = err instanceof Error ? err.message : 'UNKNOWN_ERROR';
            setError(t.errors[errorMessage] || t.errors.UNKNOWN_ERROR);
        } finally {
            setIsLoading(false);
        }
    };
    
    const handleResetScanner = () => {
        setImage(null);
        setAnalysis(null);
        setError(null);
    };

    const CameraModal: React.FC = () => (
        <div className="fixed inset-0 z-50 bg-black/90 flex flex-col items-center justify-center p-4 animate-fade-in">
            <button 
                onClick={closeCamera} 
                className="absolute top-4 right-4 text-white/70 hover:text-white text-4xl font-bold z-10"
                aria-label={t.closeCamera}
            >
                &times;
            </button>
            <div className="relative w-full max-w-2xl aspect-[4/3] bg-black rounded-lg overflow-hidden shadow-2xl">
                 <video ref={videoRef} autoPlay playsInline className="w-full h-full object-cover"></video>
            </div>
            <div className="absolute bottom-10 flex justify-center w-full">
                <button
                    onClick={capturePhoto}
                    className="w-20 h-20 rounded-full border-4 border-white/80 bg-transparent hover:border-white transition-all transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-black/50 focus:ring-white"
                    aria-label={t.capture}
                >
                </button>
            </div>
        </div>
    );

    return (
        <div>
            {isCameraOpen && <CameraModal />}
            <h2 className="text-2xl font-bold mb-4 text-brand-green-dark border-b-2 border-brand-green/50 pb-3">{t.soilScannerTitle}</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="space-y-4">
                    <div className="p-4 border-2 border-dashed rounded-lg border-base-300 bg-base-100">
                        <label 
                            htmlFor="soil-dropzone-file"
                            onDragEnter={handleDragEvents}
                            onDragOver={handleDragEvents}
                            onDragLeave={handleDragEvents}
                            onDrop={handleDrop}
                            className={`relative flex flex-col items-center justify-center w-full min-h-[16rem] cursor-pointer transition-colors ${isDragging ? 'border-brand-green bg-green-50' : 'border-base-300 bg-base-100 hover:bg-base-200'}`}
                        >
                            {image ? (
                                <img src={image.previewUrl} alt="Soil preview" className="h-full w-full max-h-64 object-contain rounded-lg p-2" />
                            ) : (
                                <div className="flex flex-col items-center justify-center p-5 text-center">
                                    <svg className="w-12 h-12 mb-4 text-base-400" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>
                                    <p className="mb-2 text-sm text-text-muted"><span className="font-semibold">{t.uploadPrompt}</span> {t.uploadPromptDrag}</p>
                                    <p className="text-xs text-text-muted">{t.uploadFileType}</p>
                                </div>
                            )}
                            <input id="soil-dropzone-file" type="file" accept="image/*" className="hidden" onChange={(e) => handleFileChange(e.target.files)} />
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
                                <label htmlFor="prompt" className="block text-sm font-medium text-text-muted mb-2">{t.soilAnalysisPrompt}</label>
                                <textarea
                                    id="prompt"
                                    rows={2}
                                    value={prompt}
                                    onChange={(e) => setPrompt(e.target.value)}
                                    className="form-input"
                                />
                            </div>
                         </div>
                    )}

                     {analysis && !isLoading ? (
                        <button
                            onClick={handleResetScanner}
                            className="w-full bg-brand-brown hover:bg-brand-brown/80 text-white font-bold py-3 px-4 rounded-lg transition-all duration-300 ease-in-out transform hover:scale-105 shadow-md"
                        >
                            {t.scanAnotherSoil}
                        </button>
                     ) : (
                        <button
                            onClick={handleSubmit}
                            disabled={isLoading || !image}
                            className="w-full bg-brand-green hover:bg-brand-green-dark text-white font-bold py-3 px-4 rounded-lg transition-all duration-300 ease-in-out transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed shadow-md"
                        >
                            {isLoading ? t.analyzingButton : t.soilAnalysisButton}
                        </button>
                    )}
                </div>
                <div className="space-y-4">
                    <div className="bg-card border border-base-200 p-4 rounded-lg min-h-[200px] flex flex-col shadow-lg">
                        <div className="flex justify-between items-center mb-2">
                            <h3 className="text-xl font-bold text-brand-green-dark">{t.soilAnalysisResult}</h3>
                        </div>
                        <div className="flex-grow overflow-y-auto pr-2">
                            {isLoading && <LoadingIndicator text={t.aiAnalyzingSoil} />}
                            {error && <div className="text-red-600 bg-red-100 p-3 rounded-md">{error}</div>}
                            {analysis && <div className="prose max-w-none" dangerouslySetInnerHTML={{ __html: analysis }} />}
                            {!analysis && !isLoading && !error && (
                                <div className="text-center text-text-muted pt-10">
                                    <p>{t.uploadPrompt} an image of a soil sample to begin.</p>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default SoilScanner;