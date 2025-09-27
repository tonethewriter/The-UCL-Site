import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { UserRole } from '../types';
import { PaymentModal } from '../components/PaymentModal';

const roleOptions: { id: UserRole; label: string; description: string, price?: number }[] = [
    { id: 'player', label: 'Player', description: 'Standard player account.' },
    { id: 'player_plus', label: 'Player Plus ⭐', description: 'Enhanced player features.', price: 10 },
    { id: 'team_owner', label: 'Team Owner', description: 'Create and manage a team.' },
    { id: 'team_owner_plus', label: 'Team Owner Plus ⭐', description: 'Enhanced team management.', price: 25 },
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

    const [isPaymentModalOpen, setIsPaymentModalOpen] = useState(false);
    const [paymentDetails, setPaymentDetails] = useState<{ productName: string; price: number; onConfirm: () => Promise<void> } | null>(null);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (pin.length !== 4 || !/^\d{4}$/.test(pin)) {
            setError("PIN must be exactly 4 digits.");
            return;
        }
        setError('');

        const selectedRoleOption = roleOptions.find(o => o.id === role);
        const isPaidRole = selectedRoleOption && selectedRoleOption.price;

        const performSignUp = async () => {
            try {
                await signUp(gamertag, email, pin, role, teamName);
                // On successful signup from a payment modal, this will navigate away.
                // We don't want to close the modal here, as it handles its own lifecycle.
                if (isPaymentModalOpen) return;
                navigate('/');
            } catch (err: any) {
                setError(err.message);
                // If an error occurs during signup (e.g., gamertag taken), close the modal
                // so the user can see the error on the form.
                if (isPaymentModalOpen) {
                    setIsPaymentModalOpen(false);
                }
                throw err; // re-throw to let payment modal know it failed
            }
        };

        if (isPaidRole) {
            setPaymentDetails({
                productName: `New Account: ${selectedRoleOption.label}`,
                price: selectedRoleOption.price!,
                onConfirm: performSignUp,
            });
            setIsPaymentModalOpen(true);
        } else {
            await performSignUp();
        }
    };

    const needsTeamName = role === 'team_owner' || role === 'team_owner_plus' || role === 'co_owner';

    return (
        <>
            <div className="min-h-screen flex items-center justify-center bg-brand-bg py-12 px-4">
                <div className="max-w-md w-full bg-brand-surface p-8 rounded-xl shadow-2xl border border-brand-border/50">
                    <h2 className="text-3xl font-bold text-center text-white mb-6">Create Account</h2>
                    {error && <p className="bg-red-500/20 text-red-400 p-3 rounded-md mb-4 text-center">{error}</p>}
                    <form onSubmit={handleSubmit} className="space-y-6">
                        {/* Role Selector */}
                        <div>
                            <label className="text-sm font-bold text-brand-text-muted block mb-3">Account Type</label>
                            <div className="grid grid-cols-2 gap-3">
                                {roleOptions.map(option => (
                                    <div key={option.id}>
                                        <input type="radio" id={option.id} name="role" value={option.id}
                                            checked={role === option.id}
                                            onChange={() => setRole(option.id)}
                                            className="sr-only peer"
                                        />
                                        <label htmlFor={option.id} className="block cursor-pointer text-center p-3 rounded-lg border border-brand-border bg-black/30 peer-checked:ring-2 peer-checked:ring-brand-accent peer-checked:border-transparent transition">
                                            <span className="text-sm font-semibold text-white">{option.label}</span>
                                            {option.price && (
                                                <span className="text-xs font-bold text-brand-accent block mt-1">${option.price.toFixed(2)} Fee</span>
                                            )}
                                        </label>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Form Fields */}
                        <div>
                            <label className="text-sm font-bold text-brand-text-muted block mb-2" htmlFor="gamertag">Gamertag</label>
                            <input type="text" id="gamertag" value={gamertag} onChange={(e) => setGamertag(e.target.value)}
                                className="w-full bg-black/30 text-white border border-brand-border rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-brand-accent transition" required
                            />
                        </div>
                        <div>
                            <label className="text-sm font-bold text-brand-text-muted block mb-2" htmlFor="email">Email</label>
                            <input type="email" id="email" value={email} onChange={(e) => setEmail(e.target.value)}
                                className="w-full bg-black/30 text-white border border-brand-border rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-brand-accent transition" required
                            />
                        </div>
                        <div>
                            <label className="text-sm font-bold text-brand-text-muted block mb-2" htmlFor="pin">4-Digit PIN</label>
                            <input type="password" id="pin" value={pin} onChange={(e) => setPin(e.target.value)}
                                pattern="\d{4}" maxLength={4}
                                className="w-full bg-black/30 text-white border border-brand-border rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-brand-accent transition" required
                            />
                        </div>
                        {needsTeamName && (
                            <div>
                                <label className="text-sm font-bold text-brand-text-muted block mb-2" htmlFor="teamName">Team Name</label>
                                <input type="text" id="teamName" value={teamName} onChange={(e) => setTeamName(e.target.value)}
                                    className="w-full bg-black/30 text-white border border-brand-border rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-brand-accent transition" required
                                />
                            </div>
                        )}

                        <button type="submit" className="w-full bg-brand-interactive hover:bg-green-500 text-black font-bold py-3 px-4 rounded-lg transition-transform hover:scale-105">
                            Sign Up
                        </button>
                    </form>
                    <p className="text-center text-brand-text-muted mt-6">
                        Already have an account? <Link to="/login" className="font-semibold text-brand-accent hover:underline">Log In</Link>
                    </p>
                </div>
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