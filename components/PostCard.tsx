import React from 'react';
import { Link } from 'react-router-dom';
import { Post, User } from '../types';
import { EmojiReaction } from './EmojiReaction';
import { RoleBadge } from './RoleBadge';
import { useAuth } from '../hooks/useAuth';
import { UCLPointIcon } from '../constants';

interface PostCardProps {
  post: Post;
  author: User | undefined;
}

export const PostCard: React.FC<PostCardProps> = ({ post, author }) => {
    const { reactionPointReward } = useAuth();

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
                {author?.profilePicture ? (
                    <img src={author.profilePicture} alt={post.authorGamertag} className="w-10 h-10 rounded-full bg-green-800 object-cover mr-3" />
                ) : (
                    <div className="w-10 h-10 rounded-full bg-yellow-500 flex items-center justify-center font-bold text-green-900 mr-3">
                        {post.authorGamertag.charAt(0).toUpperCase()}
                    </div>
                )}
                <div>
                    <div className="flex items-center gap-2">
                         <Link to={`/users/${post.authorId}`} className="font-semibold text-white hover:underline">
                            {post.authorGamertag}
                        </Link>
                        {author && <RoleBadge role={author.role} />}
                    </div>

                    <p className="text-xs text-gray-400">{timeAgo(post.timestamp)}</p>
                </div>
            </div>
            <p className="text-gray-100 whitespace-pre-wrap my-4">{post.content}</p>
            
            {post.pointsAwarded && (
                <div className="mb-4 text-xs font-bold text-yellow-300 bg-yellow-500/10 px-2.5 py-1 rounded-full inline-flex items-center gap-1.5">
                    <UCLPointIcon />
                    <span>+{reactionPointReward} UCL Points Earned</span>
                </div>
            )}

            <EmojiReaction post={post} />
        </div>
    );
};