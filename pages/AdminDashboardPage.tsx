import React, { useState } from 'react';
import { useAuth } from '../hooks/useAuth';
import { User, Post, UserRole, Quest, QuestStatus } from '../types';
import { TrashIcon } from '../constants';

const allRoles: UserRole[] = ['player', 'player_plus', 'team_owner', 'team_owner_plus', 'co_owner', 'admin'];
const allQuestStatuses: QuestStatus[] = ['incomplete', 'started', 'completed'];

const UserManagement: React.FC<{ users: User[], currentUser: User, deleteUser: (userId: string) => void, updateUserRole: (userId: string, newRole: UserRole) => void }> = ({ users, currentUser, deleteUser, updateUserRole }) => {

    const handleRoleChange = (userId: string, newRole: UserRole) => {
        if (window.confirm(`Are you sure you want to change this user's role to ${newRole.replace('_', ' ')}?`)) {
            let finalRole = newRole;
            let teamName = users.find(u => u.id === userId)?.teamName;

            if (['team_owner', 'team_owner_plus', 'co_owner'].includes(newRole) && !teamName) {
                const newTeamName = window.prompt("This role requires a team name. Please enter one:");
                if (newTeamName) {
                    alert("Role changed. A better implementation would extend updateUserRole to accept an optional team name.");
                } else {
                    alert("Role change cancelled as a team name is required.");
                    return; 
                }
            }

            updateUserRole(userId, finalRole);
        }
    };

    return (
        <div className="bg-green-900/60 p-6 rounded-lg shadow-lg border border-yellow-700/30">
            <h2 className="text-2xl font-bold text-yellow-300 mb-4">User Management</h2>
            <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-green-800">
                    <thead className="bg-green-800/50">
                        <tr>
                            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-yellow-300 uppercase tracking-wider">Gamertag</th>
                            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-yellow-300 uppercase tracking-wider">Role</th>
                            <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-yellow-300 uppercase tracking-wider">Actions</th>
                        </tr>
                    </thead>
                    <tbody className="bg-green-900/60 divide-y divide-green-800">
                        {users.length > 0 ? (
                            users.map(user => (
                                <tr key={user.id}>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-white">{user.gamertag}</td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">
                                       {user.id === currentUser.id || user.role === 'admin' ? (
                                           <span className="capitalize">{user.role.replace('_', ' ')}</span>
                                       ) : (
                                        <select 
                                            value={user.role} 
                                            onChange={(e) => handleRoleChange(user.id, e.target.value as UserRole)}
                                            className="bg-green-800 text-white border border-green-700 rounded-md p-1 focus:outline-none focus:ring-1 focus:ring-yellow-500"
                                        >
                                            {allRoles.map(role => (
                                                <option key={role} value={role} className="capitalize">{role.replace('_', ' ')}</option>
                                            ))}
                                        </select>
                                       )}
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                                        {user.id !== currentUser.id && user.role !== 'admin' && (
                                            <button onClick={() => deleteUser(user.id)} className="text-red-500 hover:text-red-400 transition-colors">
                                               <TrashIcon />
                                            </button>
                                        )}
                                    </td>
                                </tr>
                            ))
                        ) : (
                            <tr>
                                <td colSpan={3} className="text-center py-4 px-6 text-gray-400">No users found.</td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

const PostManagement: React.FC<{ posts: Post[], deletePost: (postId: string) => void }> = ({ posts, deletePost }) => {
    return (
        <div className="bg-green-900/60 p-6 rounded-lg shadow-lg border border-yellow-700/30">
            <h2 className="text-2xl font-bold text-yellow-300 mb-4">Post Management</h2>
            <div className="space-y-4 max-h-96 overflow-y-auto pr-2">
                {posts.length > 0 ? (
                    posts.map(post => (
                        <div key={post.id} className="bg-green-800/50 p-3 rounded-md flex justify-between items-start">
                            <div>
                                <p className="text-sm text-white truncate w-full max-w-lg">{post.content}</p>
                                <p className="text-xs text-gray-400">by {post.authorGamertag}</p>
                            </div>
                            <button onClick={() => deletePost(post.id)} className="text-red-500 hover:text-red-400 transition-colors ml-4 flex-shrink-0">
                                 <TrashIcon />
                            </button>
                        </div>
                    ))
                ) : (
                     <p className="text-center py-4 text-gray-400">No posts found.</p>
                )}
            </div>
        </div>
    );
};

const QuestManagement: React.FC<{ quests: Quest[], addQuest: Function, updateQuestStatus: Function, deleteQuest: Function, handleOpenGrantModal: (quest: Quest) => void }> = ({ quests, addQuest, updateQuestStatus, deleteQuest, handleOpenGrantModal }) => {
    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');
    const [prize, setPrize] = useState('');

    const handleAddQuest = (e: React.FormEvent) => {
        e.preventDefault();
        if (title && description && prize) {
            addQuest(title, description, prize);
            setTitle('');
            setDescription('');
            setPrize('');
        }
    };
    
    return (
         <div className="bg-green-900/60 p-6 rounded-lg shadow-lg border border-yellow-700/30">
            <h2 className="text-2xl font-bold text-yellow-300 mb-4">Quest Management</h2>
            
            <form onSubmit={handleAddQuest} className="mb-6 bg-green-800/50 p-4 rounded-md space-y-4">
                 <h3 className="text-lg font-semibold text-white">Create New Quest</h3>
                 <input type="text" placeholder="Quest Title" value={title} onChange={e => setTitle(e.target.value)} className="w-full bg-green-900/60 text-white border border-green-700 rounded-lg p-2 focus:outline-none focus:ring-1 focus:ring-yellow-500" required />
                 <textarea placeholder="Quest Description" value={description} onChange={e => setDescription(e.target.value)} className="w-full bg-green-900/60 text-white border border-green-700 rounded-lg p-2 focus:outline-none focus:ring-1 focus:ring-yellow-500" required />
                 <input type="text" placeholder="Quest Prize (e.g., '100 UCL Points')" value={prize} onChange={e => setPrize(e.target.value)} className="w-full bg-green-900/60 text-white border border-green-700 rounded-lg p-2 focus:outline-none focus:ring-1 focus:ring-yellow-500" required />
                 <button type="submit" className="w-full bg-yellow-600 hover:bg-yellow-700 text-green-900 font-bold py-2 px-4 rounded-lg transition-colors">Add Quest</button>
            </form>

            <div className="space-y-4 max-h-96 overflow-y-auto pr-2">
                {quests.length > 0 ? (
                    quests.map(quest => (
                        <div key={quest.id} className="bg-green-800/50 p-3 rounded-md">
                            <div className="flex justify-between items-start">
                                <div>
                                    <p className="font-bold text-white">{quest.title}</p>
                                    <p className="text-sm text-gray-300">{quest.description}</p>
                                    <p className="text-xs text-yellow-300/80 mt-1">Prize: {quest.prize}</p>
                                </div>
                                <button onClick={() => deleteQuest(quest.id)} className="text-red-500 hover:text-red-400 transition-colors ml-4 flex-shrink-0">
                                    <TrashIcon />
                                </button>
                            </div>
                            <div className="mt-2 flex items-center gap-4">
                                <select 
                                    value={quest.status} 
                                    onChange={(e) => updateQuestStatus(quest.id, e.target.value as QuestStatus)}
                                    className="bg-green-900 text-white border border-green-700 rounded-md p-1 text-sm focus:outline-none focus:ring-1 focus:ring-yellow-500"
                                >
                                    {allQuestStatuses.map(status => (
                                        <option key={status} value={status} className="capitalize">{status}</option>
                                    ))}
                                </select>
                                 {quest.status === 'completed' && (
                                    <button
                                        onClick={() => handleOpenGrantModal(quest)}
                                        className="bg-yellow-500 hover:bg-yellow-600 text-green-900 font-bold py-1 px-3 rounded-md text-xs transition-colors"
                                    >
                                        Grant Prize
                                    </button>
                                )}
                            </div>
                        </div>
                    ))
                ) : (
                     <p className="text-center py-4 text-gray-400">No quests found.</p>
                )}
            </div>
        </div>
    );
};

export const AdminDashboardPage: React.FC = () => {
    const { users, posts, quests, currentUser, deleteUser, deletePost, updateUserRole, addQuest, updateQuestStatus, deleteQuest, grantQuestReward } = useAuth();
    const [searchTerm, setSearchTerm] = useState('');
    
    // State for Grant Reward Modal
    const [isGrantModalOpen, setIsGrantModalOpen] = useState(false);
    const [questToGrant, setQuestToGrant] = useState<Quest | null>(null);
    const [userToGrant, setUserToGrant] = useState<string>('');
    const [grantMessage, setGrantMessage] = useState({ type: '', text: '' });
    
    if (!currentUser) return null;

    const lowercasedFilter = searchTerm.toLowerCase();

    const filteredUsers = searchTerm ? users.filter(user => user.gamertag.toLowerCase().includes(lowercasedFilter)) : users;
    const filteredPosts = searchTerm ? posts.filter(post => post.content.toLowerCase().includes(lowercasedFilter) || post.authorGamertag.toLowerCase().includes(lowercasedFilter)) : posts;
    const filteredQuests = searchTerm ? quests.filter(quest => quest.title.toLowerCase().includes(lowercasedFilter) || quest.description.toLowerCase().includes(lowercasedFilter)) : quests;
    
    const handleOpenGrantModal = (quest: Quest) => {
        setQuestToGrant(quest);
        setIsGrantModalOpen(true);
        setUserToGrant('');
        setGrantMessage({ type: '', text: '' });
    };

    const handleConfirmGrant = async () => {
        if (!questToGrant || !userToGrant) {
            setGrantMessage({ type: 'error', text: 'Please select a user.' });
            return;
        }
        try {
            await grantQuestReward(userToGrant, questToGrant.prize);
            setGrantMessage({ type: 'success', text: `Reward process initiated for user.` });
            setTimeout(() => {
                setIsGrantModalOpen(false);
                setQuestToGrant(null);
            }, 2000);
        } catch (err: any) {
            setGrantMessage({ type: 'error', text: err.message });
        }
    };


    return (
        <>
            <div className="max-w-4xl mx-auto py-10 px-4 sm:px-6 lg:px-8">
                <h1 className="text-4xl font-bold text-center mb-6 text-white">Admin Dashboard</h1>

                <div className="mb-8">
                    <input
                        type="text"
                        placeholder="Search users, posts, or quests..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="w-full bg-green-900/60 text-white border border-green-800 rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-yellow-500 transition placeholder-gray-400/50"
                    />
                </div>

                <div className="space-y-8">
                    <QuestManagement quests={filteredQuests} addQuest={addQuest} updateQuestStatus={updateQuestStatus} deleteQuest={deleteQuest} handleOpenGrantModal={handleOpenGrantModal} />
                    <UserManagement users={filteredUsers} currentUser={currentUser} deleteUser={deleteUser} updateUserRole={updateUserRole} />
                    <PostManagement posts={filteredPosts} deletePost={deletePost} />
                </div>
            </div>

            {isGrantModalOpen && questToGrant && (
                <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 p-4">
                    <div className="bg-green-900 border border-yellow-700/50 rounded-lg shadow-xl p-6 w-full max-w-md">
                        <h2 className="text-2xl font-bold text-yellow-300 mb-2">Grant Quest Reward</h2>
                        <p className="text-white mb-1">Quest: <span className="font-semibold">{questToGrant.title}</span></p>
                        <p className="text-white mb-4">Prize: <span className="font-semibold">{questToGrant.prize}</span></p>

                        <div className="space-y-4">
                             <div>
                                <label htmlFor="user-select" className="block text-sm font-medium text-gray-300 mb-1">Select User</label>
                                <select
                                    id="user-select"
                                    value={userToGrant}
                                    onChange={(e) => setUserToGrant(e.target.value)}
                                    className="w-full bg-green-800 text-white border border-green-700 rounded-md p-2 focus:outline-none focus:ring-1 focus:ring-yellow-500"
                                >
                                    <option value="">-- Choose a recipient --</option>
                                    {users.filter(u => u.role !== 'admin').map(user => (
                                        <option key={user.id} value={user.id}>
                                            {user.gamertag}
                                        </option>
                                    ))}
                                </select>
                            </div>

                            {grantMessage.text && (
                                <p className={`text-sm text-center p-2 rounded-md ${grantMessage.type === 'error' ? 'bg-red-500/20 text-red-300' : 'bg-green-500/20 text-green-300'}`}>
                                    {grantMessage.text}
                                </p>
                            )}

                            <div className="flex justify-end gap-4 pt-2">
                                <button onClick={() => setIsGrantModalOpen(false)} className="bg-green-700 hover:bg-green-600 text-white font-bold py-2 px-4 rounded-lg transition-colors">
                                    Cancel
                                </button>
                                <button onClick={handleConfirmGrant} className="bg-yellow-600 hover:bg-yellow-700 text-green-900 font-bold py-2 px-4 rounded-lg transition-colors">
                                    Confirm & Grant
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </>
    );
};