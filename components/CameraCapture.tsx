import React, { useRef, useEffect, useCallback } from 'react';

interface CameraCaptureProps {
  isOpen: boolean;
  onClose: () => void;
  onCapture: (file: File) => void;
  t: any; // Translation object
  helperText?: string;
}

const CameraCapture: React.FC<CameraCaptureProps> = ({ isOpen, onClose, onCapture, t, helperText }) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const streamRef = useRef<MediaStream | null>(null);

  const startStream = useCallback(async () => {
    if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({ video: { facingMode: 'environment' } });
        streamRef.current = stream;
        if (videoRef.current) {
          videoRef.current.srcObject = stream;
        }
      } catch (err) {
        console.error("Error accessing camera:", err);
        // Let the parent component know so it can display an error if needed
        onClose();
      }
    } else {
      console.error("Camera not supported");
      onClose();
    }
  }, [onClose]);

  const stopStream = useCallback(() => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach(track => track.stop());
      streamRef.current = null;
    }
  }, []);

  useEffect(() => {
    if (isOpen) {
      startStream();
    } else {
      stopStream();
    }
    // Cleanup on unmount
    return () => {
      stopStream();
    };
  }, [isOpen, startStream, stopStream]);

  const handleCapture = () => {
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
            onCapture(file);
          }
          // The parent will call onClose after handling the capture
        }, 'image/jpeg');
      }
    }
  };

  if (!isOpen) {
    return null;
  }

  return (
    <div className="fixed inset-0 z-50 bg-black/90 flex flex-col items-center justify-center p-4 animate-fade-in">
      <button onClick={onClose} className="absolute top-4 right-4 text-white/70 hover:text-white text-4xl font-bold z-10" aria-label={t.closeCamera}>
        &times;
      </button>
      <div className="relative w-full max-w-2xl aspect-video bg-black rounded-lg overflow-hidden shadow-2xl border-4 border-white/10">
        <video ref={videoRef} autoPlay playsInline className="w-full h-full object-cover"></video>
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
          <div className="w-[90%] h-[90%] border-2 border-dashed border-white/50 rounded-lg"></div>
        </div>
        <p className="absolute top-4 left-1/2 -translate-x-1/2 text-white bg-black/50 px-3 py-1 rounded-full text-sm">{helperText || t.cameraHelperText}</p>
      </div>
      <div className="absolute bottom-10 flex justify-center w-full">
        <button
          onClick={handleCapture}
          className="w-20 h-20 rounded-full border-4 border-white/50 bg-white/20 p-1 group transition-all duration-200 transform hover:scale-110 focus:outline-none"
          aria-label={t.capture}>
          <div className="w-full h-full rounded-full bg-white group-active:bg-gray-300"></div>
        </button>
      </div>
    </div>
  );
};

export default CameraCapture;
