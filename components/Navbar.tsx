import React from 'react';
import { NavLink, Link } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { RoleBadge } from './RoleBadge';

export const Navbar: React.FC = () => {
    const { currentUser, logout } = useAuth();

    const activeLinkClass = "bg-green-800 text-white";
    const inactiveLinkClass = "text-gray-300 hover:bg-green-900 hover:text-white";
    const linkClasses = `px-3 py-2 rounded-md text-sm font-medium transition-colors`;

    return (
        <nav className="bg-green-950/90 backdrop-blur-sm shadow-lg sticky top-0 z-50 border-b border-yellow-800/50">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex items-center justify-between h-16">
                    <div className="flex items-center">
                        <Link to="/" className="text-2xl font-bold text-yellow-300">
                            United Clan League
                        </Link>
                        <div className="hidden md:block">
                            <div className="ml-10 flex items-baseline space-x-4">
                                <NavLink to="/" className={({ isActive }) => `${linkClasses} ${isActive ? activeLinkClass : inactiveLinkClass}`}>
                                    UCL Wall
                                </NavLink>
                                 <NavLink to="/quests" className={({ isActive }) => `${linkClasses} ${isActive ? activeLinkClass : inactiveLinkClass}`}>
                                    Tone's Quests
                                </NavLink>
                                {currentUser?.role === 'admin' && (
                                    <NavLink to="/admin" className={({ isActive }) => `${linkClasses} ${isActive ? activeLinkClass : inactiveLinkClass}`}>
                                        Admin Dashboard
                                    </NavLink>
                                )}
                            </div>
                        </div>
                    </div>
                    <div className="hidden md:block">
                        <div className="ml-4 flex items-center md:ml-6">
                            {currentUser ? (
                                <>
                                    <NavLink 
                                        to="/profile" 
                                        className="text-gray-300 hover:text-white mr-4 transition-colors rounded-md px-2 py-1 flex items-center gap-2"
                                        style={({ isActive }) => isActive ? { backgroundColor: 'rgba(234, 179, 8, 0.1)' } : {}}
                                    >
                                        Welcome, <span className="font-semibold text-yellow-300">{currentUser.gamertag}</span>
                                        <RoleBadge role={currentUser.role} />
                                    </NavLink>
                                    <button onClick={logout} className="bg-red-600 hover:bg-red-700 text-white font-bold py-2 px-4 rounded-md transition-colors">
                                        Log Out
                                    </button>
                                </>
                            ) : (
                                <div className="space-x-2">
                                    <Link to="/login" className="bg-yellow-600 hover:bg-yellow-700 text-green-900 font-bold py-2 px-4 rounded-md transition-colors">
                                        Log In
                                    </Link>
                                    <Link to="/signup" className="bg-green-800 hover:bg-green-700 text-white font-bold py-2 px-4 rounded-md transition-colors">
                                        Sign Up
                                    </Link>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </nav>
    );
};