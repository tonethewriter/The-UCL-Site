import React, { createContext, useState, useEffect, ReactNode } from 'react';
import { User, Post, Quest, UserRole, Comment, Message } from '../types';

// Mock Data
const initialUsers: User[] = [
  { id: '1', gamertag: 'Tone', email: 'tone@ucl.com', pin: '1234', role: 'admin', uclPoints: 1500, profilePicture: 'https://i.pravatar.cc/150?u=1' },
  { id: '2', gamertag: 'Sniper', email: 'sniper@ucl.com', pin: '1234', role: 'player_plus', teamName: 'Alpha', uclPoints: 850, profilePicture: 'https://i.pravatar.cc/150?u=2' },
  { id: '3', gamertag: 'Ghost', email: 'ghost@ucl.com', pin: '1234', role: 'player', teamName: 'Alpha', uclPoints: 320, profilePicture: 'https://i.pravatar.cc/150?u=3' },
  { id: '4', gamertag: 'Viper', email: 'viper@ucl.com', pin: '1234', role: 'team_owner', teamName: 'Bravo', uclPoints: 1100, profilePicture: 'https://i.pravatar.cc/150?u=4' },
  { id: '5', gamertag: 'Rogue', email: 'rogue@ucl.com', pin: '1234', role: 'player', uclPoints: 450, profilePicture: 'https://i.pravatar.cc/150?u=5', isFreeAgent: true },
];

const initialPosts: Post[] = [
  {
    id: 'p1',
    authorId: '2',
    authorGamertag: 'Sniper',
    content: 'Just hit a sick 360 no-scope in the last match! Clip coming soon. #UCL #Gaming',
    timestamp: new Date(Date.now() - 3600 * 1000 * 2).toISOString(),
    reactions: [{ emoji: '🔥', users: ['1', '4'] }, { emoji: '😮', users: ['3'] }],
    comments: [
        { id: 'c1', authorId: '4', authorGamertag: 'Viper', content: 'Can\'t wait to see it!', timestamp: new Date(Date.now() - 3600 * 1000 * 1.5).toISOString() }
    ],
    pointsAwarded: true
  },
  {
    id: 'p2',
    authorId: '1',
    authorGamertag: 'Tone',
    content: 'Welcome to the new UCL Wall! Post your highlights, discuss strategies, and connect with other members. New quests are up, go check them out!',
    timestamp: new Date(Date.now() - 3600 * 1000 * 24).toISOString(),
    reactions: [{ emoji: '👍', users: ['2', '3', '4'] }],
    comments: [],
  },
];

const initialQuests: Quest[] = [
    { id: 'q1', title: 'First Blood', description: 'Get 10 eliminations in any game mode.', status: 'completed', prize: '50 UCL Points', claimedBy: ['2'], progress: 10, target: 10 },
    { id: 'q2', title: 'Team Player', description: 'Play 5 matches with your team.', status: 'started', prize: '100 UCL Points', claimedBy: [], progress: 2, target: 5 },
    { id: 'q3', title: 'Sharpshooter', description: 'Achieve a 5 kill streak.', status: 'incomplete', prize: '75 UCL Points', claimedBy: [] },
    { id: 'q4', title: 'Wall Poster', description: 'Make your first post on the UCL Wall.', status: 'completed', prize: '25 UCL Points', claimedBy: ['2', '1'], progress: 1, target: 1 }
];

const initialMessages: Message[] = [
  { id: 'm1', senderId: '1', senderGamertag: 'Tone', channelId: 'owners_chat', content: 'Welcome to the new Owners chat! Feel free to discuss league matters here.', timestamp: new Date(Date.now() - 3600 * 1000 * 5).toISOString() },
  { id: 'm2', senderId: '4', senderGamertag: 'Viper', channelId: 'owners_chat', content: 'This is a great addition, thanks Tone!', timestamp: new Date(Date.now() - 3600 * 1000 * 4).toISOString() },
  { id: 'm3', senderId: '4', senderGamertag: 'Viper', channelId: 'team_Bravo', content: 'Team Bravo, let\'s get some practice matches in this weekend. Let me know your availability.', timestamp: new Date(Date.now() - 3600 * 1000 * 3).toISOString() },
  { id: 'm4', senderId: '2', senderGamertag: 'Sniper', channelId: 'team_Alpha', content: 'Our owner posted a new quest for us, we need to prep for the next tourney.', timestamp: new Date(Date.now() - 3600 * 1000 * 2).toISOString() },
  { id: 'm5', senderId: '3', senderGamertag: 'Ghost', channelId: 'team_Alpha', content: 'I\'m free Saturday afternoon.', timestamp: new Date(Date.now() - 3600 * 1000 * 1).toISOString() },
];


export interface AuthContextType {
  currentUser: User | null;
  users: User[];
  posts: Post[];
  quests: Quest[];
  messages: Message[];
  reactionPointReward: number;
  login: (identifier: string, pin: string) => Promise<void>;
  logout: () => void;
  signUp: (gamertag: string, email: string, pin:string, role: UserRole, teamName?: string) => Promise<void>;
  addPost: (content: string) => void;
  toggleReaction: (postId: string, emoji: string) => void;
  addComment: (postId: string, content: string) => void;
  claimQuestReward: (questId: string) => Promise<void>;
  updateQuestProgress: (questId: string, amount: number) => void;
  sendMessage: (channelId: string, content: string) => void;
  leaveTeam: () => Promise<void>;
  toggleFreeAgentStatus: () => Promise<void>;
}

export const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{children: ReactNode}> = ({ children }) => {
  const [currentUser, setCurrentUser] = useState<User | null>(() => {
    try {
      const savedUser = localStorage.getItem('ucl_user');
      return savedUser ? JSON.parse(savedUser) : null;
    } catch (error) {
      return null;
    }
  });
  const [users, setUsers] = useState<User[]>(initialUsers);
  const [posts, setPosts] = useState<Post[]>(initialPosts);
  const [quests, setQuests] = useState<Quest[]>(initialQuests);
  const [messages, setMessages] = useState<Message[]>(initialMessages);
  const reactionPointReward = 5;

  useEffect(() => {
    if (currentUser) {
      localStorage.setItem('ucl_user', JSON.stringify(currentUser));
    } else {
      localStorage.removeItem('ucl_user');
    }
  }, [currentUser]);

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
    const newUser: User = {
        id: String(Date.now()),
        gamertag,
        email,
        pin,
        role,
        teamName: role.includes('team') ? teamName : undefined,
        uclPoints: 0,
        profilePicture: `https://i.pravatar.cc/150?u=${gamertag}`
    };
    setUsers(prev => [...prev, newUser]);
    setCurrentUser(newUser);
  };

  const addPost = (content: string) => {
    if (!currentUser) return;
    const newPost: Post = {
      id: `p${Date.now()}`,
      authorId: currentUser.id,
      authorGamertag: currentUser.gamertag,
      content,
      timestamp: new Date().toISOString(),
      reactions: [],
      comments: [],
    };
    setPosts(prev => [newPost, ...prev]);
  };
  
  const toggleReaction = (postId: string, emoji: string) => {
    if (!currentUser) return;

    setPosts(posts.map(post => {
      if (post.id !== postId) return post;

      const newReactions = [...post.reactions];
      const reactionIndex = newReactions.findIndex(r => r.emoji === emoji);

      if (reactionIndex > -1) {
        const users = newReactions[reactionIndex].users;
        const userIndex = users.indexOf(currentUser.id);

        if (userIndex > -1) {
          // User is removing their reaction
          const updatedUsers = users.filter(id => id !== currentUser.id);
          if (updatedUsers.length === 0) {
            // Remove the reaction object if no users are left
            newReactions.splice(reactionIndex, 1);
          } else {
            newReactions[reactionIndex] = { ...newReactions[reactionIndex], users: updatedUsers };
          }
        } else {
          // User is adding a reaction to an existing emoji
          newReactions[reactionIndex] = { ...newReactions[reactionIndex], users: [...users, currentUser.id] };
        }
      } else {
        // User is adding a new emoji reaction
        newReactions.push({ emoji, users: [currentUser.id] });
      }

      return { ...post, reactions: newReactions };
    }));
  };
  
  const addComment = (postId: string, content: string) => {
      if (!currentUser) return;
      const newComment: Comment = {
          id: `c${Date.now()}`,
          authorId: currentUser.id,
          authorGamertag: currentUser.gamertag,
          content,
          timestamp: new Date().toISOString(),
      };
      setPosts(posts.map(p => p.id === postId ? { ...p, comments: [...p.comments, newComment] } : p));
  };
  
  const claimQuestReward = async (questId: string) => {
      if (!currentUser) throw new Error("You must be logged in to claim a reward.");
      const quest = quests.find(q => q.id === questId);
      if (!quest) throw new Error("Quest not found.");
      if (quest.status !== 'completed') throw new Error("Quest is not completed yet.");
      if (quest.claimedBy.includes(currentUser.id)) throw new Error("You have already claimed this reward.");

      setQuests(quests.map(q => q.id === questId ? { ...q, claimedBy: [...q.claimedBy, currentUser.id] } : q));
      const points = parseInt(quest.prize.split(' ')[0]) || 0;
      setCurrentUser(prev => prev ? { ...prev, uclPoints: prev.uclPoints + points } : null);
       setUsers(users.map(u => u.id === currentUser.id ? { ...u, uclPoints: u.uclPoints + points } : u));
  };
  
  const updateQuestProgress = (questId: string, amount: number) => {
      setQuests(quests.map(q => {
          if (q.id === questId && q.status !== 'completed' && q.target) {
              const newProgress = Math.min((q.progress || 0) + amount, q.target);
              const newStatus = newProgress === q.target ? 'completed' : 'started';
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

    const updatedUser = { ...currentUser, teamName: undefined };
    setCurrentUser(updatedUser);
    setUsers(users.map(u => u.id === currentUser.id ? updatedUser : u));
  };

  const toggleFreeAgentStatus = async () => {
    if (!currentUser) throw new Error("You are not logged in.");
    
    const isBecomingFreeAgent = !currentUser.isFreeAgent;
    
    const updatedUser = { 
        ...currentUser, 
        isFreeAgent: isBecomingFreeAgent,
        // If becoming a free agent, they must leave their team.
        teamName: isBecomingFreeAgent ? undefined : currentUser.teamName 
    };

    setCurrentUser(updatedUser);
    setUsers(users.map(u => u.id === currentUser.id ? updatedUser : u));
  };

  const value = { currentUser, users, posts, quests, messages, reactionPointReward, login, logout, signUp, addPost, toggleReaction, addComment, claimQuestReward, updateQuestProgress, sendMessage, leaveTeam, toggleFreeAgentStatus };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};