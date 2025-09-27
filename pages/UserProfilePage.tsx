import React from 'react';
import { useParams, Link } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';

export const UserProfilePage: React.FC = () => {
    const { userId } = useParams<{ userId: string }>();
    const { users } = useAuth();

    const user = users.find(u => u.id === userId);

    if (!user) {
        return (
            <div className="text-center py-20">
                <h1 className="text-3xl font-bold text-brand-accent">User Not Found</h1>
                <p className="text-brand-text-muted mt-2">Could not find a user with the specified ID.</p>
                <Link to="/" className="mt-6 inline-block bg-brand-interactive hover:bg-green-500 text-black font-bold py-2 px-6 rounded-lg transition-transform hover:scale-105">
                    Go to Home
                </Link>
            </div>
        );
    }
    
    const roleDisplayMap = {
        player: 'Player',
        player_plus: 'Player Plus ⭐',
        team_owner: 'Team Owner',
        co_owner: 'Co-Owner',
        team_owner_plus: 'Team Owner Plus ⭐',
        admin: 'Administrator'
    };

    return (
        <div className="max-w-4xl mx-auto py-10 px-4 sm:px-6 lg:px-8">
            <div className="bg-brand-surface p-8 rounded-xl shadow-2xl border border-brand-border/50">
                <div className="flex flex-col md:flex-row items-center md:items-start md:space-x-8">
                    <div className="flex-shrink-0 mb-6 md:mb-0">
                         {user.profilePicture ? (
                            <img src={user.profilePicture} alt={user.gamertag} className="w-32 h-32 rounded-full object-cover ring-4 ring-brand-accent/50 bg-brand-border" />
                        ) : (
                            <div className="w-32 h-32 rounded-full bg-brand-accent flex items-center justify-center font-bold text-black text-6xl ring-4 ring-brand-accent/50">
                                {user.gamertag.charAt(0).toUpperCase()}
                            </div>
                        )}
                    </div>
                    
                    <div className="flex-grow text-center md:text-left">
                        <h1 className="text-4xl font-bold text-white break-words">{user.gamertag}</h1>
                        <p className="text-brand-text-muted mt-1 break-words">{user.email}</p>
                        <div className="mt-4 space-y-2">
                            <div className="flex items-center justify-center md:justify-start gap-2 bg-black/30 px-3 py-1 rounded-full text-sm text-brand-text w-fit mx-auto md:mx-0">
                                <strong>Role:</strong> {roleDisplayMap[user.role]}
                            </div>
                            {user.teamName && (
                                <div className="flex items-center justify-center md:justify-start gap-2 bg-black/30 px-3 py-1 rounded-full text-sm text-brand-text w-fit mx-auto md:mx-0">
                                    <strong>Team:</strong> {user.teamName}
                                </div>
                            )}
                            <div className="flex items-center justify-center md:justify-start gap-2 bg-black/30 px-3 py-1 rounded-full text-sm text-brand-text w-fit mx-auto md:mx-0">
                                <strong>UCL Points:</strong> <span className="text-brand-accent">{user.uclPoints.toLocaleString()}</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};