export type UserRole = 'player' | 'player_plus' | 'team_owner' | 'team_owner_plus' | 'co_owner' | 'admin';

export interface User {
  id: string;
  gamertag: string;
  email: string;
  pin: string; 
  role: UserRole;
  teamName?: string;
  profilePicture?: string;
  uclPoints: number;
  isFreeAgent?: boolean;
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
  id: string;
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