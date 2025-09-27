import React, { useState, useMemo } from 'react';
import { useAuth } from '../hooks/useAuth';
import { Feedback, FeedbackStatus } from '../types';
import { Link } from 'react-router-dom';

const timeAgo = (dateString: string): string => {
    const date = new Date(dateString);
    const seconds = Math.floor((new Date().getTime() - date.getTime()) / 1000);
    if (seconds < 60) return "just now";
    const minutes = Math.floor(seconds / 60);
    if (minutes < 60) return `${minutes}m ago`;
    const hours = Math.floor(minutes / 60);
    if (hours < 24) return `${hours}h ago`;
    const days = Math.floor(hours / 24);
    return `${days}d ago`;
};

const FeedbackCard: React.FC<{ item: Feedback, onStatusChange: (id: string, status: FeedbackStatus) => void }> = ({ item, onStatusChange }) => {
    
    const typeStyles: Record<string, string> = {
        'suggestion': 'bg-blue-500/20 text-blue-300',
        'bug_report': 'bg-red-500/20 text-red-300',
        'general': 'bg-gray-500/20 text-gray-300',
    };
    
    const statusStyles: Record<FeedbackStatus, string> = {
        'new': 'border-brand-accent/70',
        'viewed': 'border-brand-border/50',
        'archived': 'border-transparent bg-brand-surface/30',
    };

    const handleView = () => {
        if (item.status === 'new') {
            onStatusChange(item.id, 'viewed');
        }
    };

    return (
        <div className={`bg-brand-surface p-5 rounded-lg border-l-4 ${statusStyles[item.status]} shadow-md`}>
            <div className="flex justify-between items-start">
                <div>
                    <div className="flex items-center gap-3">
                        <Link to={`/users/${item.userId}`} className="font-bold text-white hover:underline">{item.userGamertag}</Link>
                        <span className={`px-2 py-0.5 rounded-full text-xs font-semibold leading-none ${typeStyles[item.type] || typeStyles['general']}`}>
                            {item.type.replace('_', ' ')}
                        </span>
                    </div>
                    <p className="text-xs text-brand-text-muted mt-1">{new Date(item.timestamp).toLocaleString()}</p>
                </div>
                <div className="flex items-center gap-2">
                    {item.status !== 'archived' && (
                        <button 
                            onClick={() => onStatusChange(item.id, 'archived')} 
                            className="text-xs font-semibold text-brand-text-muted hover:text-white"
                            title="Archive"
                        >
                           Archive
                        </button>
                    )}
                     {item.status === 'new' && (
                        <button 
                            onClick={handleView} 
                            className="text-xs font-semibold text-brand-accent hover:underline"
                            title="Mark as Viewed"
                        >
                            Mark Viewed
                        </button>
                    )}
                </div>
            </div>
            <p onClick={handleView} className="mt-4 text-brand-text whitespace-pre-wrap cursor-pointer">{item.message}</p>
        </div>
    );
};

export const FeedbackInboxPage: React.FC = () => {
    const { feedback, updateFeedbackStatus } = useAuth();
    const [filter, setFilter] = useState<FeedbackStatus | 'all'>('new');

    const filteredFeedback = useMemo(() => {
        const sorted = [...feedback].sort((a,b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());
        if (filter === 'all') {
            return sorted;
        }
        return sorted.filter(item => item.status === filter);
    }, [feedback, filter]);

    const getCount = (status: FeedbackStatus | 'all') => {
        if (status === 'all') return feedback.length;
        return feedback.filter(item => item.status === status).length;
    };
    
    const handleStatusChange = async (id: string, status: FeedbackStatus) => {
        await updateFeedbackStatus(id, status);
    };

    return (
        <div className="max-w-4xl mx-auto py-10 px-4 sm:px-6 lg:px-8">
            <h1 className="text-4xl font-bold text-brand-accent mb-2">Feedback Inbox</h1>
            <p className="text-lg text-brand-text-muted mb-8">Review and manage user-submitted feedback.</p>

            <div className="mb-6 p-2 bg-brand-surface border border-brand-border/30 rounded-lg flex gap-2">
                {(['new', 'viewed', 'archived', 'all'] as const).map(status => (
                    <button
                        key={status}
                        onClick={() => setFilter(status)}
                        className={`flex-1 px-4 py-2 rounded-md text-sm font-semibold transition-colors relative ${
                            filter === status
                                ? 'bg-brand-interactive text-black'
                                : 'bg-transparent hover:bg-brand-surface text-brand-text-muted'
                        }`}
                    >
                        <span className="capitalize">{status}</span>
                        <span className={`ml-2 px-2 py-0.5 rounded-full text-xs font-bold ${filter === status ? 'bg-black/20 text-white' : 'bg-brand-border text-brand-text-muted'}`}>
                           {getCount(status)}
                        </span>
                    </button>
                ))}
            </div>

            <div className="space-y-4">
                {filteredFeedback.length > 0 ? (
                    filteredFeedback.map(item => (
                        <FeedbackCard key={item.id} item={item} onStatusChange={handleStatusChange} />
                    ))
                ) : (
                    <div className="text-center bg-brand-surface border border-brand-border/30 rounded-lg p-12">
                        <h2 className="text-2xl font-semibold text-white">No Feedback Here</h2>
                        <p className="mt-2 text-brand-text-muted">
                            There are no submissions in this category.
                        </p>
                    </div>
                )}
            </div>
        </div>
    );
};