import React, { useState } from 'react';
import { NavLink, Link } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { RoleBadge } from './RoleBadge';

const MenuIcon = () => (
    <svg className="h-6 w-6" stroke="currentColor" fill="none" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16" />
    </svg>
);

const CloseIcon = () => (
    <svg className="h-6 w-6" stroke="currentColor" fill="none" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
    </svg>
);

export const Navbar: React.FC = () => {
    const { currentUser, logout } = useAuth();
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

    const activeLinkClass = "bg-brand-interactive/50 text-white";
    const inactiveLinkClass = "text-brand-text-muted hover:bg-brand-surface hover:text-white";
    const linkClasses = `px-3 py-2 rounded-md text-sm font-medium transition-colors`;
    const mobileLinkClasses = `block px-3 py-2 rounded-md text-base font-medium`;

    return (
        <nav className="bg-black/80 backdrop-blur-sm shadow-lg sticky top-0 z-50 border-b border-brand-border/50">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex items-center justify-between h-16">
                    <div className="flex items-center">
                        <Link to="/" className="text-2xl font-bold text-brand-accent">
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
                                {currentUser && (
                                    <>
                                        <NavLink to="/messages" className={({ isActive }) => `${linkClasses} ${isActive ? activeLinkClass : inactiveLinkClass}`}>
                                            Messages
                                        </NavLink>
                                        <NavLink to="/free-agents" className={({ isActive }) => `${linkClasses} ${isActive ? activeLinkClass : inactiveLinkClass}`}>
                                            Free Agents
                                        </NavLink>
                                    </>
                                )}
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
                                        className="text-brand-text-muted hover:text-white mr-4 transition-colors rounded-md px-2 py-1 flex items-center gap-2"
                                        style={({ isActive }) => isActive ? { backgroundColor: 'rgba(74, 222, 128, 0.1)' } : {}}
                                    >
                                        Welcome, <span className="font-semibold text-brand-accent">{currentUser.gamertag}</span>
                                        <RoleBadge role={currentUser.role} />
                                    </NavLink>
                                    <button onClick={logout} className="bg-red-600 hover:bg-red-700 text-white font-bold py-2 px-4 rounded-md transition-colors">
                                        Log Out
                                    </button>
                                </>
                            ) : (
                                <div className="space-x-2">
                                    <Link to="/login" className="bg-brand-interactive hover:bg-green-500 text-black font-bold py-2 px-4 rounded-md transition-colors">
                                        Log In
                                    </Link>
                                    <Link to="/signup" className="bg-brand-surface hover:bg-brand-border text-white font-bold py-2 px-4 rounded-md transition-colors">
                                        Sign Up
                                    </Link>
                                </div>
                            )}
                        </div>
                    </div>
                    <div className="-mr-2 flex md:hidden">
                        <button onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)} className="bg-brand-surface inline-flex items-center justify-center p-2 rounded-md text-gray-400 hover:text-white hover:bg-brand-border focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-black focus:ring-white">
                            <span className="sr-only">Open main menu</span>
                            {isMobileMenuOpen ? <CloseIcon /> : <MenuIcon />}
                        </button>
                    </div>
                </div>
            </div>

            {isMobileMenuOpen && (
                <div className="md:hidden" id="mobile-menu">
                    <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
                        <NavLink to="/" onClick={() => setIsMobileMenuOpen(false)} className={({ isActive }) => `${mobileLinkClasses} ${isActive ? activeLinkClass : inactiveLinkClass}`}>
                            UCL Wall
                        </NavLink>
                        <NavLink to="/quests" onClick={() => setIsMobileMenuOpen(false)} className={({ isActive }) => `${mobileLinkClasses} ${isActive ? activeLinkClass : inactiveLinkClass}`}>
                            Tone's Quests
                        </NavLink>
                        {currentUser && (
                            <>
                                <NavLink to="/messages" onClick={() => setIsMobileMenuOpen(false)} className={({ isActive }) => `${mobileLinkClasses} ${isActive ? activeLinkClass : inactiveLinkClass}`}>
                                    Messages
                                </NavLink>
                                <NavLink to="/free-agents" onClick={() => setIsMobileMenuOpen(false)} className={({ isActive }) => `${mobileLinkClasses} ${isActive ? activeLinkClass : inactiveLinkClass}`}>
                                    Free Agents
                                </NavLink>
                            </>
                        )}
                        {currentUser?.role === 'admin' && (
                            <NavLink to="/admin" onClick={() => setIsMobileMenuOpen(false)} className={({ isActive }) => `${mobileLinkClasses} ${isActive ? activeLinkClass : inactiveLinkClass}`}>
                                Admin Dashboard
                            </NavLink>
                        )}
                    </div>
                    <div className="pt-4 pb-3 border-t border-brand-border">
                        {currentUser ? (
                            <div className="px-5">
                                <div className="flex items-center gap-2">
                                    <span className="text-base font-medium text-white">{currentUser.gamertag}</span>
                                    <RoleBadge role={currentUser.role} />
                                </div>
                                <div className="mt-3 space-y-1">
                                    <NavLink to="/profile" onClick={() => setIsMobileMenuOpen(false)} className={`${mobileLinkClasses} ${inactiveLinkClass}`}>Your Profile</NavLink>
                                    <button onClick={() => { logout(); setIsMobileMenuOpen(false); }} className={`w-full text-left ${mobileLinkClasses} ${inactiveLinkClass}`}>Log Out</button>
                                </div>
                            </div>
                        ) : (
                            <div className="px-5 space-y-2">
                                <Link to="/login" onClick={() => setIsMobileMenuOpen(false)} className="block w-full text-center bg-brand-interactive hover:bg-green-500 text-black font-bold py-2 px-4 rounded-md transition-colors">
                                    Log In
                                </Link>
                                <Link to="/signup" onClick={() => setIsMobileMenuOpen(false)} className="block w-full text-center bg-brand-surface hover:bg-brand-border text-white font-bold py-2 px-4 rounded-md transition-colors">
                                    Sign Up
                                </Link>
                            </div>
                        )}
                    </div>
                </div>
            )}
        </nav>
    );
};