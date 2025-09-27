import React from 'react';
import { useAuth } from '../hooks/useAuth';
import { PostForm } from '../components/PostForm';
import { PostCard } from '../components/PostCard';

export const HomePage: React.FC = () => {
    const { currentUser, posts } = useAuth();

    return (
        <div className="max-w-3xl mx-auto py-8 px-4">
            <h1 className="text-5xl font-bold text-center mb-8 text-yellow-400 tracking-wider">UCL Wall</h1>
            {currentUser && <PostForm />}
            <div className="space-y-6">
                {posts.slice(0, 20).map(post => (
                    <PostCard key={post.id} post={post} />
                ))}
            </div>
        </div>
    );
};