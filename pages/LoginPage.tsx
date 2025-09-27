import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';

export const LoginPage: React.FC = () => {
    const [identifier, setIdentifier] = useState('');
    const [pin, setPin] = useState('');
    const [error, setError] = useState('');
    const { login } = useAuth();
    const navigate = useNavigate();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        try {
            await login(identifier, pin);
            navigate('/');
        } catch (err: any) {
            setError(err.message);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-green-950 px-4">
            <div className="max-w-md w-full bg-green-900/50 p-8 rounded-xl shadow-2xl border border-yellow-700/50">
                <h2 className="text-3xl font-bold text-center text-white mb-6">Log In</h2>
                {error && <p className="bg-red-500/20 text-red-400 p-3 rounded-md mb-4 text-center">{error}</p>}
                <form onSubmit={handleSubmit} className="space-y-6">
                    <div>
                        <label className="text-sm font-bold text-gray-300 block mb-2" htmlFor="identifier">Gamertag or Email</label>
                        <input
                            type="text"
                            id="identifier"
                            value={identifier}
                            onChange={(e) => setIdentifier(e.target.value)}
                            className="w-full bg-green-800/60 text-white border border-green-700 rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-yellow-500 transition placeholder-gray-400/50"
                            required
                        />
                    </div>
                    <div>
                        <label className="text-sm font-bold text-gray-300 block mb-2" htmlFor="pin">4-Digit PIN</label>
                        <input
                            type="password"
                            id="pin"
                            value={pin}
                            onChange={(e) => setPin(e.target.value)}
                            maxLength={4}
                            className="w-full bg-green-800/60 text-white border border-green-700 rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-yellow-500 transition placeholder-gray-400/50"
                            required
                        />
                    </div>
                    <button
                        type="submit"
                        className="w-full bg-yellow-600 hover:bg-yellow-700 text-green-900 font-bold py-3 px-4 rounded-lg transition-transform hover:scale-105"
                    >
                        Log In
                    </button>
                </form>
                <p className="text-center text-gray-400 mt-6">
                    Don't have an account? <Link to="/signup" className="font-semibold text-yellow-300 hover:underline">Sign Up</Link>
                </p>
            </div>
        </div>
    );
};