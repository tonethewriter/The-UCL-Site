import React, { useState, useMemo } from 'react';
import { useAuth } from '../hooks/useAuth';
import { Link } from 'react-router-dom';
import { Team } from '../types';
import { UserIcon } from '../constants';

const TeamCard: React.FC<{ team: Team }> = ({ team }) => {
    const { users } = useAuth();
    const memberCount = users.filter(u => u.teamId === team.id).length;

    return (
        <Link to={`/teams/${team.id}`} className="block bg-brand-surface p-5 rounded-lg shadow-lg border border-brand-border/50 transition-transform hover:-translate-y-1 hover:border-brand-accent/70">
            <div className="flex flex-col items-center text-center">
                <img src={team.logoUrl} alt={`${team.name} Logo`} className="w-24 h-24 rounded-full bg-brand-border object-cover ring-4 ring-brand-border/50 mb-4" />
                <h3 className="text-xl font-bold text-white">{team.name}</h3>
                <div className="mt-2 flex items-center gap-2 text-brand-text-muted">
                    <UserIcon className="w-4 h-4" />
                    <span className="text-sm font-semibold">{memberCount} Member{memberCount !== 1 ? 's' : ''}</span>
                </div>
            </div>
        </Link>
    );
};

export const TeamsListPage: React.FC = () => {
    const { teams } = useAuth();
    const [searchTerm, setSearchTerm] = useState('');

    const filteredTeams = useMemo(() => {
        if (!searchTerm) {
            return teams;
        }
        const lowercasedFilter = searchTerm.toLowerCase();
        return teams.filter(team => 
            team.name.toLowerCase().includes(lowercasedFilter)
        );
    }, [teams, searchTerm]);

    return (
        <div className="max-w-7xl mx-auto py-10 px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-10">
                <h1 className="text-5xl font-bold text-brand-accent tracking-wider">Teams</h1>
                <p className="mt-4 text-xl text-brand-text-muted max-w-3xl mx-auto">
                    Browse all the teams competing in the United Clan League.
                </p>
            </div>
            
            <div className="mb-8 max-w-2xl mx-auto">
                <input
                    type="text"
                    placeholder="Search by team name..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full bg-brand-surface text-white border border-brand-border rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-brand-accent transition placeholder-brand-text-muted/50"
                />
            </div>

            {filteredTeams.length > 0 ? (
                 <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                    {filteredTeams.map(team => (
                        <TeamCard key={team.id} team={team} />
                    ))}
                </div>
            ) : (
                <div className="text-center bg-brand-surface border border-brand-border/30 rounded-lg p-8 max-w-2xl mx-auto">
                    <h2 className="text-2xl font-semibold text-white">No Teams Found</h2>
                    <p className="mt-2 text-brand-text-muted">
                        Your search returned no results. Try a different team name.
                    </p>
                </div>
            )}
        </div>
    );
};