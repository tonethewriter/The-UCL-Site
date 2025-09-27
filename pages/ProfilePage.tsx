import React, { useState, useMemo, useRef } from 'react';
import { useAuth } from '../hooks/useAuth';
import { Navigate, Link } from 'react-router-dom';
import { ConfirmationModal } from '../components/ConfirmationModal';
import { Invite, Application, ProfileVisibility } from '../types';
import { EnvelopeIcon, TrashIcon } from '../constants';
import { PostCard } from '../components/PostCard';
import { fileToBase64 } from '../constants';


const roleDisplayMap = {
    player: 'Player',
    player_plus: 'Player Plus ⭐',
    team_owner: 'Team Owner',
    co_owner: 'Co-Owner',
    team_owner_plus: 'Team Owner Plus ⭐',
    admin: 'Administrator'
};

const StatCard: React.FC<{ label: string; value: string | number; icon?: React.ReactNode }> = ({ label, value, icon }) => (
    <div className="bg-black/30 p-4 rounded-lg text-center">
        <div className="flex items-center justify-center gap-2 text-brand-text-muted">
            {icon}
            <p className="text-sm">{label}</p>
        </div>
        <p className="text-3xl font-bold text-white mt-1">{value}</p>
    </div>
);


const InviteCard: React.FC<{ invite: Invite }> = ({ invite }) => {
    const { teams, respondToInvite } = useAuth();
    const team = teams.find(t => t.id === invite.teamId);

    if (!team) return null;

    return (
        <div className="bg-black/30 p-4 rounded-lg flex items-center justify-between">
            <div>
                <p className="text-sm text-brand-text-muted">Invite from</p>
                <Link to={`/teams/${team.id}`} className="font-semibold text-white hover:underline">{team.name}</Link>
            </div>
            <div className="space-x-2">
                <button onClick={() => respondToInvite(invite.id, 'accepted')} className="bg-green-600 hover:bg-green-500 text-white font-bold py-1 px-3 rounded-md text-sm transition-colors">Accept</button>
                <button onClick={() => respondToInvite(invite.id, 'declined')} className="bg-red-600 hover:bg-red-500 text-white font-bold py-1 px-3 rounded-md text-sm transition-colors">Decline</button>
            </div>
        </div>
    );
};

const ApplicationCard: React.FC<{ application: Application }> = ({ application }) => {
    const { teams } = useAuth();
    const team = teams.find(t => t.id === application.teamId);
    if (!team) return null;

    const statusClasses = {
        pending: 'text-yellow-400 bg-yellow-500/10',
        accepted: 'text-green-400 bg-green-500/10',
        declined: 'text-red-400 bg-red-500/10',
    };

    return (
        <div className="bg-black/30 p-4 rounded-lg flex items-center justify-between">
            <div>
                <p className="text-sm text-brand-text-muted">Application to</p>
                <Link to={`/teams/${team.id}`} className="font-semibold text-white hover:underline">{team.name}</Link>
            </div>
            <span className={`px-2 py-1 rounded-full text-xs font-semibold ${statusClasses[application.status]}`}>{application.status}</span>
        </div>
    );
};

const SettingsToggle: React.FC<{ label: string; description: string; isChecked: boolean; onChange: (isChecked: boolean) => void; }> = ({ label, description, isChecked, onChange }) => {
  return (
    <div className="flex items-center justify-between py-4">
      <div className="flex-1 pr-4">
        <h3 className="text-white font-semibold">{label}</h3>
        <p className="text-sm text-brand-text-muted">{description}</p>
      </div>
        <button
          type="button"
          className={`relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-brand-accent focus:ring-offset-2 focus:ring-offset-brand-surface ${
            isChecked ? 'bg-brand-interactive' : 'bg-brand-border'
          }`}
          onClick={() => onChange(!isChecked)}
        >
          <span
            className={`inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out ${
              isChecked ? 'translate-x-5' : 'translate-x-0'
            }`}
          />
        </button>
    </div>
  );
};


export const ProfilePage: React.FC = () => {
    const { currentUser, teams, posts, quests, invites, applications, customEmojis, leaveTeam, toggleFreeAgentStatus, updateUserProfile, updateProfileBanner, addCustomEmoji, deleteCustomEmoji, updateProfileVisibility, updateProfilePicture } = useAuth();
    const profilePicInputRef = useRef<HTMLInputElement>(null);
    const bannerInputRef = useRef<HTMLInputElement>(null);
    
    const [gamertag, setGamertag] = useState(currentUser?.gamertag || '');
    const [email, setEmail] = useState(currentUser?.email || '');
    const [twitter, setTwitter] = useState(currentUser?.twitter || '');
    const [twitch, setTwitch] = useState(currentUser?.twitch || '');
    const [youtube, setYoutube] = useState(currentUser?.youtube || '');
    const [bannerUrl, setBannerUrl] = useState(currentUser?.profileBanner || '');

    const [isLeaveModalOpen, setIsLeaveModalOpen] = useState(false);
    const [isFAModalOpen, setIsFAModalOpen] = useState(false);
    const [isUpdating, setIsUpdating] = useState(false);
    const [updateMessage, setUpdateMessage] = useState('');
    const [updateStatus, setUpdateStatus] = useState<'success' | 'error' | ''>('');

    if (!currentUser) {
        return <Navigate to="/login" replace />;
    }
    
    const isPlusMember = currentUser.role.includes('_plus') || currentUser.role === 'admin';
    const team = teams.find(t => t.id === currentUser.teamId);
    const myInvites = invites.filter(i => i.userId === currentUser.id && i.status === 'pending');
    const myApplications = applications.filter(a => a.userId === currentUser.id);

    const handleUpdate = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsUpdating(true);
        setUpdateMessage('');
        setUpdateStatus('');
        try {
            await updateUserProfile({
                gamertag,
                email,
                twitter: twitter.trim() ? twitter : undefined,
                twitch: twitch.trim() ? twitch : undefined,
                youtube: youtube.trim() ? youtube : undefined,
            });
             if (isPlusMember && bannerUrl !== currentUser.profileBanner) {
                await updateProfileBanner(bannerUrl.trim());
            }
            setUpdateMessage('Profile updated successfully!');
            setUpdateStatus('success');
        } catch (err: any) {
            setUpdateMessage(err.message);
            setUpdateStatus('error');
        } finally {
            setIsUpdating(false);
            setTimeout(() => {
                setUpdateMessage('');
                setUpdateStatus('');
            }, 4000);
        }
    };
    
    const handleLeaveTeam = async () => {
        try {
            await leaveTeam();
        } catch(error: any) {
            alert(error.message);
        }
    }
    
    const handleToggleFreeAgent = async () => {
        try {
            await toggleFreeAgentStatus();
        } catch(error: any) {
            alert(error.message);
        } finally {
            setIsFAModalOpen(false);
        }
    };

    const handleFABtnClick = () => {
        if (currentUser.teamId && !currentUser.isFreeAgent) {
            setIsFAModalOpen(true);
        } else {
            handleToggleFreeAgent();
        }
    };

    const handleChangePicture = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            try {
                const base64 = await fileToBase64(file);
                await updateProfilePicture(base64);
            } catch (err: any) {
                alert(err.message);
            }
        }
    };

    const handleBannerFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            try {
                const base64 = await fileToBase64(file);
                setBannerUrl(base64);
            } catch (err) {
                console.error("Failed to read banner file", err);
            }
        }
    };
    
    const canLeaveTeam = currentUser.role === 'player' || currentUser.role === 'player_plus';

    // --- Plus Feature Components ---
    
    const StatsDashboard = () => {
        const stats = useMemo(() => {
            const myPosts = posts.filter(p => p.authorId === currentUser.id);
            const totalReactionsReceived = myPosts.reduce((sum, post) => sum + post.reactions.reduce((s, r) => s + r.users.length, 0), 0);
            const completedQuests = quests.filter(q => q.claimedBy.includes(currentUser.id));
            const pointsFromQuests = completedQuests.reduce((sum, q) => sum + (parseInt(q.prize.split(' ')[0]) || 0), 0);
            const topPosts = [...myPosts].sort((a, b) => {
                const reactionsA = a.reactions.reduce((sum, r) => sum + r.users.length, 0);
                const reactionsB = b.reactions.reduce((sum, r) => sum + r.users.length, 0);
                return reactionsB - reactionsA;
            }).slice(0, 3);
            const totalCommentsMade = posts.reduce((sum, post) => sum + post.comments.filter(c => c.authorId === currentUser.id).length, 0);

            return {
                totalPosts: myPosts.length,
                totalReactionsReceived,
                completedQuestsCount: completedQuests.length,
                pointsFromQuests,
                totalCommentsMade,
                topPosts
            };
        }, [currentUser, posts, quests]);

        if (!stats) return null;

        return (
            <div className="bg-brand-surface p-6 rounded-xl shadow-lg border border-brand-border/50">
                <h2 className="text-2xl font-semibold text-brand-accent mb-4">⭐ Advanced Stats Dashboard</h2>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mb-6">
                    <StatCard label="Total Posts" value={stats.totalPosts} />
                    <StatCard label="Comments Made" value={stats.totalCommentsMade} />
                    <StatCard label="Reactions Received" value={stats.totalReactionsReceived} />
                    <StatCard label="Quests Completed" value={stats.completedQuestsCount} />
                    <StatCard label="Points from Quests" value={stats.pointsFromQuests.toLocaleString()} />
                </div>
                <div>
                    <h3 className="text-lg font-semibold text-white mb-3">Your Top Posts</h3>
                    <div className="space-y-4">
                        {stats.topPosts.length > 0 ? stats.topPosts.map(post => (
                           <div key={post.id} className="bg-black/20 p-3 rounded-md">
                               <p className="text-sm text-brand-text truncate">{post.content}</p>
                               <p className="text-xs text-brand-text-muted">{post.reactions.reduce((s,r) => s + r.users.length, 0)} reactions</p>
                           </div>
                        )) : <p className="text-sm text-brand-text-muted">No posts with reactions yet.</p>}
                    </div>
                </div>
            </div>
        );
    };

    const CustomEmojiManager = () => {
        const myEmojis = customEmojis.filter(e => e.uploaderId === currentUser.id);
        const [emojiName, setEmojiName] = useState('');
        const [emojiUrl, setEmojiUrl] = useState(''); // This will now hold the data URL
        const [emojiError, setEmojiError] = useState('');
        const emojiFileInputRef = useRef<HTMLInputElement>(null);

        const handleEmojiFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
            const file = e.target.files?.[0];
            if (file) {
                if (file.size > 128 * 1024) { // 128KB limit for emojis
                    setEmojiError('Emoji image must be smaller than 128KB.');
                    return;
                }
                const base64 = await fileToBase64(file);
                setEmojiUrl(base64);
                setEmojiError('');
            }
        };

        const handleAddEmoji = async (e: React.FormEvent) => {
            e.preventDefault();
            setEmojiError('');
            if (!emojiUrl) {
                setEmojiError('Please upload an emoji image.');
                return;
            }
            try {
                await addCustomEmoji(emojiName, emojiUrl);
                setEmojiName('');
                setEmojiUrl('');
                if (emojiFileInputRef.current) emojiFileInputRef.current.value = '';
            } catch (err: any) {
                setEmojiError(err.message);
            }
        };

        const handleDeleteEmoji = async (id: string) => {
            if (window.confirm("Are you sure you want to delete this emoji?")) {
                try {
                    await deleteCustomEmoji(id);
                } catch (err: any) {
                    alert(err.message);
                }
            }
        };

        return (
            <div className="bg-brand-surface p-6 rounded-xl shadow-lg border border-brand-border/50">
                <h2 className="text-2xl font-semibold text-brand-accent mb-4">⭐ Custom Emoji Management</h2>
                <p className="text-sm text-brand-text-muted mb-4">Upload custom emojis (max 128KB) for everyone to use. You can upload up to 3.</p>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mb-6">
                    {myEmojis.map(emoji => (
                        <div key={emoji.id} className="bg-black/30 p-2 rounded-lg text-center relative group">
                            <img src={emoji.imageUrl} alt={emoji.name} className="w-12 h-12 mx-auto" />
                            <p className="text-xs text-white mt-1 truncate">{emoji.name}</p>
                             <button onClick={() => handleDeleteEmoji(emoji.id)} className="absolute top-1 right-1 bg-red-600/80 hover:bg-red-500 rounded-full p-0.5 opacity-0 group-hover:opacity-100 transition-opacity">
                                <TrashIcon className="w-3 h-3 text-white" />
                            </button>
                        </div>
                    ))}
                     {emojiUrl && myEmojis.length < 3 && (
                        <div className="bg-black/30 p-2 rounded-lg text-center relative border border-dashed border-brand-accent">
                            <img src={emojiUrl} alt="New Emoji Preview" className="w-12 h-12 mx-auto" />
                            <p className="text-xs text-brand-accent mt-1 truncate">{emojiName || 'preview'}</p>
                        </div>
                    )}
                </div>
                {myEmojis.length < 3 ? (
                    <form onSubmit={handleAddEmoji} className="space-y-3 pt-4 border-t border-brand-border/50">
                        <h3 className="text-lg font-semibold text-white">Add New Emoji ({myEmojis.length}/3)</h3>
                        {emojiError && <p className="text-sm text-red-400 bg-red-500/10 p-2 rounded-md">{emojiError}</p>}
                        <input type="file" ref={emojiFileInputRef} onChange={handleEmojiFileChange} className="hidden" accept="image/png, image/gif" />
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                            <input type="text" placeholder=":emoji_name:" value={emojiName} onChange={e => setEmojiName(e.target.value)} className="bg-black/30 text-white border border-brand-border rounded-lg p-2 focus:outline-none focus:ring-1 focus:ring-brand-accent transition text-sm" required />
                            <button
                                type="button"
                                onClick={() => emojiFileInputRef.current?.click()}
                                className="w-full bg-black/30 text-white border border-brand-border rounded-lg p-2 focus:outline-none focus:ring-1 focus:ring-brand-accent transition text-sm truncate"
                            >
                                {emojiUrl ? 'Image Selected' : 'Upload Image'}
                            </button>
                        </div>
                        <div className="text-right">
                            <button type="submit" className="bg-brand-interactive hover:bg-green-500 text-black font-bold py-1 px-4 rounded-md text-sm transition-colors">Add Emoji</button>
                        </div>
                    </form>
                ) : (
                    <p className="text-center text-yellow-400 bg-yellow-500/10 p-3 rounded-lg text-sm">You have reached your emoji upload limit.</p>
                )}
            </div>
        );
    };

    const ProfileVisibilityManager = () => {
        const [visibility, setVisibility] = useState<ProfileVisibility>(
            currentUser.profileVisibility || { showTeam: true, showSocials: true, showPoints: true, showPinnedPost: true }
        );

        const handleVisibilityChange = (key: keyof ProfileVisibility, value: boolean) => {
            const newVisibility = { ...visibility, [key]: value };
            setVisibility(newVisibility);
            updateProfileVisibility(newVisibility);
        };

        return (
            <div className="bg-brand-surface p-6 rounded-xl shadow-lg border border-brand-border/50">
                <h2 className="text-2xl font-semibold text-brand-accent mb-2 border-b border-brand-border/50 pb-4">⭐ Profile Visibility</h2>
                <p className="text-sm text-brand-text-muted my-4">Choose what information is visible to others on your public profile page.</p>
                <div className="divide-y divide-brand-border/50">
                    <SettingsToggle 
                        label="Show My Team"
                        description="Display your current team affiliation."
                        isChecked={visibility.showTeam}
                        onChange={(val) => handleVisibilityChange('showTeam', val)}
                    />
                     <SettingsToggle 
                        label="Show Social Links"
                        description="Display your Twitter, Twitch, and YouTube links."
                        isChecked={visibility.showSocials}
                        onChange={(val) => handleVisibilityChange('showSocials', val)}
                    />
                    <SettingsToggle 
                        label="Show UCL Points"
                        description="Display your total UCL points."
                        isChecked={visibility.showPoints}
                        onChange={(val) => handleVisibilityChange('showPoints', val)}
                    />
                    <SettingsToggle 
                        label="Show Pinned Post"
                        description="Display your pinned post at the top of your profile."
                        isChecked={visibility.showPinnedPost}
                        onChange={(val) => handleVisibilityChange('showPinnedPost', val)}
                    />
                </div>
            </div>
        )
    };

    return (
        <>
            <div className="max-w-7xl mx-auto py-10 px-4 sm:px-6 lg:px-8">
                <h1 className="text-4xl font-bold text-brand-accent mb-8">Your Profile</h1>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    <div className="lg:col-span-1">
                        <div className="bg-brand-surface p-6 rounded-xl shadow-lg border border-brand-border/50 text-center">
                            {currentUser.profilePicture ? (
                                <img src={currentUser.profilePicture} alt={currentUser.gamertag} className="w-32 h-32 rounded-full object-cover ring-4 ring-brand-accent/50 bg-brand-border mx-auto" />
                            ) : (
                                <div className="w-32 h-32 rounded-full bg-brand-accent flex items-center justify-center font-bold text-black text-6xl ring-4 ring-brand-accent/50 mx-auto">
                                    {currentUser.gamertag.charAt(0).toUpperCase()}
                                </div>
                            )}
                             <input
                                type="file"
                                ref={profilePicInputRef}
                                onChange={handleChangePicture}
                                className="hidden"
                                accept="image/png, image/jpeg, image/gif"
                            />
                            <button onClick={() => profilePicInputRef.current?.click()} className="mt-4 text-xs bg-brand-interactive/50 hover:bg-brand-interactive text-white font-semibold py-1 px-3 rounded-md transition-colors">
                                Upload Picture
                            </button>
                             {isPlusMember && <p className="text-xs text-brand-accent/80 mt-2">Animated GIFs are supported!</p>}
                            <div className="mt-6 text-left space-y-3">
                                <div className="bg-black/30 px-3 py-2 rounded-md text-sm">
                                    <strong className="block text-brand-text-muted text-xs">Role</strong>
                                    <span className="text-white">{roleDisplayMap[currentUser.role]}</span>
                                </div>
                                {team && (
                                    <div className="bg-black/30 px-3 py-2 rounded-md text-sm">
                                        <strong className="block text-brand-text-muted text-xs">Team</strong>
                                        <div className="flex justify-between items-center">
                                            <Link to={`/teams/${team.id}`} className="text-white font-semibold hover:underline">{team.name}</Link>
                                            {canLeaveTeam && (
                                                <button onClick={() => setIsLeaveModalOpen(true)} className="text-xs text-red-400 hover:underline">Leave</button>
                                            )}
                                        </div>
                                    </div>
                                )}
                                <div className="bg-black/30 px-3 py-2 rounded-md text-sm">
                                    <strong className="block text-brand-text-muted text-xs">UCL Points</strong>
                                    <span className="text-brand-accent font-bold">{currentUser.uclPoints.toLocaleString()}</span>
                                </div>
                            </div>
                             <div className="mt-6">
                                {currentUser.isFreeAgent ? (
                                    <button onClick={handleToggleFreeAgent} className="w-full text-center bg-yellow-600 hover:bg-yellow-700 text-white font-bold py-2 px-4 rounded-md transition-colors">
                                        Remove Free Agent Status
                                    </button>
                                ) : (
                                    <button onClick={handleFABtnClick} className="w-full text-center bg-brand-interactive hover:bg-green-500 text-black font-bold py-2 px-4 rounded-md transition-colors">
                                        Become a Free Agent
                                    </button>
                                )}
                             </div>
                        </div>
                    </div>

                    <div className="lg:col-span-2 space-y-8">
                        <div className="bg-brand-surface p-8 rounded-xl shadow-lg border border-brand-border/50">
                            <div className="flex justify-between items-center mb-6">
                                <h2 className="text-2xl font-semibold text-white">Account Details</h2>
                            </div>
                            <form onSubmit={handleUpdate} className="space-y-6">
                                {isPlusMember && (
                                     <div className="border-b border-brand-border/50 pb-6">
                                        <h3 className="text-lg font-semibold text-brand-accent">Profile Banner (Plus Feature)</h3>
                                        <div>
                                            <label className="text-sm font-bold text-brand-text-muted block mt-4 mb-2" htmlFor="bannerUrl">Banner Image</label>
                                             <p className="text-xs text-brand-accent/80 mb-2">Animated GIFs are supported!</p>
                                             <input
                                                type="file"
                                                ref={bannerInputRef}
                                                onChange={handleBannerFileChange}
                                                className="hidden"
                                                accept="image/png, image/jpeg, image/gif"
                                            />
                                            <div className="flex items-center gap-4">
                                                {bannerUrl && <img src={bannerUrl} alt="Banner preview" className="w-24 h-14 rounded object-cover bg-brand-border" />}
                                                <button type="button" onClick={() => bannerInputRef.current?.click()} className="bg-brand-border hover:bg-brand-interactive/50 text-white font-bold py-2 px-4 rounded-md transition-colors">
                                                    {bannerUrl ? 'Change Banner' : 'Upload Banner'}
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                )}
                                <div>
                                    <label className="text-sm font-bold text-brand-text-muted block mb-2" htmlFor="gamertag">Gamertag</label>
                                    <input type="text" id="gamertag" value={gamertag} onChange={(e) => setGamertag(e.target.value)} className="w-full bg-black/30 text-white border border-brand-border rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-brand-accent transition" />
                                </div>
                                <div>
                                    <label className="text-sm font-bold text-brand-text-muted block mb-2" htmlFor="email">Email</label>
                                    <input type="email" id="email" value={email} onChange={(e) => setEmail(e.target.value)} className="w-full bg-black/30 text-white border border-brand-border rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-brand-accent transition" />
                                </div>
                                <div className="border-t border-brand-border/50 pt-6">
                                    <h3 className="text-lg font-semibold text-white mb-4">Social Links</h3>
                                    <div className="space-y-4">
                                        <div>
                                            <label className="text-sm font-bold text-brand-text-muted block mb-2" htmlFor="twitter">Twitter URL</label>
                                            <input type="url" id="twitter" value={twitter} onChange={(e) => setTwitter(e.target.value)} placeholder="https://twitter.com/yourhandle" className="w-full bg-black/30 text-white border border-brand-border rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-brand-accent transition" />
                                        </div>
                                        <div>
                                            <label className="text-sm font-bold text-brand-text-muted block mb-2" htmlFor="twitch">Twitch URL</label>
                                            <input type="url" id="twitch" value={twitch} onChange={(e) => setTwitch(e.target.value)} placeholder="https://twitch.tv/yourchannel" className="w-full bg-black/30 text-white border border-brand-border rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-brand-accent transition" />
                                        </div>
                                        <div>
                                            <label className="text-sm font-bold text-brand-text-muted block mb-2" htmlFor="youtube">YouTube URL</label>
                                            <input type="url" id="youtube" value={youtube} onChange={(e) => setYoutube(e.target.value)} placeholder="https://youtube.com/yourchannel" className="w-full bg-black/30 text-white border border-brand-border rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-brand-accent transition" />
                                        </div>
                                    </div>
                                </div>

                                <div className="pt-2">
                                    <button type="submit" disabled={isUpdating} className="w-full bg-brand-interactive hover:bg-green-500 text-black font-bold py-3 px-4 rounded-lg transition-all hover:scale-105 disabled:bg-brand-border disabled:cursor-not-allowed">
                                        {isUpdating ? 'Saving...' : 'Update Profile'}
                                    </button>
                                    {updateMessage && (
                                        <p className={`text-center text-sm mt-4 p-2 rounded-md ${updateStatus === 'success' ? 'bg-green-500/20 text-green-400' : 'bg-red-500/20 text-red-400'}`}>
                                            {updateMessage}
                                        </p>
                                    )}
                                </div>
                            </form>
                        </div>
                        
                        {isPlusMember && <ProfileVisibilityManager />}
                        {isPlusMember && <StatsDashboard />}
                        {isPlusMember && <CustomEmojiManager />}

                        {(myInvites.length > 0 || myApplications.length > 0) && (
                            <div className="bg-brand-surface p-6 rounded-xl shadow-lg border border-brand-border/50">
                                <h2 className="text-2xl font-semibold text-white mb-4 flex items-center gap-2">
                                    <EnvelopeIcon />
                                    My Invites & Applications
                                </h2>
                                <div className="space-y-3">
                                    {myInvites.map(invite => <InviteCard key={invite.id} invite={invite} />)}
                                    {myApplications.map(app => <ApplicationCard key={app.id} application={app} />)}
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </div>
            <ConfirmationModal 
                isOpen={isLeaveModalOpen}
                onClose={() => setIsLeaveModalOpen(false)}
                onConfirm={handleLeaveTeam}
                title="Leave Team"
                message={`Are you sure you want to leave ${team?.name}? You will lose access to the team chat and other team features.`}
                confirmText="Yes, Leave"
            />
            <ConfirmationModal 
                isOpen={isFAModalOpen}
                onClose={() => setIsFAModalOpen(false)}
                onConfirm={handleToggleFreeAgent}
                title="Become a Free Agent"
                message={`This will remove you from your current team (${team?.name}). Are you sure you want to become a free agent?`}
                confirmText="Yes, Leave & List Me"
                confirmButtonClass="bg-yellow-600 hover:bg-yellow-700"
            />
        </>
    );
};