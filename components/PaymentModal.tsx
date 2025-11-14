import React, { useState } from 'react';

interface PaymentModalProps {
    isOpen: boolean;
    onClose: () => void;
    onConfirm: () => void;
    t: any;
}

const PaymentModal: React.FC<PaymentModalProps> = ({ isOpen, onClose, onConfirm, t }) => {
    const [isProcessing, setIsProcessing] = useState(false);
    const [transactionId, setTransactionId] = useState('');
    const [step, setStep] = useState<'enterDetails' | 'confirming'>('enterDetails');


    if (!isOpen) return null;

    const handleFinalConfirm = () => {
        setIsProcessing(true);
        // Simulate a delay for payment verification
        setTimeout(() => {
            onConfirm();
            setIsProcessing(false);
            setTransactionId('');
            setStep('enterDetails');
        }, 2000);
    };

    const handleProceedToConfirm = () => {
        if (!transactionId.trim()) return;
        setStep('confirming');
    };

    const handleGoBack = () => {
        setStep('enterDetails');
    };

    const handleClose = () => {
        setTransactionId('');
        setStep('enterDetails');
        onClose();
    }

    return (
        <div className="fixed inset-0 z-50 bg-black/60 flex items-center justify-center p-4 animate-fade-in">
            <div 
                className="bg-white rounded-lg shadow-xl p-6 max-w-md w-full text-center relative"
                onClick={(e) => e.stopPropagation()} // Prevents closing when clicking inside
            >
                <button 
                    onClick={handleClose} 
                    className="absolute top-2 right-3 text-gray-400 hover:text-gray-600 text-2xl font-bold"
                    aria-label="Close"
                >
                    &times;
                </button>
                
                {step === 'enterDetails' && (
                    <>
                        <h3 className="text-xl font-bold text-brand-green-dark">{t.payment.title}</h3>
                        <p className="text-3xl font-bold text-brand-green my-4">{t.payment.price}</p>
                        
                        <div className="my-4 text-gray-600 space-y-2 border-t pt-4">
                            <p>{t.payment.instructions}</p>
                            <p className="font-semibold">{t.payment.scanQR}</p>
                            {/* Fake QR Code */}
                            <div className="flex justify-center p-2 bg-gray-100 border rounded-md">
                                <svg className="h-32 w-32" viewBox="0 0 256 256" xmlns="http://www.w3.org/2000/svg" preserveAspectRatio="xMidYMid" fill="currentColor">
                                    <path d="M0 0h90v90H0zm30 30v30h30V30zm60 0h90v90H90zM0 166h90v90H0zm30 30v30h30v-30zm60-106h30v30H90zm30 30h30v30h-30zm-30 30h30v30H90zm30 0h30v30h-30zm30-120h30v30h-30zm0 30h30v30h-30zm-30 30h30v30h-30zm0 30h30v30h-30zm-30 30h30v30H90zm60-90h30v30h-30zm-30 30h30v30h-30zm60 0h30v30h-30zm-30 30h30v30h-30zm30 0h30v30h-30zm-60 30h30v30h-30zm30 0h30v30h-30zm-60 30h30v30H90zm30 30h30v30h-30zm30 0h30v30h-30z"/>
                                    <path d="M226 90h30v30h-30zm-30 30h30v30h-30zm30-60h30v30h-30zm-60 0h30v30h-30zm30 30h30v30h-30zm-30 30h30v30h-30zm-30 0h30v30h-30zm0 30h30v30h-30zm30 30h30v30h-30zm30-150h30v30h-30zm30 90h30v30h-30zm-30 30h30v30h-30zm-30 30h30v30h-30z"/>
                                </svg>
                            </div>
                            <p className="font-bold bg-gray-100 p-2 rounded-md">{t.payment.paybillNumber}</p>
                        </div>

                        <div className="mt-4 text-left">
                            <label htmlFor="transactionId" className="block text-sm font-medium text-text-muted mb-2">
                                {t.payment.transactionIdLabel}
                            </label>
                            <input
                                id="transactionId"
                                name="transactionId"
                                type="text"
                                value={transactionId}
                                onChange={(e) => setTransactionId(e.target.value)}
                                placeholder={t.payment.transactionIdPlaceholder}
                                className="form-input"
                                required
                            />
                        </div>

                        <div className="flex flex-col sm:flex-row gap-2 mt-6">
                            <button
                                onClick={handleProceedToConfirm}
                                disabled={isProcessing || !transactionId.trim()}
                                className="w-full bg-brand-green hover:bg-brand-green-dark text-white font-bold py-3 px-4 rounded-lg transition-colors disabled:opacity-50"
                            >
                                {t.payment.confirmPaymentButton}
                            </button>
                            <button
                                onClick={handleClose}
                                disabled={isProcessing}
                                className="w-full bg-gray-200 hover:bg-gray-300 text-gray-700 font-bold py-3 px-4 rounded-lg transition-colors disabled:opacity-50"
                            >
                                {t.payment.cancelButton}
                            </button>
                        </div>
                    </>
                )}

                {step === 'confirming' && (
                     <div className="animate-fade-in">
                        <h3 className="text-xl font-bold text-brand-green-dark">{t.payment.confirmDetailsTitle}</h3>
                        <div className="my-4 text-gray-600 space-y-2 border-y py-4">
                            <p>{t.payment.confirmTransactionId}</p>
                            <p className="font-bold text-lg bg-gray-100 p-2 rounded-md text-brand-green-dark break-all">{transactionId}</p>
                            <p className="text-sm mt-2">{t.payment.confirmFinal}</p>
                        </div>

                        <div className="flex flex-col sm:flex-row gap-2 mt-6">
                            <button
                                onClick={handleFinalConfirm}
                                disabled={isProcessing}
                                className="w-full bg-brand-green hover:bg-brand-green-dark text-white font-bold py-3 px-4 rounded-lg transition-colors disabled:opacity-50"
                            >
                                {isProcessing ? t.payment.processing : t.payment.finalizeButton}
                            </button>
                            <button
                                onClick={handleGoBack}
                                disabled={isProcessing}
                                className="w-full bg-gray-200 hover:bg-gray-300 text-gray-700 font-bold py-3 px-4 rounded-lg transition-colors disabled:opacity-50"
                            >
                                {t.payment.goBackButton}
                            </button>
                        </div>
                    </div>
                )}

            </div>
        </div>
    );
};

export default PaymentModal;