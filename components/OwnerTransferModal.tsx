import React, { useState, useEffect, useMemo } from 'react';
import { Team } from '../types';
import { useAuth } from '../hooks/useAuth';

interface OwnerTransferModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSave: (newOwnerId: string) => void;
    team: Team | null;
}

export const OwnerTransferModal: React.FC<OwnerTransferModalProps> = ({ isOpen, onClose, onSave, team }) => {
    const { users } = useAuth();
    const [selectedOwnerId, setSelectedOwnerId] = useState('');

    const teamMembers = useMemo(() => {
        if (!team) return [];
        return users.filter(u => u.teamId === team.id && u.id !== team.ownerId);
    }, [users, team]);
    
    useEffect(() => {
        if (teamMembers.length > 0) {
            setSelectedOwnerId(teamMembers[0].id);
        } else {
            setSelectedOwnerId('');
        }
    }, [teamMembers, isOpen]);

    if (!isOpen || !team) return null;

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (selectedOwnerId) {
            onSave(selectedOwnerId);
        }
    };

    return (
        <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-[60] p-4 backdrop-blur-sm" onClick={onClose}>
            <div className="bg-brand-surface border border-brand-border/50 rounded-lg shadow-xl p-6 w-full max-w-md" onClick={e => e.stopPropagation()}>
                <h2 className="text-2xl font-bold text-white mb-2">Transfer Ownership</h2>
                <p className="text-brand-text-muted mb-6">For team: <span className="font-bold text-brand-accent">{team.name}</span></p>
                <form onSubmit={handleSubmit}>
                    {teamMembers.length > 0 ? (
                        <div>
                            <label className="text-sm font-bold text-brand-text-muted block mb-2" htmlFor="owner-select">Select New Owner</label>
                            <select
                                id="owner-select"
                                value={selectedOwnerId}
                                onChange={(e) => setSelectedOwnerId(e.target.value)}
                                className="w-full bg-black/30 text-white border border-brand-border rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-brand-accent transition appearance-none"
                            >
                                {teamMembers.map(member => (
                                    <option key={member.id} value={member.id}>
                                        {member.gamertag}
                                    </option>
                                ))}
                            </select>
                        </div>
                    ) : (
                        <p className="text-center text-yellow-400 bg-yellow-500/10 p-3 rounded-lg">This team has no other members to transfer ownership to.</p>
                    )}
                    <div className="flex justify-end space-x-4 pt-6">
                         <button type="button" onClick={onClose} className="bg-brand-border hover:bg-brand-interactive/50 text-white font-bold py-2 px-6 rounded-md transition-colors">Cancel</button>
                         <button type="submit" disabled={!selectedOwnerId} className="bg-brand-interactive hover:bg-green-500 text-black font-bold py-2 px-6 rounded-md transition-colors disabled:bg-brand-border disabled:text-brand-text-muted disabled:cursor-not-allowed">
                            Transfer Ownership
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};