import React, { createContext, useState, useEffect, ReactNode } from 'react';
import { User, Post, Quest, UserRole, Comment, Message, Notification, NotificationType, NotificationSettings, Team, Invite, Application, InviteStatus, ActivityLog, ActivityLogEntity, CustomEmoji, ProfileVisibility, Feedback, FeedbackStatus } from '../types';

// --- Mock Data (acts as our in-memory database) ---

// Use a static date to make mock data consistent across reloads.
const MOCK_DATE = new Date('2024-07-20T12:00:00.000Z');

const defaultNotificationSettings: NotificationSettings = {
    inApp: {
        new_reaction: true,
        new_comment: true,
        quest_complete: true,
        welcome: true,
        team_invite: true,
        team_application: true,
        application_update: true,
        mention: true,
    },
    email: {
        new_reaction: true,
        new_comment: true,
        quest_complete: false,
    }
};

const defaultVisibilitySettings: ProfileVisibility = {
    showTeam: true,
    showSocials: true,
    showPoints: true,
    showPinnedPost: true,
};

const initialUsers: User[] = [
  // Old users
  { id: '1', gamertag: 'Admin', email: 'admin@ucl.com', pin: '1234', role: 'admin', uclPoints: 1500, profilePicture: 'https://i.pravatar.cc/150?u=Admin', profileBanner: 'https://placehold.co/1200x400/166534/4ade80?text=Admin+HQ', notificationSettings: defaultNotificationSettings, createdAt: new Date(MOCK_DATE.getTime() - 1000 * 60 * 60 * 24 * 30).toISOString(), profileVisibility: defaultVisibilitySettings, badges: ['Site Founder'] },
  { id: '4', gamertag: 'Viper', email: 'viper@ucl.com', pin: '1234', role: 'team_owner_plus', teamId: 't2', uclPoints: 1100, profilePicture: 'https://media.giphy.com/media/v1.Y2lkPTc5MGI3NjExM3ZnejRzZTNkcnNmMjB4N2ZtN2Y0cHJqZm5tYW51NWYzcGZseG8zayZlcD12MV9pbnRlcm5hbF9naWZfYnlfaWQmY3Q9Zw/f4V2mqb6YE50I/giphy.gif', profileBanner: 'https://placehold.co/1200x400/8b5cf6/ffffff?text=Viper', pinnedPostId: 'p3', notificationSettings: defaultNotificationSettings, twitter: 'https://twitter.com/example', createdAt: new Date(MOCK_DATE.getTime() - 1000 * 60 * 60 * 24 * 10).toISOString(), profileVisibility: defaultVisibilitySettings, badges: ['Site Founder'] },
  { id: '6', gamertag: 'Moderator', email: 'coowner@ucl.com', pin: '1234', role: 'player_plus', isModerator: true, teamId: 't2', uclPoints: 900, profilePicture: 'https://i.pravatar.cc/150?u=6', notificationSettings: defaultNotificationSettings, createdAt: new Date(MOCK_DATE.getTime() - 1000 * 60 * 60 * 24 * 5).toISOString(), profileVisibility: defaultVisibilitySettings, badges: ['Site Founder'] },
  { id: '7', gamertag: 'Shadow', email: 'shadow@ucl.com', pin: '1234', role: 'team_owner', teamId: 't1', uclPoints: 1000, profilePicture: 'https://i.pravatar.cc/150?u=7', notificationSettings: defaultNotificationSettings, createdAt: new Date(MOCK_DATE.getTime() - 1000 * 60 * 60 * 24 * 15).toISOString(), profileVisibility: defaultVisibilitySettings, badges: ['Site Founder'] },
  
  // Recent users (relative to MOCK_DATE)
  { id: '2', gamertag: 'Sniper', email: 'sniper@ucl.com', pin: '1234', role: 'player_plus', teamId: 't1', uclPoints: 850, profilePicture: 'https://media.giphy.com/media/v1.Y2lkPTc5MGI3NjExdzg1cjN1eDFwbWE5bGl6cjJ0YjU4NHo5M2V0ZGN0YmY5eGh0ZTM1dSZlcD12MV9pbnRlcm5hbF9naWZfYnlfaWQmY3Q9Zw/lv6K2844D2k2Q/giphy.gif', profileBanner: 'https://placehold.co/1200x400/3b82f6/ffffff?text=Sniper', notificationSettings: defaultNotificationSettings, twitch: 'https://www.twitch.tv/example', youtube: 'https://www.youtube.com/example', createdAt: new Date(MOCK_DATE.getTime() - 1000 * 60 * 60 * 12).toISOString(), profileVisibility: defaultVisibilitySettings, badges: ['Site Founder'] },
  { id: '3', gamertag: 'Ghost', email: 'ghost@ucl.com', pin: '1234', role: 'player', teamId: 't1', uclPoints: 320, profilePicture: 'https://i.pravatar.cc/150?u=3', notificationSettings: defaultNotificationSettings, createdAt: new Date(MOCK_DATE.getTime() - 1000 * 60 * 60 * 24).toISOString(), profileVisibility: defaultVisibilitySettings, badges: ['Site Founder'] },
  { id: '5', gamertag: 'Rogue', email: 'rogue@ucl.com', pin: '1234', role: 'player', uclPoints: 450, profilePicture: 'https://i.pravatar.cc/150?u=5', isFreeAgent: true, notificationSettings: defaultNotificationSettings, createdAt: new Date(MOCK_DATE.getTime() - 1000 * 60 * 60 * 40).toISOString(), profileVisibility: defaultVisibilitySettings, badges: ['Site Founder'] },
  { id: '8', gamertag: 'Blade', email: 'blade@ucl.com', pin: '1234', role: 'player', uclPoints: 200, profilePicture: 'https://i.pravatar.cc/150?u=8', isFreeAgent: true, notificationSettings: defaultNotificationSettings, createdAt: new Date(MOCK_DATE.getTime() - 1000 * 60 * 60 * 60).toISOString(), profileVisibility: defaultVisibilitySettings, badges: ['Site Founder'] },
];

const initialTeams: Team[] = [
    { id: 't1', name: 'Alpha Squad', logoUrl: 'https://placehold.co/200x200/4ade80/000000?text=AS', ownerId: '7', description: 'Alpha Squad is the premier competitive team in the UCL, known for their aggressive playstyle and strategic dominance.' },
    { id: 't2', name: 'Bravo Company', logoUrl: 'https://placehold.co/200x200/f87171/000000?text=BC', bannerUrl: 'https://placehold.co/1200x300/f87171/000000?text=Bravo+Company', ownerId: '4', description: 'Bravo Company values teamwork and communication above all else. A friendly and welcoming environment for dedicated players.' },
    { id: 't3', name: 'Crimson Guard', logoUrl: 'https://placehold.co/200x200/9333ea/000000?text=CG', ownerId: '1', description: 'The elite forces of the UCL, hand-picked by the admins.' },
];

const initialInvites: Invite[] = [
    { id: 'inv1', teamId: 't2', userId: '5', status: 'pending' },
];

const initialApplications: Application[] = [
    { id: 'app1', teamId: 't1', userId: '8', status: 'pending' },
];

const initialCustomEmojis: CustomEmoji[] = [
    { id: 'ce1', name: ':bc_logo:', imageUrl: 'https://placehold.co/40x40/f87171/000000?text=BC', uploaderId: '4' },
    { id: 'ce2', name: ':pog:', imageUrl: 'https://cdn.frankerfacez.com/emoticon/210748/1', uploaderId: '4' },
];

const initialPosts: Post[] = [
  {
    id: 'p1',
    authorId: '2',
    authorGamertag: 'Sniper',
    content: 'Just hit a sick 360 no-scope in the last match! Clip coming soon. Hey @Admin, check this out! #UCL #Gaming',
    imageUrl: 'https://placehold.co/600x400/3b82f6/ffffff?text=Amazing+Clip!',
    timestamp: new Date(MOCK_DATE.getTime() - 3600 * 1000 * 2).toISOString(),
    reactions: [{ emoji: '🔥', users: ['1', '4'] }, { emoji: '😮', users: ['3'] }, { emoji: 'ce2', users: ['7'] }],
    comments: [
        { id: 'c1', authorId: '4', authorGamertag: 'Viper', content: 'Can\'t wait to see it @Sniper!', timestamp: new Date(MOCK_DATE.getTime() - 3600 * 1000 * 1.5).toISOString() },
        { id: 'c2', authorId: '3', authorGamertag: 'Ghost', content: 'This is a comment that can be deleted by a mod.', timestamp: new Date(MOCK_DATE.getTime() - 3600 * 1000 * 1).toISOString() }
    ],
    pointsAwarded: true
  },
  {
    id: 'p2',
    authorId: '1',
    authorGamertag: 'Admin',
    content: 'Welcome to the new UCL Wall! Post your highlights, discuss strategies, and connect with other members. New quests are up, go check them out!',
    timestamp: new Date(MOCK_DATE.getTime() - 3600 * 1000 * 24).toISOString(),
    reactions: [{ emoji: '👍', users: ['2', '3', '4'] }],
    comments: [],
  },
   {
    id: 'p3',
    authorId: '4',
    authorGamertag: 'Viper',
    content: 'Bravo Company is recruiting! We are looking for dedicated players who value teamwork. Apply on our team page!',
    timestamp: new Date(MOCK_DATE.getTime() - 3600 * 1000 * 8).toISOString(),
    reactions: [{ emoji: '👍', users: ['5', '8'] }, { emoji: 'ce1', users:['6'] }],
    comments: [],
  },
  // Private team post
  {
    id: 'pt1',
    authorId: '4',
    authorGamertag: 'Viper',
    content: 'Team meeting this Friday at 8 PM EST to go over the new strats. Please confirm your attendance.',
    privateTeamId: 't2',
    timestamp: new Date(MOCK_DATE.getTime() - 3600 * 1000 * 4).toISOString(),
    reactions: [{ emoji: '👍', users: ['6'] }],
    comments: [],
  },
  ...Array.from({ length: 50 }, (_, i) => ({
    id: `p${i + 4}`,
    authorId: String((i % 5) + 2),
    authorGamertag: initialUsers.find(u => u.id === String((i % 5) + 2))?.gamertag || 'User',
    content: `This is dummy post number ${i + 3} to demonstrate infinite scrolling. Hope you enjoy the seamless experience!`,
    timestamp: new Date(MOCK_DATE.getTime() - 3600 * 1000 * (25 + i * 2)).toISOString(),
    reactions: [],
    comments: [],
  }))
];

const initialQuests: Quest[] = [
    { id: 'q1', title: 'First Blood', description: 'Get 10 eliminations in any game mode.', status: 'completed', prize: '50 UCL Points', claimedBy: ['2'], progress: 10, target: 10 },
    { id: 'q2', title: 'Team Player', description: 'Play 5 matches with your team.', status: 'started', prize: '100 UCL Points', claimedBy: [], progress: 2, target: 5 },
    { id: 'q3', title: 'Sharpshooter', description: 'Achieve a 5 kill streak.', status: 'incomplete', prize: '75 UCL Points', claimedBy: [] },
    { id: 'q4', title: 'Wall Poster', description: 'Make your first post on the UCL Wall.', status: 'completed', prize: '25 UCL Points', claimedBy: ['2', '1'], progress: 1, target: 1 }
];

const initialMessages: Message[] = [
  { id: 'm1', senderId: '1', senderGamertag: 'Admin', channelId: 'owners_chat', content: 'Welcome to the new Owners chat! Feel free to discuss league matters here.', timestamp: new Date(MOCK_DATE.getTime() - 3600 * 1000 * 5).toISOString() },
  { id: 'm2', senderId: '4', senderGamertag: 'Viper', channelId: 'owners_chat', content: 'This is a great addition, thanks Admin!', timestamp: new Date(MOCK_DATE.getTime() - 3600 * 1000 * 4).toISOString() },
  { id: 'm3', senderId: '4', senderGamertag: 'Viper', channelId: 'team_Bravo_Company', content: 'Team Bravo, let\'s get some practice matches in this weekend. Let me know your availability.', timestamp: new Date(MOCK_DATE.getTime() - 3600 * 1000 * 3).toISOString() },
  { id: 'm4', senderId: '2', senderGamertag: 'Sniper', channelId: 'team_Alpha_Squad', content: 'Our owner posted a new quest for us, we need to prep for the next tourney.', timestamp: new Date(MOCK_DATE.getTime() - 3600 * 1000 * 2).toISOString() },
  { id: 'm5', senderId: '3', senderGamertag: 'Ghost', channelId: 'team_Alpha_Squad', content: 'I\'m free Saturday afternoon.', timestamp: new Date(MOCK_DATE.getTime() - 3600 * 1000 * 1).toISOString() },
];

const initialNotifications: Notification[] = [
    { id: 'n1', userId: '2', type: 'new_reaction', message: 'Admin reacted 🔥 to your post.', link: '/', isRead: false, timestamp: new Date(MOCK_DATE.getTime() - 3600 * 1000 * 2).toISOString()},
    { id: 'n2', userId: '2', type: 'new_comment', message: 'Viper commented on your post: "Can\'t wait to see it!"', link: '/', isRead: true, timestamp: new Date(MOCK_DATE.getTime() - 3600 * 1000 * 1.5).toISOString()},
    { id: 'n3', userId: '2', type: 'quest_complete', message: 'You completed the quest: First Blood!', link: '/quests', isRead: false, timestamp: new Date(MOCK_DATE.getTime() - 3600 * 1000 * 10).toISOString()},
    { id: 'n4', userId: '5', type: 'team_invite', message: 'Viper has invited you to join Bravo Company.', link: '/profile', isRead: false, timestamp: new Date(MOCK_DATE.getTime() - 3600 * 1000 * 1).toISOString()},
    { id: 'n5', userId: '7', type: 'team_application', message: 'Blade has applied to join Alpha Squad.', link: '/teams/t1', isRead: false, timestamp: new Date(MOCK_DATE.getTime() - 3600 * 1000 * 1).toISOString()},
];

const initialActivityLog: ActivityLog[] = [
    { id: 'al0', timestamp: new Date(MOCK_DATE.getTime() - 1000 * 60 * 60 * 12).toISOString(), entities: [{ type: 'user', id: '2', text: 'Sniper' }, { type: 'text', text: ' has registered as a new user.' }] },
    { id: 'al1', timestamp: new Date(MOCK_DATE.getTime() - 3600 * 1000 * 20).toISOString(), entities: [{ type: 'user', id: '5', text: 'Rogue' }, { type: 'text', text: ' became a free agent.' }] },
    { id: 'al2', timestamp: new Date(MOCK_DATE.getTime() - 3600 * 1000 * 25).toISOString(), entities: [{ type: 'user', id: '8', text: 'Blade' }, { type: 'text', text: ' has registered as a new user.' }] },
    { id: 'al3', timestamp: new Date(MOCK_DATE.getTime() - 3600 * 1000 * 30).toISOString(), entities: [{ type: 'user', id: '4', text: 'Viper' }, { type: 'text', text: ' created a new team: ' }, { type: 'team', id: 't2', text: 'Bravo Company' }, { type: 'text', text: '.' }] },
];

const initialFeedback: Feedback[] = [
    { id: 'fb1', userId: '2', userGamertag: 'Sniper', type: 'suggestion', message: 'We should have tournaments for different game modes, not just the main one.', timestamp: new Date(MOCK_DATE.getTime() - 3600 * 1000 * 24 * 2).toISOString(), status: 'new' },
    { id: 'fb2', userId: '5', userGamertag: 'Rogue', type: 'bug_report', message: 'The post button is sometimes unresponsive on mobile. I have to tap it a few times.', timestamp: new Date(MOCK_DATE.getTime() - 3600 * 1000 * 24).toISOString(), status: 'viewed' },
];

export interface AuthContextType {
  currentUser: User | null;
  users: User[];
  posts: Post[];
  quests: Quest[];
  messages: Message[];
  notifications: Notification[];
  teams: Team[];
  invites: Invite[];
  applications: Application[];
  activityLog: ActivityLog[];
  customEmojis: CustomEmoji[];
  feedback: Feedback[];
  reactionPointReward: number;
  isWallPostingDisabled: boolean;
  postOfTheWeekId: string | null;
  login: (identifier: string, pin: string) => Promise<void>;
  logout: () => void;
  signUp: (gamertag: string, email: string, pin:string, role: UserRole, teamName?: string) => Promise<void>;
  addPost: (content: string, imageUrl?: string, privateTeamId?: string) => void;
  toggleReaction: (postId: string, emoji: string) => void;
  addComment: (postId: string, content: string) => void;
  claimQuestReward: (questId: string) => Promise<void>;
  updateQuestProgress: (questId: string, amount: number) => void;
  sendMessage: (channelId: string, content: string) => void;
  leaveTeam: () => Promise<void>;
  toggleFreeAgentStatus: () => Promise<void>;
  markNotificationAsRead: (notificationId: string) => void;
  markAllNotificationsAsRead: () => void;
  updateNotificationSettings: (settings: NotificationSettings) => Promise<void>;
  addQuest: (questData: { title: string; description: string; prize: string; target?: number }) => void;
  updateQuest: (questData: Quest) => void;
  deleteQuest: (questId: string) => void;
  deleteUser: (userId: string) => void;
  updateUserRole: (userId: string, newRole: UserRole) => void;
  deletePost: (postId: string) => void;
  deleteAllPublicPosts: () => void;
  submitFeedback: (type: string, message: string) => Promise<void>;
  updateFeedbackStatus: (feedbackId: string, status: FeedbackStatus) => Promise<void>;
  adjustUserPoints: (userId: string, amount: number) => void;
  updateUserProfile: (profileData: { gamertag: string; email: string; twitter?: string; twitch?: string; youtube?: string; }) => Promise<void>;
  updateProfilePicture: (pictureUrl: string) => Promise<void>;
  sendInvite: (teamId: string, userId: string) => Promise<void>;
  respondToInvite: (inviteId: string, response: 'accepted' | 'declined') => Promise<void>;
  applyToTeam: (teamId: string) => Promise<void>;
  respondToApplication: (applicationId: string, response: 'accepted' | 'declined') => Promise<void>;
  editTeamDetails: (teamId: string, details: { name: string; description: string; logoUrl: string; }) => Promise<void>;
  transferTeamOwnership: (teamId: string, newOwnerId: string) => Promise<void>;
  disbandTeam: (teamId: string) => Promise<void>;
  pinPost: (postId: string | null) => Promise<void>;
  updateProfileBanner: (bannerUrl: string) => Promise<void>;
  updateTeamBanner: (teamId: string, bannerUrl: string) => Promise<void>;
  addCustomEmoji: (name: string, imageUrl: string) => Promise<void>;
  deleteCustomEmoji: (emojiId: string) => Promise<void>;
  updateProfileVisibility: (settings: ProfileVisibility) => Promise<void>;
  timeoutUser: (userId: string, durationHours: number) => Promise<void>;
  deleteComment: (postId: string, commentId: string) => Promise<void>;
  toggleWallPosting: () => void;
  toggleModeratorStatus: (userId: string) => void;
  sendMassCommunication: (subject: string, message: string) => Promise<void>;
}

export const AuthContext = createContext<AuthContextType | undefined>(undefined);

// --- LocalStorage Persistence ---
// Helper function to safely read from localStorage.
const loadFromLocalStorage = <T,>(key: string, initialValue: T): T => {
    try {
        const saved = localStorage.getItem(key);
        return saved ? JSON.parse(saved) : initialValue;
    } catch (error) {
        console.warn(`Error reading ${key} from localStorage:`, error);
        return initialValue;
    }
};

// Helper function to safely write to localStorage.
const saveToLocalStorage = <T,>(key: string, value: T) => {
    try {
        localStorage.setItem(key, JSON.stringify(value));
    } catch (error) {
        console.error(`Error saving ${key} to localStorage:`, error);
    }
};


export const AuthProvider: React.FC<{children: ReactNode}> = ({ children }) => {
  // --- STATE MANAGEMENT ---
  // The current user's session is persisted in localStorage.
  const [currentUser, setCurrentUser] = useState<User | null>(() => loadFromLocalStorage('ucl_user', null));
  
  // All other app data is held in state and persisted to localStorage.
  // On first load, it initializes from mock data if localStorage is empty.
  const [users, setUsers] = useState<User[]>(() => loadFromLocalStorage('ucl_users', initialUsers));
  const [posts, setPosts] = useState<Post[]>(() => loadFromLocalStorage('ucl_posts', initialPosts));
  const [quests, setQuests] = useState<Quest[]>(() => loadFromLocalStorage('ucl_quests', initialQuests));
  const [messages, setMessages] = useState<Message[]>(() => loadFromLocalStorage('ucl_messages', initialMessages));
  const [notifications, setNotifications] = useState<Notification[]>(() => loadFromLocalStorage('ucl_notifications', initialNotifications));
  const [teams, setTeams] = useState<Team[]>(() => loadFromLocalStorage('ucl_teams', initialTeams));
  const [invites, setInvites] = useState<Invite[]>(() => loadFromLocalStorage('ucl_invites', initialInvites));
  const [applications, setApplications] = useState<Application[]>(() => loadFromLocalStorage('ucl_applications', initialApplications));
  const [activityLog, setActivityLog] = useState<ActivityLog[]>(() => loadFromLocalStorage('ucl_activityLog', initialActivityLog));
  const [customEmojis, setCustomEmojis] = useState<CustomEmoji[]>(() => loadFromLocalStorage('ucl_customEmojis', initialCustomEmojis));
  const [feedback, setFeedback] = useState<Feedback[]>(() => loadFromLocalStorage('ucl_feedback', initialFeedback));
  const [isWallPostingDisabled, setIsWallPostingDisabled] = useState<boolean>(() => loadFromLocalStorage('ucl_wall_posting_disabled', false));
  const [postOfTheWeekId, setPostOfTheWeekId] = useState<string | null>(() => loadFromLocalStorage('ucl_potw_id', null));
  
  const reactionPointReward = 5;

  // --- DATA PERSISTENCE ---
  // These effects save each slice of state to localStorage whenever it changes.
  useEffect(() => { saveToLocalStorage('ucl_users', users); }, [users]);
  useEffect(() => { saveToLocalStorage('ucl_posts', posts); }, [posts]);
  useEffect(() => { saveToLocalStorage('ucl_quests', quests); }, [quests]);
  useEffect(() => { saveToLocalStorage('ucl_messages', messages); }, [messages]);
  useEffect(() => { saveToLocalStorage('ucl_notifications', notifications); }, [notifications]);
  useEffect(() => { saveToLocalStorage('ucl_teams', teams); }, [teams]);
  useEffect(() => { saveToLocalStorage('ucl_invites', invites); }, [invites]);
  useEffect(() => { saveToLocalStorage('ucl_applications', applications); }, [applications]);
  useEffect(() => { saveToLocalStorage('ucl_activityLog', activityLog); }, [activityLog]);
  useEffect(() => { saveToLocalStorage('ucl_customEmojis', customEmojis); }, [customEmojis]);
  useEffect(() => { saveToLocalStorage('ucl_feedback', feedback); }, [feedback]);
  useEffect(() => { saveToLocalStorage('ucl_wall_posting_disabled', isWallPostingDisabled); }, [isWallPostingDisabled]);
  useEffect(() => { saveToLocalStorage('ucl_potw_id', postOfTheWeekId); }, [postOfTheWeekId]);

  // This effect synchronizes the currentUser state with the master 'users' list.
  // This is crucial for ensuring the logged-in user's data is always up-to-date
  // after any operation that might change it (e.g., earning points, changing roles).
  useEffect(() => {
    if (currentUser) {
        const updatedUserInList = users.find(u => u.id === currentUser.id);
        if (updatedUserInList) {
            // Prevent infinite loops by only updating if the data is actually different.
            if (JSON.stringify(currentUser) !== JSON.stringify(updatedUserInList)) {
                setCurrentUser(updatedUserInList);
            }
        } else {
            // If the user was deleted from the main list, log them out.
            logout();
        }
    }
  }, [users]); // This depends on `currentUser` as well, but adding it creates a render loop. `users` is the master list.

  // This effect saves the synchronized currentUser to its own localStorage entry for quick session restoration.
  useEffect(() => {
    if (currentUser) {
        saveToLocalStorage('ucl_user', currentUser);
    } else {
        localStorage.removeItem('ucl_user');
    }
  }, [currentUser]);

  // --- AUTOMATIONS ---
    useEffect(() => {
        const runWeeklyAutomations = () => {
            console.log('Running weekly automations...');
            
            // --- Post of the Week Logic ---
            const oneWeekAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000);
            const recentPublicPosts = posts.filter(p => !p.privateTeamId && new Date(p.timestamp) >= oneWeekAgo);
            
            if (recentPublicPosts.length > 0) {
                const topPost = recentPublicPosts.reduce((top, current) => {
                    const topReactions = top.reactions.reduce((sum, r) => sum + r.users.length, 0);
                    const currentReactions = current.reactions.reduce((sum, r) => sum + r.users.length, 0);
                    if (currentReactions > topReactions) return current;
                    if (currentReactions === topReactions) return new Date(current.timestamp) > new Date(top.timestamp) ? current : top;
                    return top;
                });

                if (topPost && topPost.reactions.reduce((s, r) => s + r.users.length, 0) > 0) {
                    setPostOfTheWeekId(topPost.id);
                    const author = users.find(u => u.id === topPost.authorId);
                    if (author) {
                        setUsers(prevUsers => prevUsers.map(u => u.id === author.id ? { ...u, uclPoints: u.uclPoints + 100 } : u));
                        createActivityLog([
                            { type: 'user', id: topPost.authorId, text: author.gamertag },
                            { type: 'text', text: ' was awarded Post of the Week and earned 100 UCL Points!' }
                        ]);
                    }
                }
            }

            // --- Weekly Quest Generation Logic ---
            setQuests(prev => {
                const nonWeeklyQuests = prev.filter(q => !q.title.startsWith('Weekly:'));
                const newWeeklyQuest: Quest = {
                    id: `wq-${Date.now()}`,
                    title: 'Weekly: Community Contributor',
                    description: 'Comment on 3 different public posts this week.',
                    prize: '50 UCL Points',
                    status: 'incomplete',
                    claimedBy: [],
                    target: 3,
                    progress: 0,
                };
                return [newWeeklyQuest, ...nonWeeklyQuests];
            });
        };

        const lastCheckString = localStorage.getItem('ucl_last_weekly_check');
        const lastCheck = lastCheckString ? new Date(lastCheckString) : new Date(0);
        const now = new Date();
        
        // Run on Sunday if it hasn't run this week
        if (now.getDay() === 0) {
            const lastSunday = new Date(now);
            lastSunday.setDate(now.getDate() - now.getDay());
            lastSunday.setHours(0, 0, 0, 0);

            if (lastCheck < lastSunday) {
                runWeeklyAutomations();
                localStorage.setItem('ucl_last_weekly_check', now.toISOString());
            }
        }
    }, []); // Run only on initial app mount

  
  const createActivityLog = (entities: ActivityLogEntity[]) => {
    const newLog: ActivityLog = {
        id: `al${Date.now()}`,
        timestamp: new Date().toISOString(),
        entities,
    };
    setActivityLog(prev => [newLog, ...prev]);
  };
  
  const createNotification = (userId: string, type: NotificationType, message: string, link: string) => {
    const user = users.find(u => u.id === userId);
    if (!user) return;
    
    if (user.notificationSettings.inApp[type as keyof NotificationSettings['inApp']]) {
      const newNotification: Notification = {
          id: `n${Date.now()}`,
          userId,
          type,
          message,
          link,
          isRead: false,
          timestamp: new Date().toISOString(),
      };
      setNotifications(prev => [newNotification, ...prev]);
    }
    
    if (type !== 'welcome' && user.notificationSettings.email[type as keyof NotificationSettings['email']]) {
         console.log(`(SIMULATE EMAIL) Sending email to ${user.email} for ${type}: "${message}"`);
    }
  };
  
  const parseAndNotifyMentions = (content: string, authorId: string, link: string) => {
    const mentions = content.match(/@(\w+)/g);
    if (mentions) {
        const author = users.find(u => u.id === authorId);
        const uniqueGamertags = new Set(mentions.map(m => m.substring(1).toLowerCase()));

        uniqueGamertags.forEach(gamertag => {
            const mentionedUser = users.find(u => u.gamertag.toLowerCase() === gamertag);
            if (mentionedUser && mentionedUser.id !== authorId) {
                createNotification(mentionedUser.id, 'mention', `${author?.gamertag || 'Someone'} mentioned you.`, link);
            }
        });
    }
  };


  const login = async (identifier: string, pin: string): Promise<void> => {
    const user = users.find(u => (u.gamertag.toLowerCase() === identifier.toLowerCase() || u.email.toLowerCase() === identifier.toLowerCase()) && u.pin === pin);
    if (user) {
      setCurrentUser(user);
    } else {
      throw new Error('Invalid credentials. Please try again.');
    }
  };

  const logout = () => {
    setCurrentUser(null);
  };

  const signUp = async (gamertag: string, email: string, pin: string, role: UserRole, teamName?: string): Promise<void> => {
    if (users.some(u => u.gamertag.toLowerCase() === gamertag.toLowerCase())) {
        throw new Error('Gamertag is already taken.');
    }
    if (users.some(u => u.email.toLowerCase() === email.toLowerCase())) {
        throw new Error('Email is already registered.');
    }

    const isFounder = users.length < 20;

    const newUser: User = {
        id: String(Date.now()),
        gamertag,
        email,
        pin,
        role,
        uclPoints: 0,
        profilePicture: `https://i.pravatar.cc/150?u=${gamertag}`,
        notificationSettings: defaultNotificationSettings,
        profileVisibility: defaultVisibilitySettings,
        createdAt: new Date().toISOString(),
        badges: isFounder ? ['Site Founder'] : [],
    };

    const needsTeamName = role === 'team_owner' || role === 'team_owner_plus' || role === 'co_owner';

    if (needsTeamName) {
        if (!teamName) throw new Error("A team name is required for this role.");
        const newTeam: Team = {
            id: `t${Date.now()}`,
            name: teamName,
            ownerId: newUser.id,
            logoUrl: `https://placehold.co/200x200/cccccc/000000?text=${teamName.substring(0, 2).toUpperCase()}`,
            description: `Welcome to the official page for ${teamName}.`
        };
        setTeams(prev => [...prev, newTeam]);
        newUser.teamId = newTeam.id;
        createActivityLog([{ type: 'user', id: newUser.id, text: newUser.gamertag }, { type: 'text', text: ' created a new team: ' }, { type: 'team', id: newTeam.id, text: teamName }, { type: 'text', text: '.' }]);
    }

    setUsers(prev => [...prev, newUser]);
    setCurrentUser(newUser);
    createNotification(newUser.id, 'welcome', 'Welcome to the United Clan League! Check out the quests to get started.', '/quests');
    createActivityLog([{ type: 'user', id: newUser.id, text: gamertag }, { type: 'text', text: ' has registered as a new user.' }]);
    
    if (isFounder) {
        createActivityLog([{ type: 'user', id: newUser.id, text: gamertag }, { type: 'text', text: ' has earned the Site Founder badge!' }]);
    }
  };

  const addPost = (content: string, imageUrl?: string, privateTeamId?: string) => {
    if (!currentUser) return;
    const newPost: Post = {
      id: `p${Date.now()}`,
      authorId: currentUser.id,
      authorGamertag: currentUser.gamertag,
      content,
      imageUrl: imageUrl,
      privateTeamId: privateTeamId,
      timestamp: new Date().toISOString(),
      reactions: [],
      comments: [],
    };
    setPosts(prev => [newPost, ...prev]);
    // Only parse mentions for public posts
    if (!privateTeamId) {
        parseAndNotifyMentions(content, currentUser.id, `/`);
    }
  };
  
  const toggleReaction = (postId: string, emoji: string) => {
    if (!currentUser) return;
    const post = posts.find(p => p.id === postId);
    if (!post) return;

    if (post.authorId !== currentUser.id && !post.privateTeamId) {
        const reaction = post.reactions.find(r => r.emoji === emoji);
        const hasReacted = reaction?.users.includes(currentUser.id);
        if (!hasReacted) {
             createNotification(post.authorId, 'new_reaction', `${currentUser.gamertag} reacted to your post.`, '/');
        }
    }

    setPosts(posts.map(p => {
      if (p.id !== postId) return p;

      const newReactions = [...p.reactions];
      const reactionIndex = newReactions.findIndex(r => r.emoji === emoji);

      if (reactionIndex > -1) {
        const users = newReactions[reactionIndex].users;
        const userIndex = users.indexOf(currentUser.id);

        if (userIndex > -1) {
          const updatedUsers = users.filter(id => id !== currentUser.id);
          if (updatedUsers.length === 0) {
            newReactions.splice(reactionIndex, 1);
          } else {
            newReactions[reactionIndex] = { ...newReactions[reactionIndex], users: updatedUsers };
          }
        } else {
          newReactions[reactionIndex] = { ...newReactions[reactionIndex], users: [...users, currentUser.id] };
        }
      } else {
        newReactions.push({ emoji, users: [currentUser.id] });
      }

      return { ...p, reactions: newReactions };
    }));
  };
  
  const addComment = (postId: string, content: string) => {
      if (!currentUser) return;
      const post = posts.find(p => p.id === postId);
      if (!post) return;
      
      const newComment: Comment = {
          id: `c${Date.now()}`,
          authorId: currentUser.id,
          authorGamertag: currentUser.gamertag,
          content,
          timestamp: new Date().toISOString(),
      };
      
      if (post.authorId !== currentUser.id && !post.privateTeamId) {
          createNotification(post.authorId, 'new_comment', `${currentUser.gamertag} commented on your post: "${content.substring(0, 30)}..."`, '/');
      }
      
      setPosts(posts.map(p => p.id === postId ? { ...p, comments: [...p.comments, newComment] } : p));
      
      if (!post.privateTeamId) {
        parseAndNotifyMentions(content, currentUser.id, `/`);
      }
  };
  
  const claimQuestReward = async (questId: string) => {
      if (!currentUser) throw new Error("You must be logged in to claim a reward.");
      const quest = quests.find(q => q.id === questId);
      if (!quest) throw new Error("Quest not found.");
      if (quest.status !== 'completed') throw new Error("Quest is not completed yet.");
      if (quest.claimedBy.includes(currentUser.id)) throw new Error("You have already claimed this reward.");

      setQuests(quests.map(q => q.id === questId ? { ...q, claimedBy: [...q.claimedBy, currentUser.id] } : q));
      const points = parseInt(quest.prize.split(' ')[0]) || 0;
      setUsers(users.map(u => u.id === currentUser.id ? { ...u, uclPoints: u.uclPoints + points } : u));
  };
  
  const updateQuestProgress = (questId: string, amount: number) => {
      if(!currentUser) return;
      setQuests(quests.map(q => {
          if (q.id === questId && q.status !== 'completed' && q.target) {
              const newProgress = Math.min((q.progress || 0) + amount, q.target);
              const newStatus = newProgress === q.target ? 'completed' : 'started';
              
              if (newStatus === 'completed') {
                  createNotification(currentUser.id, 'quest_complete', `You completed the quest: ${q.title}!`, '/quests');
              }
              
              return { ...q, progress: newProgress, status: newStatus };
          }
          return q;
      }));
  };

  const sendMessage = (channelId: string, content: string) => {
    if (!currentUser) return;
    const newMessage: Message = {
      id: `m${Date.now()}`,
      senderId: currentUser.id,
      senderGamertag: currentUser.gamertag,
      channelId,
      content,
      timestamp: new Date().toISOString(),
    };
    setMessages(prev => [...prev, newMessage]);
  };
  
  const leaveTeam = async () => {
    if (!currentUser) throw new Error("You are not logged in.");
    if (currentUser.role !== 'player' && currentUser.role !== 'player_plus') {
      throw new Error("Only players can leave a team.");
    }
    const team = teams.find(t => t.id === currentUser.teamId);
    setUsers(users.map(u => u.id === currentUser.id ? { ...u, teamId: undefined } : u));
    if (team) {
        createActivityLog([{ type: 'user', id: currentUser.id, text: currentUser.gamertag }, { type: 'text', text: ' left team ' }, { type: 'team', id: team.id, text: team.name }, { type: 'text', text: '.' }]);
    }
  };

  const toggleFreeAgentStatus = async () => {
    if (!currentUser) throw new Error("You are not logged in.");
    
    const isBecomingFreeAgent = !currentUser.isFreeAgent;
    const team = teams.find(t => t.id === currentUser.teamId);
    
    const updatedUser = { 
        ...currentUser, 
        isFreeAgent: isBecomingFreeAgent,
        teamId: isBecomingFreeAgent ? undefined : currentUser.teamId 
    };

    setUsers(users.map(u => u.id === currentUser.id ? updatedUser : u));
    
    if (isBecomingFreeAgent) {
        if(team) {
            createActivityLog([{ type: 'user', id: currentUser.id, text: currentUser.gamertag }, { type: 'text', text: ` left ` }, { type: 'team', id: team.id, text: team.name }, { type: 'text', text: ' and became a free agent.' }]);
        } else {
            createActivityLog([{ type: 'user', id: currentUser.id, text: currentUser.gamertag }, { type: 'text', text: ' is now listed as a free agent.' }]);
        }
    } else {
        createActivityLog([{ type: 'user', id: currentUser.id, text: currentUser.gamertag }, { type: 'text', text: ' is no longer listed as a free agent.' }]);
    }
  };

  const markNotificationAsRead = (notificationId: string) => {
    setNotifications(prev => prev.map(n => n.id === notificationId ? { ...n, isRead: true } : n));
  };
    
  const markAllNotificationsAsRead = () => {
    if (!currentUser) return;
    setNotifications(prev => prev.map(n => n.userId === currentUser.id ? { ...n, isRead: true } : n));
  };
  
  const updateNotificationSettings = async (settings: NotificationSettings) => {
    if (!currentUser) throw new Error("You must be logged in to update settings.");
    setUsers(users.map(u => u.id === currentUser.id ? { ...u, notificationSettings: settings } : u));
  };

  // Quest Management
  const addQuest = (questData: { title: string; description: string; prize: string; target?: number }) => {
    const newQuest: Quest = {
        id: `q${Date.now()}`,
        ...questData,
        status: 'incomplete',
        claimedBy: [],
        progress: questData.target ? 0 : undefined,
    };
    setQuests(prev => [newQuest, ...prev].sort((a,b) => a.title.localeCompare(b.title)));
  };

  const updateQuest = (questData: Quest) => {
      setQuests(prev => prev.map(q => q.id === questData.id ? questData : q));
  };

  const deleteQuest = (questId: string) => {
      setQuests(prev => prev.filter(q => q.id !== questId));
  };

  const deleteUser = (userId: string) => {
      setUsers(prev => prev.filter(u => u.id !== userId));
      setPosts(prev => prev.filter(p => p.authorId !== userId));
      setPosts(prev => prev.map(p => ({
          ...p,
          comments: p.comments.filter(c => c.authorId !== userId),
          reactions: p.reactions.map(r => ({ ...r, users: r.users.filter(uid => uid !== userId) })).filter(r => r.users.length > 0)
      })));
      setMessages(prev => prev.filter(m => m.senderId !== userId));
      setNotifications(prev => prev.filter(n => n.userId !== userId));
      setQuests(prev => prev.map(q => ({ ...q, claimedBy: q.claimedBy.filter(uid => uid !== userId) })));
  };

  const updateUserRole = (userId: string, newRole: UserRole) => {
      const userToUpdate = users.find(u => u.id === userId);
      if (!userToUpdate || !currentUser) return;
      
      const updatedUser = {...userToUpdate, role: newRole};
      setUsers(prev => prev.map(u => u.id === userId ? updatedUser : u));

      createActivityLog([
        { type: 'user', id: currentUser.id, text: currentUser.gamertag },
        { type: 'text', text: ' changed the role of ' },
        { type: 'user', id: userId, text: userToUpdate.gamertag },
        { type: 'text', text: ` to ${newRole.replace(/_/g, ' ')}.` }
    ]);
  };

  const deletePost = (postId: string) => {
      const postToDelete = posts.find(p => p.id === postId);
      if (!postToDelete || !currentUser) return;
      const author = users.find(u => u.id === postToDelete.authorId);

      setPosts(prev => prev.filter(p => p.id !== postId));

      if (postToDelete.authorId !== currentUser.id) {
          createActivityLog([
              { type: 'user', id: currentUser.id, text: currentUser.gamertag },
              { type: 'text', text: ' deleted a post by ' },
              { type: 'user', id: postToDelete.authorId, text: author?.gamertag || 'a user' },
              { type: 'text', text: '.' }
          ]);
      }
  };

  const deleteAllPublicPosts = () => {
    setPosts(prev => prev.filter(p => !!p.privateTeamId));
    createActivityLog([
        { type: 'user', id: currentUser!.id, text: currentUser!.gamertag },
        { type: 'text', text: ' deleted all public posts from the wall.' },
    ]);
  };

  const submitFeedback = async (type: string, message: string) => {
    if (!currentUser) throw new Error("You must be logged in to submit feedback.");
    
    const newFeedback: Feedback = {
      id: `fb${Date.now()}`,
      userId: currentUser.id,
      userGamertag: currentUser.gamertag,
      type,
      message,
      timestamp: new Date().toISOString(),
      status: 'new',
    };

    setFeedback(prev => [newFeedback, ...prev]);
    await new Promise(resolve => setTimeout(resolve, 500));
  };

  const updateFeedbackStatus = async (feedbackId: string, status: FeedbackStatus) => {
    setFeedback(prev => prev.map(fb => fb.id === feedbackId ? { ...fb, status } : fb));
  };
  
  const adjustUserPoints = (userId: string, amount: number) => {
    setUsers(prevUsers => prevUsers.map(u => {
      if (u.id === userId) {
        return { ...u, uclPoints: Math.max(0, u.uclPoints + amount) };
      }
      return u;
    }));
  };

  const updateUserProfile = async (profileData: { gamertag: string; email: string; twitter?: string; twitch?: string; youtube?: string; }) => {
    if (!currentUser) throw new Error("You must be logged in.");

    if (profileData.gamertag.toLowerCase() !== currentUser.gamertag.toLowerCase() && users.some(u => u.id !== currentUser.id && u.gamertag.toLowerCase() === profileData.gamertag.toLowerCase())) {
        throw new Error('Gamertag is already taken.');
    }
    if (profileData.email.toLowerCase() !== currentUser.email.toLowerCase() && users.some(u => u.id !== currentUser.id && u.email.toLowerCase() === profileData.email.toLowerCase())) {
        throw new Error('Email is already registered.');
    }
    
    setUsers(users.map(u => u.id === currentUser.id ? { ...u, ...profileData } : u));
  };

  const updateProfilePicture = async (pictureUrl: string) => {
    if (!currentUser) throw new Error("Not logged in.");
    setUsers(prev => prev.map(u => u.id === currentUser.id ? { ...u, profilePicture: pictureUrl } : u));
  };

  // Team Management
    const sendInvite = async (teamId: string, userId: string) => {
        if (!currentUser || !currentUser.role.includes('owner')) throw new Error("Only team owners can send invites.");
        const team = teams.find(t => t.id === teamId);
        if (!team || team.ownerId !== currentUser.id) throw new Error("You are not the owner of this team.");
        if (invites.some(i => i.teamId === teamId && i.userId === userId && i.status === 'pending')) throw new Error("Invite already pending.");

        const newInvite: Invite = { id: `inv${Date.now()}`, teamId, userId, status: 'pending' };
        setInvites(prev => [...prev, newInvite]);
        createNotification(userId, 'team_invite', `${currentUser.gamertag} has invited you to join ${team.name}.`, '/profile');
    };

    const respondToInvite = async (inviteId: string, response: InviteStatus) => {
        if (!currentUser) throw new Error("Not logged in.");
        const invite = invites.find(i => i.id === inviteId && i.userId === currentUser.id);
        if (!invite) throw new Error("Invite not found.");

        setInvites(prev => prev.map(i => i.id === inviteId ? { ...i, status: response } : i));

        if (response === 'accepted') {
            const team = teams.find(t => t.id === invite.teamId);
            const updatedUser = { ...currentUser, teamId: invite.teamId, isFreeAgent: false };
            setUsers(prev => prev.map(u => u.id === currentUser.id ? updatedUser : u));
            setApplications(prev => prev.filter(app => app.userId !== currentUser.id)); // Remove other applications
            if (team) {
                createActivityLog([{ type: 'user', id: currentUser.id, text: currentUser.gamertag }, { type: 'text', text: ' joined ' }, { type: 'team', id: team.id, text: team.name }, { type: 'text', text: ' by accepting an invite.' }]);
            }
        }
    };

    const applyToTeam = async (teamId: string) => {
        if (!currentUser) throw new Error("Not logged in.");
        if (currentUser.teamId) throw new Error("You are already on a team.");
        if (applications.some(a => a.teamId === teamId && a.userId === currentUser.id && a.status === 'pending')) throw new Error("Application already pending.");

        const team = teams.find(t => t.id === teamId);
        if (!team) throw new Error("Team not found.");

        const newApp: Application = { id: `app${Date.now()}`, teamId, userId: currentUser.id, status: 'pending' };
        setApplications(prev => [...prev, newApp]);
        createNotification(team.ownerId, 'team_application', `${currentUser.gamertag} has applied to join your team.`, `/teams/${teamId}`);
    };

    const respondToApplication = async (applicationId: string, response: InviteStatus) => {
        if (!currentUser || !currentUser.role.includes('owner')) throw new Error("Only owners can respond.");
        const app = applications.find(a => a.id === applicationId);
        if (!app) throw new Error("Application not found.");
        const team = teams.find(t => t.id === app.teamId);
        if (!team || team.ownerId !== currentUser.id) throw new Error("Not your team.");

        setApplications(prev => prev.map(a => a.id === applicationId ? { ...a, status: response } : a));

        if (response === 'accepted') {
            const applicant = users.find(u => u.id === app.userId);
            setUsers(prev => prev.map(u => u.id === app.userId ? { ...u, teamId: app.teamId, isFreeAgent: false } : u));
            createNotification(app.userId, 'application_update', `Your application to ${team.name} has been accepted!`, `/teams/${team.id}`);
            if (applicant) {
                createActivityLog([{ type: 'user', id: applicant.id, text: applicant.gamertag }, { type: 'text', text: ' joined ' }, { type: 'team', id: team.id, text: team.name }, { type: 'text', text: ' after their application was accepted.' }]);
            }
        } else {
            createNotification(app.userId, 'application_update', `Your application to ${team.name} has been declined.`, `/teams`);
        }
    };
    
    // Admin Team Management
    const editTeamDetails = async (teamId: string, details: { name: string; description: string; logoUrl: string; }) => {
        setTeams(prev => prev.map(t => t.id === teamId ? { ...t, ...details } : t));
    };

    const transferTeamOwnership = async (teamId: string, newOwnerId: string) => {
        const team = teams.find(t => t.id === teamId);
        if (!team) throw new Error("Team not found");
        const oldOwner = users.find(u => u.id === team.ownerId);
        const newOwner = users.find(u => u.id === newOwnerId);
        if(!oldOwner || !newOwner) throw new Error("Owner not found");
        
        setTeams(prev => prev.map(t => t.id === teamId ? { ...t, ownerId: newOwnerId } : t));
        createActivityLog([{ type: 'text', text: 'Ownership of ' }, { type: 'team', id: team.id, text: team.name }, { type: 'text', text: ' was transferred from ' }, { type: 'user', id: oldOwner.id, text: oldOwner.gamertag }, { type: 'text', text: ' to ' }, { type: 'user', id: newOwner.id, text: newOwner.gamertag }, { type: 'text', text: '.' }]);
    };

    const disbandTeam = async (teamId: string) => {
        const teamToDisband = teams.find(t => t.id === teamId);
        if (!teamToDisband) return;

        setTeams(prev => prev.filter(t => t.id !== teamId));
        setUsers(prev => prev.map(u => {
            if (u.teamId === teamId) {
                return { ...u, teamId: undefined, isFreeAgent: true };
            }
            return u;
        }));
        setInvites(prev => prev.filter(i => i.teamId !== teamId));
        setApplications(prev => prev.filter(a => a.teamId !== teamId));
        createActivityLog([{ type: 'text', text: 'Team ' }, { type: 'team', id: teamToDisband.id, text: teamToDisband.name }, { type: 'text', text: ' was disbanded.' }]);
    };
    
    // Plus Features
    const pinPost = async (postId: string | null) => {
        if (!currentUser) throw new Error("Not logged in.");
        setUsers(prev => prev.map(u => u.id === currentUser.id ? { ...u, pinnedPostId: postId || undefined } : u));
    };

    const updateProfileBanner = async (bannerUrl: string) => {
        if (!currentUser) throw new Error("Not logged in.");
        setUsers(prev => prev.map(u => u.id === currentUser.id ? { ...u, profileBanner: bannerUrl } : u));
    };

    const updateTeamBanner = async (teamId: string, bannerUrl: string) => {
        if (!currentUser || currentUser.role !== 'team_owner_plus') throw new Error("Insufficient permissions.");
        setTeams(prev => prev.map(t => t.id === teamId ? { ...t, bannerUrl } : t));
    };
    
    const addCustomEmoji = async (name: string, imageUrl: string) => {
        if (!currentUser || !(currentUser.role.includes('_plus') || currentUser.role === 'admin')) throw new Error("Only Plus members can add custom emojis.");
        const userEmojis = customEmojis.filter(e => e.uploaderId === currentUser.id);
        if (userEmojis.length >= 3) throw new Error("You have reached your custom emoji upload limit (3).");
        if (!name.match(/^:[a-zA-Z0-9_]+:$/)) throw new Error("Emoji name must be in the format :name_here:");
        if (customEmojis.some(e => e.name.toLowerCase() === name.toLowerCase())) throw new Error("An emoji with this name already exists.");

        const newEmoji: CustomEmoji = {
            id: `ce${Date.now()}`,
            name,
            imageUrl,
            uploaderId: currentUser.id,
        };
        setCustomEmojis(prev => [...prev, newEmoji]);
    };

    const deleteCustomEmoji = async (emojiId: string) => {
        if (!currentUser) throw new Error("Not logged in.");
        const emoji = customEmojis.find(e => e.id === emojiId);
        if (!emoji || (emoji.uploaderId !== currentUser.id && currentUser.role !== 'admin')) {
             throw new Error("You can only delete your own emojis.");
        }

        setCustomEmojis(prev => prev.filter(e => e.id !== emojiId));
    };
    
    const updateProfileVisibility = async (settings: ProfileVisibility) => {
        if (!currentUser) throw new Error("Not logged in.");
        setUsers(prev => prev.map(u => u.id === currentUser.id ? { ...u, profileVisibility: settings } : u));
    };
    
    // Moderator Actions
    const timeoutUser = async (userId: string, durationHours: number) => {
        if (!currentUser || (currentUser.role !== 'admin' && !currentUser.isModerator)) throw new Error("Insufficient permissions.");
        const userToTimeout = users.find(u => u.id === userId);
        if (!userToTimeout) throw new Error("User not found.");

        const timeoutEndDate = new Date(Date.now() + durationHours * 60 * 60 * 1000);
        const updatedUser = { ...userToTimeout, timeoutUntil: timeoutEndDate.toISOString() };

        setUsers(prev => prev.map(u => u.id === userId ? updatedUser : u));

        createActivityLog([
            { type: 'user', id: currentUser.id, text: currentUser.gamertag },
            { type: 'text', text: ` timed out ` },
            { type: 'user', id: userId, text: userToTimeout.gamertag },
            { type: 'text', text: ` for ${durationHours} hour(s).` }
        ]);
    };

    const deleteComment = async (postId: string, commentId: string) => {
        if (!currentUser || (currentUser.role !== 'admin' && !currentUser.isModerator)) throw new Error("Insufficient permissions.");
        const post = posts.find(p => p.id === postId);
        const comment = post?.comments.find(c => c.id === commentId);
        if (!post || !comment) throw new Error("Comment not found.");
        const author = users.find(u => u.id === comment.authorId);

        setPosts(prev => prev.map(p => {
            if (p.id === postId) {
                return { ...p, comments: p.comments.filter(c => c.id !== commentId) };
            }
            return p;
        }));

        createActivityLog([
            { type: 'user', id: currentUser.id, text: currentUser.gamertag },
            { type: 'text', text: ` deleted a comment by ` },
            { type: 'user', id: comment.authorId, text: author?.gamertag || 'a user' },
            { type: 'text', text: `.` }
        ]);
    };
    
    const toggleWallPosting = () => {
      setIsWallPostingDisabled(prev => !prev);
    };

    const toggleModeratorStatus = (userId: string) => {
        const userToUpdate = users.find(u => u.id === userId);
        if (!userToUpdate || !currentUser) return;

        const newIsModerator = !userToUpdate.isModerator;
        setUsers(prev => prev.map(u => 
            u.id === userId ? { ...u, isModerator: newIsModerator } : u
        ));

        createActivityLog([
            { type: 'user', id: currentUser.id, text: currentUser.gamertag },
            { type: 'text', text: newIsModerator ? ' granted moderator status to ' : ' revoked moderator status from ' },
            { type: 'user', id: userId, text: userToUpdate.gamertag },
            { type: 'text', text: '.' }
        ]);
    };
    
    const sendMassCommunication = async (subject: string, message: string) => {
        if (!currentUser || (currentUser.role !== 'admin' && !currentUser.isModerator)) {
            throw new Error("Insufficient permissions.");
        }

        const recipients = new Map<string, User>();
        users.forEach(user => {
            const isOwner = user.role.includes('owner');
            const isMod = user.isModerator;
            const isAdmin = user.role === 'admin';
            // Exclude the sender from the recipient list
            if ((isOwner || isMod || isAdmin) && user.id !== currentUser.id) {
                if (!recipients.has(user.id)) {
                    recipients.set(user.id, user);
                }
            }
        });

        const newMessages: Message[] = [];
        const fullMessageContent = `**${subject}**\n\n${message}`;

        console.log("--- Sending Mass Communication ---");
        console.log("From:", currentUser.gamertag);
        console.log("Subject:", subject);
        console.log("Message:", message);
        console.log("Recipients:", Array.from(recipients.values()).map(u => u.gamertag));
        console.log("--------------------------");

        recipients.forEach(recipient => {
            // Simulate email
            console.log(`(SIMULATE EMAIL) Sending mass email to ${recipient.email}...`);

            // Create in-site message
            const channelId = ['dm', currentUser.id, recipient.id].sort().join('_');
            const newMessage: Message = {
                id: `m${Date.now()}_${recipient.id}`, // Unique ID for messages created in the same tick
                senderId: currentUser.id,
                senderGamertag: currentUser.gamertag,
                channelId,
                content: fullMessageContent,
                timestamp: new Date().toISOString(),
            };
            newMessages.push(newMessage);
        });

        setMessages(prev => [...prev, ...newMessages]);
        
        // Simulate network delay
        await new Promise(resolve => setTimeout(resolve, 1000));

        createActivityLog([
            { type: 'user', id: currentUser.id, text: currentUser.gamertag },
            { type: 'text', text: ` sent a mass message to all owners and moderators.` }
        ]);
    };


  const value = { currentUser, users, posts, quests, messages, notifications, teams, invites, applications, activityLog, customEmojis, feedback, reactionPointReward, isWallPostingDisabled, postOfTheWeekId, login, logout, signUp, addPost, toggleReaction, addComment, claimQuestReward, updateQuestProgress, sendMessage, leaveTeam, toggleFreeAgentStatus, markNotificationAsRead, markAllNotificationsAsRead, updateNotificationSettings, addQuest, updateQuest, deleteQuest, deleteUser, updateUserRole, deletePost, deleteAllPublicPosts, submitFeedback, updateFeedbackStatus, adjustUserPoints, updateUserProfile, updateProfilePicture, sendInvite, respondToInvite, applyToTeam, respondToApplication, editTeamDetails, transferTeamOwnership, disbandTeam, pinPost, updateProfileBanner, updateTeamBanner, addCustomEmoji, deleteCustomEmoji, updateProfileVisibility, timeoutUser, deleteComment, toggleWallPosting, toggleModeratorStatus, sendMassCommunication };

  // FIX: Corrected a typo from `Auth.Provider` to `AuthContext.Provider` to fix a 'Cannot find name' error.
  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};