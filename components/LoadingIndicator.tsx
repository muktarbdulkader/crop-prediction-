
import React from 'react';

interface LoadingIndicatorProps {
    text: string;
}

const LoadingIndicator: React.FC<LoadingIndicatorProps> = ({ text }) => (
    <div className="flex flex-col items-center justify-center text-brand-green-dark p-8">
        <div className="relative h-16 w-16">
            <div className="absolute inset-0 bg-gradient-to-br from-brand-green to-brand-brown rounded-full opacity-75 animate-pulse-gemini"></div>
            <div className="relative flex h-full w-full items-center justify-center rounded-full bg-brand-bg">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-brand-green-dark" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.293 2.293M17.707 5.293L15.414 7.586m-5.121 9.707l-2.293 2.293M7.586 15.414l2.293-2.293M9 10l.343-3.434A1 1 0 0110.33 5.66l3.434-.343a1 1 0 011.23.805L15.9 9.556a1 1 0 01-.806 1.23l-3.433.343a1 1 0 01-1.23-.805L10 9z" />
                </svg>
            </div>
        </div>
        <p className="mt-4 text-lg font-semibold">{text}</p>
    </div>
);

export default LoadingIndicator;
