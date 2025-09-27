import React from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { MessageIcon, TwitterIcon, TwitchIcon, YouTubeIcon, ShimmeringGamertag } from '../constants';

export const UserProfilePage: React.FC = () => {
    const { userId } = useParams<{ userId: string }>();
    const { users, currentUser, teams } = useAuth();
    const navigate = useNavigate();

    const user = users.find(u => u.id === userId);
    const team = user?.teamId ? teams.find(t => t.id === user.teamId) : null;

    const handleMessageClick = () => {
        if (!currentUser || !user) return;
        // Create a predictable, unique channel ID for the two users
        const channelId = ['dm', currentUser.id, user.id].sort().join('_');
        navigate('/messages', { state: { activeChannelId: channelId } });
    };

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
        team_owner_plus: 'Team Owner Plus ⭐',
        co_owner: 'Co-Owner',
        admin: 'Administrator'
    };

    const canMessageUser = (currentUser?.role === 'team_owner_plus' || currentUser?.role === 'admin') && currentUser.id !== user.id;

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
                        <h1 className="text-4xl font-bold text-white break-words">
                            <ShimmeringGamertag user={user} />
                        </h1>
                        <p className="text-brand-text-muted mt-1 break-words">{user.email}</p>
                        
                        <div className="mt-4 flex items-center justify-center md:justify-start space-x-4">
                            {user.twitter && (
                                <a href={user.twitter} target="_blank" rel="noopener noreferrer" className="text-blue-400 hover:text-blue-300 transition-colors" title="Twitter">
                                    <TwitterIcon className="w-6 h-6" />
                                </a>
                            )}
                            {user.twitch && (
                                <a href={user.twitch} target="_blank" rel="noopener noreferrer" className="text-purple-500 hover:text-purple-400 transition-colors" title="Twitch">
                                    <TwitchIcon className="w-6 h-6" />
                                </a>
                            )}
                            {user.youtube && (
                                <a href={user.youtube} target="_blank" rel="noopener noreferrer" className="text-red-600 hover:text-red-500 transition-colors" title="YouTube">
                                    <YouTubeIcon className="w-6 h-6" />
                                </a>
                            )}
                        </div>

                        <div className="mt-4 space-y-2">
                            <div className="flex items-center justify-center md:justify-start gap-2 bg-black/30 px-3 py-1 rounded-full text-sm text-brand-text w-fit mx-auto md:mx-0">
                                <strong>Role:</strong> {roleDisplayMap[user.role]}
                            </div>
                            {team && (
                                <div className="flex items-center justify-center md:justify-start gap-2 bg-black/30 px-3 py-1 rounded-full text-sm text-brand-text w-fit mx-auto md:mx-0">
                                    <strong>Team:</strong> <Link to={`/teams/${team.id}`} className="font-semibold hover:underline">{team.name}</Link>
                                </div>
                            )}
                             {user.isFreeAgent && (
                                <div className="flex items-center justify-center md:justify-start gap-2 bg-yellow-600/20 text-yellow-300 px-3 py-1 rounded-full text-sm w-fit mx-auto md:mx-0 font-semibold">
                                    Free Agent
                                </div>
                            )}
                            <div className="flex items-center justify-center md:justify-start gap-2 bg-black/30 px-3 py-1 rounded-full text-sm text-brand-text w-fit mx-auto md:mx-0">
                                <strong>UCL Points:</strong> <span className="text-brand-accent">{user.uclPoints.toLocaleString()}</span>
                            </div>
                        </div>

                        {canMessageUser && (
                            <div className="mt-6">
                                <button
                                    onClick={handleMessageClick}
                                    className="flex items-center justify-center gap-2 w-full md:w-auto bg-brand-interactive hover:bg-green-500 text-black font-bold py-2 px-6 rounded-lg transition-transform hover:scale-105"
                                >
                                    <MessageIcon className="w-5 h-5" />
                                    <span>Message {user.gamertag}</span>
                                </button>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};