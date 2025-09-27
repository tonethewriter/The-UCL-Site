import React, { useState } from 'react';
import { useAuth } from '../hooks/useAuth';
import { LightbulbIcon } from '../constants';
import { FeedbackModal } from './FeedbackModal';

export const FeedbackButton: React.FC = () => {
    const { currentUser } = useAuth();
    const [isModalOpen, setIsModalOpen] = useState(false);

    if (!currentUser) {
        return null;
    }
    
    return (
        <>
            <button
                onClick={() => setIsModalOpen(true)}
                className="fixed bottom-6 right-6 bg-brand-accent hover:bg-yellow-400 text-black rounded-full p-4 shadow-lg z-40 transition-transform hover:scale-110"
                aria-label="Send Feedback"
                title="Send Feedback"
            >
                <LightbulbIcon className="h-7 w-7" />
            </button>
            <FeedbackModal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
            />
        </>
    );
};