import React from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { MessageIcon, TwitterIcon, TwitchIcon, YouTubeIcon, ShimmeringGamertag } from '../constants';
import { PostCard } from '../components/PostCard';

const PinIcon: React.FC<{className?: string}> = ({ className }) => (
    <svg className={className} viewBox="0 0 20 20" fill="currentColor">
      <path fillRule="evenodd" d="M10 3a1 1 0 011 1v5.586l2.293-2.293a1 1 0 011.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 111.414-1.414L9 9.586V4a1 1 0 011-1z" clipRule="evenodd" />
      <path d="M3 12a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1z" />
    </svg>
);


export const UserProfilePage: React.FC = () => {
    const { userId } = useParams<{ userId: string }>();
    const { users, currentUser, teams, posts } = useAuth();
    const navigate = useNavigate();

    const user = users.find(u => u.id === userId);
    const team = user?.teamId ? teams.find(t => t.id === user.teamId) : null;
    
    const canViewAll = currentUser?.role === 'admin' || currentUser?.id === user?.id;

    const showPinnedPost = canViewAll || (user?.profileVisibility?.showPinnedPost ?? true);
    const pinnedPost = user?.pinnedPostId && showPinnedPost ? posts.find(p => p.id === user.pinnedPostId) : null;
    const pinnedPostAuthor = pinnedPost ? users.find(u => u.id === pinnedPost.authorId) : null;


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

    const showTeam = canViewAll || (user.profileVisibility?.showTeam ?? true);
    const showSocials = canViewAll || (user.profileVisibility?.showSocials ?? true);
    const showPoints = canViewAll || (user.profileVisibility?.showPoints ?? true);

    return (
        <div className="max-w-4xl mx-auto py-10 px-4 sm:px-6 lg:px-8">
            <div className="bg-brand-surface rounded-xl shadow-2xl border border-brand-border/50 overflow-hidden">
                <div className="h-48 bg-brand-border relative">
                    {user.profileBanner ? (
                        <img src={user.profileBanner} alt={`${user.gamertag}'s banner`} className="w-full h-full object-cover" />
                    ) : (
                        <div className="w-full h-full bg-gradient-to-r from-brand-surface to-brand-border"></div>
                    )}
                    <div className="absolute -bottom-16 left-8">
                        {user.profilePicture ? (
                            <img src={user.profilePicture} alt={user.gamertag} className="w-32 h-32 rounded-full object-cover ring-4 ring-brand-surface bg-brand-border" />
                        ) : (
                            <div className="w-32 h-32 rounded-full bg-brand-accent flex items-center justify-center font-bold text-black text-6xl ring-4 ring-brand-surface">
                                {user.gamertag.charAt(0).toUpperCase()}
                            </div>
                        )}
                    </div>
                </div>

                <div className="pt-20 px-8 pb-8">
                     <div className="flex flex-col md:flex-row items-center md:items-start justify-between">
                         <div>
                            <h1 className="text-4xl font-bold text-white break-words">
                                <ShimmeringGamertag user={user} />
                            </h1>
                            {canViewAll ? (
                                <p className="text-brand-text-muted mt-1 break-words">{user.email}</p>
                            ) : (
                                <p className="text-brand-text-muted mt-1 break-words italic">[Email Hidden for Privacy]</p>
                            )}
                        </div>
                        {showSocials && (
                            <div className="mt-4 md:mt-0 flex items-center justify-center md:justify-start space-x-4">
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
                        )}
                     </div>
                     <div className="mt-4 flex flex-wrap gap-2">
                        <div className="flex items-center justify-center md:justify-start gap-2 bg-black/30 px-3 py-1 rounded-full text-sm text-brand-text">
                            <strong>Role:</strong> {roleDisplayMap[user.role]}
                        </div>
                        {team && showTeam && (
                            <div className="flex items-center justify-center md:justify-start gap-2 bg-black/30 px-3 py-1 rounded-full text-sm text-brand-text">
                                <strong>Team:</strong> <Link to={`/teams/${team.id}`} className="font-semibold hover:underline">{team.name}</Link>
                            </div>
                        )}
                         {user.isFreeAgent && (
                            <div className="flex items-center justify-center md:justify-start gap-2 bg-yellow-600/20 text-yellow-300 px-3 py-1 rounded-full text-sm font-semibold">
                                Free Agent
                            </div>
                        )}
                        {showPoints && (
                            <div className="flex items-center justify-center md:justify-start gap-2 bg-black/30 px-3 py-1 rounded-full text-sm text-brand-text">
                                <strong>UCL Points:</strong> <span className="text-brand-accent">{user.uclPoints.toLocaleString()}</span>
                            </div>
                        )}
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

            {pinnedPost && (
                <div className="mt-8">
                    <h2 className="text-2xl font-semibold text-brand-accent mb-4 flex items-center gap-2">
                        <PinIcon className="w-6 h-6" />
                        Pinned Post
                    </h2>
                    <PostCard post={pinnedPost} author={pinnedPostAuthor} />
                </div>
            )}
        </div>
    );
};