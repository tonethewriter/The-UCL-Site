import React, { useState } from 'react';
import { User } from '../types';

interface TimeoutUserModalProps {
    isOpen: boolean;
    onClose: () => void;
    onConfirm: (durationHours: number) => void;
    user: User | null;
}

export const TimeoutUserModal: React.FC<TimeoutUserModalProps> = ({ isOpen, onClose, onConfirm, user }) => {
    const [duration, setDuration] = useState(1);
    const [error, setError] = useState('');

    if (!isOpen || !user) return null;

    const handleConfirm = () => {
        if (duration > 0 && duration <= 720) { // Max 30 days
            onConfirm(duration);
        } else {
            setError('Duration must be between 1 and 720 hours.');
        }
    };
    
    const handleClose = () => {
        setDuration(1);
        setError('');
        onClose();
    };

    return (
        <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-[60] p-4 backdrop-blur-sm" onClick={handleClose}>
            <div className="bg-brand-surface border border-brand-border/50 rounded-lg shadow-xl p-6 w-full max-w-md" onClick={e => e.stopPropagation()}>
                <h2 className="text-2xl font-bold text-white mb-2">Timeout User</h2>
                <p className="text-brand-text-muted mb-6">For user: <span className="font-bold text-brand-accent">{user.gamertag}</span></p>
                
                {error && <p className="bg-red-500/20 text-red-400 p-3 rounded-md mb-4 text-center text-sm">{error}</p>}

                <div className="space-y-4">
                    <div>
                        <label className="text-sm font-bold text-brand-text-muted block mb-2" htmlFor="timeout-duration">Duration (in hours)</label>
                        <input
                            type="number"
                            id="timeout-duration"
                            value={duration}
                            onChange={(e) => setDuration(parseInt(e.target.value, 10))}
                            className="w-full bg-black/30 text-white border border-brand-border rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-brand-accent transition"
                            min="1"
                            max="720"
                            placeholder="e.g. 24"
                        />
                    </div>
                </div>

                <div className="flex justify-end space-x-4 pt-6">
                     <button type="button" onClick={handleClose} className="bg-brand-border hover:bg-brand-interactive/50 text-white font-bold py-2 px-6 rounded-md transition-colors">Cancel</button>
                     <button
                        onClick={handleConfirm}
                        className="bg-yellow-600 hover:bg-yellow-700 text-black font-bold py-2 px-6 rounded-md transition-colors"
                    >
                        Confirm Timeout
                    </button>
                </div>
            </div>
        </div>
    );
};
