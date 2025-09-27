import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { UserRole } from '../types';

const roleOptions: { id: UserRole; label: string; description: string }[] = [
    { id: 'player', label: 'Player', description: 'Standard player account.' },
    { id: 'player_plus', label: 'Player Plus', description: 'Enhanced player features.' },
    { id: 'team_owner', label: 'Team Owner', description: 'Create and manage a team.' },
    { id: 'team_owner_plus', label: 'Team Owner Plus', description: 'Enhanced team management.' },
];

export const SignUpPage: React.FC = () => {
    const [gamertag, setGamertag] = useState('');
    const [email, setEmail] = useState('');
    const [pin, setPin] = useState('');
    const [teamName, setTeamName] = useState('');
    const [role, setRole] = useState<UserRole>('player');
    const [error, setError] = useState('');
    const { signUp } = useAuth();
    const navigate = useNavigate();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (pin.length !== 4 || !/^\d{4}$/.test(pin)) {
            setError("PIN must be exactly 4 digits.");
            return;
        }
        setError('');
        try {
            await signUp(gamertag, email, pin, role, teamName);
            navigate('/');
        } catch (err: any) {
            setError(err.message);
        }
    };

    const isTeamOwner = role === 'team_owner' || role === 'team_owner_plus';

    return (
        <div className="min-h-screen flex items-center justify-center bg-green-950 py-12 px-4">
            <div className="max-w-md w-full bg-green-900/50 p-8 rounded-xl shadow-2xl border border-yellow-700/50">
                <h2 className="text-3xl font-bold text-center text-yellow-300 mb-6">Create Account</h2>
                {error && <p className="bg-red-500/20 text-red-400 p-3 rounded-md mb-4 text-center">{error}</p>}
                <form onSubmit={handleSubmit} className="space-y-6">
                    {/* Role Selector */}
                    <div>
                        <label className="text-sm font-bold text-yellow-500 block mb-3">Account Type</label>
                        <div className="grid grid-cols-2 gap-3">
                            {roleOptions.map(option => (
                                <div key={option.id}>
                                    <input type="radio" id={option.id} name="role" value={option.id}
                                        checked={role === option.id}
                                        onChange={() => setRole(option.id)}
                                        className="sr-only peer"
                                    />
                                    <label htmlFor={option.id} className="block cursor-pointer text-center p-3 rounded-lg border border-green-700 bg-green-800/60 peer-checked:ring-2 peer-checked:ring-yellow-500 peer-checked:border-transparent transition">
                                        <span className="text-sm font-semibold text-yellow-300">{option.label}</span>
                                    </label>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Form Fields */}
                    <div>
                        <label className="text-sm font-bold text-yellow-500 block mb-2" htmlFor="gamertag">Gamertag</label>
                        <input type="text" id="gamertag" value={gamertag} onChange={(e) => setGamertag(e.target.value)}
                            className="w-full bg-green-800/60 text-yellow-200 border border-green-700 rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-yellow-500 transition" required
                        />
                    </div>
                     <div>
                        <label className="text-sm font-bold text-yellow-500 block mb-2" htmlFor="email">Email</label>
                        <input type="email" id="email" value={email} onChange={(e) => setEmail(e.target.value)}
                            className="w-full bg-green-800/60 text-yellow-200 border border-green-700 rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-yellow-500 transition" required
                        />
                    </div>
                     <div>
                        <label className="text-sm font-bold text-yellow-500 block mb-2" htmlFor="pin">4-Digit PIN</label>
                        <input type="password" id="pin" value={pin} onChange={(e) => setPin(e.target.value)}
                            pattern="\d{4}" maxLength={4}
                            className="w-full bg-green-800/60 text-yellow-200 border border-green-700 rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-yellow-500 transition" required
                        />
                    </div>
                     {isTeamOwner && (
                         <div>
                             <label className="text-sm font-bold text-yellow-500 block mb-2" htmlFor="teamName">Team Name</label>
                             <input type="text" id="teamName" value={teamName} onChange={(e) => setTeamName(e.target.value)}
                                 className="w-full bg-green-800/60 text-yellow-200 border border-green-700 rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-yellow-500 transition" required
                             />
                         </div>
                     )}

                    <button type="submit" className="w-full bg-yellow-600 hover:bg-yellow-700 text-green-900 font-bold py-3 px-4 rounded-lg transition-transform hover:scale-105">
                        Sign Up
                    </button>
                </form>
                <p className="text-center text-yellow-500 mt-6">
                    Already have an account? <Link to="/login" className="font-semibold text-yellow-400 hover:underline">Log In</Link>
                </p>
            </div>
        </div>
    );
};