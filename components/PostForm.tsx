import React, { useState } from 'react';
import { useAuth } from '../hooks/useAuth';

export const PostForm: React.FC = () => {
    const [content, setContent] = useState('');
    const { addPost } = useAuth();

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (content.trim()) {
            addPost(content);
            setContent('');
        }
    };

    return (
        <div className="bg-brand-surface p-4 rounded-lg shadow-md mb-8 border border-brand-border/50">
            <form onSubmit={handleSubmit}>
                <textarea
                    className="w-full bg-black/30 text-brand-text border border-brand-border rounded-md p-3 focus:outline-none focus:ring-2 focus:ring-brand-accent transition-shadow placeholder-brand-text-muted/50"
                    rows={4}
                    placeholder="What's on your mind?"
                    value={content}
                    onChange={(e) => setContent(e.target.value)}
                ></textarea>
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