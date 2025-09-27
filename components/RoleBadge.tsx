import React from 'react';
import { UserRole } from '../types';

interface RoleBadgeProps {
  role: UserRole;
}

export const RoleBadge: React.FC<RoleBadgeProps> = ({ role }) => {
    const roleStyles: Record<UserRole, { text: string; className: string }> = {
        admin: { text: 'Admin', className: 'bg-red-600 text-white' },
        team_owner: { text: 'Owner', className: 'bg-blue-600 text-white' },
        team_owner_plus: { text: 'Owner ⭐', className: 'bg-blue-500 text-white' },
        co_owner: { text: 'Co-Owner', className: 'bg-cyan-600 text-white' },
        player_plus: { text: 'Player ⭐', className: 'bg-purple-600 text-white' },
        player: { text: 'Player', className: 'bg-green-700 text-green-100' },
    };

    const style = roleStyles[role] || roleStyles.player;

    return (
        <span className={`px-2 py-0.5 rounded-full text-xs font-semibold leading-none ${style.className}`}>
            {style.text}
        </span>
    );
};
