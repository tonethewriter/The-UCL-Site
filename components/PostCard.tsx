import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Post, User } from '../types';
import { EmojiReaction } from './EmojiReaction';
import { RoleBadge } from './RoleBadge';
import { useAuth } from '../hooks/useAuth';
import { UCLPointIcon, CommentIcon } from '../constants';

interface PostCardProps {
  post: Post;
  author: User | undefined;
}

export const PostCard: React.FC<PostCardProps> = ({ post, author }) => {
    const { currentUser, reactionPointReward, addComment } = useAuth();
    const [isCommentsOpen, setIsCommentsOpen] = useState(false);
    const [newComment, setNewComment] = useState('');

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

    const handleCommentSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (newComment.trim()) {
            addComment(post.id, newComment);
            setNewComment('');
        }
    };

    return (
        <div className="bg-brand-surface p-5 rounded-lg shadow-lg border border-brand-border/50">
            <div className="flex items-center mb-3">
                {author?.profilePicture ? (
                    <img src={author.profilePicture} alt={post.authorGamertag} className="w-10 h-10 rounded-full bg-brand-border object-cover mr-3" />
                ) : (
                    <div className="w-10 h-10 rounded-full bg-brand-accent flex items-center justify-center font-bold text-black mr-3">
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

                    <p className="text-xs text-brand-text-muted">{timeAgo(post.timestamp)}</p>
                </div>
            </div>
            <p className="text-brand-text whitespace-pre-wrap my-4">{post.content}</p>
            
            {post.pointsAwarded && (
                <div className="mb-4 text-xs font-bold text-brand-accent bg-brand-accent/10 px-2.5 py-1 rounded-full inline-flex items-center gap-1.5">
                    <UCLPointIcon />
                    <span>+{reactionPointReward} UCL Points Earned</span>
                </div>
            )}

            <div className="flex items-center justify-between">
                <EmojiReaction post={post} />
                <button onClick={() => setIsCommentsOpen(!isCommentsOpen)} className="flex items-center gap-1.5 text-sm text-brand-accent/80 hover:text-brand-accent transition-colors">
                    <CommentIcon />
                    <span>{post.comments.length}</span>
                </button>
            </div>

            {isCommentsOpen && (
                <div className="mt-4 pt-4 border-t border-brand-border/50 space-y-4">
                    {post.comments.length > 0 ? (
                        post.comments.map(comment => (
                            <div key={comment.id} className="flex items-start space-x-3">
                                <div className="w-8 h-8 rounded-full bg-brand-border flex items-center justify-center font-bold text-brand-accent text-sm flex-shrink-0">
                                    {comment.authorGamertag.charAt(0).toUpperCase()}
                                </div>
                                <div className="flex-1 bg-black/20 p-2.5 rounded-lg">
                                    <div className="flex items-baseline justify-between">
                                        <Link to={`/users/${comment.authorId}`} className="font-semibold text-white text-sm hover:underline">{comment.authorGamertag}</Link>
                                        <span className="text-xs text-brand-text-muted">{timeAgo(comment.timestamp)}</span>
                                    </div>
                                    <p className="text-sm text-brand-text mt-1 whitespace-pre-wrap">{comment.content}</p>
                                </div>
                            </div>
                        ))
                    ) : (
                        <p className="text-sm text-brand-text-muted text-center py-2">No comments yet. Be the first to reply!</p>
                    )}

                    {currentUser && (
                        <form onSubmit={handleCommentSubmit} className="flex items-start space-x-3 pt-4">
                            <div className="w-8 h-8 rounded-full bg-brand-accent flex items-center justify-center font-bold text-black text-sm flex-shrink-0">
                                {currentUser.gamertag.charAt(0).toUpperCase()}
                            </div>
                            <div className="flex-1">
                                <textarea
                                    value={newComment}
                                    onChange={(e) => setNewComment(e.target.value)}
                                    placeholder="Write a comment..."
                                    className="w-full bg-black/30 text-white border border-brand-border rounded-md p-2 focus:outline-none focus:ring-1 focus:ring-brand-accent transition text-sm"
                                    rows={2}
                                />
                                <div className="text-right">
                                <button type="submit" disabled={!newComment.trim()} className="mt-2 bg-brand-interactive hover:bg-green-500 text-black font-bold py-1 px-4 rounded-md text-xs transition disabled:bg-brand-border disabled:text-brand-accent/50 disabled:cursor-not-allowed">
                                    Post
                                </button>
                                </div>
                            </div>
                        </form>
                    )}
                </div>
            )}
        </div>
    );
};