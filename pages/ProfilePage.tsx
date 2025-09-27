import React, { useState } from 'react';
import { useAuth } from '../hooks/useAuth';
import { Navigate } from 'react-router-dom';
import { ConfirmationModal } from '../components/ConfirmationModal';

const roleDisplayMap = {
    player: 'Player',
    player_plus: 'Player Plus ⭐',
    team_owner: 'Team Owner',
    co_owner: 'Co-Owner',
    team_owner_plus: 'Team Owner Plus ⭐',
    admin: 'Administrator'
};

export const ProfilePage: React.FC = () => {
    const { currentUser, leaveTeam, toggleFreeAgentStatus } = useAuth();
    const [gamertag, setGamertag] = useState(currentUser?.gamertag || '');
    const [email, setEmail] = useState(currentUser?.email || '');
    const [isLeaveModalOpen, setIsLeaveModalOpen] = useState(false);
    const [isFAModalOpen, setIsFAModalOpen] = useState(false);

    if (!currentUser) {
        return <Navigate to="/login" replace />;
    }

    const handleUpdate = (e: React.FormEvent) => {
        e.preventDefault();
        // In a real app, this would call an update function from the context
        alert('Profile update functionality is not implemented in this demo.');
    };
    
    const handleLeaveTeam = async () => {
        try {
            await leaveTeam();
        } catch(error: any) {
            alert(error.message);
        }
    }
    
    const handleToggleFreeAgent = async () => {
        try {
            await toggleFreeAgentStatus();
        } catch(error: any) {
            alert(error.message);
        } finally {
            setIsFAModalOpen(false);
        }
    };

    const handleFABtnClick = () => {
        if (currentUser.teamName && !currentUser.isFreeAgent) {
            setIsFAModalOpen(true);
        } else {
            handleToggleFreeAgent();
        }
    };
    
    const canLeaveTeam = currentUser.role === 'player' || currentUser.role === 'player_plus';

    return (
        <>
            <div className="max-w-4xl mx-auto py-10 px-4 sm:px-6 lg:px-8">
                <h1 className="text-4xl font-bold text-brand-accent mb-8">Your Profile</h1>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                    <div className="md:col-span-1">
                        <div className="bg-brand-surface p-6 rounded-xl shadow-lg border border-brand-border/50 text-center">
                            {currentUser.profilePicture ? (
                                <img src={currentUser.profilePicture} alt={currentUser.gamertag} className="w-32 h-32 rounded-full object-cover ring-4 ring-brand-accent/50 bg-brand-border mx-auto" />
                            ) : (
                                <div className="w-32 h-32 rounded-full bg-brand-accent flex items-center justify-center font-bold text-black text-6xl ring-4 ring-brand-accent/50 mx-auto">
                                    {currentUser.gamertag.charAt(0).toUpperCase()}
                                </div>
                            )}
                            <button className="mt-4 text-xs bg-brand-interactive/50 hover:bg-brand-interactive text-white font-semibold py-1 px-3 rounded-md transition-colors">
                                Change Picture
                            </button>
                            <div className="mt-6 text-left space-y-3">
                                <div className="bg-black/30 px-3 py-2 rounded-md text-sm">
                                    <strong className="block text-brand-text-muted text-xs">Role</strong>
                                    <span className="text-white">{roleDisplayMap[currentUser.role]}</span>
                                </div>
                                {currentUser.teamName && (
                                    <div className="bg-black/30 px-3 py-2 rounded-md text-sm">
                                        <strong className="block text-brand-text-muted text-xs">Team</strong>
                                        <div className="flex justify-between items-center">
                                            <span className="text-white">{currentUser.teamName}</span>
                                            {canLeaveTeam && (
                                                <button onClick={() => setIsLeaveModalOpen(true)} className="text-xs text-red-400 hover:underline">Leave</button>
                                            )}
                                        </div>
                                    </div>
                                )}
                                <div className="bg-black/30 px-3 py-2 rounded-md text-sm">
                                    <strong className="block text-brand-text-muted text-xs">UCL Points</strong>
                                    <span className="text-brand-accent font-bold">{currentUser.uclPoints.toLocaleString()}</span>
                                </div>
                            </div>
                             <div className="mt-6">
                                {currentUser.isFreeAgent ? (
                                    <button onClick={handleToggleFreeAgent} className="w-full text-center bg-yellow-600 hover:bg-yellow-700 text-white font-bold py-2 px-4 rounded-md transition-colors">
                                        Remove Free Agent Status
                                    </button>
                                ) : (
                                    <button onClick={handleFABtnClick} className="w-full text-center bg-brand-interactive hover:bg-green-500 text-black font-bold py-2 px-4 rounded-md transition-colors">
                                        Become a Free Agent
                                    </button>
                                )}
                             </div>
                        </div>
                    </div>

                    <div className="md:col-span-2">
                        <div className="bg-brand-surface p-8 rounded-xl shadow-lg border border-brand-border/50">
                            <h2 className="text-2xl font-semibold text-white mb-6">Account Details</h2>
                            <form onSubmit={handleUpdate} className="space-y-6">
                                <div>
                                    <label className="text-sm font-bold text-brand-text-muted block mb-2" htmlFor="gamertag">Gamertag</label>
                                    <input
                                        type="text"
                                        id="gamertag"
                                        value={gamertag}
                                        onChange={(e) => setGamertag(e.target.value)}
                                        className="w-full bg-black/30 text-white border border-brand-border rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-brand-accent transition"
                                    />
                                </div>
                                <div>
                                    <label className="text-sm font-bold text-brand-text-muted block mb-2" htmlFor="email">Email</label>
                                    <input
                                        type="email"
                                        id="email"
                                        value={email}
                                        onChange={(e) => setEmail(e.target.value)}
                                        className="w-full bg-black/30 text-white border border-brand-border rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-brand-accent transition"
                                    />
                                </div>
                                <div>
                                    <label className="text-sm font-bold text-brand-text-muted block mb-2">Change PIN</label>
                                    <button type="button" className="text-sm bg-brand-border hover:bg-brand-interactive text-white font-semibold py-2 px-4 rounded-md transition-colors">
                                        Request PIN Change
                                    </button>
                                </div>
                                <div className="pt-2">
                                    <button
                                        type="submit"
                                        className="w-full bg-brand-interactive hover:bg-green-500 text-black font-bold py-3 px-4 rounded-lg transition-transform hover:scale-105"
                                    >
                                        Update Profile
                                    </button>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            </div>
            <ConfirmationModal 
                isOpen={isLeaveModalOpen}
                onClose={() => setIsLeaveModalOpen(false)}
                onConfirm={handleLeaveTeam}
                title="Leave Team"
                message={`Are you sure you want to leave ${currentUser.teamName}? You will lose access to the team chat and other team features.`}
                confirmText="Yes, Leave"
            />
            <ConfirmationModal 
                isOpen={isFAModalOpen}
                onClose={() => setIsFAModalOpen(false)}
                onConfirm={handleToggleFreeAgent}
                title="Become a Free Agent"
                message={`This will remove you from your current team (${currentUser.teamName}). Are you sure you want to become a free agent?`}
                confirmText="Yes, Leave & List Me"
                confirmButtonClass="bg-yellow-600 hover:bg-yellow-700"
            />
        </>
    );
};