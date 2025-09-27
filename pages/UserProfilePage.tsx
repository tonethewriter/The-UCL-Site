import React from 'react';
import { useParams, Link } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';

export const UserProfilePage: React.FC = () => {
    const { userId } = useParams<{ userId: string }>();
    const { users } = useAuth();

    const user = users.find(u => u.id === userId);

    if (!user) {
        return (
            <div className="text-center py-20">
                <h1 className="text-3xl font-bold text-yellow-300">User Not Found</h1>
                <p className="text-gray-400 mt-2">Could not find a user with the specified ID.</p>
                <Link to="/" className="mt-6 inline-block bg-yellow-600 hover:bg-yellow-700 text-green-900 font-bold py-2 px-6 rounded-lg transition-transform hover:scale-105">
                    Go to Home
                </Link>
            </div>
        );
    }
    
    const roleDisplayMap = {
        player: 'Player',
        player_plus: 'Player Plus ⭐',
        team_owner: 'Team Owner',
        co_owner: 'Co-Owner',
        team_owner_plus: 'Team Owner Plus ⭐',
        admin: 'Administrator'
    };

    return (
        <div className="max-w-4xl mx-auto py-10 px-4 sm:px-6 lg:px-8">
            <div className="bg-green-900/60 p-8 rounded-xl shadow-2xl border border-yellow-700/50">
                <div className="flex flex-col md:flex-row items-center md:items-start md:space-x-8">
                    <div className="flex-shrink-0 mb-6 md:mb-0">
                         {user.profilePicture ? (
                            <img src={user.profilePicture} alt={user.gamertag} className="w-32 h-32 rounded-full object-cover ring-4 ring-yellow-600/50 bg-green-800" />
                        ) : (
                            <div className="w-32 h-32 rounded-full bg-yellow-500 flex items-center justify-center font-bold text-green-900 text-6xl ring-4 ring-yellow-600/50">
                                {user.gamertag.charAt(0).toUpperCase()}
                            </div>
                        )}
                    </div>
                    
                    <div className="flex-grow text-center md:text-left">
                        <h1 className="text-4xl font-bold text-white break-words">{user.gamertag}</h1>
                        <p className="text-gray-400 mt-1 break-words">{user.email}</p>
                        <div className="mt-4 space-y-2">
                            <div className="flex items-center justify-center md:justify-start gap-2 bg-green-800/50 px-3 py-1 rounded-full text-sm text-gray-200 w-fit mx-auto md:mx-0">
                                <strong>Role:</strong> {roleDisplayMap[user.role]}
                            </div>
                            {user.teamName && (
                                <div className="flex items-center justify-center md:justify-start gap-2 bg-green-800/50 px-3 py-1 rounded-full text-sm text-gray-200 w-fit mx-auto md:mx-0">
                                    <strong>Team:</strong> {user.teamName}
                                </div>
                            )}
                            <div className="flex items-center justify-center md:justify-start gap-2 bg-green-800/50 px-3 py-1 rounded-full text-sm text-gray-200 w-fit mx-auto md:mx-0">
                                <strong>UCL Points:</strong> {user.uclPoints.toLocaleString()}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};