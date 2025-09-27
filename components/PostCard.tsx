import React from 'react';
import { Post } from '../types';
import { EmojiReaction } from './EmojiReaction';

interface PostCardProps {
  post: Post;
}

export const PostCard: React.FC<PostCardProps> = ({ post }) => {
    const timeAgo = (dateString: string): string => {
        const date = new Date(dateString);
        const seconds = Math.floor((new Date().getTime() - date.getTime()) / 1000);
        let interval = seconds / 31536000;
        if (interval > 1) return Math.floor(interval) + " years ago";
        interval = seconds / 2592000;
        if (interval > 1) return Math.floor(interval) + " months ago";
        interval = seconds / 86400;
        if (interval > 1) return Math.floor(interval) + " days ago";
        interval = seconds / 3600;
        if (interval > 1) return Math.floor(interval) + " hours ago";
        interval = seconds / 60;
        if (interval > 1) return Math.floor(interval) + " minutes ago";
        return "just now";
    };

    return (
        <div className="bg-green-900/60 p-5 rounded-lg shadow-lg border border-yellow-700/30">
            <div className="flex items-center mb-3">
                <div className="w-10 h-10 rounded-full bg-yellow-500 flex items-center justify-center font-bold text-green-900 mr-3">
                    {post.authorGamertag.charAt(0).toUpperCase()}
                </div>
                <div>
                    <p className="font-semibold text-yellow-200">{post.authorGamertag}</p>
                    <p className="text-xs text-yellow-500">{timeAgo(post.timestamp)}</p>
                </div>
            </div>
            <p className="text-yellow-300 whitespace-pre-wrap">{post.content}</p>
            <EmojiReaction post={post} />
        </div>
    );
};