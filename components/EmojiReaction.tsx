import React from 'react';
import { Post } from '../types';
import { useAuth } from '../hooks/useAuth';
import { AVAILABLE_REACTIONS } from '../constants';

interface EmojiReactionProps {
  post: Post;
}

export const EmojiReaction: React.FC<EmojiReactionProps> = ({ post }) => {
    const { currentUser, toggleReaction } = useAuth();

    const handleReactionClick = (emoji: string) => {
        if (!currentUser) {
            alert("Please log in to react.");
            return;
        }
        toggleReaction(post.id, emoji);
    };

    return (
        <div className="flex items-center space-x-2">
            {post.reactions.map(({ emoji, users }) => (
                <button
                    key={emoji}
                    onClick={() => handleReactionClick(emoji)}
                    className={`px-3 py-1 rounded-full text-sm flex items-center space-x-1 transition-all
                        ${currentUser && users.includes(currentUser.id) ? 'bg-yellow-500/30 border-yellow-500 text-yellow-100' : 'bg-green-700/50 hover:bg-green-700 border-transparent'}
                        border`}
                >
                    <span>{emoji}</span>
                    <span className="font-semibold">{users.length}</span>
                </button>
            ))}
            {currentUser && (
                <div className="relative group">
                     <button className="bg-green-700/50 hover:bg-green-700 text-gray-300 px-3 py-1 rounded-full text-sm transition-colors">+</button>
                     <div className="absolute bottom-full mb-2 left-1/2 -translate-x-1/2 bg-green-800 shadow-lg rounded-full p-1 flex space-x-1 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none group-hover:pointer-events-auto">
                        {AVAILABLE_REACTIONS.map(emoji => (
                             <button 
                                key={emoji} 
                                onClick={() => handleReactionClick(emoji)}
                                className="text-xl p-1 rounded-full hover:bg-green-700 transition-transform hover:scale-125"
                             >
                                 {emoji}
                             </button>
                        ))}
                     </div>
                </div>
            )}
        </div>
    );
};