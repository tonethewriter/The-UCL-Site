import React from 'react';
import { Link } from 'react-router-dom';
import { User } from './types';

export const AVAILABLE_REACTIONS = ['👍', '❤️', '😂', '🔥', '😮', '😢'];

// Utility function to read a file and convert it to a Base64 data URL
export const fileToBase64 = (file: File): Promise<string> =>
  new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = (error) => reject(error);
  });

// Utility function to parse text and convert @mentions to links
export const parseMentions = (text: string, users: User[]) => {
    const parts = text.split(/(@\w+)/g);
    return parts.map((part, index) => {
        if (part.startsWith('@')) {
            const gamertag = part.substring(1);
            const user = users.find(u => u.gamertag.toLowerCase() === gamertag.toLowerCase());
            if (user) {
                return (
                    <Link key={index} to={`/users/${user.id}`} className="text-brand-accent font-bold hover:underline">
                        {part}
                    </Link>
                );
            }
        }
        return part;
    });
};

export const ShimmeringGamertag: React.FC<{ user: User | undefined; baseClassName?: string; }> = ({ user, baseClassName = '' }) => {
    if (!user) return <span className={`${baseClassName} text-brand-text-muted italic`}>[Deleted User]</span>;
    if (!user.createdAt) return <span className={baseClassName}>{user.gamertag}</span>;

    const gamertag = user.gamertag;
    const isPlusUser = user.role.includes('_plus') || user.role === 'admin';
    
    const creationDate = new Date(user.createdAt);
    const now = new Date();
    const hoursSinceCreation = (now.getTime() - creationDate.getTime()) / (1000 * 60 * 60);

    const shouldShimmer = isPlusUser || hoursSinceCreation < 48;

    if (shouldShimmer) {
        return (
            <span className={baseClassName} aria-label={gamertag}>
                {gamertag.split('').map((char, index) => (
                    <span
                        key={index}
                        className="shimmer-char"
                        style={{ animationDelay: `${index * 0.07}s` }}
                        aria-hidden="true"
                    >
                        {char === ' ' ? '\u00A0' : char}
                    </span>
                ))}
            </span>
        );
    }

    return <span className={baseClassName}>{gamertag}</span>;
};

export const UCLPointIcon: React.FC = () => (
  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
  </svg>
);

export const CommentIcon: React.FC = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
        <path d="M2 5a2 2 0 012-2h12a2 2 0 012 2v6a2 2 0 01-2 2H4a2 2 0 01-2-2V5zm1.5 0a.5.5 0 00-.5.5v6a.5.5 0 00.5.5h11a.5.5 0 00.5-.5V5.5a.5.5 0 00-.5-.5h-11z" />
        <path d="M3 13.5a.5.5 0 01.5-.5h9a.5.5 0 010 1h-9a.5.5 0 01-.5-.5z" />
    </svg>
);

export const QuestionMarkIcon: React.FC = () => (
    <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.79 4 4 0 1.105-.448 2.105-1.172 2.828-.724.724-1.724 1.172-2.828 1.172-1.104 0-2.104-.448-2.828-1.172a3.986 3.986 0 01-1.172-2.828c0-1.105.448-2.105 1.172-2.828z" />
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 18v.01" />
    </svg>
);

export const PayPalIcon: React.FC = () => (
    <svg className="w-5 h-5" role="img" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
        <title>PayPal</title>
        <path d="M7.064 6.421c.216-1.023 1.22-1.73 2.454-1.73h6.42c2.81 0 4.207 1.754 3.659 4.614-.548 2.86-2.453 4.31-4.962 4.31H9.986c-.548 0-.914.365-.73 1.092l1.64 4.568c.182.546.637.91 1.182.91h2.274c.455 0 .819-.273.91-.728l.455-2.273c.182-.82-.273-1.273-1.092-1.273H9.256c-1.365 0-2.365-.728-2.637-2.002-.273-1.273.454-2.183 1.545-2.183h8.37c1.545 0 2.454-.728 2.726-2.09.273-1.365-.455-2.183-1.636-2.183h-5.82c-1.454 0-2.272.819-2.545 2.002-.124.546-.6.82-1.143.728L7.065 6.42z" fill="#003087"/>
    </svg>
);

export const CreditCardIcon: React.FC = () => (
    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
    </svg>
);

export const ApplePayIcon: React.FC = () => (
    <svg className="w-5 h-5" role="img" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
        <title>Apple Pay</title>
        <path d="M18.89 12.005c0 1.94-1.205 3.033-3.111 3.033-1.859 0-2.82-1.01-4.223-1.01-.278 0-1.636.987-2.986.987-1.835 0-3.328-1.228-3.328-3.21s1.397-3.234 3.218-3.234c.99 0 2.242.73 3.44.73.189 0 2.071-.84 3.492-.84 1.779.023 3.498 1.345 3.498 3.545zM15.116 8.35c.023-1.812 1.467-2.843 3.111-2.933-.189.047-2.16 1.25-2.709 2.91zm-4.482-.862c.942-1.137 2.404-1.916 2.404-1.916s-1.467 1.835-2.266 2.843c-.776.987-1.489 2.583-1.489 2.583s-1.558-1.51-2.52-2.73c-1.08-.942-2.07-1.858-2.07-1.858s2.023.753 3.047 1.767c.189.188.82.707 1.161.942.34-.14.776-.42 1.185-.73z" fill="currentColor"/>
    </svg>
);

export const BellIcon: React.FC<{className?: string}> = ({ className = "h-6 w-6" }) => (
    <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
    </svg>
);

export const TrophyIcon: React.FC<{className?: string}> = ({ className = "h-5 w-5" }) => (
    <svg className={className} viewBox="0 0 20 20" fill="currentColor">
        <path d="M17.926 5.546A4.998 4.998 0 0013 2.003a5.007 5.007 0 00-4.33 2.502 5.007 5.007 0 00-4.33-2.502A4.998 4.998 0 00.074 5.546c-.321.936-.321 2.064 0 3C.569 10.38 2.21 12 4.5 12c.797 0 1.54-.22 2.168-.602a1 1 0 011.063.093l.394.33a1 1 0 001.216-.002l.14-.116.33-.275a1 1 0 011.063-.093A4.98 4.98 0 0015.5 12c2.29 0 3.932-1.62 4.426-3.454.321-.936.321-2.064 0-3z" />
        <path fillRule="evenodd" d="M10 13a1 1 0 011 1v2.25c0 .414.336.75.75.75h1.5a.75.75 0 010 1.5h-1.5A2.25 2.25 0 0111 16.25V14a1 1 0 01-1-1v-.001a1 1 0 01-1 1V16.25A2.25 2.25 0 016.75 18h-1.5a.75.75 0 010-1.5h1.5a.75.75 0 01.75-.75V14a1 1 0 011-1z" clipRule="evenodd" />
    </svg>
);

export const HeartIcon: React.FC = () => (
    <svg className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
        <path fillRule="evenodd" d="M3.172 5.172a4 4 0 015.656 0L10 6.343l1.172-1.171a4 4 0 115.656 5.656L10 17.657l-6.828-6.829a4 4 0 010-5.656z" clipRule="evenodd" />
    </svg>
);

export const PencilIcon: React.FC<{className?: string}> = ({ className = "h-5 w-5" }) => (
    <svg className={className} viewBox="0 0 20 20" fill="currentColor">
        <path d="M17.414 2.586a2 2 0 00-2.828 0L7 10.172V13h2.828l7.586-7.586a2 2 0 000-2.828z" />
        <path fillRule="evenodd" d="M2 6a2 2 0 012-2h4a1 1 0 010 2H4v10h10v-4a1 1 0 112 0v4a2 2 0 01-2 2H4a2 2 0 01-2-2V6z" clipRule="evenodd" />
    </svg>
);

export const TrashIcon: React.FC<{className?: string}> = ({ className = "h-5 w-5" }) => (
    <svg className={className} viewBox="0 0 20 20" fill="currentColor">
        <path fillRule="evenodd" d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm4 0a1 1 0 012 0v6a1 1 0 11-2 0V8z" clipRule="evenodd" />
    </svg>
);

export const MessageIcon: React.FC<{className?: string}> = ({ className = "h-5 w-5" }) => (
    <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
    </svg>
);

export const UserIcon: React.FC<{className?: string}> = ({ className = "h-5 w-5" }) => (
    <svg className={className} viewBox="0 0 20 20" fill="currentColor">
        <path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd" />
    </svg>
);

export const XIcon: React.FC<{className?: string}> = ({ className = "h-5 w-5" }) => (
    <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
    </svg>
);

export const ImageIcon: React.FC<{className?: string}> = ({ className = "h-5 w-5" }) => (
    <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
    </svg>
);

export const LightbulbIcon: React.FC<{className?: string}> = ({ className = "h-6 w-6" }) => (
    <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
    </svg>
);

export const TwitterIcon: React.FC<{className?: string}> = ({ className = "h-5 w-5" }) => (
    <svg className={className} role="img" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" fill="currentColor">
        <title>Twitter</title>
        <path d="M22.46 6c-.77.35-1.6.58-2.46.67.88-.53 1.56-1.37 1.88-2.38-.83.5-1.75.85-2.72 1.05C18.37 4.5 17.26 4 16 4c-2.35 0-4.27 1.92-4.27 4.29 0 .34.04.67.11.98-3.56-.18-6.73-1.89-8.84-4.48-.37.63-.58 1.37-.58 2.15 0 1.49.75 2.81 1.91 3.56-.71 0-1.37-.22-1.95-.55v.05c0 2.08 1.48 3.82 3.44 4.21a4.22 4.22 0 0 1-1.93.07 4.28 4.28 0 0 0 4 2.98 8.52 8.52 0 0 1-5.33 1.84c-.34 0-.68-.02-1.01-.06 1.79 1.15 3.92 1.82 6.23 1.82 7.48 0 11.57-6.2 11.57-11.57 0-.18 0-.35-.01-.52.8-.58 1.48-1.3 2.02-2.1z"/>
    </svg>
);

export const TwitchIcon: React.FC<{className?: string}> = ({ className = "h-5 w-5" }) => (
    <svg className={className} role="img" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" fill="currentColor">
        <title>Twitch</title>
        <path d="M11.571 4.714h1.715v5.143H11.57zm4.714 0h1.715v5.143h-1.715zM6 0L1.714 4.286v15.428h5.143V24l4.286-4.286h3.428L22.286 12V0H6zm14.571 11.143l-3.428 3.428h-3.429l-3 3v-3H8.571V1.714h12v9.429z"/>
    </svg>
);

export const YouTubeIcon: React.FC<{className?: string}> = ({ className = "h-5 w-5" }) => (
    <svg className={className} role="img" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" fill="currentColor">
        <title>YouTube</title>
        <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/>
    </svg>
);

export const CoinIcon: React.FC<{className?: string}> = ({ className = "h-5 w-5" }) => (
    <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 8h6m-5 4h4m5 6H5a2 2 0 01-2-2V7a2 2 0 012-2h14a2 2 0 012 2v10a2 2 0 01-2 2z" />
    </svg>
);

export const ShieldCheckIcon: React.FC<{className?: string}> = ({ className = "h-5 w-5" }) => (
  <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 20.944A12.02 12.02 0 0012 22c4.646 0 8.573-2.827 10.118-6.882a12.02 12.02 0 00-2.5-11.896z" />
  </svg>
);

export const UserPlusIcon: React.FC<{className?: string}> = ({ className = "h-5 w-5" }) => (
  <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z" />
  </svg>
);

export const EnvelopeIcon: React.FC<{className?: string}> = ({ className = "h-5 w-5" }) => (
  <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
  </svg>
);

export const AtSymbolIcon: React.FC<{className?: string}> = ({ className = "h-5 w-5" }) => (
  <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 12a4 4 0 10-8 0 4 4 0 008 0zm0 0v1.5a2.5 2.5 0 005 0V12a9 9 0 10-9 9m4.5-1.206a8.959 8.959 0 01-4.5 1.207" />
  </svg>
);

export const UserGroupIcon: React.FC<{className?: string}> = ({ className = "h-5 w-5" }) => (
    <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.653-.124-1.282-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.653.124-1.282.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
    </svg>
);

export const SwitchHorizontalIcon: React.FC<{className?: string}> = ({ className = "h-5 w-5" }) => (
    <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4" />
    </svg>
);

export const HomeIcon: React.FC<{className?: string}> = ({ className = "h-5 w-5" }) => (
    <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
    </svg>
);

export const SettingsIcon: React.FC<{className?: string}> = ({ className = "h-5 w-5" }) => (
    <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
    </svg>
);

export const LogoutIcon: React.FC<{className?: string}> = ({ className = "h-5 w-5" }) => (
    <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
    </svg>
);