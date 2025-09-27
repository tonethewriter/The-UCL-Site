import React, { useState, useEffect, useRef } from 'react';
import { Team } from '../types';
import { fileToBase64 } from '../constants';

interface TeamEditorModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSave: (details: { name: string; description: string; logoUrl: string; }) => void;
    team: Team | null;
}

export const TeamEditorModal: React.FC<TeamEditorModalProps> = ({ isOpen, onClose, onSave, team }) => {
    const [name, setName] = useState('');
    const [description, setDescription] = useState('');
    const [logoUrl, setLogoUrl] = useState('');
    const fileInputRef = useRef<HTMLInputElement>(null);

    useEffect(() => {
        if (team) {
            setName(team.name);
            setDescription(team.description);
            setLogoUrl(team.logoUrl);
        }
    }, [team, isOpen]);

    if (!isOpen || !team) return null;

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        onSave({ name, description, logoUrl });
    };

    const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            const base64 = await fileToBase64(file);
            setLogoUrl(base64);
        }
    };

    return (
        <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-[60] p-4 backdrop-blur-sm" onClick={onClose}>
            <div className="bg-brand-surface border border-brand-border/50 rounded-lg shadow-xl p-6 w-full max-w-lg" onClick={e => e.stopPropagation()}>
                <h2 className="text-2xl font-bold text-white mb-6">Edit Team: <span className="text-brand-accent">{team.name}</span></h2>
                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <label className="text-sm font-bold text-brand-text-muted block mb-2" htmlFor="team-name">Team Name</label>
                        <input type="text" id="team-name" value={name} onChange={(e) => setName(e.target.value)} className="w-full bg-black/30 text-white border border-brand-border rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-brand-accent transition" required />
                    </div>
                    <div>
                        <label className="text-sm font-bold text-brand-text-muted block mb-2" htmlFor="team-description">Description</label>
                        <textarea id="team-description" value={description} onChange={(e) => setDescription(e.target.value)} className="w-full bg-black/30 text-white border border-brand-border rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-brand-accent transition" rows={3} required />
                    </div>
                    <div>
                        <label className="text-sm font-bold text-brand-text-muted block mb-2">Logo</label>
                        <div className="mt-2 flex items-center gap-4">
                            <img src={logoUrl} alt="Team Logo Preview" className="w-16 h-16 rounded-full bg-brand-border object-cover" />
                            <input
                                type="file"
                                ref={fileInputRef}
                                onChange={handleFileChange}
                                className="hidden"
                                accept="image/png, image/jpeg, image/gif"
                            />
                            <button
                                type="button"
                                onClick={() => fileInputRef.current?.click()}
                                className="bg-brand-border hover:bg-brand-interactive/50 text-white font-bold py-2 px-4 rounded-md transition-colors"
                            >
                                Upload New Logo
                            </button>
                        </div>
                    </div>
                    <div className="flex justify-end space-x-4 pt-4">
                         <button type="button" onClick={onClose} className="bg-brand-border hover:bg-brand-interactive/50 text-white font-bold py-2 px-6 rounded-md transition-colors">Cancel</button>
                         <button type="submit" className="bg-brand-interactive hover:bg-green-500 text-black font-bold py-2 px-6 rounded-md transition-colors">Save Changes</button>
                    </div>
                </form>
            </div>
        </div>
    );
};