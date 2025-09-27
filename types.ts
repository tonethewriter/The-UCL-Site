export type UserRole = 'player' | 'player_plus' | 'team_owner' | 'team_owner_plus' | 'admin';

export interface User {
  id: string;
  gamertag: string;
  email: string;
  pin: string; 
  role: UserRole;
  teamName?: string;
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
}