import React from 'react';
import { UserRole } from '../types';

interface RoleBadgeProps {
  role: UserRole;
}

export const RoleBadge: React.FC<RoleBadgeProps> = ({ role }) => {
    const roleStyles: Record<UserRole, { text: string; className: string }> = {
        admin: { text: 'Admin', className: 'bg-red-600 text-white' },
        team_owner_plus: { text: 'Owner ⭐', className: 'bg-brand-accent text-black' },
        team_owner: { text: 'Owner', className: 'bg-brand-interactive text-white' },
        co_owner: { text: 'Co-Owner', className: 'bg-emerald-600 text-white' },
        player_plus: { text: 'Player ⭐', className: 'bg-teal-600 text-white' },
        player: { text: 'Player', className: 'bg-brand-border text-brand-text' },
    };

    const style = roleStyles[role] || roleStyles.player;

    return (
        <span className={`px-2 py-0.5 rounded-full text-xs font-semibold leading-none ${style.className}`}>
            {style.text}
        </span>
    );
};