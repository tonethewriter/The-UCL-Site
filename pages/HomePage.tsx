import React, { useState, useMemo } from 'react';
import { useAuth } from '../hooks/useAuth';
import { PostForm } from '../components/PostForm';
import { PostCard } from '../components/PostCard';

export const HomePage: React.FC = () => {
    const { currentUser, posts, users } = useAuth();
    const [searchTerm, setSearchTerm] = useState('');

    const filteredPosts = useMemo(() => {
        if (!searchTerm) {
            return posts;
        }
        const lowercasedFilter = searchTerm.toLowerCase();
        return posts.filter(post => 
            post.content.toLowerCase().includes(lowercasedFilter) || 
            post.authorGamertag.toLowerCase().includes(lowercasedFilter)
        );
    }, [posts, searchTerm]);

    return (
        <div className="max-w-3xl mx-auto py-8 px-4">
            <h1 className="text-5xl font-bold text-center mb-4 text-yellow-300 tracking-wider">UCL Wall</h1>
            
            <div className="mb-6">
                <input
                    type="text"
                    placeholder="Search posts by content or author..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full bg-green-900/60 text-white border border-green-800 rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-yellow-500 transition placeholder-gray-400/50"
                />
            </div>

            {currentUser && <PostForm />}
            
            <div className="space-y-6 mt-8">
                {filteredPosts.slice(0, 20).map(post => {
                    const author = users.find(u => u.id === post.authorId);
                    return <PostCard key={post.id} post={post} author={author} />;
                })}
            </div>
        </div>
    );
};