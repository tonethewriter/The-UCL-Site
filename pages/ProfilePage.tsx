import React, { useState } from 'react';
import { useAuth } from '../hooks/useAuth';
import { Navigate, Link } from 'react-router-dom';
import { ConfirmationModal } from '../components/ConfirmationModal';
import { Invite, Application } from '../types';
import { EnvelopeIcon } from '../constants';


const roleDisplayMap = {
    player: 'Player',
    player_plus: 'Player Plus ⭐',
    team_owner: 'Team Owner',
    co_owner: 'Co-Owner',
    team_owner_plus: 'Team Owner Plus ⭐',
    admin: 'Administrator'
};

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


export const ProfilePage: React.FC = () => {
    const { currentUser, teams, invites, applications, leaveTeam, toggleFreeAgentStatus, updateUserProfile } = useAuth();
    
    const [gamertag, setGamertag] = useState(currentUser?.gamertag || '');
    const [email, setEmail] = useState(currentUser?.email || '');
    const [twitter, setTwitter] = useState(currentUser?.twitter || '');
    const [twitch, setTwitch] = useState(currentUser?.twitch || '');
    const [youtube, setYoutube] = useState(currentUser?.youtube || '');

    const [isLeaveModalOpen, setIsLeaveModalOpen] = useState(false);
    const [isFAModalOpen, setIsFAModalOpen] = useState(false);
    const [isUpdating, setIsUpdating] = useState(false);
    const [updateMessage, setUpdateMessage] = useState('');
    const [updateStatus, setUpdateStatus] = useState<'success' | 'error' | ''>('');

    if (!currentUser) {
        return <Navigate to="/login" replace />;
    }
    
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
    
    const canLeaveTeam = currentUser.role === 'player' || currentUser.role === 'player_plus';

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
                            <button className="mt-4 text-xs bg-brand-interactive/50 hover:bg-brand-interactive text-white font-semibold py-1 px-3 rounded-md transition-colors">
                                Change Picture
                            </button>
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