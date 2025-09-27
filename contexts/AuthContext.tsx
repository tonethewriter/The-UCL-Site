import React, { createContext, useState, useEffect, ReactNode } from 'react';
import { User, Post, Reaction, UserRole, Quest, QuestStatus } from '../types';

export interface AuthContextType {
  currentUser: User | null;
  users: User[];
  posts: Post[];
  quests: Quest[];
  login: (identifier: string, pin: string) => Promise<void>;
  logout: () => void;
  signUp: (gamertag: string, email: string, pin: string, role: UserRole, teamName?: string) => Promise<void>;
  addPost: (content: string) => void;
  deletePost: (postId: string) => void;
  deleteUser: (userId: string) => void;
  toggleReaction: (postId: string, emoji: string) => void;
  updateUser: (userId: string, updates: Partial<Pick<User, 'gamertag' | 'email' | 'pin' | 'profilePicture'>>) => Promise<void>;
  assignCoOwner: (identifier: string) => Promise<void>;
  removeCoOwner: (coOwnerId: string) => Promise<void>;
  updateUserRole: (userId: string, newRole: UserRole) => Promise<void>;
  upgradeToPlayerPlus: () => Promise<void>;
  addQuest: (title: string, description: string, prize: string) => Promise<void>;
  updateQuestStatus: (questId: string, status: QuestStatus) => Promise<void>;
  deleteQuest: (questId: string) => Promise<void>;
  grantQuestReward: (userId: string, prize: string) => Promise<void>;
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
    { id: '1', gamertag: 'admin', email: 'admin@ucl.com', pin: '1234', role: 'admin', uclPoints: 9999 },
    { id: '2', gamertag: 'PlayerOne', email: 'player@one.com', pin: '0000', role: 'player', uclPoints: 1250 }
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
   const [quests, setQuests] = useState<Quest[]>(() => getInitialState<Quest[]>('quests', [
    {
      id: 'q1',
      title: 'First Steps',
      description: 'Welcome to the league! Complete your first match to earn a reward.',
      status: 'started',
      prize: '50 UCL Points'
    },
    {
      id: 'q2',
      title: 'Team Player',
      description: 'Win 3 matches with your designated team.',
      status: 'incomplete',
      prize: 'Exclusive Team Banner'
    },
     {
      id: 'q3',
      title: 'Legendary Victory',
      description: 'Achieve a flawless victory in a tournament match.',
      status: 'completed',
      prize: 'Legendary Loot Box'
    }
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
  
  useEffect(() => {
    localStorage.setItem('quests', JSON.stringify(quests));
  }, [quests]);

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
      uclPoints: 0,
    };

    if ((role === 'team_owner' || role === 'team_owner_plus') && teamName) {
        newUser.teamName = teamName;
    }

    setUsers(prev => [...prev, newUser]);
    setCurrentUser(newUser);
  };

  const updateUser = async (userId: string, updates: Partial<Pick<User, 'gamertag' | 'email' | 'pin' | 'profilePicture'>>): Promise<void> => {
    if (updates.gamertag && users.some(u => u.id !== userId && u.gamertag.toLowerCase() === updates.gamertag!.toLowerCase())) {
      throw new Error('Gamertag already taken.');
    }
    if (updates.email && users.some(u => u.id !== userId && u.email.toLowerCase() === updates.email!.toLowerCase())) {
      throw new Error('Email already registered.');
    }

    let updatedGamertag: string | undefined = undefined;

    setUsers(currentUsers =>
      currentUsers.map(user => {
        if (user.id === userId) {
          if (updates.gamertag && updates.gamertag !== user.gamertag) {
            updatedGamertag = updates.gamertag;
          }
          return { ...user, ...updates };
        }
        return user;
      })
    );

    if (currentUser && currentUser.id === userId) {
      setCurrentUser(prev => prev ? { ...prev, ...updates } : null);
    }
    
    if (updatedGamertag) {
        setPosts(currentPosts => currentPosts.map(post => {
            if (post.authorId === userId) {
                return { ...post, authorGamertag: updatedGamertag! };
            }
            return post;
        }));
    }
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

  const assignCoOwner = async (identifier: string): Promise<void> => {
    if (!currentUser || (currentUser.role !== 'team_owner' && currentUser.role !== 'team_owner_plus')) {
        throw new Error('Only Team Owners can assign a Co-Owner.');
    }

    const teamName = currentUser.teamName;
    if (!teamName) {
        throw new Error('You must be part of a team to assign a Co-Owner.');
    }

    const existingCoOwner = users.find(u => u.teamName === teamName && u.role === 'co_owner');
    if (existingCoOwner) {
        throw new Error('Your team already has a Co-Owner.');
    }
    
    const targetUser = users.find(u => u.gamertag.toLowerCase() === identifier.toLowerCase() || u.email.toLowerCase() === identifier.toLowerCase());

    if (!targetUser) {
        throw new Error('User not found.');
    }

    if (targetUser.id === currentUser.id) {
        throw new Error('You cannot assign yourself as a Co-Owner.');
    }

    if (['team_owner', 'team_owner_plus', 'co_owner', 'admin'].includes(targetUser.role)) {
        throw new Error('This user is already an owner, co-owner, or admin.');
    }

    setUsers(currentUsers => currentUsers.map(user => {
        if (user.id === targetUser.id) {
            return { ...user, role: 'co_owner', teamName: teamName };
        }
        return user;
    }));
  };

  const removeCoOwner = async (coOwnerId: string): Promise<void> => {
    if (!currentUser || (currentUser.role !== 'team_owner' && currentUser.role !== 'team_owner_plus')) {
        throw new Error('Only Team Owners can remove a Co-Owner.');
    }

    const targetUser = users.find(u => u.id === coOwnerId);

    if (!targetUser || targetUser.role !== 'co_owner' || targetUser.teamName !== currentUser.teamName) {
        throw new Error('This user is not the Co-Owner of your team.');
    }

    setUsers(currentUsers => currentUsers.map(user => {
        if (user.id === coOwnerId) {
            const { teamName, ...rest } = user;
            return { ...rest, role: 'player' };
        }
        return user;
    }));
  };

  const updateUserRole = async (userId: string, newRole: UserRole): Promise<void> => {
    if (currentUser?.role !== 'admin') {
      throw new Error("You don't have permission to change user roles.");
    }
    setUsers(currentUsers => currentUsers.map(user => {
      if (user.id === userId) {
        const updatedUser = { ...user, role: newRole };
        // If user is no longer an owner/co-owner, remove team name
        if (!['team_owner', 'team_owner_plus', 'co_owner'].includes(newRole)) {
            delete updatedUser.teamName;
        }
        return updatedUser;
      }
      return user;
    }));
  };
  
  const upgradeToPlayerPlus = async (): Promise<void> => {
    if (!currentUser || currentUser.role !== 'player') {
        throw new Error('Only players can upgrade to Player Plus.');
    }
    const updatedUser = { ...currentUser, role: 'player_plus' as UserRole };
    
    setUsers(currentUsers => currentUsers.map(user => 
        user.id === currentUser.id ? updatedUser : user
    ));
    setCurrentUser(updatedUser);
  };

  const addQuest = async (title: string, description: string, prize: string): Promise<void> => {
    if (currentUser?.role !== 'admin') {
        throw new Error("You don't have permission to add quests.");
    }
    const newQuest: Quest = {
        id: `q${Date.now()}`,
        title,
        description,
        prize,
        status: 'incomplete',
    };
    setQuests(prev => [newQuest, ...prev]);
  };

  const updateQuestStatus = async (questId: string, status: QuestStatus): Promise<void> => {
    if (currentUser?.role !== 'admin') {
        throw new Error("You don't have permission to update quests.");
    }
    setQuests(quests => quests.map(q => q.id === questId ? { ...q, status } : q));
  };
  
  const deleteQuest = async (questId: string): Promise<void> => {
    if (currentUser?.role !== 'admin') {
        throw new Error("You don't have permission to delete quests.");
    }
    setQuests(quests => quests.filter(q => q.id !== questId));
  };

  const grantQuestReward = async (userId: string, prize: string): Promise<void> => {
    const pointsRegex = /(\d+)\s+UCL\s+Points/i;
    const match = prize.match(pointsRegex);
    let userFound = false;

    setUsers(currentUsers => currentUsers.map(user => {
      if (user.id === userId) {
        userFound = true;
        let finalUser = { ...user };

        if (match && match[1]) {
          const pointsToAdd = parseInt(match[1], 10);
          alert(`Awarding ${pointsToAdd} UCL Points to ${user.gamertag}.`);
          finalUser.uclPoints += pointsToAdd;
        } else {
          alert(`Prize is "${prize}". Please award this manually to ${user.gamertag}.`);
        }
        // Also update current user if they are the one receiving the reward
        if (currentUser?.id === userId) {
            setCurrentUser(finalUser);
        }
        return finalUser;
      }
      return user;
    }));

    if (!userFound) {
      throw new Error("User not found to grant reward to.");
    }
  };


  return (
    <AuthContext.Provider value={{ currentUser, users, posts, quests, login, logout, signUp, addPost, deletePost, deleteUser, toggleReaction, updateUser, assignCoOwner, removeCoOwner, updateUserRole, upgradeToPlayerPlus, addQuest, updateQuestStatus, deleteQuest, grantQuestReward }}>
      {children}
    </AuthContext.Provider>
  );
};