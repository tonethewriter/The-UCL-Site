import React, { useState } from 'react';
import { useAuth } from '../hooks/useAuth';
import { User, Quest, UserRole, Team } from '../types';
import { ConfirmationModal } from '../components/ConfirmationModal';
import { QuestEditorModal } from '../components/QuestEditorModal';
import { RoleEditorModal } from '../components/RoleEditorModal';
import { PointsEditorModal } from '../components/PointsEditorModal';
import { TeamEditorModal } from '../components/TeamEditorModal';
import { OwnerTransferModal } from '../components/OwnerTransferModal';
import { PencilIcon, TrashIcon, CoinIcon, SwitchHorizontalIcon, UserGroupIcon } from '../constants';

const StatCard: React.FC<{ title: string; value: string | number; }> = ({ title, value }) => (
    <div className="bg-brand-surface p-6 rounded-lg border border-brand-border">
        <h3 className="text-sm font-medium text-brand-text-muted">{title}</h3>
        <p className="mt-1 text-3xl font-semibold text-white">{value}</p>
    </div>
);

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

export const AdminDashboardPage: React.FC = () => {
    const { currentUser, users, posts, quests, teams, addQuest, updateQuest, deleteQuest, updateUserRole, deleteUser, adjustUserPoints, editTeamDetails, transferTeamOwnership, disbandTeam } = useAuth();
    
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
    const handleSaveRole = (userId: string, newRole: UserRole) => { updateUserRole(userId, newRole); setIsRoleModalOpen(false); };
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

    return (
        <>
            <div className="max-w-7xl mx-auto py-10 px-4 sm:px-6 lg:px-8">
                <h1 className="text-4xl font-bold text-brand-accent mb-8">Admin Dashboard</h1>
                <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4 mb-8">
                    <StatCard title="Total Users" value={users.length} />
                    <StatCard title="Total Posts" value={posts.length} />
                    <StatCard title="Total Teams" value={teams.length} />
                    <StatCard title="Active Quests" value={quests.filter(q => q.status !== 'completed').length} />
                </div>
                <div className="bg-brand-surface p-6 rounded-lg shadow-lg border border-brand-border/30 mb-8">
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
                <div className="bg-brand-surface p-6 rounded-lg shadow-lg border border-brand-border/30 mb-8">
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
            {/* Modals */}
            <QuestEditorModal isOpen={isQuestModalOpen} onClose={() => setIsQuestModalOpen(false)} onSave={handleSaveQuest} quest={editingQuest}/>
            <ConfirmationModal isOpen={isDeleteQuestConfirmOpen} onClose={() => setIsDeleteQuestConfirmOpen(false)} onConfirm={handleConfirmDeleteQuest} title="Delete Quest" message="Are you sure you want to delete this quest? This action cannot be undone." confirmText="Yes, Delete"/>
            <RoleEditorModal isOpen={isRoleModalOpen} onClose={() => setIsRoleModalOpen(false)} onSave={handleSaveRole} user={editingUser}/>
            <PointsEditorModal isOpen={isPointsModalOpen} onClose={() => setIsPointsModalOpen(false)} onSave={handleSavePoints} user={editingUser}/>
            <ConfirmationModal isOpen={isDeleteUserConfirmOpen} onClose={() => setIsDeleteUserConfirmOpen(false)} onConfirm={handleConfirmDeleteUser} title="Delete User" message="Are you sure you want to permanently delete this user? All of their posts, comments, and messages will also be removed. This action cannot be undone." confirmText="Yes, Delete User"/>
            <TeamEditorModal isOpen={isTeamEditorOpen} onClose={() => setIsTeamEditorOpen(false)} onSave={handleSaveTeam} team={editingTeam} />
            <OwnerTransferModal isOpen={isOwnerTransferOpen} onClose={() => setIsOwnerTransferOpen(false)} onSave={handleTransferOwner} team={editingTeam} />
            <ConfirmationModal isOpen={isDisbandConfirmOpen} onClose={() => setIsDisbandConfirmOpen(false)} onConfirm={handleConfirmDisband} title="Disband Team" message={`Are you sure you want to disband ${editingTeam?.name}? All members will become free agents. This action is irreversible.`} confirmText="Yes, Disband" />
        </>
    );
};