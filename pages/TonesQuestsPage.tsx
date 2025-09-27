import React, { useState, useMemo } from 'react';
import { useAuth } from '../hooks/useAuth';
import { Quest, QuestStatus } from '../types';
import { QuestionMarkIcon } from '../constants';

const statusStyles: Record<QuestStatus, { badge: string; border: string; }> = {
    incomplete: { badge: 'bg-gray-600 text-gray-100', border: 'border-gray-700/50' },
    started: { badge: 'bg-blue-600 text-blue-100', border: 'border-blue-500/50' },
    completed: { badge: 'bg-green-600 text-green-100', border: 'border-green-500/50' },
};

const filterOptions: { label: string, value: 'all' | QuestStatus }[] = [
    { label: 'All', value: 'all' },
    { label: 'Incomplete', value: 'incomplete' },
    { label: 'Started', value: 'started' },
    { label: 'Completed', value: 'completed' }
];

const QuestCard: React.FC<{ quest: Quest }> = ({ quest }) => {
    const styles = statusStyles[quest.status];

    return (
        <div className={`bg-green-900/60 p-6 rounded-lg shadow-lg border-t-4 ${styles.border} flex flex-col justify-between`}>
            <div>
                <div className="flex justify-between items-start mb-2">
                    <h2 className="text-2xl font-bold text-white">{quest.title}</h2>
                    <span className={`px-3 py-1 rounded-full text-xs font-semibold leading-none ${styles.badge} capitalize`}>
                        {quest.status}
                    </span>
                </div>
                <p className="text-gray-300 min-h-[40px]">{quest.description}</p>
            </div>
            <div className="mt-6 pt-4 border-t border-green-800/50">
                <h3 className="text-sm font-semibold text-yellow-300 mb-2 uppercase tracking-wider">Reward</h3>
                {quest.status === 'completed' ? (
                    <div className="bg-yellow-500/10 border border-yellow-500/30 rounded-lg p-3 text-center">
                        <p className="text-lg font-bold text-yellow-300">{quest.prize}</p>
                    </div>
                ) : (
                    <div className="flex items-center gap-2 text-gray-400">
                        <div className="animate-pulse">
                            <QuestionMarkIcon />
                        </div>
                        <span>Complete the quest to reveal</span>
                    </div>
                )}
            </div>
        </div>
    );
};

export const TonesQuestsPage: React.FC = () => {
    const { quests } = useAuth();
    const [searchTerm, setSearchTerm] = useState('');
    const [statusFilter, setStatusFilter] = useState<'all' | QuestStatus>('all');

    const filteredQuests = useMemo(() => {
        return quests.filter(quest => {
            const matchesStatus = statusFilter === 'all' || quest.status === statusFilter;
            const lowercasedTerm = searchTerm.toLowerCase();
            const matchesSearch = searchTerm === '' || 
                quest.title.toLowerCase().includes(lowercasedTerm) || 
                quest.description.toLowerCase().includes(lowercasedTerm);
            return matchesStatus && matchesSearch;
        });
    }, [quests, searchTerm, statusFilter]);

    return (
        <div className="max-w-7xl mx-auto py-10 px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-10">
                <h1 className="text-5xl font-bold text-yellow-300 tracking-wider">Tone's Quests</h1>
                <p className="mt-4 text-xl text-gray-300 max-w-3xl mx-auto">
                    Welcome, challenger! Complete these quests to earn UCL Points and exclusive rewards.
                </p>
            </div>

            <div className="mb-8 p-4 bg-green-900/50 border border-yellow-700/30 rounded-lg flex flex-col md:flex-row gap-4 items-center">
                <input
                    type="text"
                    placeholder="Search quests by keyword..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full md:flex-grow bg-green-800/60 text-white border border-green-700 rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-yellow-500 transition placeholder-gray-400/50"
                />
                <div className="flex items-center gap-2 flex-wrap justify-center">
                    {filterOptions.map(({ label, value }) => (
                        <button
                            key={value}
                            onClick={() => setStatusFilter(value)}
                            className={`px-4 py-2 rounded-md text-sm font-semibold transition-colors ${
                                statusFilter === value
                                    ? 'bg-yellow-600 text-green-900'
                                    : 'bg-green-800 hover:bg-green-700 text-gray-300'
                            }`}
                        >
                            {label}
                        </button>
                    ))}
                </div>
            </div>

            {filteredQuests.length > 0 ? (
                 <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {filteredQuests.map(quest => (
                        <QuestCard key={quest.id} quest={quest} />
                    ))}
                </div>
            ) : (
                <div className="text-center bg-green-900/50 border border-yellow-700/30 rounded-lg p-8 max-w-2xl mx-auto">
                    <h2 className="text-2xl font-semibold text-white">No Quests Found</h2>
                    <p className="mt-2 text-gray-400">
                        Your search or filter returned no results. Try adjusting your criteria.
                    </p>
                </div>
            )}
        </div>
    );
};