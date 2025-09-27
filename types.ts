// FIX: Replaced circular self-reference of UserRole with a complete type definition.
export type UserRole =
  | 'admin'
  | 'co_owner'
  | 'player'
  | 'player_plus'
  | 'team_owner'
  | 'team_owner_plus';

export interface NotificationSettings {
  inApp: {
    new_reaction: boolean;
    new_comment: boolean;
    quest_complete: boolean;
    welcome: boolean;
    team_invite: boolean;
    team_application: boolean;
    application_update: boolean;
    mention: boolean;
  };
  email: {
    new_reaction: boolean;
    new_comment: boolean;
    quest_complete: boolean;
  };
}

export interface ProfileVisibility {
  showTeam: boolean;
  showSocials: boolean;
  showPoints: boolean;
  showPinnedPost: boolean;
}


export interface User {
  id: string;
  gamertag: string;
  email: string;
  pin: string; 
  role: UserRole;
  isModerator?: boolean;
  notificationSettings: NotificationSettings;
  createdAt: string;
  teamId?: string;
  profilePicture?: string;
  profileBanner?: string;
  pinnedPostId?: string;
  uclPoints: number;
  isFreeAgent?: boolean;
  twitter?: string;
  twitch?: string;
  youtube?: string;
  profileVisibility?: ProfileVisibility;
  timeoutUntil?: string; // ISO string for when the timeout expires
}

export interface Reaction {
  emoji: string;
  users: string[]; // Array of user IDs who reacted
}

export interface Comment {
  id: string;
  authorId: string;
  authorGamertag: string;
  content: string;
  timestamp: string;
}

export interface Post {
  id: string;
  authorId: string;
  authorGamertag: string;
  content: string;
  imageUrl?: string;
  timestamp: string;
  reactions: Reaction[];
  comments: Comment[];
  pointsAwarded?: boolean;
  privateTeamId?: string; // If present, post is private to this team
}

export type QuestStatus = 'incomplete' | 'started' | 'completed';

export interface Quest {
  id:string;
  title: string;
  description: string;
  status: QuestStatus;
  prize: string;
  claimedBy: string[]; // Array of user IDs who have claimed the prize
  progress?: number;
  target?: number;
}

export interface Message {
  id: string;
  senderId: string;
  senderGamertag: string;
  channelId: string; // e.g., 'team_Alpha', 'owners_chat'
  content: string;
  timestamp: string;
}

export type NotificationType = 'new_reaction' | 'new_comment' | 'quest_complete' | 'welcome' | 'team_invite' | 'team_application' | 'application_update' | 'mention';

export interface Notification {
  id: string;
  userId: string; // The user who should receive the notification
  type: NotificationType;
  message: string;
  link: string; // e.g., '/posts/p1' or '/quests'
  isRead: boolean;
  timestamp: string;
}

export interface Team {
    id: string;
    name: string;
    logoUrl: string;
    bannerUrl?: string;
    ownerId: string;
    description: string;
}

export type InviteStatus = 'pending' | 'accepted' | 'declined';

export interface Invite {
    id: string;
    teamId: string;
    userId: string;
    status: InviteStatus;
}

export interface Application {
    id: string;
    teamId: string;
    userId: string;
    status: InviteStatus;
}

export type ActivityLogEntity = 
    | { type: 'user'; id: string; text: string; }
    | { type: 'team'; id: string; text: string; }
    | { type: 'text'; text: string; };

export interface ActivityLog {
  id: string;
  timestamp: string;
  entities: ActivityLogEntity[];
}

export interface CustomEmoji {
  id: string;
  name: string; // e.g., ':squad_logo:'
  imageUrl: string;
  uploaderId: string;
}

export type FeedbackStatus = 'new' | 'viewed' | 'archived';

export interface Feedback {
  id: string;
  userId: string;
  userGamertag: string;
  type: string;
  message: string;
  timestamp: string;
  status: FeedbackStatus;
}

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