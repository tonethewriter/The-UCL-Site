import React, { useState } from 'react';
import { useAuth } from '../hooks/useAuth';

interface FeedbackModalProps {
    isOpen: boolean;
    onClose: () => void;
}

type FeedbackStatus = 'idle' | 'submitting' | 'success' | 'error';

export const FeedbackModal: React.FC<FeedbackModalProps> = ({ isOpen, onClose }) => {
    const { submitFeedback } = useAuth();
    const [feedbackType, setFeedbackType] = useState('suggestion');
    const [message, setMessage] = useState('');
    const [status, setStatus] = useState<FeedbackStatus>('idle');
    const [error, setError] = useState('');

    if (!isOpen) return null;

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!message.trim()) {
            setError('Feedback message cannot be empty.');
            return;
        }
        setStatus('submitting');
        setError('');
        try {
            await submitFeedback(feedbackType, message);
            setStatus('success');
            setTimeout(() => {
                onClose();
                // Reset form state after closing
                setTimeout(() => {
                    setStatus('idle');
                    setMessage('');
                    setFeedbackType('suggestion');
                }, 300);
            }, 2000);
        } catch (err: any) {
            setStatus('error');
            setError(err.message || 'An error occurred.');
        }
    };

    const renderContent = () => {
        switch (status) {
            case 'submitting':
                return (
                    <div className="text-center py-10">
                        <div className="w-10 h-10 border-4 border-brand-accent border-t-transparent rounded-full animate-spin mx-auto"></div>
                        <p className="mt-4 text-white font-semibold">Submitting Feedback...</p>
                    </div>
                );
            case 'success':
                 return (
                    <div className="text-center py-10">
                        <svg className="w-14 h-14 text-green-500 mx-auto" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                        <p className="mt-4 text-white font-semibold text-xl">Feedback Sent!</p>
                        <p className="text-brand-text-muted">Thank you for helping us improve.</p>
                    </div>
                );
            default:
                return (
                    <>
                        <h2 className="text-2xl font-bold text-white mb-6">Send Feedback</h2>
                        {status === 'error' && <p className="bg-red-500/20 text-red-400 p-3 rounded-md mb-4 text-center">{error}</p>}
                        <form onSubmit={handleSubmit} className="space-y-4">
                            <div>
                                <label className="text-sm font-bold text-brand-text-muted block mb-2" htmlFor="feedback-type">Type of Feedback</label>
                                <select id="feedback-type" value={feedbackType} onChange={(e) => setFeedbackType(e.target.value)} className="w-full bg-black/30 text-white border border-brand-border rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-brand-accent transition appearance-none">
                                    <option value="suggestion">Suggestion</option>
                                    <option value="bug_report">Bug Report</option>
                                    <option value="general">General Feedback</option>
                                </select>
                            </div>
                            <div>
                                <label className="text-sm font-bold text-brand-text-muted block mb-2" htmlFor="feedback-message">Message</label>
                                <textarea id="feedback-message" value={message} onChange={(e) => setMessage(e.target.value)} className="w-full bg-black/30 text-white border border-brand-border rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-brand-accent transition" rows={5} required placeholder="Tell us what you think..." />
                            </div>
                            <div className="flex justify-end space-x-4 pt-4">
                                <button type="button" onClick={onClose} className="bg-brand-border hover:bg-brand-interactive/50 text-white font-bold py-2 px-6 rounded-md transition-colors">Cancel</button>
                                <button type="submit" className="bg-brand-interactive hover:bg-green-500 text-black font-bold py-2 px-6 rounded-md transition-colors">Submit</button>
                            </div>
                        </form>
                    </>
                );
        }
    }

    return (
        <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 p-4 backdrop-blur-sm" onClick={onClose}>
            <div className="bg-brand-surface border border-brand-border/50 rounded-lg shadow-xl p-6 w-full max-w-lg" onClick={e => e.stopPropagation()}>
                {renderContent()}
            </div>
        </div>
    );
};