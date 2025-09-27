import React, { createContext, useState, useEffect, ReactNode } from 'react';
import { User, Post, Reaction, UserRole, Quest, QuestStatus, Comment } from '../types';

export interface AuthContextType {
  currentUser: User | null;
  users: User[];
  posts: Post[];
  quests: Quest[];
  reactionPointThreshold: number;
  reactionPointReward: number;
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
  upgradeToTeamOwnerPlus: () => Promise<void>;
  addQuest: (title: string, description: string, prize: string) => Promise<void>;
  updateQuestStatus: (questId: string, status: QuestStatus) => Promise<void>;
  deleteQuest: (questId: string) => Promise<void>;
  grantQuestReward: (userId: string, prize: string) => Promise<void>;
  updateReactionPointConfig: (threshold: number, reward: number) => Promise<void>;
  manualUpdateUserPoints: (userId: string, points: number) => Promise<void>;
  addComment: (postId: string, content: string) => Promise<void>;
  claimQuestReward: (questId: string) => Promise<void>;
  updateQuestProgress: (questId: string, amount: number) => Promise<void>;
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
    { id: '2', gamertag: 'PlayerOne', email: 'player@one.com', pin: '0000', role: 'player', uclPoints: 1250 },
    { id: '3', gamertag: 'TeamOwner', email: 'owner@one.com', pin: '0000', role: 'team_owner', teamName: 'The Legends', uclPoints: 2500 },
  ]));
  const [posts, setPosts] = useState<Post[]>(() => getInitialState<Post[]>('posts', [
      {
        id: 'p1',
        authorId: '1',
        authorGamertag: 'admin',
        content: 'Welcome to the United Clan League! This is the first official post. Feel free to react.',
        timestamp: new Date(Date.now() - 1000 * 60 * 5).toISOString(),
        reactions: [{ emoji: '🔥', users: ['2'] }],
        comments: [],
        pointsAwarded: false,
      },
      {
        id: 'p2',
        authorId: '2',
        authorGamertag: 'PlayerOne',
        content: 'Excited to be here! Looking forward to connecting with other members.',
        timestamp: new Date(Date.now() - 1000 * 60 * 2).toISOString(),
        reactions: [{ emoji: '👍', users: ['1'] }, { emoji: '❤️', users: ['1'] }],
        comments: [],
        pointsAwarded: false,
      },
      {
        id: 'p3',
        authorId: '3',
        authorGamertag: 'TeamOwner',
        content: 'My team, The Legends, is looking for new talent! Message me to try out.',
        timestamp: new Date(Date.now() - 1000 * 60 * 10).toISOString(),
        reactions: [{ emoji: '🔥', users: ['1', '2'] }],
        comments: [],
        pointsAwarded: false,
      },
  ]));
   const [quests, setQuests] = useState<Quest[]>(() => getInitialState<Quest[]>('quests', [
    {
      id: 'q1',
      title: 'First Steps',
      description: 'Welcome to the league! Complete your first match to earn a reward.',
      status: 'started',
      prize: '50 UCL Points',
      claimedBy: [],
      progress: 0,
      target: 1,
    },
    {
      id: 'q2',
      title: 'Team Player',
      description: 'Win 3 matches with your designated team.',
      status: 'incomplete',
      prize: 'Exclusive Team Banner',
      claimedBy: [],
      progress: 1,
      target: 3,
    },
     {
      id: 'q3',
      title: 'Legendary Victory',
      description: 'Achieve a flawless victory in a tournament match.',
      status: 'completed',
      prize: 'Legendary Loot Box',
      claimedBy: [],
      progress: 1,
      target: 1,
    }
  ]));
  const [reactionPointThreshold, setReactionPointThreshold] = useState<number>(() => getInitialState<number>('reactionPointThreshold', 20));
  const [reactionPointReward, setReactionPointReward] = useState<number>(() => getInitialState<number>('reactionPointReward', 100));

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

  useEffect(() => {
    localStorage.setItem('reactionPointThreshold', JSON.stringify(reactionPointThreshold));
  }, [reactionPointThreshold]);

  useEffect(() => {
    localStorage.setItem('reactionPointReward', JSON.stringify(reactionPointReward));
  }, [reactionPointReward]);

  const login = async (identifier: string, pin: string): Promise<void> => {
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
      comments: [],
      pointsAwarded: false,
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
    setPosts(prev => prev.filter(p => p.authorId !== userId));
  };
  
  const toggleReaction = (postId: string, emoji: string) => {
    if (!currentUser) return;

    let postAwardedPoints = false;
    const postAuthorId: string | null = null;

    const newPosts = posts.map(post => {
        if (post.id === postId) {
            let newReactions: Reaction[] = JSON.parse(JSON.stringify(post.reactions));
            const reactionIndex = newReactions.findIndex(r => r.emoji === emoji);

            if (reactionIndex > -1) {
                const reaction = newReactions[reactionIndex];
                const userIndex = reaction.users.indexOf(currentUser.id);
                if (userIndex > -1) {
                    reaction.users.splice(userIndex, 1);
                    if (reaction.users.length === 0) {
                        newReactions.splice(reactionIndex, 1);
                    }
                } else {
                    reaction.users.push(currentUser.id);
                }
            } else {
                newReactions.push({ emoji, users: [currentUser.id] });
            }

            const updatedPost = { ...post, reactions: newReactions };
            const totalReactions = updatedPost.reactions.reduce((sum, reaction) => sum + reaction.users.length, 0);
            
            if (totalReactions >= reactionPointThreshold && !updatedPost.pointsAwarded) {
                updatedPost.pointsAwarded = true;
                postAwardedPoints = true;
            }

            return updatedPost;
        }
        return post;
    });

    if (postAwardedPoints) {
      const awardedPost = newPosts.find(p => p.id === postId);
      if (awardedPost) {
        setUsers(currentUsers => currentUsers.map(user => {
          if (user.id === awardedPost.authorId) {
            const updatedUser = { ...user, uclPoints: user.uclPoints + reactionPointReward };
            if (currentUser && currentUser.id === updatedUser.id) {
              setCurrentUser(updatedUser);
            }
            return updatedUser;
          }
          return user;
        }));
      }
    }
    
    setPosts(newPosts);
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

  const upgradeToTeamOwnerPlus = async (): Promise<void> => {
    if (!currentUser || currentUser.role !== 'team_owner') {
        throw new Error('Only Team Owners can upgrade to Team Owner Plus.');
    }
    const updatedUser = { ...currentUser, role: 'team_owner_plus' as UserRole };
    
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
        claimedBy: [],
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

  const updateReactionPointConfig = async (threshold: number, reward: number): Promise<void> => {
    if (currentUser?.role !== 'admin') {
      throw new Error("You don't have permission to change site settings.");
    }
    setReactionPointThreshold(threshold);
    setReactionPointReward(reward);
  };

  const manualUpdateUserPoints = async (userId: string, points: number): Promise<void> => {
    if (currentUser?.role !== 'admin') {
      throw new Error("You don't have permission to update user points.");
    }
    setUsers(currentUsers => currentUsers.map(user => {
        if (user.id === userId) {
            const updatedUser = { ...user, uclPoints: user.uclPoints + points };
             if (currentUser && currentUser.id === updatedUser.id) {
                setCurrentUser(updatedUser);
             }
            return updatedUser;
        }
        return user;
    }));
  };

  const addComment = async (postId: string, content: string): Promise<void> => {
    if (!currentUser) throw new Error("You must be logged in to comment.");

    const newComment: Comment = {
        id: `c${Date.now()}`,
        authorId: currentUser.id,
        authorGamertag: currentUser.gamertag,
        content,
        timestamp: new Date().toISOString(),
    };

    setPosts(currentPosts =>
        currentPosts.map(post =>
            post.id === postId ? { ...post, comments: [...post.comments, newComment] } : post
        )
    );
  };

  const claimQuestReward = async (questId: string): Promise<void> => {
    if (!currentUser) {
        throw new Error("You must be logged in to claim a reward.");
    }
    const quest = quests.find(q => q.id === questId);
    if (!quest) throw new Error("Quest not found.");
    if (quest.status !== 'completed') throw new Error("Quest is not yet completed.");
    if (quest.claimedBy?.includes(currentUser.id)) throw new Error("You have already claimed this reward.");

    // Grant the prize (re-using logic from grantQuestReward but for currentUser)
    const pointsRegex = /(\d+)\s+UCL\s+Points/i;
    const match = quest.prize.match(pointsRegex);

    let userUpdated = false;
    setUsers(currentUsers => currentUsers.map(user => {
        if (user.id === currentUser.id) {
            userUpdated = true;
            const updatedUser = { ...user };
            if (match && match[1]) {
                const pointsToAdd = parseInt(match[1], 10);
                alert(`Awarding ${pointsToAdd} UCL Points to you.`);
                updatedUser.uclPoints += pointsToAdd;
            } else {
                alert(`You have received the prize: "${quest.prize}"! (Simulated)`);
            }
            setCurrentUser(updatedUser);
            return updatedUser;
        }
        return user;
    }));

    if (!userUpdated) throw new Error("Current user not found to grant reward to.");

    // Mark as claimed
    setQuests(currentQuests => currentQuests.map(q =>
        q.id === questId ? { ...q, claimedBy: [...(q.claimedBy || []), currentUser.id] } : q
    ));
  };
  
  const updateQuestProgress = async (questId: string, amount: number): Promise<void> => {
    setQuests(currentQuests => currentQuests.map(q => {
        if (q.id === questId && typeof q.progress === 'number' && typeof q.target === 'number' && q.status !== 'completed') {
            const newProgress = Math.min(q.progress + amount, q.target);
            // FIX: Explicitly type `newStatus` as `QuestStatus` to allow assignment of 'completed'.
            // The type was previously inferred as 'incomplete' | 'started' due to the `q.status !== 'completed'` check.
            let newStatus: QuestStatus = q.status;
            if (newProgress > 0 && newStatus === 'incomplete') {
                newStatus = 'started';
            }
            if (newProgress >= q.target) {
                newStatus = 'completed';
            }
            return { ...q, progress: newProgress, status: newStatus };
        }
        return q;
    }));
  };

  return (
    <AuthContext.Provider value={{ currentUser, users, posts, quests, reactionPointThreshold, reactionPointReward, login, logout, signUp, addPost, deletePost, deleteUser, toggleReaction, updateUser, assignCoOwner, removeCoOwner, updateUserRole, upgradeToPlayerPlus, upgradeToTeamOwnerPlus, addQuest, updateQuestStatus, deleteQuest, grantQuestReward, updateReactionPointConfig, manualUpdateUserPoints, addComment, claimQuestReward, updateQuestProgress }}>
      {children}
    </AuthContext.Provider>
  );
};