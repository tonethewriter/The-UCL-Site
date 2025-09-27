import React, { useState, useMemo, useEffect, useCallback } from 'react';
import { useAuth } from '../hooks/useAuth';
import { PostForm } from '../components/PostForm';
import { PostCard } from '../components/PostCard';
import { Post } from '../types';
import { ConfirmationModal } from '../components/ConfirmationModal';
import { TrashIcon, TrophyIcon } from '../constants';
import { TwitterFeed } from '../components/TwitterFeed';

const POSTS_PER_PAGE = 10;
type SortByType = 'newest' | 'oldest' | 'mostReactions';

export const HomePage: React.FC = () => {
    const { currentUser, posts, users, isWallPostingDisabled, toggleWallPosting, deleteAllPublicPosts, postOfTheWeekId } = useAuth();
    const [searchTerm, setSearchTerm] = useState('');
    const [sortBy, setSortBy] = useState<SortByType>('newest');
    const [displayedPosts, setDisplayedPosts] = useState<Post[]>([]);
    const [page, setPage] = useState(1);
    const [isLoading, setIsLoading] = useState(false);
    const [hasMore, setHasMore] = useState(true);
    const [isDeleteAllModalOpen, setIsDeleteAllModalOpen] = useState(false);
    
    const postOfTheWeek = useMemo(() => {
        if (!postOfTheWeekId) return null;
        const post = posts.find(p => p.id === postOfTheWeekId);
        if (!post) return null;
        const author = users.find(u => u.id === post.authorId);
        return { post, author };
    }, [postOfTheWeekId, posts, users]);

    const sortedAndFilteredPosts = useMemo(() => {
        let filtered = posts.filter(p => !p.privateTeamId);

        if (searchTerm) {
            const lowercasedFilter = searchTerm.toLowerCase();
            filtered = filtered.filter(post => 
                post.content.toLowerCase().includes(lowercasedFilter) || 
                post.authorGamertag.toLowerCase().includes(lowercasedFilter)
            );
        }

        const sorted = [...filtered].sort((a, b) => {
            switch (sortBy) {
                case 'oldest':
                    return new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime();
                case 'mostReactions':
                    const reactionsA = a.reactions.reduce((sum, r) => sum + r.users.length, 0);
                    const reactionsB = b.reactions.reduce((sum, r) => sum + r.users.length, 0);
                    if (reactionsB !== reactionsA) {
                        return reactionsB - reactionsA;
                    }
                    return new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime();
                case 'newest':
                default:
                    return new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime();
            }
        });

        return sorted;
    }, [posts, searchTerm, sortBy]);

    useEffect(() => {
        setIsLoading(true);
        const newPosts = sortedAndFilteredPosts.slice(0, POSTS_PER_PAGE);
        setDisplayedPosts(newPosts);
        setPage(1);
        setHasMore(sortedAndFilteredPosts.length > POSTS_PER_PAGE);
        setIsLoading(false);
    }, [sortedAndFilteredPosts]);

    const loadMorePosts = useCallback(() => {
        if (isLoading || !hasMore) return;
        
        setIsLoading(true);
        setTimeout(() => {
            const nextPage = page + 1;
            const newPosts = sortedAndFilteredPosts.slice(page * POSTS_PER_PAGE, nextPage * POSTS_PER_PAGE);
            
            setDisplayedPosts(prevPosts => [...prevPosts, ...newPosts]);
            setPage(nextPage);
            setHasMore(sortedAndFilteredPosts.length > nextPage * POSTS_PER_PAGE);
            setIsLoading(false);
        }, 500);
    }, [isLoading, hasMore, page, sortedAndFilteredPosts]);
    
    useEffect(() => {
        const handleScroll = () => {
            const isAtBottom = window.innerHeight + document.documentElement.scrollTop >= document.documentElement.offsetHeight - 200;
            if (isAtBottom) {
                loadMorePosts();
            }
        };
        
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, [loadMorePosts]);

    const handleConfirmDeleteAll = () => {
        deleteAllPublicPosts();
        setIsDeleteAllModalOpen(false);
    };

    return (
        <>
        <div className="max-w-7xl mx-auto py-6 md:py-8 px-4">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                <main className="lg:col-span-2">
                    {postOfTheWeek && (
                        <div className="mb-8 p-4 bg-gradient-to-tr from-yellow-800/20 via-brand-surface to-yellow-800/20 border-2 border-yellow-400/50 rounded-lg shadow-2xl">
                            <h2 className="text-2xl font-bold text-yellow-300 mb-4 text-center flex items-center justify-center gap-2">
                                <TrophyIcon className="w-6 h-6"/>
                                Post of the Week
                                <TrophyIcon className="w-6 h-6"/>
                            </h2>
                            <PostCard post={postOfTheWeek.post} author={postOfTheWeek.author} />
                        </div>
                    )}

                    <h1 className="text-4xl md:text-5xl font-bold text-center mb-4 text-brand-accent tracking-wider">UCL Wall</h1>

                    {currentUser?.role === 'admin' && (
                        <div className="bg-red-900/30 border border-red-500/50 p-4 rounded-lg mb-6">
                            <h3 className="text-lg font-bold text-red-300 mb-3">Admin Controls</h3>
                            <div className="flex flex-col sm:flex-row gap-4 items-center">
                                <div className="flex items-center gap-3">
                                    <span className="font-semibold text-white">Wall Posting:</span>
                                    <button onClick={toggleWallPosting} className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${isWallPostingDisabled ? 'bg-gray-600' : 'bg-brand-interactive'}`}>
                                        <span className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${isWallPostingDisabled ? 'translate-x-1' : 'translate-x-6'}`} />
                                    </button>
                                    <span className={`font-bold ${isWallPostingDisabled ? 'text-red-400' : 'text-green-400'}`}>{isWallPostingDisabled ? 'Disabled' : 'Enabled'}</span>
                                </div>
                                <button onClick={() => setIsDeleteAllModalOpen(true)} className="flex items-center gap-2 bg-red-600 hover:bg-red-700 text-white font-bold py-2 px-4 rounded-md transition-colors text-sm">
                                    <TrashIcon />
                                    Delete All Public Posts
                                </button>
                            </div>
                        </div>
                    )}
                    
                    <div className="mb-6 flex flex-col md:flex-row gap-4">
                        <input
                            type="text"
                            placeholder="Search posts by content or author..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="flex-grow bg-brand-surface text-white border border-brand-border rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-brand-accent transition placeholder-brand-text-muted/50"
                        />
                        <div className="relative">
                            <select
                                value={sortBy}
                                onChange={(e) => setSortBy(e.target.value as SortByType)}
                                className="w-full md:w-auto appearance-none bg-brand-surface text-white border border-brand-border rounded-lg p-3 pr-8 focus:outline-none focus:ring-2 focus:ring-brand-accent transition"
                                aria-label="Sort posts by"
                            >
                                <option value="newest">Sort by: Newest</option>
                                <option value="oldest">Sort by: Oldest</option>
                                <option value="mostReactions">Sort by: Most Reactions</option>
                            </select>
                            <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-brand-text-muted">
                                <svg className="fill-current h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20"><path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z"/></svg>
                            </div>
                        </div>
                    </div>

                    {currentUser && (
                        isWallPostingDisabled ? (
                            <div className="bg-yellow-900/50 border border-yellow-500/50 p-4 rounded-lg text-center mb-8">
                                <p className="font-bold text-yellow-300">Posting is currently disabled by an administrator.</p>
                            </div>
                        ) : (
                            <PostForm />
                        )
                    )}
                    
                    <div className="space-y-6 mt-8">
                        {displayedPosts.map(post => {
                            const author = users.find(u => u.id === post.authorId);
                            return <PostCard key={post.id} post={post} author={author} />;
                        })}
                    </div>
                    
                    {isLoading && (
                        <div className="text-center py-6">
                            <div className="w-8 h-8 border-4 border-brand-accent border-t-transparent rounded-full animate-spin mx-auto"></div>
                            <p className="mt-2 text-brand-text-muted">Loading more posts...</p>
                        </div>
                    )}
                    
                    {!hasMore && displayedPosts.length > 0 && (
                        <div className="text-center py-8 text-brand-text-muted border-t border-brand-border/30 mt-8">
                            <p>You've reached the end of the wall.</p>
                        </div>
                    )}
                </main>
                <aside className="lg:col-span-1">
                    <div className="lg:sticky lg:top-24 space-y-8">
                        <TwitterFeed />
                    </div>
                </aside>
            </div>
        </div>
        <ConfirmationModal
            isOpen={isDeleteAllModalOpen}
            onClose={() => setIsDeleteAllModalOpen(false)}
            onConfirm={handleConfirmDeleteAll}
            title="Delete All Public Posts"
            message="Are you sure you want to permanently delete all public posts from the wall? This action is irreversible and cannot be undone."
            confirmText="Yes, Delete Everything"
        />
        </>
    );
};