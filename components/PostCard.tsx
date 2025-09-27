import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Post, User } from '../types';
import { EmojiReaction } from './EmojiReaction';
import { RoleBadge } from './RoleBadge';
import { useAuth } from '../hooks/useAuth';
import { UCLPointIcon, CommentIcon, TrashIcon, parseMentions, ShimmeringGamertag } from '../constants';
import { ConfirmationModal } from './ConfirmationModal';

const PinIcon: React.FC<{className?: string}> = ({ className }) => (
    <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 8v8m-4-5v5m-4-2v2m-2 4h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
    </svg>
);


export const PostCard: React.FC<{ post: Post; author: User | undefined; }> = ({ post, author }) => {
    const { currentUser, reactionPointReward, addComment, deletePost, users, pinPost } = useAuth();
    const [isCommentsOpen, setIsCommentsOpen] = useState(false);
    const [newComment, setNewComment] = useState('');
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);

    const isAuthor = currentUser?.id === post.authorId;
    const isPlusMember = currentUser?.role.includes('_plus') || currentUser?.role === 'admin';
    const isPinned = currentUser?.pinnedPostId === post.id;

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

    const handleConfirmDelete = () => {
        deletePost(post.id);
        setIsDeleteModalOpen(false);
    };

    const handlePinClick = () => {
        pinPost(isPinned ? null : post.id);
    };

    return (
        <>
            <div className="bg-brand-surface p-5 rounded-lg shadow-lg border border-brand-border/50 relative">
                <div className="absolute top-3 right-3 flex items-center gap-2">
                     {isAuthor && isPlusMember && (
                        <button
                            onClick={handlePinClick}
                            className={`p-1.5 rounded-full transition-colors ${isPinned ? 'text-brand-accent bg-brand-accent/20' : 'text-brand-text-muted/60 hover:text-brand-accent hover:bg-brand-accent/10'}`}
                            aria-label={isPinned ? 'Unpin post' : 'Pin post'}
                            title={isPinned ? 'Unpin from profile' : 'Pin to profile'}
                        >
                            <PinIcon className="w-5 h-5" />
                        </button>
                    )}
                    {currentUser?.role === 'admin' && (
                        <button
                            onClick={() => setIsDeleteModalOpen(true)}
                            className="text-red-500/60 hover:text-red-500 hover:bg-red-500/10 p-1.5 rounded-full transition-colors"
                            aria-label="Delete post"
                        >
                            <TrashIcon className="w-5 h-5" />
                        </button>
                    )}
                </div>
                <div className="flex items-center mb-3">
                    {author?.profilePicture ? (
                        <img src={author.profilePicture} alt={post.authorGamertag} className="w-10 h-10 rounded-full bg-brand-border object-cover mr-3" />
                    ) : (
                        <div className="w-10 h-10 rounded-full bg-brand-accent flex items-center justify-center font-bold text-black mr-3">
                            {author ? author.gamertag.charAt(0).toUpperCase() : '?'}
                        </div>
                    )}
                    <div>
                        <div className="flex items-center gap-2">
                            <Link to={`/users/${post.authorId}`} className="font-semibold text-white hover:underline">
                                <ShimmeringGamertag user={author} />
                            </Link>
                            {author && <RoleBadge role={author.role} />}
                        </div>

                        <p className="text-xs text-brand-text-muted">{timeAgo(post.timestamp)}</p>
                    </div>
                </div>
                <p className="text-brand-text whitespace-pre-wrap my-4">{parseMentions(post.content, users)}</p>
                
                {post.imageUrl && (
                    <div className="my-4 rounded-lg overflow-hidden border border-brand-border/50">
                        <img src={post.imageUrl} alt="Post attachment" className="w-full h-auto object-cover" />
                    </div>
                )}
                
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
                            post.comments.map(comment => {
                                const commentAuthor = users.find(u => u.id === comment.authorId);
                                return (
                                <div key={comment.id} className="flex items-start space-x-3">
                                    <div className="w-8 h-8 rounded-full bg-brand-border flex items-center justify-center font-bold text-brand-accent text-sm flex-shrink-0">
                                        {comment.authorGamertag.charAt(0).toUpperCase()}
                                    </div>
                                    <div className="flex-1 bg-black/20 p-2.5 rounded-lg">
                                        <div className="flex items-baseline justify-between">
                                            <Link to={`/users/${comment.authorId}`} className="font-semibold text-white text-sm hover:underline">
                                                <ShimmeringGamertag user={commentAuthor} />
                                            </Link>
                                            <span className="text-xs text-brand-text-muted">{timeAgo(comment.timestamp)}</span>
                                        </div>
                                        <p className="text-sm text-brand-text mt-1 whitespace-pre-wrap">{parseMentions(comment.content, users)}</p>
                                    </div>
                                </div>
                            )})
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
            <ConfirmationModal
                isOpen={isDeleteModalOpen}
                onClose={() => setIsDeleteModalOpen(false)}
                onConfirm={handleConfirmDelete}
                title="Delete Post"
                message="Are you sure you want to permanently delete this post? This action cannot be undone."
                confirmText="Yes, Delete Post"
            />
        </>
    );
};