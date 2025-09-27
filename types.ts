export type UserRole = 'player' | 'player_plus' | 'team_owner' | 'team_owner_plus' | 'co_owner' | 'admin';

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


export interface User {
  id: string;
  gamertag: string;
  email: string;
  pin: string; 
  role: UserRole;
  notificationSettings: NotificationSettings;
  createdAt: string;
  teamId?: string;
  profilePicture?: string;
  uclPoints: number;
  isFreeAgent?: boolean;
  twitter?: string;
  twitch?: string;
  youtube?: string;
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
  timestamp: string;
  reactions: Reaction[];
  comments: Comment[];
  pointsAwarded?: boolean;
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