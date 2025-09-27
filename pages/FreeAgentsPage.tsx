import React, { useState, useMemo } from 'react';
import { useAuth } from '../hooks/useAuth';
import { User } from '../types';
import { Link } from 'react-router-dom';
import { RoleBadge } from '../components/RoleBadge';
import { UCLPointIcon } from '../constants';

const FreeAgentCard: React.FC<{ user: User }> = ({ user }) => {
    return (
        <div className="bg-brand-surface p-5 rounded-lg shadow-lg border border-brand-border/50 flex flex-col items-center text-center transition-transform hover:-translate-y-1">
            <img src={user.profilePicture} alt={user.gamertag} className="w-24 h-24 rounded-full bg-brand-border object-cover ring-4 ring-brand-border/50" />
            <h3 className="text-xl font-bold text-white mt-4">{user.gamertag}</h3>
            <div className="my-2">
                <RoleBadge role={user.role} />
            </div>
            <div className="flex items-center gap-1 text-brand-accent font-semibold bg-brand-accent/10 px-2.5 py-1 rounded-full text-sm">
                <UCLPointIcon />
                {user.uclPoints.toLocaleString()}
            </div>
            <Link 
                to={`/users/${user.id}`} 
                className="mt-4 w-full bg-brand-interactive hover:bg-green-500 text-black font-bold py-2 px-4 rounded-md transition-colors"
            >
                View Profile
            </Link>
        </div>
    );
};


export const FreeAgentsPage: React.FC = () => {
    const { users } = useAuth();
    const [searchTerm, setSearchTerm] = useState('');

    const freeAgents = useMemo(() => {
        const agents = users.filter(u => u.isFreeAgent);
        if (!searchTerm) {
            return agents;
        }
        const lowercasedFilter = searchTerm.toLowerCase();
        return agents.filter(agent => 
            agent.gamertag.toLowerCase().includes(lowercasedFilter)
        );
    }, [users, searchTerm]);

    return (
        <div className="max-w-7xl mx-auto py-10 px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-10">
                <h1 className="text-5xl font-bold text-brand-accent tracking-wider">Free Agents</h1>
                <p className="mt-4 text-xl text-brand-text-muted max-w-3xl mx-auto">
                    Looking for a team? List yourself here. Team owners, find your next star player.
                </p>
            </div>
            
            <div className="mb-8 max-w-2xl mx-auto">
                <input
                    type="text"
                    placeholder="Search by gamertag..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full bg-brand-surface text-white border border-brand-border rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-brand-accent transition placeholder-brand-text-muted/50"
                />
            </div>

            {freeAgents.length > 0 ? (
                 <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
                    {freeAgents.map(user => (
                        <FreeAgentCard key={user.id} user={user} />
                    ))}
                </div>
            ) : (
                <div className="text-center bg-brand-surface border border-brand-border/30 rounded-lg p-8 max-w-2xl mx-auto">
                    <h2 className="text-2xl font-semibold text-white">No Free Agents Found</h2>
                    <p className="mt-2 text-brand-text-muted">
                        There are currently no players listed as free agents. Check back later!
                    </p>
                </div>
            )}
        </div>
    );
};