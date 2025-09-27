import React from 'react';
import { Post } from '../types';
import { useAuth } from '../hooks/useAuth';
import { AVAILABLE_REACTIONS } from '../constants';

interface EmojiReactionProps {
  post: Post;
}

export const EmojiReaction: React.FC<EmojiReactionProps> = ({ post }) => {
    const { currentUser, toggleReaction, customEmojis } = useAuth();

    const handleReactionClick = (emoji: string) => {
        if (!currentUser) {
            alert("Please log in to react.");
            return;
        }
        toggleReaction(post.id, emoji);
    };

    return (
        <div className="flex items-center space-x-2 flex-wrap gap-y-2">
            {post.reactions.map(({ emoji, users }) => {
                 const customEmoji = customEmojis.find(ce => ce.id === emoji);
                 return (
                    <button
                        key={emoji}
                        onClick={() => handleReactionClick(emoji)}
                        className={`px-3 py-1 rounded-full text-sm flex items-center space-x-2 transition-all
                            ${currentUser && users.includes(currentUser.id) ? 'bg-brand-accent/30 border-brand-accent text-brand-text' : 'bg-brand-surface hover:bg-brand-border border-transparent'}
                            border`}
                    >
                         {customEmoji ? (
                            <img src={customEmoji.imageUrl} alt={customEmoji.name} className="w-5 h-5" />
                         ) : (
                            <span>{emoji}</span>
                         )}
                        <span className="font-semibold">{users.length}</span>
                    </button>
                )
            })}
            {currentUser && (
                <div className="relative group">
                     <button className="bg-brand-surface hover:bg-brand-border text-brand-text-muted px-3 py-1 rounded-full text-sm transition-colors">+</button>
                     <div className="absolute bottom-full mb-2 left-1/2 -translate-x-1/2 bg-brand-surface shadow-lg rounded-full p-1 flex space-x-1 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none group-hover:pointer-events-auto border border-brand-border">
                        {AVAILABLE_REACTIONS.map(emoji => (
                             <button 
                                key={emoji} 
                                onClick={() => handleReactionClick(emoji)}
                                className="text-xl p-1 rounded-full hover:bg-brand-border transition-transform hover:scale-125"
                             >
                                 {emoji}
                             </button>
                        ))}
                        {customEmojis.map(emoji => (
                            <button
                                key={emoji.id}
                                onClick={() => handleReactionClick(emoji.id)}
                                className="p-1 rounded-full hover:bg-brand-border transition-transform hover:scale-125"
                                title={emoji.name}
                            >
                                <img src={emoji.imageUrl} alt={emoji.name} className="w-6 h-6" />
                            </button>
                        ))}
                     </div>
                </div>
            )}
        </div>
    );
};