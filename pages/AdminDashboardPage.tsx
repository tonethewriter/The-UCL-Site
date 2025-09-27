import React from 'react';
import { useAuth } from '../hooks/useAuth';
import { User } from '../types';

const StatCard: React.FC<{ title: string; value: string | number; }> = ({ title, value }) => (
    <div className="bg-brand-surface p-6 rounded-lg border border-brand-border">
        <h3 className="text-sm font-medium text-brand-text-muted">{title}</h3>
        <p className="mt-1 text-3xl font-semibold text-white">{value}</p>
    </div>
);

const UserRow: React.FC<{ user: User }> = ({ user }) => (
    <tr className="border-b border-brand-border hover:bg-brand-surface/40">
        <td className="p-4 whitespace-nowrap text-sm font-medium text-white">{user.gamertag}</td>
        <td className="p-4 whitespace-nowrap text-sm text-brand-text-muted">{user.email}</td>
        <td className="p-4 whitespace-nowrap text-sm text-brand-text-muted capitalize">{user.role.replace(/_/g, ' ')}</td>
        <td className="p-4 whitespace-nowrap text-sm text-brand-accent">{user.uclPoints.toLocaleString()}</td>
    </tr>
);

export const AdminDashboardPage: React.FC = () => {
    const { users, posts, quests } = useAuth();

    return (
        <div className="max-w-7xl mx-auto py-10 px-4 sm:px-6 lg:px-8">
            <h1 className="text-4xl font-bold text-brand-accent mb-8">Admin Dashboard</h1>

            <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4 mb-8">
                <StatCard title="Total Users" value={users.length} />
                <StatCard title="Total Posts" value={posts.length} />
                <StatCard title="Total Quests" value={quests.length} />
                <StatCard title="Active Quests" value={quests.filter(q => q.status !== 'completed').length} />
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
                            </tr>
                        </thead>
                        <tbody className="bg-brand-surface/50 divide-y divide-brand-border/50">
                            {users.sort((a,b) => a.gamertag.localeCompare(b.gamertag)).map(user => <UserRow key={user.id} user={user} />)}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
};