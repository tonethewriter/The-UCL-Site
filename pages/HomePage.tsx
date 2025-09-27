import React, { useState, useMemo, useEffect, useCallback } from 'react';
import { useAuth } from '../hooks/useAuth';
import { PostForm } from '../components/PostForm';
import { PostCard } from '../components/PostCard';
import { Post } from '../types';

const POSTS_PER_PAGE = 10;
type SortByType = 'newest' | 'oldest' | 'mostReactions';

export const HomePage: React.FC = () => {
    const { currentUser, posts, users } = useAuth();
    const [searchTerm, setSearchTerm] = useState('');
    const [sortBy, setSortBy] = useState<SortByType>('newest');
    const [displayedPosts, setDisplayedPosts] = useState<Post[]>([]);
    const [page, setPage] = useState(1);
    const [isLoading, setIsLoading] = useState(false);
    const [hasMore, setHasMore] = useState(true);
    
    const sortedAndFilteredPosts = useMemo(() => {
        // 1. Filter posts for public only
        let filtered = posts.filter(p => !p.privateTeamId);

        if (searchTerm) {
            const lowercasedFilter = searchTerm.toLowerCase();
            filtered = filtered.filter(post => 
                post.content.toLowerCase().includes(lowercasedFilter) || 
                post.authorGamertag.toLowerCase().includes(lowercasedFilter)
            );
        }

        // 2. Sort posts
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
                    // Fallback to newest if reactions are equal
                    return new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime();
                case 'newest':
                default:
                    return new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime();
            }
        });

        return sorted;
    }, [posts, searchTerm, sortBy]);

    // Effect to reset and initialize posts when filter or sort changes
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
        // Simulate network delay for loading more posts
        setTimeout(() => {
            const nextPage = page + 1;
            const newPosts = sortedAndFilteredPosts.slice(page * POSTS_PER_PAGE, nextPage * POSTS_PER_PAGE);
            
            setDisplayedPosts(prevPosts => [...prevPosts, ...newPosts]);
            setPage(nextPage);
            setHasMore(sortedAndFilteredPosts.length > nextPage * POSTS_PER_PAGE);
            setIsLoading(false);
        }, 1000);
    }, [isLoading, hasMore, page, sortedAndFilteredPosts]);
    
    // Effect for scroll listener
    useEffect(() => {
        const handleScroll = () => {
            // Check if user is near the bottom
            const isAtBottom = window.innerHeight + document.documentElement.scrollTop >= document.documentElement.offsetHeight - 200;
            if (isAtBottom) {
                loadMorePosts();
            }
        };
        
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, [loadMorePosts]);

    return (
        <div className="max-w-3xl mx-auto py-6 md:py-8 px-4">
            <h1 className="text-4xl md:text-5xl font-bold text-center mb-4 text-brand-accent tracking-wider">UCL Wall</h1>
            
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

            {currentUser && <PostForm />}
            
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
        </div>
    );
};