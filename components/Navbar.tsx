import React from 'react';
import { NavLink, Link } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';

export const Navbar: React.FC = () => {
    const { currentUser, logout } = useAuth();

    const activeLinkClass = "bg-green-800 text-white";
    const inactiveLinkClass = "text-yellow-300 hover:bg-green-900 hover:text-yellow-100";
    const linkClasses = `px-3 py-2 rounded-md text-sm font-medium transition-colors`;

    return (
        <nav className="bg-green-950/90 backdrop-blur-sm shadow-lg sticky top-0 z-50 border-b border-yellow-800/50">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex items-center justify-between h-16">
                    <div className="flex items-center">
                        <Link to="/" className="text-2xl font-bold text-yellow-400">
                            United Clan League
                        </Link>
                        <div className="hidden md:block">
                            <div className="ml-10 flex items-baseline space-x-4">
                                <NavLink to="/" className={({ isActive }) => `${linkClasses} ${isActive ? activeLinkClass : inactiveLinkClass}`}>
                                    UCL Wall
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
                                    <span className="text-yellow-300 mr-4">Welcome, <span className="font-semibold text-yellow-400">{currentUser.gamertag}</span></span>
                                    <button onClick={logout} className="bg-red-600 hover:bg-red-700 text-white font-bold py-2 px-4 rounded-md transition-colors">
                                        Log Out
                                    </button>
                                </>
                            ) : (
                                <div className="space-x-2">
                                    <Link to="/login" className="bg-yellow-600 hover:bg-yellow-700 text-green-900 font-bold py-2 px-4 rounded-md transition-colors">
                                        Log In
                                    </Link>
                                    <Link to="/signup" className="bg-green-800 hover:bg-green-700 text-yellow-200 font-bold py-2 px-4 rounded-md transition-colors">
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