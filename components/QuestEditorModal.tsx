import React, { useState, useEffect } from 'react';
import { Quest } from '../types';

interface QuestEditorModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSave: (questData: { title: string; description: string; prize: string; target?: number; }) => void;
    quest: Quest | null;
}

export const QuestEditorModal: React.FC<QuestEditorModalProps> = ({ isOpen, onClose, onSave, quest }) => {
    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');
    const [prize, setPrize] = useState('');
    const [target, setTarget] = useState<number | undefined>(undefined);

    useEffect(() => {
        if (!isOpen) return;
        if (quest) {
            setTitle(quest.title);
            setDescription(quest.description);
            setPrize(quest.prize);
            setTarget(quest.target);
        } else {
            setTitle('');
            setDescription('');
            setPrize('');
            setTarget(undefined);
        }
    }, [quest, isOpen]);

    if (!isOpen) return null;

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        onSave({
            title,
            description,
            prize,
            target: target ? Number(target) : undefined,
        });
    };

    return (
        <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 p-4 backdrop-blur-sm" onClick={onClose}>
            <div className="bg-brand-surface border border-brand-border/50 rounded-lg shadow-xl p-6 w-full max-w-lg" onClick={e => e.stopPropagation()}>
                <h2 className="text-2xl font-bold text-white mb-6">{quest ? 'Edit Quest' : 'Create New Quest'}</h2>
                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <label className="text-sm font-bold text-brand-text-muted block mb-2" htmlFor="title">Title</label>
                        <input type="text" id="title" value={title} onChange={(e) => setTitle(e.target.value)} className="w-full bg-black/30 text-white border border-brand-border rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-brand-accent transition" required />
                    </div>
                    <div>
                        <label className="text-sm font-bold text-brand-text-muted block mb-2" htmlFor="description">Description</label>
                        <textarea id="description" value={description} onChange={(e) => setDescription(e.target.value)} className="w-full bg-black/30 text-white border border-brand-border rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-brand-accent transition" rows={3} required />
                    </div>
                    <div>
                        <label className="text-sm font-bold text-brand-text-muted block mb-2" htmlFor="prize">Prize</label>
                        <input type="text" id="prize" value={prize} onChange={(e) => setPrize(e.target.value)} placeholder="e.g. 100 UCL Points" className="w-full bg-black/30 text-white border border-brand-border rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-brand-accent transition" required />
                    </div>
                    <div>
                        <label className="text-sm font-bold text-brand-text-muted block mb-2" htmlFor="target">Progress Target (optional)</label>
                        <input type="number" id="target" value={target || ''} onChange={(e) => setTarget(e.target.value ? parseInt(e.target.value, 10) : undefined)} placeholder="e.g. 5" className="w-full bg-black/30 text-white border border-brand-border rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-brand-accent transition" min="1" />
                    </div>
                    <div className="flex justify-end space-x-4 pt-4">
                         <button type="button" onClick={onClose} className="bg-brand-border hover:bg-brand-interactive/50 text-white font-bold py-2 px-6 rounded-md transition-colors">Cancel</button>
                         <button type="submit" className="bg-brand-interactive hover:bg-green-500 text-black font-bold py-2 px-6 rounded-md transition-colors">Save Quest</button>
                    </div>
                </form>
            </div>
        </div>
    );
};
