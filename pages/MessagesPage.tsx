import React, { useState, useMemo, useRef, useEffect } from 'react';
import { useAuth } from '../hooks/useAuth';
import { useLocation } from 'react-router-dom';
import { parseMentions, ShimmeringGamertag } from '../constants';

// Icons for UI
const SendIcon: React.FC = () => (
    <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
        <path d="M10.894 2.553a1 1 0 00-1.788 0l-7 14a1 1 0 001.169 1.409l5-1.429A1 1 0 009 15.571V11a1 1 0 112 0v4.571a1 1 0 00.725.962l5 1.428a1 1 0 001.17-1.408l-7-14z"></path>
    </svg>
);

const UsersIcon: React.FC = () => (
    <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
        <path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd"></path>
    </svg>
);

const CrownIcon: React.FC = () => (
    <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
        <path d="M11.05 3.001a1 1 0 00-2.1 0L6.44 8.752A1 1 0 007.392 10h5.216a1 1 0 00.952-1.248L11.05 3.001zM11.05 3.001L12 5.5l-1 2.5-1-2.5L11.05 3.001z"></path>
        <path fillRule="evenodd" d="M12.293 10.293a1 1 0 011.414 1.414l-2 2a1 1 0 01-1.414 0l-2-2a1 1 0 111.414-1.414L10 11.586l1.293-1.293zM5 10a1 1 0 011-1h8a1 1 0 110 2H6a1 1 0 01-1-1z" clipRule="evenodd"></path>
    </svg>
);

const UserIcon: React.FC = () => (
  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
    <path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd" />
  </svg>
);


// Main Component
export const MessagesPage: React.FC = () => {
    const { currentUser, users, teams, messages, sendMessage } = useAuth();
    const location = useLocation();
    const [activeChannelId, setActiveChannelId] = useState<string | null>(location.state?.activeChannelId || null);
    const [newMessage, setNewMessage] = useState('');
    const messagesEndRef = useRef<HTMLDivElement>(null);

    const channels = useMemo(() => {
        if (!currentUser) return [];
        const userChannels = new Map<string, { name: string, icon: React.ReactNode, type: 'group' | 'dm' }>();
        const dmChannelIds = new Set<string>();

        // Discover DMs from messages
        messages.forEach(msg => {
            if (msg.channelId.startsWith('dm_') && msg.channelId.includes(currentUser.id)) {
                dmChannelIds.add(msg.channelId);
            }
        });
        // Add DM channel from navigation state if it's new
        if (location.state?.activeChannelId) {
            dmChannelIds.add(location.state.activeChannelId);
        }

        // Add group channels
        // Owners channel: includes team owners, co-owners, and admins
        if (currentUser.role === 'admin' || currentUser.role.includes('owner')) {
            userChannels.set('owners_chat', { name: 'Owners Chat', icon: <CrownIcon />, type: 'group' });
        }

        // Team channel
        if (currentUser.teamId) {
            const team = teams.find(t => t.id === currentUser.teamId);
            if(team) {
                const channelId = `team_${team.name.replace(/\s+/g, '_')}`;
                userChannels.set(channelId, { name: `Team: ${team.name}`, icon: <UsersIcon />, type: 'group' });
            }
        }

        // Process discovered DM channels
        dmChannelIds.forEach(channelId => {
            const userIds = channelId.split('_').slice(1);
            const otherUserId = userIds.find(id => id !== currentUser.id);
            const otherUser = users.find(u => u.id === otherUserId);
            if (otherUser) {
                userChannels.set(channelId, { name: otherUser.gamertag, icon: <UserIcon />, type: 'dm' });
            }
        });

        const channelList = Array.from(userChannels.entries()).map(([id, data]) => ({ id, ...data }));
        
        if (!activeChannelId && channelList.length > 0) {
            setActiveChannelId(channelList[0].id);
        } else if (!userChannels.has(activeChannelId as string) && channelList.length > 0) {
            setActiveChannelId(channelList[0].id);
        }
        
        return channelList;
    }, [currentUser, messages, users, teams, activeChannelId, location.state]);

    const activeMessages = useMemo(() => {
        return messages
            .filter(m => m.channelId === activeChannelId)
            .sort((a, b) => new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime());
    }, [messages, activeChannelId]);

    const activeChannel = channels.find(c => c.id === activeChannelId);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    };

    useEffect(() => {
        scrollToBottom();
    }, [activeMessages]);

    const handleSendMessage = (e: React.FormEvent) => {
        e.preventDefault();
        if (newMessage.trim() && activeChannelId) {
            sendMessage(activeChannelId, newMessage.trim());
            setNewMessage('');
        }
    };

    const timeAgo = (dateString: string): string => {
        const date = new Date(dateString);
        const seconds = Math.floor((new Date().getTime() - date.getTime()) / 1000);
        let interval = seconds / 3600;
        if (interval > 1) return Math.floor(interval) + "h ago";
        interval = seconds / 60;
        if (interval > 1) return Math.floor(interval) + "m ago";
        return "just now";
    };

    if (!currentUser) return null;

    return (
        <div className="max-w-7xl mx-auto h-[calc(100vh-64px)] flex">
            <aside className="w-1/3 md:w-1/4 bg-brand-surface/40 border-r border-brand-border/30 flex flex-col">
                <div className="p-4 border-b border-brand-border/30">
                    <h1 className="text-xl font-bold text-white">Channels</h1>
                </div>
                <nav className="flex-1 p-2 space-y-1 overflow-y-auto">
                    {channels.map(channel => (
                        <button
                            key={channel.id}
                            onClick={() => setActiveChannelId(channel.id)}
                            className={`w-full flex items-center gap-3 p-3 rounded-lg text-left transition-colors ${
                                activeChannelId === channel.id ? 'bg-brand-accent/20 text-brand-accent' : 'text-brand-text-muted hover:bg-brand-surface'
                            }`}
                        >
                            <span className="text-brand-accent flex-shrink-0">{channel.icon}</span>
                            <span className="font-semibold truncate">{channel.name}</span>
                        </button>
                    ))}
                </nav>
            </aside>

            <main className="flex-1 flex flex-col bg-black/20">
                {activeChannel ? (
                    <>
                        <header className="p-4 border-b border-brand-border/30 bg-brand-surface/50 flex items-center gap-3">
                            <span className="text-brand-accent">{activeChannel.icon}</span>
                            <h2 className="text-lg font-bold text-white">{activeChannel.name}</h2>
                        </header>

                        <div className="flex-1 p-4 overflow-y-auto space-y-4">
                            {activeMessages.map(message => {
                                const author = users.find(u => u.id === message.senderId);
                                const isCurrentUser = message.senderId === currentUser.id;
                                return (
                                    <div key={message.id} className={`flex items-end gap-3 ${isCurrentUser ? 'justify-end' : 'justify-start'}`}>
                                        {!isCurrentUser && (
                                            <img
                                                src={author?.profilePicture || `https://i.pravatar.cc/150?u=${author?.gamertag}`}
                                                alt={author?.gamertag}
                                                className="w-8 h-8 rounded-full bg-brand-border object-cover flex-shrink-0"
                                            />
                                        )}
                                        <div className={`max-w-xs md:max-w-md p-3 rounded-xl ${isCurrentUser ? 'bg-brand-interactive text-black rounded-br-none' : 'bg-brand-surface text-white rounded-bl-none'}`}>
                                            {!isCurrentUser && (
                                                 <div className="flex items-baseline gap-2">
                                                    <ShimmeringGamertag user={author} baseClassName="font-bold text-sm" />
                                                    <p className="text-xs text-brand-text-muted">{timeAgo(message.timestamp)}</p>
                                                </div>
                                            )}
                                            <p className="text-sm whitespace-pre-wrap mt-1 break-words">{parseMentions(message.content, users)}</p>
                                        </div>
                                    </div>
                                );
                            })}
                            <div ref={messagesEndRef} />
                        </div>
                        
                        <div className="p-4 bg-brand-surface/50 border-t border-brand-border/30">
                            <form onSubmit={handleSendMessage} className="flex items-center gap-3">
                                <textarea
                                    value={newMessage}
                                    onChange={(e) => setNewMessage(e.target.value)}
                                    placeholder={`Message ${activeChannel.type === 'dm' ? '' : 'in '}${activeChannel.name}`}
                                    rows={1}
                                    className="flex-1 bg-black/30 text-white border border-brand-border rounded-lg p-2.5 resize-none focus:outline-none focus:ring-1 focus:ring-brand-accent transition text-sm"
                                />
                                <button type="submit" disabled={!newMessage.trim()} className="bg-brand-interactive hover:bg-green-500 text-black font-bold p-2.5 rounded-lg transition-colors disabled:bg-brand-border disabled:text-brand-accent/50 disabled:cursor-not-allowed">
                                    <SendIcon />
                                </button>
                            </form>
                        </div>
                    </>
                ) : (
                    <div className="flex-1 flex flex-col items-center justify-center text-center p-4">
                        <h2 className="text-2xl font-bold text-white">Welcome to Messages</h2>
                        <p className="text-brand-text-muted mt-2 max-w-sm">Select a channel to start communicating with your team and other league members.</p>
                    </div>
                )}
            </main>
        </div>
    );
};