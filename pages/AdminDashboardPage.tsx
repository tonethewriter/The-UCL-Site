import React, { useState } from 'react';
import { useAuth } from '../hooks/useAuth';
import { User, Post } from '../types';
import { TrashIcon } from '../constants';

const UserManagement: React.FC<{ users: User[], currentUser: User, deleteUser: (userId: string) => void }> = ({ users, currentUser, deleteUser }) => {
    return (
        <div className="bg-green-900/60 p-6 rounded-lg shadow-lg border border-yellow-700/30">
            <h2 className="text-2xl font-bold text-yellow-400 mb-4">User Management</h2>
            <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-green-800">
                    <thead className="bg-green-800/50">
                        <tr>
                            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-yellow-400 uppercase tracking-wider">Gamertag</th>
                            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-yellow-400 uppercase tracking-wider">Role</th>
                            <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-yellow-400 uppercase tracking-wider">Actions</th>
                        </tr>
                    </thead>
                    <tbody className="bg-green-900/60 divide-y divide-green-800">
                        {users.length > 0 ? (
                            users.map(user => (
                                <tr key={user.id}>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-yellow-200">{user.gamertag}</td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-yellow-300">{user.role}</td>
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
                                <td colSpan={3} className="text-center py-4 px-6 text-yellow-500">No users found.</td>
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
            <h2 className="text-2xl font-bold text-yellow-400 mb-4">Post Management</h2>
            <div className="space-y-4 max-h-96 overflow-y-auto pr-2">
                {posts.length > 0 ? (
                    posts.map(post => (
                        <div key={post.id} className="bg-green-800/50 p-3 rounded-md flex justify-between items-start">
                            <div>
                                <p className="text-sm text-yellow-200 truncate w-96">{post.content}</p>
                                <p className="text-xs text-yellow-500">by {post.authorGamertag}</p>
                            </div>
                            <button onClick={() => deletePost(post.id)} className="text-red-500 hover:text-red-400 transition-colors ml-4 flex-shrink-0">
                                 <TrashIcon />
                            </button>
                        </div>
                    ))
                ) : (
                     <p className="text-center py-4 text-yellow-500">No posts found.</p>
                )}
            </div>
        </div>
    );
};

export const AdminDashboardPage: React.FC = () => {
    const { users, posts, currentUser, deleteUser, deletePost } = useAuth();
    const [searchTerm, setSearchTerm] = useState('');
    
    if (!currentUser) return null;

    const lowercasedFilter = searchTerm.toLowerCase();

    const filteredUsers = searchTerm
        ? users.filter(user =>
            user.gamertag.toLowerCase().includes(lowercasedFilter) ||
            (user.email && user.email.toLowerCase().includes(lowercasedFilter))
        )
        : users;

    const filteredPosts = searchTerm
        ? posts.filter(post =>
            post.content.toLowerCase().includes(lowercasedFilter) ||
            post.authorGamertag.toLowerCase().includes(lowercasedFilter)
        )
        : posts;

    return (
        <div className="max-w-7xl mx-auto py-10 px-4 sm:px-6 lg:px-8">
            <h1 className="text-4xl font-bold text-center mb-6 text-yellow-300">Admin Dashboard</h1>

            <div className="mb-8 max-w-2xl mx-auto">
                <input
                    type="text"
                    placeholder="Search users or posts..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full bg-green-900/60 text-yellow-200 border border-green-800 rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-yellow-500 transition placeholder-yellow-500/50"
                />
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                <UserManagement users={filteredUsers} currentUser={currentUser} deleteUser={deleteUser} />
                <PostManagement posts={filteredPosts} deletePost={deletePost} />
            </div>
        </div>
    );
};