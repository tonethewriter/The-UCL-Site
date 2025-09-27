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
}

export interface Reaction {
  emoji: string;
  users: string[]; // Array of user IDs who reacted
}

export interface Post {
  id: string;
  authorId: string;
  authorGamertag: string;
  content: string;
  timestamp: string;
  reactions: Reaction[];
  pointsAwarded?: boolean;
}

export type QuestStatus = 'incomplete' | 'started' | 'completed';

export interface Quest {
  id: string;
  title: string;
  description: string;
  status: QuestStatus;
  prize: string;
}