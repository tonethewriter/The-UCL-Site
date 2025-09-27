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
        <div className="bg-green-900/50 p-4 rounded-lg shadow-md mb-8 border border-yellow-700/30">
            <form onSubmit={handleSubmit}>
                <textarea
                    className="w-full bg-green-800/60 text-white border border-green-700 rounded-md p-3 focus:outline-none focus:ring-2 focus:ring-yellow-500 transition-shadow placeholder-gray-400/50"
                    rows={4}
                    placeholder="What's on your mind?"
                    value={content}
                    onChange={(e) => setContent(e.target.value)}
                ></textarea>
                <div className="flex justify-end mt-3">
                    <button
                        type="submit"
                        disabled={!content.trim()}
                        className="bg-yellow-600 hover:bg-yellow-700 text-green-900 font-bold py-2 px-6 rounded-md transition-all disabled:bg-green-700 disabled:text-yellow-500/50 disabled:cursor-not-allowed"
                    >
                        Post
                    </button>
                </div>
            </form>
        </div>
    );
};