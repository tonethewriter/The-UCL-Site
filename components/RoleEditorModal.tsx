import React, { useState, useEffect } from 'react';
import { User, UserRole } from '../types';

interface RoleEditorModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSave: (userId: string, newRole: UserRole) => void;
    user: User | null;
}

const ALL_ROLES: { id: UserRole; label: string }[] = [
    { id: 'player', label: 'Player' },
    { id: 'player_plus', label: 'Player Plus' },
    { id: 'team_owner', label: 'Team Owner' },
    { id: 'team_owner_plus', label: 'Team Owner Plus' },
    { id: 'co_owner', label: 'Co-Owner' },
    { id: 'moderator', label: 'Moderator' },
    { id: 'admin', label: 'Admin' },
];

export const RoleEditorModal: React.FC<RoleEditorModalProps> = ({ isOpen, onClose, onSave, user }) => {
    const [selectedRole, setSelectedRole] = useState<UserRole>('player');

    useEffect(() => {
        if (user) {
            setSelectedRole(user.role);
        }
    }, [user]);

    if (!isOpen || !user) return null;

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        onSave(user.id, selectedRole);
    };

    return (
        <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 p-4 backdrop-blur-sm" onClick={onClose}>
            <div className="bg-brand-surface border border-brand-border/50 rounded-lg shadow-xl p-6 w-full max-w-md" onClick={e => e.stopPropagation()}>
                <h2 className="text-2xl font-bold text-white mb-2">Edit Role</h2>
                <p className="text-brand-text-muted mb-6">Change the role for <span className="font-bold text-brand-accent">{user.gamertag}</span>.</p>
                <form onSubmit={handleSubmit}>
                    <div>
                        <label className="text-sm font-bold text-brand-text-muted block mb-2" htmlFor="role-select">Role</label>
                        <select
                            id="role-select"
                            value={selectedRole}
                            onChange={(e) => setSelectedRole(e.target.value as UserRole)}
                            className="w-full bg-black/30 text-white border border-brand-border rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-brand-accent transition appearance-none"
                        >
                            {ALL_ROLES.map(roleOption => (
                                <option key={roleOption.id} value={roleOption.id}>
                                    {roleOption.label}
                                </option>
                            ))}
                        </select>
                    </div>
                    <div className="flex justify-end space-x-4 pt-6">
                         <button type="button" onClick={onClose} className="bg-brand-border hover:bg-brand-interactive/50 text-white font-bold py-2 px-6 rounded-md transition-colors">Cancel</button>
                         <button type="submit" className="bg-brand-interactive hover:bg-green-500 text-black font-bold py-2 px-6 rounded-md transition-colors">Save Changes</button>
                    </div>
                </form>
            </div>
        </div>
    );
};