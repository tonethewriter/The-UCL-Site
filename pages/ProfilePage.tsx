import React, { useState, useEffect } from 'react';
import { useAuth } from '../hooks/useAuth';
import { User } from '../types';
import { PaymentModal } from '../components/PaymentModal';

export const ProfilePage: React.FC = () => {
    const { currentUser, updateUser, users, assignCoOwner, removeCoOwner, upgradeToPlayerPlus, upgradeToTeamOwnerPlus } = useAuth();
    
    const [isEditing, setIsEditing] = useState(false);
    
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');
    const [teamMgmtError, setTeamMgmtError] = useState('');
    const [teamMgmtSuccess, setTeamMgmtSuccess] = useState('');
    const [coOwnerIdentifier, setCoOwnerIdentifier] = useState('');
    
    const [gamertag, setGamertag] = useState(currentUser?.gamertag || '');
    const [email, setEmail] = useState(currentUser?.email || '');
    const [pin, setPin] = useState('');
    const [confirmPin, setConfirmPin] = useState('');
    const [newProfilePicture, setNewProfilePicture] = useState<string | null>(null);

    const [isPaymentModalOpen, setIsPaymentModalOpen] = useState(false);
    const [paymentDetails, setPaymentDetails] = useState<{ productName: string; price: number; onConfirm: () => Promise<void> } | null>(null);
    
    useEffect(() => {
        if (currentUser) {
            setGamertag(currentUser.gamertag);
            setEmail(currentUser.email);
            setSuccess(''); // Clear success message on user change
        }
    }, [currentUser]);

    if (!currentUser) {
        return <div className="text-center py-10">Loading profile...</div>;
    }

    const handlePictureChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            const file = e.target.files[0];
            const reader = new FileReader();
            reader.onloadend = () => {
                setNewProfilePicture(reader.result as string);
            };
            reader.readAsDataURL(file);
        }
    };

    const handleCancel = () => {
        setIsEditing(false);
        setGamertag(currentUser.gamertag);
        setEmail(currentUser.email);
        setPin('');
        setConfirmPin('');
        setNewProfilePicture(null);
        setError('');
        setSuccess('');
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        setSuccess('');

        if (pin && (pin.length !== 4 || !/^\d{4}$/.test(pin))) {
            setError("PIN must be exactly 4 digits.");
            return;
        }

        if (pin && pin !== confirmPin) {
            setError("PINs do not match.");
            return;
        }

        try {
            const updates: Partial<Pick<User, 'gamertag' | 'email' | 'pin' | 'profilePicture'>> = {};
            if (gamertag !== currentUser.gamertag) updates.gamertag = gamertag;
            if (email !== currentUser.email) updates.email = email;
            if (pin) updates.pin = pin;
            if (newProfilePicture) updates.profilePicture = newProfilePicture;

            if (Object.keys(updates).length > 0) {
                await updateUser(currentUser.id, updates);
                setSuccess('Profile updated successfully!');
            }
            setIsEditing(false);
            setPin('');
            setConfirmPin('');
            setNewProfilePicture(null);
        } catch (err: any) {
            setError(err.message);
        }
    };

    const handleAddCoOwner = async (e: React.FormEvent) => {
        e.preventDefault();
        setTeamMgmtError('');
        setTeamMgmtSuccess('');
        try {
            await assignCoOwner(coOwnerIdentifier);
            setTeamMgmtSuccess(`Successfully assigned ${coOwnerIdentifier} as Co-Owner.`);
            setCoOwnerIdentifier('');
        } catch (err: any) {
            setTeamMgmtError(err.message);
        }
    };

    const handleRemoveCoOwner = async (coOwnerId: string) => {
        setTeamMgmtError('');
        setTeamMgmtSuccess('');
        if (window.confirm('Are you sure you want to remove this Co-Owner? This action cannot be undone.')) {
            try {
                await removeCoOwner(coOwnerId);
                setTeamMgmtSuccess('Co-Owner has been removed.');
            } catch (err: any) {
                setTeamMgmtError(err.message);
            }
        }
    };

    const handlePlayerPlusUpgrade = () => {
        setPaymentDetails({
            productName: 'Player Plus Upgrade',
            price: 10,
            onConfirm: async () => {
                await upgradeToPlayerPlus();
                setIsPaymentModalOpen(false);
                setSuccess('Congratulations! You are now a Player Plus member.');
            },
        });
        setIsPaymentModalOpen(true);
    };

    const handleTeamOwnerPlusUpgrade = () => {
        setPaymentDetails({
            productName: 'Team Owner Plus Upgrade',
            price: 25,
            onConfirm: async () => {
                await upgradeToTeamOwnerPlus();
                setIsPaymentModalOpen(false);
                setSuccess('Congratulations! You now have Team Owner Plus privileges.');
            },
        });
        setIsPaymentModalOpen(true);
    };

    const isOwner = currentUser.role === 'team_owner' || currentUser.role === 'team_owner_plus';
    const coOwner = isOwner ? users.find(u => u.teamName === currentUser.teamName && u.role === 'co_owner') : null;

    const roleDisplayMap = {
        player: 'Player',
        player_plus: 'Player Plus ⭐',
        team_owner: 'Team Owner',
        co_owner: 'Co-Owner',
        team_owner_plus: 'Team Owner Plus ⭐',
        admin: 'Administrator'
    };

    const displayPicture = newProfilePicture || currentUser.profilePicture;
    
    return (
        <>
            <div className="max-w-4xl mx-auto py-10 px-4 sm:px-6 lg:px-8">
                <div className="bg-green-900/60 p-8 rounded-xl shadow-2xl border border-yellow-700/50">
                    <div className="flex flex-col md:flex-row items-center md:items-start md:space-x-8">
                        <div className="flex-shrink-0 mb-6 md:mb-0">
                            {displayPicture ? (
                                <img src={displayPicture} alt={currentUser.gamertag} className="w-32 h-32 rounded-full object-cover ring-4 ring-yellow-600/50 bg-green-800" />
                            ) : (
                                <div className="w-32 h-32 rounded-full bg-yellow-500 flex items-center justify-center font-bold text-green-900 text-6xl ring-4 ring-yellow-600/50">
                                    {currentUser.gamertag.charAt(0).toUpperCase()}
                                </div>
                            )}
                        </div>
                        
                        <div className="flex-grow text-center md:text-left w-full">
                            {!isEditing ? (
                                <>
                                    <h1 className="text-4xl font-bold text-white break-words">{currentUser.gamertag}</h1>
                                    <p className="text-gray-400 mt-1 break-words">{currentUser.email}</p>
                                    <div className="mt-4 space-y-2">
                                        <div className="flex items-center justify-center md:justify-start gap-2 bg-green-800/50 px-3 py-1 rounded-full text-sm text-gray-200 w-fit mx-auto md:mx-0">
                                            <strong>Role:</strong> {roleDisplayMap[currentUser.role]}
                                        </div>
                                        {currentUser.teamName && (
                                            <div className="flex items-center justify-center md:justify-start gap-2 bg-green-800/50 px-3 py-1 rounded-full text-sm text-gray-200 w-fit mx-auto md:mx-0">
                                                <strong>Team:</strong> {currentUser.teamName}
                                            </div>
                                        )}
                                        <div className="flex items-center justify-center md:justify-start gap-2 bg-green-800/50 px-3 py-1 rounded-full text-sm text-gray-200 w-fit mx-auto md:mx-0">
                                            <strong>UCL Points:</strong> {currentUser.uclPoints.toLocaleString()}
                                        </div>
                                    </div>
                                    <div className="mt-6 flex items-center justify-center md:justify-start gap-4">
                                        <button onClick={() => setIsEditing(true)} className="bg-yellow-600 hover:bg-yellow-700 text-green-900 font-bold py-2 px-6 rounded-lg transition-transform hover:scale-105">
                                            Edit Profile
                                        </button>
                                    </div>

                                    {success && <p className="mt-4 text-green-400 text-center md:text-left">{success}</p>}
                                    {error && <p className="mt-4 text-red-400 text-center md:text-left">{error}</p>}
                                </>
                            ) : (
                                <form onSubmit={handleSubmit} className="space-y-4">
                                    <h2 className="text-2xl font-bold text-white mb-4">Edit Profile</h2>
                                    {error && <p className="bg-red-500/20 text-red-400 p-3 rounded-md text-center">{error}</p>}
                                    <div>
                                        <label className="text-sm font-bold text-gray-300 block mb-2" htmlFor="profilePicture">Profile Picture</label>
                                        <input type="file" id="profilePicture" accept="image/png, image/jpeg" onChange={handlePictureChange} className="w-full text-sm text-gray-300 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-yellow-600 file:text-green-900 hover:file:bg-yellow-700"/>
                                    </div>
                                    <div>
                                        <label className="text-sm font-bold text-gray-300 block mb-2" htmlFor="gamertag">Gamertag</label>
                                        <input type="text" id="gamertag" value={gamertag} onChange={(e) => setGamertag(e.target.value)} className="w-full bg-green-800/60 text-white border border-green-700 rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-yellow-500 transition" required />
                                    </div>
                                    <div>
                                        <label className="text-sm font-bold text-gray-300 block mb-2" htmlFor="email">Email</label>
                                        <input type="email" id="email" value={email} onChange={(e) => setEmail(e.target.value)} className="w-full bg-green-800/60 text-white border border-green-700 rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-yellow-500 transition" required />
                                    </div>
                                    <div>
                                        <label className="text-sm font-bold text-gray-300 block mb-2" htmlFor="pin">New 4-Digit PIN (optional)</label>
                                        <input type="password" id="pin" value={pin} onChange={(e) => setPin(e.target.value)} pattern="\\d{4}" maxLength={4} className="w-full bg-green-800/60 text-white border border-green-700 rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-yellow-500 transition" />
                                    </div>
                                    <div>
                                        <label className="text-sm font-bold text-gray-300 block mb-2" htmlFor="confirmPin">Confirm New PIN</label>
                                        <input type="password" id="confirmPin" value={confirmPin} onChange={(e) => setConfirmPin(e.target.value)} pattern="\\d{4}" maxLength={4} className="w-full bg-green-800/60 text-white border border-green-700 rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-yellow-500 transition" />
                                    </div>
                                    <div className="flex items-center gap-4 pt-2">
                                        <button type="submit" className="bg-yellow-600 hover:bg-yellow-700 text-green-900 font-bold py-2 px-6 rounded-lg transition-transform hover:scale-105">
                                            Save Changes
                                        </button>
                                        <button type="button" onClick={handleCancel} className="bg-green-700 hover:bg-green-600 text-white font-bold py-2 px-6 rounded-lg transition-colors">
                                            Cancel
                                        </button>
                                    </div>
                                </form>
                            )}
                        </div>
                    </div>
                </div>

                {currentUser.role === 'player' && (
                    <div className="mt-8 text-center bg-purple-900/30 border border-purple-600/50 rounded-lg p-6">
                        <h3 className="text-xl font-bold text-white">Upgrade to Player Plus ⭐</h3>
                        <p className="text-purple-200 mt-2">Unlock exclusive features and stand out from the crowd.</p>
                        <button onClick={handlePlayerPlusUpgrade} className="mt-4 bg-purple-600 hover:bg-purple-700 text-white font-bold py-2 px-8 rounded-lg transition-transform hover:scale-105">
                            Upgrade for $10.00
                        </button>
                    </div>
                )}
                 {currentUser.role === 'team_owner' && (
                    <div className="mt-8 text-center bg-blue-900/30 border border-blue-600/50 rounded-lg p-6">
                        <h3 className="text-xl font-bold text-white">Upgrade to Team Owner Plus ⭐</h3>
                        <p className="text-blue-200 mt-2">Get advanced team management tools and priority support.</p>
                        <button onClick={handleTeamOwnerPlusUpgrade} className="mt-4 bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-8 rounded-lg transition-transform hover:scale-105">
                           Upgrade for $25.00
                        </button>
                    </div>
                )}
{/* FIX: Moved Team Management section inside the main container and removed extra closing div tag */}
                {isOwner && (
                     <div className="mt-8 bg-green-900/60 p-8 rounded-xl shadow-2xl border border-yellow-700/50">
                        <h2 className="text-2xl font-bold text-white mb-4">Team Management</h2>
                        {teamMgmtError && <p className="bg-red-500/20 text-red-400 p-3 rounded-md mb-4 text-center">{teamMgmtError}</p>}
                        {teamMgmtSuccess && <p className="bg-green-500/20 text-green-400 p-3 rounded-md mb-4 text-center">{teamMgmtSuccess}</p>}
                        
                        {coOwner ? (
                            <div>
                                <h3 className="text-lg font-semibold text-gray-300">Current Co-Owner</h3>
                                <div className="mt-2 bg-green-800/50 p-4 rounded-lg flex items-center justify-between">
                                    <span className="text-white font-medium">{coOwner.gamertag}</span>
                                    <button onClick={() => handleRemoveCoOwner(coOwner.id)} className="bg-red-600 hover:bg-red-700 text-white font-bold py-1 px-3 rounded-md text-sm transition-colors">
                                        Remove
                                    </button>
                                </div>
                            </div>
                        ) : (
                            <form onSubmit={handleAddCoOwner}>
                                <h3 className="text-lg font-semibold text-gray-300 mb-2">Add Co-Owner</h3>
                                <p className="text-sm text-gray-400 mb-3">Enter the gamertag or email of an existing user to make them a Co-Owner. Your team can only have one Co-Owner.</p>
                                <div className="flex flex-col sm:flex-row items-center gap-4">
                                    <input 
                                        type="text" 
                                        value={coOwnerIdentifier}
                                        onChange={(e) => setCoOwnerIdentifier(e.target.value)}
                                        placeholder="Gamertag or Email"
                                        className="w-full flex-grow bg-green-800/60 text-white border border-green-700 rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-yellow-500 transition" 
                                        required 
                                    />
                                    <button type="submit" className="w-full sm:w-auto bg-yellow-600 hover:bg-yellow-700 text-green-900 font-bold py-3 px-6 rounded-lg transition-colors">
                                        Assign
                                    </button>
                                </div>
                            </form>
                        )}
                    </div>
                )}
            </div>
            {isPaymentModalOpen && paymentDetails && (
                <PaymentModal
                    isOpen={isPaymentModalOpen}
                    onClose={() => setIsPaymentModalOpen(false)}
                    productName={paymentDetails.productName}
                    price={paymentDetails.price}
                    onSuccess={paymentDetails.onConfirm}
                />
            )}
        </>
    );
};
