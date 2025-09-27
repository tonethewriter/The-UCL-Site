import React, { useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { MessageIcon, TwitterIcon, TwitchIcon, YouTubeIcon, ShimmeringGamertag, FounderBadgeIcon } from '../constants';
import { PostCard } from '../components/PostCard';
import { TimeoutUserModal } from '../components/TimeoutUserModal';
import { User } from '../types';

const PinIcon: React.FC<{className?: string}> = ({ className }) => (
    <svg className={className} viewBox="0 0 20 20" fill="currentColor">
      <path fillRule="evenodd" d="M10 3a1 1 0 011 1v5.586l2.293-2.293a1 1 0 011.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 111.414-1.414L9 9.586V4a1 1 0 011-1z" clipRule="evenodd" />
      <path d="M3 12a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1z" />
    </svg>
);

const ShieldExclamationIcon: React.FC<{className?: string}> = ({ className }) => (
    <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
    </svg>
);

export const UserProfilePage: React.FC = () => {
    const { userId } = useParams<{ userId: string }>();
    const { users, currentUser, teams, posts, timeoutUser } = useAuth();
    const navigate = useNavigate();
    const [isTimeoutModalOpen, setIsTimeoutModalOpen] = useState(false);

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
    
    const team = user.teamId ? teams.find(t => t.id === user.teamId) : null;
    const isPlusUser = user.role.includes('_plus') || user.role === 'admin';
    const isModeratorView = currentUser?.role === 'admin' || !!currentUser?.isModerator;
    const canViewAll = isModeratorView || currentUser?.id === user?.id;

    const showPinnedPost = canViewAll || (user.profileVisibility?.showPinnedPost ?? true);
    const pinnedPost = user.pinnedPostId && showPinnedPost ? posts.find(p => p.id === user.pinnedPostId) : null;
    const pinnedPostAuthor = pinnedPost ? users.find(u => u.id === pinnedPost.authorId) : null;
    
    const isTimedOut = user.timeoutUntil && new Date(user.timeoutUntil) > new Date();

    const handleMessageClick = () => {
        if (!currentUser || !user) return;
        const channelId = ['dm', currentUser.id, user.id].sort().join('_');
        navigate('/messages', { state: { activeChannelId: channelId } });
    };

    const handleTimeout = async (durationHours: number) => {
        if (!user) return;
        await timeoutUser(user.id, durationHours);
        setIsTimeoutModalOpen(false);
    };
    
    const roleDisplayMap = {
        player: 'Player',
        player_plus: 'Player Plus ⭐',
        team_owner: 'Team Owner',
        team_owner_plus: 'Team Owner Plus ⭐',
        co_owner: 'Co-Owner',
        admin: 'Administrator'
    };

    const canMessageUser = currentUser && (currentUser.role === 'team_owner_plus' || isModeratorView) && currentUser.id !== user.id;

    const showTeam = canViewAll || (user.profileVisibility?.showTeam ?? true);
    const showSocials = canViewAll || (user.profileVisibility?.showSocials ?? true);
    const showPoints = canViewAll || (user.profileVisibility?.showPoints ?? true);

    const socialLinksBlock = (
        <div className="flex items-center gap-4">
            {showSocials && (user.twitter || user.twitch || user.youtube) && (
                <div className="flex items-center gap-3">
                    {user.twitter && <a href={user.twitter} target="_blank" rel="noopener noreferrer" className="text-brand-text-muted hover:text-white"><TwitterIcon /></a>}
                    {user.twitch && <a href={user.twitch} target="_blank" rel="noopener noreferrer" className="text-brand-text-muted hover:text-white"><TwitchIcon /></a>}
                    {user.youtube && <a href={user.youtube} target="_blank" rel="noopener noreferrer" className="text-brand-text-muted hover:text-white"><YouTubeIcon /></a>}
                </div>
            )}
            {canMessageUser && (
                <button onClick={handleMessageClick} className="bg-brand-interactive hover:bg-green-500 text-black font-bold py-2 px-4 rounded-lg transition-transform hover:scale-105 text-sm flex items-center gap-2">
                    <MessageIcon /> Message
                </button>
            )}
        </div>
    );

    return (
        <>
            <div className="bg-black">
                <div className="max-w-5xl mx-auto">
                    <div className="bg-brand-surface shadow-lg rounded-b-xl border-x border-b border-brand-border/50 overflow-hidden">
                       {isPlusUser ? (
                            <>
                                {/* --- HEADER FOR PLUS MEMBERS --- */}
                                <div className="h-36 md:h-48 bg-brand-border relative">
                                    {user.profileBanner ? (
                                        <img src={user.profileBanner} alt={`${user.gamertag}'s banner`} className="w-full h-full object-cover" />
                                    ) : (
                                        <div className="w-full h-full bg-gradient-to-r from-brand-surface via-brand-border to-brand-surface"></div>
                                    )}
                                </div>
                                <div className="p-4 sm:p-6">
                                    <div className="flex flex-col sm:flex-row sm:items-end sm:space-x-5">
                                        <div className="-mt-20 sm:-mt-24 flex-shrink-0">
                                            <img src={user.profilePicture} alt={user.gamertag} className="h-24 w-24 sm:h-32 sm:w-32 rounded-full object-cover ring-4 ring-brand-surface bg-brand-border" />
                                        </div>
                                        <div className="mt-4 sm:mt-0 w-full flex-grow flex flex-col sm:flex-row items-center sm:items-end justify-between gap-4">
                                            <div className="text-center sm:text-left">
                                                <h1 className="text-2xl sm:text-4xl font-bold text-white break-words"><ShimmeringGamertag user={user} /></h1>
                                                <p className="text-sm text-brand-text-muted mt-1 break-words">{canViewAll ? user.email : '[Email Hidden]'}</p>
                                            </div>
                                            {socialLinksBlock}
                                        </div>
                                    </div>
                                </div>
                            </>
                        ) : (
                            <>
                                {/* --- COMPACT HEADER FOR FREE USERS --- */}
                                <div className="p-6 sm:p-8">
                                    <div className="flex flex-col sm:flex-row items-center gap-6 text-center sm:text-left">
                                        <div className="flex-shrink-0">
                                            <img src={user.profilePicture} alt={user.gamertag} className="h-24 w-24 sm:h-32 sm:w-32 rounded-full object-cover ring-4 ring-brand-surface bg-brand-border" />
                                        </div>
                                        <div className="flex-grow">
                                            <h1 className="text-3xl sm:text-4xl font-bold text-white break-words"><ShimmeringGamertag user={user} /></h1>
                                            <p className="text-sm text-brand-text-muted mt-1 break-words">{canViewAll ? user.email : '[Email Hidden]'}</p>
                                             <div className="mt-4 flex items-center justify-center sm:justify-start gap-4">
                                                {socialLinksBlock}
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </>
                        )}

                        {/* --- SHARED PROFILE DETAILS --- */}
                         <div className={`flex flex-wrap gap-2 items-center justify-center sm:justify-start ${isPlusUser ? 'px-6 pb-6' : 'p-6 border-t border-brand-border/50'}`}>
                            <div className="bg-black/30 px-3 py-1 rounded-full text-sm text-brand-text"><strong>Role:</strong> {roleDisplayMap[user.role]}</div>
                             {user.isModerator && (
                                <div className="bg-blue-600/20 text-blue-300 px-3 py-1 rounded-full text-sm font-semibold">Moderator</div>
                            )}
                            {user.badges?.includes('Site Founder') && (
                                <div className="bg-yellow-600/20 text-yellow-300 px-3 py-1 rounded-full text-sm font-semibold flex items-center gap-1.5">
                                    <FounderBadgeIcon className="w-4 h-4" />
                                    Site Founder
                                </div>
                            )}
                            {team && showTeam && (<div className="bg-black/30 px-3 py-1 rounded-full text-sm text-brand-text"><strong>Team:</strong> <Link to={`/teams/${team.id}`} className="font-semibold hover:underline">{team.name}</Link></div>)}
                            {user.isFreeAgent && (<div className="bg-yellow-600/20 text-yellow-300 px-3 py-1 rounded-full text-sm font-semibold">Free Agent</div>)}
                            {showPoints && (<div className="bg-black/30 px-3 py-1 rounded-full text-sm text-brand-text"><strong>UCL Points:</strong> <span className="text-brand-accent">{user.uclPoints.toLocaleString()}</span></div>)}
                        </div>
                        {isTimedOut && (
                             <div className="m-6 mt-0 p-3 bg-red-900/50 border border-red-500/50 rounded-lg text-red-300 text-sm">This user is currently timed out until {new Date(user.timeoutUntil!).toLocaleString()}.</div>
                        )}
                    </div>
                </div>
                
                <div className="max-w-5xl mx-auto py-10 px-4 sm:px-6 lg:px-8">
                    {isModeratorView && currentUser?.id !== user.id && (
                         <div className="mb-8 bg-brand-surface p-6 rounded-xl shadow-lg border border-brand-border/50">
                            <h2 className="text-xl font-semibold text-brand-accent mb-4 flex items-center gap-2">
                                <ShieldExclamationIcon />
                                Moderation Actions
                            </h2>
                            <div className="flex items-center gap-4">
                                <button
                                    onClick={() => setIsTimeoutModalOpen(true)}
                                    className="bg-yellow-600 hover:bg-yellow-500 text-black font-bold py-2 px-4 rounded-md transition-colors text-sm"
                                >
                                    Timeout User
                                </button>
                                <p className="text-sm text-brand-text-muted">Temporarily restrict posting and commenting.</p>
                            </div>
                         </div>
                    )}

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
            </div>
            <TimeoutUserModal 
                isOpen={isTimeoutModalOpen}
                onClose={() => setIsTimeoutModalOpen(false)}
                onConfirm={handleTimeout}
                user={user}
            />
        </>
    );
};