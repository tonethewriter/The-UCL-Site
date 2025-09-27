import React, { useState } from 'react';
import { useAuth } from '../hooks/useAuth';

export const PostForm: React.FC<{ privateTeamId?: string }> = ({ privateTeamId }) => {
    const [content, setContent] = useState('');
    const [imageUrl, setImageUrl] = useState('');
    const { currentUser, addPost } = useAuth();
    
    const isPlusMember = currentUser?.role.includes('_plus') || currentUser?.role === 'admin';

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (content.trim()) {
            addPost(content, imageUrl, privateTeamId);
            setContent('');
            setImageUrl('');
        }
    };
    
    const placeholderText = privateTeamId ? "Post an announcement to your team..." : "What's on your mind?";
    
    const isTimedOut = currentUser?.timeoutUntil && new Date(currentUser.timeoutUntil) > new Date();
    const timeoutExpiry = isTimedOut ? new Date(currentUser.timeoutUntil!).toLocaleString() : '';

    if (isTimedOut && !privateTeamId) {
        return (
            <div className="bg-red-900/50 border border-red-500/50 p-4 rounded-lg text-center">
                <p className="font-bold text-red-400">You are currently timed out.</p>
                <p className="text-sm text-red-400/80">You cannot post or comment until {timeoutExpiry}.</p>
            </div>
        )
    }

    return (
        <div className="bg-brand-surface p-4 rounded-lg shadow-md mb-8 border border-brand-border/50">
            <form onSubmit={handleSubmit}>
                <textarea
                    className="w-full bg-black/30 text-brand-text border border-brand-border rounded-md p-3 focus:outline-none focus:ring-2 focus:ring-brand-accent transition-shadow placeholder-brand-text-muted/50"
                    rows={4}
                    placeholder={placeholderText}
                    value={content}
                    onChange={(e) => setContent(e.target.value)}
                ></textarea>
                 {isPlusMember && (
                    <div className="mt-3">
                        <input
                            type="url"
                            className="w-full bg-black/30 text-brand-text border border-brand-border rounded-md p-3 focus:outline-none focus:ring-2 focus:ring-brand-accent transition-shadow placeholder-brand-text-muted/50"
                            placeholder="Image URL (Plus Feature)"
                            value={imageUrl}
                            onChange={(e) => setImageUrl(e.target.value)}
                        />
                    </div>
                )}
                <div className="flex justify-end mt-3">
                    <button
                        type="submit"
                        disabled={!content.trim()}
                        className="bg-brand-interactive hover:bg-green-500 text-black font-bold py-2 px-6 rounded-md transition-all disabled:bg-brand-border disabled:text-brand-accent/50 disabled:cursor-not-allowed"
                    >
                        Post
                    </button>
                </div>
            </form>
        </div>
    );
};