import React, { useState, useEffect } from 'react';
import { PayPalIcon, CreditCardIcon, ApplePayIcon } from '../constants';

interface PaymentModalProps {
    isOpen: boolean;
    onClose: () => void;
    productName: string;
    price: number;
    onSuccess: () => Promise<void>;
}

type PaymentStatus = 'idle' | 'processing' | 'success' | 'error';

const PaymentButton: React.FC<{ icon: React.ReactNode; label: string; onClick: () => void }> = ({ icon, label, onClick }) => (
    <button
        onClick={onClick}
        className="w-full flex items-center justify-center gap-3 bg-green-700/80 hover:bg-green-700 text-white font-bold py-3 px-4 rounded-lg transition-colors"
    >
        {icon}
        <span>{label}</span>
    </button>
);

export const PaymentModal: React.FC<PaymentModalProps> = ({ isOpen, onClose, productName, price, onSuccess }) => {
    const [status, setStatus] = useState<PaymentStatus>('idle');
    const [errorMessage, setErrorMessage] = useState('');

    useEffect(() => {
        if (isOpen) {
            setStatus('idle');
            setErrorMessage('');
        }
    }, [isOpen]);

    if (!isOpen) return null;

    const handlePayment = async () => {
        setStatus('processing');
        setErrorMessage('');
        // Simulate API call
        await new Promise(resolve => setTimeout(resolve, 2000));
        try {
            await onSuccess();
            setStatus('success');
            // Auto-close after success message
            setTimeout(() => {
                onClose();
            }, 2500);
        } catch (err: any) {
            setStatus('error');
            setErrorMessage(err.message || 'An unknown error occurred.');
        }
    };

    const renderContent = () => {
        switch (status) {
            case 'processing':
                return (
                    <div className="text-center py-12">
                        <div className="w-12 h-12 border-4 border-yellow-500 border-t-transparent rounded-full animate-spin mx-auto"></div>
                        <p className="mt-4 text-white font-semibold">Processing Payment...</p>
                        <p className="text-gray-400 text-sm">Please do not close this window.</p>
                    </div>
                );
            case 'success':
                 return (
                    <div className="text-center py-12">
                        <svg className="w-16 h-16 text-green-500 mx-auto" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                        <p className="mt-4 text-white font-semibold text-xl">Payment Successful!</p>
                        <p className="text-gray-300">Your account has been upgraded.</p>
                    </div>
                );
            case 'error':
                 return (
                    <div className="text-center py-12">
                         <svg className="w-16 h-16 text-red-500 mx-auto" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                        <p className="mt-4 text-white font-semibold text-xl">Payment Failed</p>
                        <p className="text-red-400 mt-2">{errorMessage}</p>
                         <button onClick={() => setStatus('idle')} className="mt-6 bg-yellow-600 hover:bg-yellow-700 text-green-900 font-bold py-2 px-6 rounded-lg">
                            Try Again
                        </button>
                    </div>
                );
            case 'idle':
            default:
                return (
                    <>
                        <h2 className="text-2xl font-bold text-yellow-300 text-center">Complete Your Purchase</h2>
                        <div className="my-6 bg-green-950/50 p-4 rounded-lg text-center">
                            <p className="text-gray-300">{productName}</p>
                            <p className="text-4xl font-bold text-white mt-1">${price.toFixed(2)}</p>
                            <p className="text-sm text-gray-500">One-time payment</p>
                        </div>
                        <p className="text-center text-sm text-gray-400 mb-4">Choose your payment method</p>
                        <div className="space-y-3">
                            <PaymentButton icon={<PayPalIcon />} label="PayPal" onClick={handlePayment} />
                            <PaymentButton icon={<CreditCardIcon />} label="Credit / Debit Card" onClick={handlePayment} />
                            <PaymentButton icon={<ApplePayIcon />} label="Apple Pay" onClick={handlePayment} />
                        </div>
                         <div className="mt-6 text-center">
                            <button onClick={onClose} className="text-gray-400 hover:text-white text-sm font-semibold">
                                Cancel Payment
                            </button>
                        </div>
                    </>
                );
        }
    };
    
    return (
        <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 p-4 backdrop-blur-sm">
            <div className="bg-green-900 border border-yellow-700/50 rounded-lg shadow-xl p-6 w-full max-w-sm transition-all duration-300 ease-in-out">
                {renderContent()}
            </div>
        </div>
    );
};