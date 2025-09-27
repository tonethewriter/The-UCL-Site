import React, { useState } from 'react';
import { User } from '../types';

interface PointsEditorModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSave: (userId: string, amount: number) => void;
    user: User | null;
}

export const PointsEditorModal: React.FC<PointsEditorModalProps> = ({ isOpen, onClose, onSave, user }) => {
    const [amount, setAmount] = useState('');
    const [error, setError] = useState('');

    if (!isOpen || !user) return null;

    const handleSave = (modifier: 1 | -1) => {
        const points = parseInt(amount, 10);
        if (isNaN(points) || points <= 0) {
            setError('Please enter a valid positive number.');
            return;
        }
        setError('');
        onSave(user.id, points * modifier);
    };
    
    const handleClose = () => {
        setAmount('');
        setError('');
        onClose();
    };

    return (
        <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-[60] p-4 backdrop-blur-sm" onClick={handleClose}>
            <div className="bg-brand-surface border border-brand-border/50 rounded-lg shadow-xl p-6 w-full max-w-md" onClick={e => e.stopPropagation()}>
                <h2 className="text-2xl font-bold text-white mb-2">Adjust UCL Points</h2>
                <p className="text-brand-text-muted mb-4">For user: <span className="font-bold text-brand-accent">{user.gamertag}</span></p>
                <p className="text-brand-text-muted mb-6">Current Points: <span className="font-bold text-white">{user.uclPoints.toLocaleString()}</span></p>
                
                {error && <p className="bg-red-500/20 text-red-400 p-3 rounded-md mb-4 text-center text-sm">{error}</p>}

                <div className="space-y-4">
                    <div>
                        <label className="text-sm font-bold text-brand-text-muted block mb-2" htmlFor="points-amount">Amount</label>
                        <input
                            type="number"
                            id="points-amount"
                            value={amount}
                            onChange={(e) => {
                                setAmount(e.target.value);
                                if (error) setError('');
                            }}
                            className="w-full bg-black/30 text-white border border-brand-border rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-brand-accent transition"
                            min="1"
                            placeholder="e.g. 100"
                        />
                    </div>
                </div>

                <div className="flex justify-between items-center space-x-4 pt-6">
                    <button
                        onClick={() => handleSave(-1)}
                        className="w-full bg-red-600 hover:bg-red-700 text-white font-bold py-2 px-6 rounded-md transition-colors"
                    >
                        Remove Points
                    </button>
                    <button
                        onClick={() => handleSave(1)}
                        className="w-full bg-brand-interactive hover:bg-green-500 text-black font-bold py-2 px-6 rounded-md transition-colors"
                    >
                        Add Points
                    </button>
                </div>
                 <div className="text-center mt-4">
                     <button type="button" onClick={handleClose} className="text-sm text-brand-text-muted hover:underline">Cancel</button>
                </div>
            </div>
        </div>
    );
};