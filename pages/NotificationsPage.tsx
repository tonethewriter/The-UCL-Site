import React from 'react';
import { useAuth } from '../hooks/useAuth';
import { Notification, NotificationType } from '../types';
import { useNavigate } from 'react-router-dom';
import { HeartIcon, CommentIcon, TrophyIcon, BellIcon, EnvelopeIcon, UserPlusIcon, AtSymbolIcon } from '../constants';

const NotificationIcon: React.FC<{ type: NotificationType }> = ({ type }) => {
    const iconMap: Record<NotificationType, React.ReactNode> = {
        new_reaction: <HeartIcon />,
        new_comment: <CommentIcon />,
        quest_complete: <TrophyIcon />,
        welcome: <BellIcon />,
        team_invite: <EnvelopeIcon />,
        team_application: <UserPlusIcon />,
        application_update: <BellIcon />,
        mention: <AtSymbolIcon />,
    };
    const colorMap: Record<NotificationType, string> = {
        new_reaction: 'bg-pink-500/20 text-pink-400',
        new_comment: 'bg-blue-500/20 text-blue-400',
        quest_complete: 'bg-yellow-500/20 text-yellow-400',
        welcome: 'bg-green-500/20 text-green-400',
        team_invite: 'bg-indigo-500/20 text-indigo-400',
        team_application: 'bg-purple-500/20 text-purple-400',
        application_update: 'bg-gray-500/20 text-gray-400',
        mention: 'bg-teal-500/20 text-teal-400',
    };
    return <div className={`w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0 ${colorMap[type]}`}>{iconMap[type]}</div>;
};

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

const NotificationItem: React.FC<{ notification: Notification }> = ({ notification }) => {
    const { markNotificationAsRead } = useAuth();
    const navigate = useNavigate();

    const handleClick = () => {
        if (!notification.isRead) {
            markNotificationAsRead(notification.id);
        }
        navigate(notification.link);
    };

    return (
        <div
            onClick={handleClick}
            className={`flex items-start gap-4 p-4 rounded-lg transition-colors cursor-pointer ${
                notification.isRead ? 'bg-brand-surface/30 hover:bg-brand-surface/60' : 'bg-brand-surface hover:bg-brand-surface/80'
            }`}
        >
            <NotificationIcon type={notification.type} />
            <div className="flex-1">
                <p className={`text-sm ${notification.isRead ? 'text-brand-text-muted' : 'text-brand-text'}`}>
                    {notification.message}
                </p>
                <p className={`text-xs mt-1 ${notification.isRead ? 'text-gray-500' : 'text-brand-accent'}`}>
                    {timeAgo(notification.timestamp)}
                </p>
            </div>
            {!notification.isRead && (
                <div className="w-2.5 h-2.5 bg-brand-accent rounded-full mt-1.5 flex-shrink-0"></div>
            )}
        </div>
    );
};

export const NotificationsPage: React.FC = () => {
    const { currentUser, notifications, markAllNotificationsAsRead } = useAuth();

    const userNotifications = notifications
        .filter(n => n.userId === currentUser?.id)
        .sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());
        
    const hasUnread = userNotifications.some(n => !n.isRead);

    return (
        <div className="max-w-3xl mx-auto py-10 px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between items-center mb-8">
                <h1 className="text-4xl font-bold text-brand-accent">Notifications</h1>
                {hasUnread && (
                    <button
                        onClick={markAllNotificationsAsRead}
                        className="text-sm font-semibold text-brand-accent/80 hover:text-brand-accent hover:underline transition-colors"
                    >
                        Mark all as read
                    </button>
                )}
            </div>
            
            <div className="space-y-3">
                {userNotifications.length > 0 ? (
                    userNotifications.map(notification => (
                        <NotificationItem key={notification.id} notification={notification} />
                    ))
                ) : (
                    <div className="text-center bg-brand-surface border border-brand-border/30 rounded-lg p-12">
                        <BellIcon className="h-12 w-12 mx-auto text-brand-text-muted" />
                        <h2 className="mt-4 text-2xl font-semibold text-white">No Notifications Yet</h2>
                        <p className="mt-2 text-brand-text-muted">
                            When you have new activity, your notifications will appear here.
                        </p>
                    </div>
                )}
            </div>
        </div>
    );
};