import React, { createContext, useState, useEffect, ReactNode } from 'react';
import { User, Post, Reaction, UserRole } from '../types';

export interface AuthContextType {
  currentUser: User | null;
  users: User[];
  posts: Post[];
  login: (identifier: string, pin: string) => Promise<void>;
  logout: () => void;
  signUp: (gamertag: string, email: string, pin: string, role: UserRole, teamName?: string) => Promise<void>;
  addPost: (content: string) => void;
  deletePost: (postId: string) => void;
  deleteUser: (userId: string) => void;
  toggleReaction: (postId: string, emoji: string) => void;
}

export const AuthContext = createContext<AuthContextType | undefined>(undefined);

interface AuthProviderProps {
  children: ReactNode;
}

const getInitialState = <T,>(key: string, defaultValue: T): T => {
  try {
    const storedValue = localStorage.getItem(key);
    return storedValue ? JSON.parse(storedValue) : defaultValue;
  } catch (error) {
    console.error(`Error reading from localStorage key “${key}”:`, error);
    return defaultValue;
  }
};

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [currentUser, setCurrentUser] = useState<User | null>(getInitialState<User | null>('currentUser', null));
  const [users, setUsers] = useState<User[]>(() => getInitialState<User[]>('users', [
    { id: '1', gamertag: 'admin', email: 'admin@ucl.com', pin: '1234', role: 'admin' },
    { id: '2', gamertag: 'PlayerOne', email: 'player@one.com', pin: '0000', role: 'player' }
  ]));
  const [posts, setPosts] = useState<Post[]>(() => getInitialState<Post[]>('posts', [
      {
        id: 'p1',
        authorId: '1',
        authorGamertag: 'admin',
        content: 'Welcome to the United Clan League! This is the first official post. Feel free to react.',
        timestamp: new Date(Date.now() - 1000 * 60 * 5).toISOString(),
        reactions: [{ emoji: '🔥', users: ['2'] }],
      },
      {
        id: 'p2',
        authorId: '2',
        authorGamertag: 'PlayerOne',
        content: 'Excited to be here! Looking forward to connecting with other members.',
        timestamp: new Date(Date.now() - 1000 * 60 * 2).toISOString(),
        reactions: [{ emoji: '👍', users: ['1'] }, { emoji: '❤️', users: ['1'] }],
      },
  ]));

  useEffect(() => {
    localStorage.setItem('currentUser', JSON.stringify(currentUser));
  }, [currentUser]);

  useEffect(() => {
    localStorage.setItem('users', JSON.stringify(users));
  }, [users]);

  useEffect(() => {
    localStorage.setItem('posts', JSON.stringify(posts));
  }, [posts]);

  const login = async (identifier: string, pin: string): Promise<void> => {
    // Special admin case
    if (identifier.toLowerCase() === 'admin' && pin === '1234') {
        const adminUser = users.find(u => u.role === 'admin');
        if (adminUser) {
            setCurrentUser(adminUser);
            return;
        }
    }

    const user = users.find(u => (u.gamertag.toLowerCase() === identifier.toLowerCase() || u.email.toLowerCase() === identifier.toLowerCase()) && u.pin === pin);
    if (user) {
      setCurrentUser(user);
    } else {
      throw new Error('Invalid credentials');
    }
  };

  const logout = () => {
    setCurrentUser(null);
  };

  const signUp = async (gamertag: string, email: string, pin: string, role: UserRole, teamName?: string): Promise<void> => {
    if (users.some(u => u.gamertag.toLowerCase() === gamertag.toLowerCase())) {
      throw new Error('Gamertag already exists');
    }
    if (users.some(u => u.email.toLowerCase() === email.toLowerCase())) {
        throw new Error('Email already registered');
    }

    const newUser: User = {
      id: `u${Date.now()}`,
      gamertag,
      email,
      pin,
      role,
    };

    if ((role === 'team_owner' || role === 'team_owner_plus') && teamName) {
        newUser.teamName = teamName;
    }

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
    };
    setPosts(prev => [newPost, ...prev]);
  };

  const deletePost = (postId: string) => {
    if (currentUser?.role !== 'admin') return;
    setPosts(prev => prev.filter(p => p.id !== postId));
  };

  const deleteUser = (userId: string) => {
    if (currentUser?.role !== 'admin' || currentUser.id === userId) return;
    setUsers(prev => prev.filter(u => u.id !== userId));
    // Also remove posts by the deleted user
    setPosts(prev => prev.filter(p => p.authorId !== userId));
  };
  
  const toggleReaction = (postId: string, emoji: string) => {
    if (!currentUser) return;

    setPosts(posts.map(post => {
        if (post.id === postId) {
            const reactionIndex = post.reactions.findIndex(r => r.emoji === emoji);
            let newReactions = [...post.reactions];

            if (reactionIndex > -1) {
                const reaction = newReactions[reactionIndex];
                const userIndex = reaction.users.indexOf(currentUser.id);
                if (userIndex > -1) {
                    // User is removing their reaction
                    reaction.users.splice(userIndex, 1);
                    if (reaction.users.length === 0) {
                        // If no users are left for this reaction, remove it
                        newReactions.splice(reactionIndex, 1);
                    }
                } else {
                    // User is adding their reaction
                    reaction.users.push(currentUser.id);
                }
            } else {
                // First reaction of this type
                newReactions.push({ emoji, users: [currentUser.id] });
            }
            return { ...post, reactions: newReactions };
        }
        return post;
    }));
  };

  return (
    <AuthContext.Provider value={{ currentUser, users, posts, login, logout, signUp, addPost, deletePost, deleteUser, toggleReaction }}>
      {children}
    </AuthContext.Provider>
  );
};