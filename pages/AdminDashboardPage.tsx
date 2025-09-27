import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { User, Quest, UserRole, Team, Post } from '../types';
import { ConfirmationModal } from '../components/ConfirmationModal';
import { QuestEditorModal } from '../components/QuestEditorModal';
import { RoleEditorModal } from '../components/RoleEditorModal';
import { PointsEditorModal } from '../components/PointsEditorModal';
import { TeamEditorModal } from '../components/TeamEditorModal';
import { OwnerTransferModal } from '../components/OwnerTransferModal';
import { MassCommunicationModal } from '../components/MassEmailModal';
import { PencilIcon, TrashIcon, CoinIcon, SwitchHorizontalIcon, UserGroupIcon, EnvelopeIcon } from '../constants';

const StatCard: React.FC<{ title: string; value: string | number; linkTo?: string }> = ({ title, value, linkTo }) => {
    const content = (
        <div className="bg-brand-surface p-6 rounded-lg border border-brand-border hover:border-brand-accent/50 transition-colors h-full">
            <h3 className="text-sm font-medium text-brand-text-muted">{title}</h3>
            <p className="mt-1 text-3xl font-semibold text-white">{value}</p>
        </div>
    );

    if (linkTo) {
        return <Link to={linkTo} className="block h-full">{content}</Link>;
    }
    return content;
};

const UserRow: React.FC<{ user: User; onEditRole: (user: User) => void; onDeleteUser: (userId: string) => void; onEditPoints: (user: User) => void; isCurrentUser: boolean; }> = ({ user, onEditRole, onDeleteUser, onEditPoints, isCurrentUser }) => (
    <tr className="border-b border-brand-border hover:bg-brand-surface/40">
        <td className="p-4 whitespace-nowrap text-sm font-medium text-white">{user.gamertag}</td>
        <td className="p-4 whitespace-nowrap text-sm text-brand-text-muted">{user.email}</td>
        <td className="p-4 whitespace-nowrap text-sm text-brand-text-muted capitalize">{user.role.replace(/_/g, ' ')}</td>
        <td className="p-4 whitespace-nowrap text-sm text-brand-accent">{user.uclPoints.toLocaleString()}</td>
        <td className="p-4 whitespace-nowrap text-sm text-right space-x-2">
            <button onClick={() => onEditPoints(user)} className="text-yellow-400 hover:text-yellow-300 p-1 rounded-md hover:bg-yellow-500/20 transition-colors" aria-label={`Edit points for ${user.gamertag}`}>
                <CoinIcon />
            </button>
            <button onClick={() => onEditRole(user)} className="text-blue-400 hover:text-blue-300 p-1 rounded-md hover:bg-blue-500/20 transition-colors" aria-label={`Edit role for ${user.gamertag}`}>
                <PencilIcon />
            </button>
            {!isCurrentUser && (
                 <button onClick={() => onDeleteUser(user.id)} className="text-red-400 hover:text-red-300 p-1 rounded-md hover:bg-red-500/20 transition-colors" aria-label={`Delete user ${user.gamertag}`}>
                    <TrashIcon />
                </button>
            )}
        </td>
    </tr>
);

const timeAgo = (dateString: string): string => {
    const date = new Date(dateString);
    const seconds = Math.floor((new Date().getTime() - date.getTime()) / 1000);
    let interval = seconds / 31536000;
    if (interval > 1) return Math.floor(interval) + "y ago";
    interval = seconds / 2592000;
    if (interval > 1) return Math.floor(interval) + "mo ago";
    interval = seconds / 86400;
    if (interval > 1) return Math.floor(interval) + "d ago";
    interval = seconds / 3600;
    if (interval > 1) return Math.floor(interval) + "h ago";
    interval = seconds / 60;
    if (interval > 1) return Math.floor(interval) + "m ago";
    return "just now";
};

export const AdminDashboardPage: React.FC = () => {
    const { currentUser, users, posts, quests, teams, activityLog, feedback, addQuest, updateQuest, deleteQuest, updateUserRole, deleteUser, deletePost, adjustUserPoints, editTeamDetails, transferTeamOwnership, disbandTeam, toggleModeratorStatus, sendMassCommunication } = useAuth();
    
    // Quest state
    const [isQuestModalOpen, setIsQuestModalOpen] = useState(false);
    const [editingQuest, setEditingQuest] = useState<Quest | null>(null);
    const [isDeleteQuestConfirmOpen, setIsDeleteQuestConfirmOpen] = useState(false);
    const [deletingQuestId, setDeletingQuestId] = useState<string | null>(null);

    // User state
    const [isRoleModalOpen, setIsRoleModalOpen] = useState(false);
    const [isPointsModalOpen, setIsPointsModalOpen] = useState(false);
    const [editingUser, setEditingUser] = useState<User | null>(null);
    const [isDeleteUserConfirmOpen, setIsDeleteUserConfirmOpen] = useState(false);
    const [deletingUserId, setDeletingUserId] = useState<string | null>(null);

    // Team state
    const [isTeamEditorOpen, setIsTeamEditorOpen] = useState(false);
    const [isOwnerTransferOpen, setIsOwnerTransferOpen] = useState(false);
    const [isDisbandConfirmOpen, setIsDisbandConfirmOpen] = useState(false);
    const [editingTeam, setEditingTeam] = useState<Team | null>(null);
    const [disbandingTeamId, setDisbandingTeamId] = useState<string | null>(null);

    // Post state
    const [isDeletePostConfirmOpen, setIsDeletePostConfirmOpen] = useState(false);
    const [deletingPostId, setDeletingPostId] = useState<string | null>(null);
    
    // Communication state
    const [isMassCommunicationModalOpen, setIsMassCommunicationModalOpen] = useState(false);

    // Quest handlers
    const handleOpenCreateQuestModal = () => { setEditingQuest(null); setIsQuestModalOpen(true); };
    const handleOpenEditQuestModal = (quest: Quest) => { setEditingQuest(quest); setIsQuestModalOpen(true); };
    const handleSaveQuest = (data: { title: string; description: string; prize: string; target?: number; }) => {
        if (editingQuest) {
            const updatedQuestData: Quest = { 
                ...editingQuest, 
                title: data.title, description: data.description, prize: data.prize,
                target: data.target ? data.target : undefined,
                progress: data.target && editingQuest.target === undefined ? 0 : editingQuest.progress,
            };
            if(!data.target) { delete updatedQuestData.target; delete updatedQuestData.progress; }
            updateQuest(updatedQuestData);
        } else { addQuest(data); }
        setIsQuestModalOpen(false);
    };
    const openDeleteQuestConfirm = (questId: string) => { setDeletingQuestId(questId); setIsDeleteQuestConfirmOpen(true); };
    const handleConfirmDeleteQuest = () => { if (deletingQuestId) deleteQuest(deletingQuestId); setIsDeleteQuestConfirmOpen(false); };

    // User handlers
    const handleOpenEditRoleModal = (user: User) => { setEditingUser(user); setIsRoleModalOpen(true); };
    const handleSaveRole = (userId: string, newRole: UserRole, isModerator: boolean) => {
        const user = users.find(u => u.id === userId);
        if (!user) return;
        
        if (user.role !== newRole) {
            updateUserRole(userId, newRole);
        }
        
        if (!!user.isModerator !== isModerator) {
            toggleModeratorStatus(userId);
        }

        setIsRoleModalOpen(false);
    };
    const handleOpenPointsModal = (user: User) => { setEditingUser(user); setIsPointsModalOpen(true); };
    const handleSavePoints = (userId: string, amount: number) => { adjustUserPoints(userId, amount); setIsPointsModalOpen(false); };
    const openDeleteUserConfirm = (userId: string) => { setDeletingUserId(userId); setIsDeleteUserConfirmOpen(true); };
    const handleConfirmDeleteUser = () => { if (deletingUserId) deleteUser(deletingUserId); setIsDeleteUserConfirmOpen(false); };

    // Team handlers
    const handleOpenEditTeam = (team: Team) => { setEditingTeam(team); setIsTeamEditorOpen(true); };
    const handleOpenTransferOwner = (team: Team) => { setEditingTeam(team); setIsOwnerTransferOpen(true); };
    const handleOpenDisband = (team: Team) => { setEditingTeam(team); setDisbandingTeamId(team.id); setIsDisbandConfirmOpen(true); };
    const handleSaveTeam = async (details: { name: string; description: string; logoUrl: string; }) => { if (!editingTeam) return; await editTeamDetails(editingTeam.id, details); setIsTeamEditorOpen(false); };
    const handleTransferOwner = async (newOwnerId: string) => { if (!editingTeam) return; await transferTeamOwnership(editingTeam.id, newOwnerId); setIsOwnerTransferOpen(false); };
    const handleConfirmDisband = async () => { if (!disbandingTeamId) return; await disbandTeam(disbandingTeamId); setIsDisbandConfirmOpen(false); }

    // Post handlers
    const openDeletePostConfirm = (postId: string) => { setDeletingPostId(postId); setIsDeletePostConfirmOpen(true); };
    const handleConfirmDeletePost = () => { if (deletingPostId) deletePost(deletingPostId); setIsDeletePostConfirmOpen(false); };
    
    // Communication handler
    const handleSendCommunication = async (subject: string, message: string) => {
        await sendMassCommunication(subject, message);
    };

    const sevenDaysAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000);
    const recentUsers = users.filter(user => new Date(user.createdAt) > sevenDaysAgo).sort((a,b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());

    return (
        <>
            <div className="max-w-7xl mx-auto py-10 px-4 sm:px-6 lg:px-8">
                <h1 className="text-4xl font-bold text-brand-accent mb-8">Admin Dashboard</h1>
                <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4 mb-8">
                    <StatCard title="Total Users" value={users.length} />
                    <StatCard title="Total Posts" value={posts.length} />
                    <StatCard title="Active Quests" value={quests.filter(q => q.status !== 'completed').length} />
                    <StatCard 
                        title="New Feedback" 
                        value={feedback.filter(f => f.status === 'new').length}
                        linkTo="/feedback-inbox"
                    />
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
                     <div className="bg-brand-surface p-6 rounded-lg shadow-lg border border-brand-border/30">
                        <h2 className="text-2xl font-semibold text-white mb-4">Recent Registrations</h2>
                        <div className="space-y-3 max-h-96 overflow-y-auto pr-2">
                            {recentUsers.length > 0 ? recentUsers.map(user => (
                                <div key={user.id} className="flex items-center justify-between bg-black/20 p-2 rounded-md">
                                    <div className="flex items-center gap-2">
                                        <img src={user.profilePicture} alt={user.gamertag} className="w-8 h-8 rounded-full object-cover bg-brand-border" />
                                        <span className="text-sm font-semibold text-white">{user.gamertag}</span>
                                    </div>
                                    <span className="text-xs text-brand-text-muted">{timeAgo(user.createdAt)}</span>
                                </div>
                            )) : <p className="text-brand-text-muted text-sm">No new users in the last 7 days.</p>}
                        </div>
                    </div>
                    <div className="bg-brand-surface p-6 rounded-lg shadow-lg border border-brand-border/30">
                        <h2 className="text-2xl font-semibold text-white mb-4">League Activity Feed</h2>
                        <div className="max-h-96 overflow-y-auto pr-2 space-y-4">
                            {activityLog.length > 0 ? activityLog.slice(0, 20).map(log => (
                                <div key={log.id} className="flex items-start gap-3">
                                    <div className="mt-1.5 w-2 h-2 bg-brand-border rounded-full flex-shrink-0"></div>
                                    <div className="flex-1">
                                        <p className="text-sm text-brand-text">
                                            {log.entities.map((entity, index) => {
                                                if (entity.type === 'user') {
                                                    return <Link key={index} to={`/users/${entity.id}`} className="font-bold text-brand-accent hover:underline">{entity.text}</Link>;
                                                }
                                                if (entity.type === 'team') {
                                                    return <Link key={index} to={`/teams/${entity.id}`} className="font-bold text-white hover:underline">{entity.text}</Link>;
                                                }
                                                return <span key={index}>{entity.text}</span>;
                                            })}
                                        </p>
                                        <p className="text-xs text-brand-text-muted">{timeAgo(log.timestamp)}</p>
                                    </div>
                                </div>
                            )) : <p className="text-brand-text-muted text-sm">No recent activity.</p>}
                        </div>
                    </div>
                </div>

                <div className="space-y-8">
                    <div className="bg-brand-surface p-6 rounded-lg shadow-lg border border-brand-border/30">
                        <h2 className="text-2xl font-semibold text-white mb-4">Communication Tools</h2>
                        <p className="text-sm text-brand-text-muted mb-4">Send a mass message to all team owners, co-owners, moderators, and admins. This is delivered via email and in-site message.</p>
                        <button
                            onClick={() => setIsMassCommunicationModalOpen(true)}
                            className="flex items-center gap-2 bg-brand-interactive hover:bg-green-500 text-black font-bold py-2 px-4 rounded-md transition-colors"
                        >
                            <EnvelopeIcon />
                            Message All Owners & Mods
                        </button>
                    </div>
                    <div className="bg-brand-surface p-6 rounded-lg shadow-lg border border-brand-border/30">
                        <h2 className="text-2xl font-semibold text-white mb-4">User Management</h2>
                        <div className="overflow-x-auto">
                            <table className="min-w-full divide-y divide-brand-border">
                                <thead className="bg-black/30">
                                    <tr>
                                        <th scope="col" className="p-4 text-left text-xs font-medium text-brand-text-muted uppercase tracking-wider">Gamertag</th>
                                        <th scope="col" className="p-4 text-left text-xs font-medium text-brand-text-muted uppercase tracking-wider">Email</th>
                                        <th scope="col" className="p-4 text-left text-xs font-medium text-brand-text-muted uppercase tracking-wider">Role</th>
                                        <th scope="col" className="p-4 text-left text-xs font-medium text-brand-text-muted uppercase tracking-wider">UCL Points</th>
                                        <th scope="col" className="p-4 text-right text-xs font-medium text-brand-text-muted uppercase tracking-wider">Actions</th>
                                    </tr>
                                </thead>
                                <tbody className="bg-brand-surface/50 divide-y divide-brand-border/50">
                                    {users.sort((a,b) => a.gamertag.localeCompare(b.gamertag)).map(user => <UserRow key={user.id} user={user} onEditRole={handleOpenEditRoleModal} onDeleteUser={openDeleteUserConfirm} onEditPoints={handleOpenPointsModal} isCurrentUser={currentUser?.id === user.id}/>)}
                                </tbody>
                            </table>
                        </div>
                    </div>
                    <div className="bg-brand-surface p-6 rounded-lg shadow-lg border border-brand-border/30">
                        <h2 className="text-2xl font-semibold text-white mb-4">Team Management</h2>
                        <div className="overflow-x-auto">
                            <table className="min-w-full divide-y divide-brand-border">
                                <thead className="bg-black/30">
                                    <tr>
                                        <th scope="col" className="p-4 text-left text-xs font-medium text-brand-text-muted uppercase tracking-wider">Team Name</th>
                                        <th scope="col" className="p-4 text-left text-xs font-medium text-brand-text-muted uppercase tracking-wider">Owner</th>
                                        <th scope="col" className="p-4 text-left text-xs font-medium text-brand-text-muted uppercase tracking-wider">Members</th>
                                        <th scope="col" className="p-4 text-right text-xs font-medium text-brand-text-muted uppercase tracking-wider">Actions</th>
                                    </tr>
                                </thead>
                                <tbody className="bg-brand-surface/50 divide-y divide-brand-border/50">
                                    {teams.map(team => {
                                        const owner = users.find(u => u.id === team.ownerId);
                                        const memberCount = users.filter(u => u.teamId === team.id).length;
                                        return (
                                            <tr key={team.id} className="hover:bg-brand-surface/40">
                                                <td className="p-4 whitespace-nowrap text-sm font-medium text-white flex items-center gap-3"><img src={team.logoUrl} className="w-8 h-8 rounded-full bg-brand-border" /> {team.name}</td>
                                                <td className="p-4 whitespace-nowrap text-sm text-brand-text-muted">{owner?.gamertag || 'N/A'}</td>
                                                <td className="p-4 whitespace-nowrap text-sm text-brand-text-muted">{memberCount}</td>
                                                <td className="p-4 whitespace-nowrap text-sm text-right space-x-2">
                                                    <button onClick={() => handleOpenEditTeam(team)} className="text-blue-400 hover:text-blue-300 p-1 rounded-md hover:bg-blue-500/20 transition-colors" title="Edit Team"><PencilIcon /></button>
                                                    <button onClick={() => handleOpenTransferOwner(team)} className="text-purple-400 hover:text-purple-300 p-1 rounded-md hover:bg-purple-500/20 transition-colors" title="Transfer Ownership"><SwitchHorizontalIcon /></button>
                                                    <button onClick={() => handleOpenDisband(team)} className="text-red-400 hover:text-red-300 p-1 rounded-md hover:bg-red-500/20 transition-colors" title="Disband Team"><UserGroupIcon /></button>
                                                </td>
                                            </tr>
                                        );
                                    })}
                                </tbody>
                            </table>
                        </div>
                    </div>
                     <div className="bg-brand-surface p-6 rounded-lg shadow-lg border border-brand-border/30">
                        <h2 className="text-2xl font-semibold text-white mb-4">Post Management</h2>
                        <div className="overflow-x-auto">
                            <table className="min-w-full divide-y divide-brand-border">
                                <thead className="bg-black/30">
                                    <tr>
                                        <th scope="col" className="p-4 text-left text-xs font-medium text-brand-text-muted uppercase tracking-wider">Post</th>
                                        <th scope="col" className="p-4 text-left text-xs font-medium text-brand-text-muted uppercase tracking-wider">Author</th>
                                        <th scope="col" className="p-4 text-left text-xs font-medium text-brand-text-muted uppercase tracking-wider">Date</th>
                                        <th scope="col" className="p-4 text-right text-xs font-medium text-brand-text-muted uppercase tracking-wider">Actions</th>
                                    </tr>
                                </thead>
                                <tbody className="bg-brand-surface/50 divide-y divide-brand-border/50">
                                    {posts.slice(0, 20).map(post => {
                                        const author = users.find(u => u.id === post.authorId);
                                        return (
                                            <tr key={post.id} className="hover:bg-brand-surface/40">
                                                <td className="p-4 text-sm text-white max-w-sm truncate" title={post.content}>{post.content}</td>
                                                <td className="p-4 whitespace-nowrap text-sm text-brand-text-muted">{author?.gamertag || 'Unknown'}</td>
                                                <td className="p-4 whitespace-nowrap text-sm text-brand-text-muted">{timeAgo(post.timestamp)}</td>
                                                <td className="p-4 whitespace-nowrap text-sm text-right">
                                                    <button onClick={() => openDeletePostConfirm(post.id)} className="text-red-400 hover:text-red-300 p-1 rounded-md hover:bg-red-500/20 transition-colors" aria-label={`Delete post by ${author?.gamertag}`}>
                                                        <TrashIcon />
                                                    </button>
                                                </td>
                                            </tr>
                                        );
                                    })}
                                </tbody>
                            </table>
                        </div>
                    </div>
                    <div className="bg-brand-surface p-6 rounded-lg shadow-lg border border-brand-border/30">
                        <div className="flex justify-between items-center mb-4">
                            <h2 className="text-2xl font-semibold text-white">Quest Management</h2>
                            <button onClick={handleOpenCreateQuestModal} className="bg-brand-interactive hover:bg-green-500 text-black font-bold py-2 px-4 rounded-md transition-colors">Create New Quest</button>
                        </div>
                        <div className="overflow-x-auto">
                            <table className="min-w-full divide-y divide-brand-border">
                                <thead className="bg-black/30">
                                    <tr>
                                        <th scope="col" className="p-4 text-left text-xs font-medium text-brand-text-muted uppercase tracking-wider">Title</th>
                                        <th scope="col" className="p-4 text-left text-xs font-medium text-brand-text-muted uppercase tracking-wider">Prize</th>
                                        <th scope="col" className="p-4 text-left text-xs font-medium text-brand-text-muted uppercase tracking-wider">Status</th>
                                        <th scope="col" className="p-4 text-right text-xs font-medium text-brand-text-muted uppercase tracking-wider">Actions</th>
                                    </tr>
                                </thead>
                                <tbody className="bg-brand-surface/50 divide-y divide-brand-border/50">
                                    {quests.sort((a,b) => a.title.localeCompare(b.title)).map(quest => (
                                        <tr key={quest.id} className="hover:bg-brand-surface/40">
                                            <td className="p-4 whitespace-nowrap text-sm font-medium text-white">{quest.title}</td>
                                            <td className="p-4 whitespace-nowrap text-sm text-brand-text-muted">{quest.prize}</td>
                                            <td className="p-4 whitespace-nowrap text-sm text-brand-text-muted capitalize">{quest.status}</td>
                                            <td className="p-4 whitespace-nowrap text-sm text-right space-x-2">
                                                <button onClick={() => handleOpenEditQuestModal(quest)} className="text-blue-400 hover:text-blue-300 p-1 rounded-md hover:bg-blue-500/20 transition-colors"><PencilIcon /></button>
                                                <button onClick={() => openDeleteQuestConfirm(quest.id)} className="text-red-400 hover:text-red-300 p-1 rounded-md hover:bg-red-500/20 transition-colors"><TrashIcon /></button>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>
            </div>
            {/* Modals */}
            <QuestEditorModal isOpen={isQuestModalOpen} onClose={() => setIsQuestModalOpen(false)} onSave={handleSaveQuest} quest={editingQuest}/>
            <ConfirmationModal isOpen={isDeleteQuestConfirmOpen} onClose={() => setIsDeleteQuestConfirmOpen(false)} onConfirm={handleConfirmDeleteQuest} title="Delete Quest" message="Are you sure you want to delete this quest? This action cannot be undone." confirmText="Yes, Delete"/>
            <RoleEditorModal isOpen={isRoleModalOpen} onClose={() => setIsRoleModalOpen(false)} onSave={handleSaveRole} user={editingUser}/>
            <PointsEditorModal isOpen={isPointsModalOpen} onClose={() => setIsPointsModalOpen(false)} onSave={handleSavePoints} user={editingUser}/>
            <ConfirmationModal isOpen={isDeleteUserConfirmOpen} onClose={() => setIsDeleteUserConfirmOpen(false)} onConfirm={handleConfirmDeleteUser} title="Delete User" message="Are you sure you want to permanently delete this user? All of their posts, comments, and messages will also be removed. This action cannot be undone." confirmText="Yes, Delete User"/>
            <ConfirmationModal isOpen={isDeletePostConfirmOpen} onClose={() => setIsDeletePostConfirmOpen(false)} onConfirm={handleConfirmDeletePost} title="Delete Post" message="Are you sure you want to permanently delete this post? This action cannot be undone." confirmText="Yes, Delete"/>
            <TeamEditorModal isOpen={isTeamEditorOpen} onClose={() => setIsTeamEditorOpen(false)} onSave={handleSaveTeam} team={editingTeam} />
            <OwnerTransferModal isOpen={isOwnerTransferOpen} onClose={() => setIsOwnerTransferOpen(false)} onSave={handleTransferOwner} team={editingTeam} />
            <ConfirmationModal isOpen={isDisbandConfirmOpen} onClose={() => setIsDisbandConfirmOpen(false)} onConfirm={handleConfirmDisband} title="Disband Team" message={`Are you sure you want to disband ${editingTeam?.name}? All members will become free agents. This action is irreversible.`} confirmText="Yes, Disband" />
            <MassCommunicationModal isOpen={isMassCommunicationModalOpen} onClose={() => setIsMassCommunicationModalOpen(false)} onSend={handleSendCommunication} />
        </>
    );
};