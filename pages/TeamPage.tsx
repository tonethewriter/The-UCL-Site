import React, { useRef } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { RoleBadge } from '../components/RoleBadge';
import { Application, User } from '../types';
import { PostForm } from '../components/PostForm';
import { PostCard } from '../components/PostCard';
import { fileToBase64 } from '../constants';

const RosterMember: React.FC<{ user: User }> = ({ user }) => (
    <Link to={`/users/${user.id}`} className="flex items-center gap-4 bg-black/20 p-3 rounded-lg hover:bg-black/40 transition-colors">
        <img src={user.profilePicture} alt={user.gamertag} className="w-12 h-12 rounded-full object-cover bg-brand-border" />
        <div>
            <p className="font-bold text-white">{user.gamertag}</p>
            <RoleBadge role={user.role} />
        </div>
    </Link>
);

const ApplicationManager: React.FC<{ application: Application }> = ({ application }) => {
    const { users, respondToApplication } = useAuth();
    const applicant = users.find(u => u.id === application.userId);

    if (!applicant) return null;

    return (
        <div className="flex items-center justify-between gap-4 bg-black/20 p-3 rounded-lg">
            <div className="flex items-center gap-3">
                 <img src={applicant.profilePicture} alt={applicant.gamertag} className="w-10 h-10 rounded-full object-cover bg-brand-border" />
                 <div>
                    <Link to={`/users/${applicant.id}`} className="font-semibold text-white hover:underline">{applicant.gamertag}</Link>
                    <p className="text-xs text-brand-text-muted">{applicant.uclPoints} UCL Points</p>
                 </div>
            </div>
             <div className="space-x-2">
                <button onClick={() => respondToApplication(application.id, 'accepted')} className="bg-green-600 hover:bg-green-500 text-white font-bold py-1 px-3 rounded-md text-sm transition-colors">Accept</button>
                <button onClick={() => respondToApplication(application.id, 'declined')} className="bg-red-600 hover:bg-red-500 text-white font-bold py-1 px-3 rounded-md text-sm transition-colors">Decline</button>
            </div>
        </div>
    )
}

export const TeamPage: React.FC = () => {
    const { teamId } = useParams<{ teamId: string }>();
    const { currentUser, teams, users, applications, posts, applyToTeam, updateTeamBanner } = useAuth();
    const bannerInputRef = useRef<HTMLInputElement>(null);

    const team = teams.find(t => t.id === teamId);
    const teamMembers = users.filter(u => u.teamId === teamId);
    const owner = users.find(u => u.id === team?.ownerId);
    const roster = teamMembers.filter(m => m.id !== owner?.id);

    const isOwner = currentUser?.id === owner?.id;
    const isPlusOwner = owner?.role === 'team_owner_plus';
    const isTeamMember = currentUser?.teamId === teamId;

    const canApply = currentUser && !currentUser.teamId && currentUser.isFreeAgent;
    const hasPendingApplication = applications.some(a => a.userId === currentUser?.id && a.teamId === teamId && a.status === 'pending');
    const teamApplications = applications.filter(a => a.teamId === teamId && a.status === 'pending');

    const privatePosts = posts.filter(p => p.privateTeamId === teamId).sort((a,b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());

    const handleApply = async () => {
        if (!team) return;
        try {
            await applyToTeam(team.id);
        } catch (err: any) {
            alert(err.message);
        }
    };
    
    const handleBannerFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file && team) {
            try {
                const base64 = await fileToBase64(file);
                await updateTeamBanner(team.id, base64);
            } catch (err: any) {
                alert(err.message);
            }
        }
    };

    if (!team || !owner) {
        return (
            <div className="text-center py-20">
                <h1 className="text-3xl font-bold text-brand-accent">Team Not Found</h1>
                <p className="text-brand-text-muted mt-2">Could not find a team with the specified ID.</p>
                <Link to="/teams" className="mt-6 inline-block bg-brand-interactive hover:bg-green-500 text-black font-bold py-2 px-6 rounded-lg transition-transform hover:scale-105">
                    Back to Teams
                </Link>
            </div>
        );
    }
    
    return (
        <div className="max-w-5xl mx-auto py-10 px-4 sm:px-6 lg:px-8">
            <div className="bg-brand-surface rounded-xl shadow-2xl border border-brand-border/50 overflow-hidden">
                <div className="h-48 bg-brand-border relative">
                     {team.bannerUrl ? (
                        <img src={team.bannerUrl} alt={`${team.name}'s banner`} className="w-full h-full object-cover" />
                    ) : (
                        <div className="w-full h-full bg-gradient-to-r from-brand-surface to-brand-border"></div>
                    )}
                </div>
                <div className="p-8">
                    <div className="flex flex-col md:flex-row items-center md:items-start md:space-x-8 -mt-24">
                        <div className="flex-shrink-0 mb-6 md:mb-0 text-center">
                            <img src={team.logoUrl} alt={`${team.name} Logo`} className="w-40 h-40 rounded-full object-cover ring-4 ring-brand-surface bg-brand-border" />
                             <div className="mt-4 space-x-2">
                                {isOwner && (
                                <button className="text-xs bg-brand-interactive/50 hover:bg-brand-interactive text-white font-semibold py-1 px-3 rounded-md transition-colors">
                                    Edit Info
                                </button>
                                )}
                                {isOwner && owner.role === 'team_owner_plus' && (
                                <>
                                    <input
                                        type="file"
                                        ref={bannerInputRef}
                                        onChange={handleBannerFileChange}
                                        className="hidden"
                                        accept="image/png, image/jpeg, image/gif"
                                    />
                                    <button onClick={() => bannerInputRef.current?.click()} className="text-xs bg-brand-accent/80 hover:bg-brand-accent text-black font-semibold py-1 px-3 rounded-md transition-colors">
                                        Edit Banner
                                    </button>
                                </>
                                )}
                             </div>
                        </div>
                        
                        <div className="flex-grow text-center md:text-left pt-16 md:pt-4">
                            <h1 className="text-5xl font-bold text-white break-words">{team.name}</h1>
                            <p className="text-brand-text-muted mt-2 text-lg">{team.description}</p>

                            {canApply && (
                                <div className="mt-6">
                                    <button
                                        onClick={handleApply}
                                        disabled={hasPendingApplication}
                                        className="bg-brand-interactive hover:bg-green-500 text-black font-bold py-2 px-6 rounded-lg transition-transform hover:scale-105 disabled:bg-brand-border disabled:text-brand-text-muted disabled:cursor-not-allowed"
                                    >
                                        {hasPendingApplication ? 'Application Pending' : 'Apply to Join'}
                                    </button>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>

            {isPlusOwner && isTeamMember && (
                <div className="mt-8 bg-brand-surface p-6 rounded-xl shadow-lg border-2 border-dashed border-brand-accent/50">
                    <h2 className="text-3xl font-semibold text-brand-accent mb-4">⭐ Private Team Wall</h2>
                    <PostForm privateTeamId={team.id} />
                    <div className="space-y-4">
                        {privatePosts.map(post => {
                            const author = users.find(u => u.id === post.authorId);
                            return <PostCard key={post.id} post={post} author={author} />
                        })}
                        {privatePosts.length === 0 && (
                            <p className="text-center text-brand-text-muted py-4">No private posts yet. Be the first to post an announcement!</p>
                        )}
                    </div>
                </div>
            )}

            <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-8">
                <div className="md:col-span-2 bg-brand-surface p-6 rounded-xl shadow-lg border border-brand-border/50">
                    <h2 className="text-2xl font-semibold text-white mb-4">Roster</h2>
                    <div className="space-y-3">
                        <RosterMember user={owner} />
                        {roster.map(member => <RosterMember key={member.id} user={member} />)}
                    </div>
                </div>

                <div className="md:col-span-1">
                    {isOwner && teamApplications.length > 0 && (
                        <div className="bg-brand-surface p-6 rounded-xl shadow-lg border border-brand-border/50">
                            <h2 className="text-2xl font-semibold text-white mb-4">Applications</h2>
                            <div className="space-y-3">
                                {teamApplications.map(app => <ApplicationManager key={app.id} application={app} />)}
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};