import React from 'react';
import { useParams, Link } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { RoleBadge } from '../components/RoleBadge';
import { Application, User } from '../types';

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
    const { currentUser, teams, users, applications, applyToTeam } = useAuth();

    const team = teams.find(t => t.id === teamId);
    const teamMembers = users.filter(u => u.teamId === teamId);
    const owner = users.find(u => u.id === team?.ownerId);
    const roster = teamMembers.filter(m => m.id !== owner?.id);

    const isOwner = currentUser?.id === owner?.id;
    const canApply = currentUser && !currentUser.teamId && currentUser.isFreeAgent;
    const hasPendingApplication = applications.some(a => a.userId === currentUser?.id && a.teamId === teamId && a.status === 'pending');
    const teamApplications = applications.filter(a => a.teamId === teamId && a.status === 'pending');

    const handleApply = async () => {
        if (!team) return;
        try {
            await applyToTeam(team.id);
        } catch (err: any) {
            alert(err.message);
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
            <div className="bg-brand-surface p-8 rounded-xl shadow-2xl border border-brand-border/50">
                <div className="flex flex-col md:flex-row items-center md:items-start md:space-x-8">
                    <div className="flex-shrink-0 mb-6 md:mb-0 text-center">
                        <img src={team.logoUrl} alt={`${team.name} Logo`} className="w-40 h-40 rounded-full object-cover ring-4 ring-brand-accent/50 bg-brand-border" />
                        {isOwner && (
                            <button className="mt-4 text-xs bg-brand-interactive/50 hover:bg-brand-interactive text-white font-semibold py-1 px-3 rounded-md transition-colors">
                                Edit Team Info
                            </button>
                        )}
                    </div>
                    
                    <div className="flex-grow text-center md:text-left">
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