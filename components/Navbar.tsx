import React, { useState, useEffect, useRef } from 'react';
import { NavLink, Link } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { RoleBadge } from './RoleBadge';
import { 
    BellIcon, ShimmeringGamertag, HomeIcon, TrophyIcon, UserGroupIcon, 
    UserIcon, MessageIcon, ShieldCheckIcon, SettingsIcon, LogoutIcon 
} from '../constants';

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
    const { currentUser, logout, notifications } = useAuth();
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
    const [isProfileOpen, setIsProfileOpen] = useState(false);
    const profileRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (profileRef.current && !profileRef.current.contains(event.target as Node)) {
                setIsProfileOpen(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, []);

    const activeLinkClass = "bg-brand-interactive/50 text-white";
    const inactiveLinkClass = "text-brand-text-muted hover:bg-brand-surface hover:text-white";
    const linkClasses = `px-3 py-2 rounded-md text-sm font-medium transition-colors flex items-center gap-2`;
    const mobileLinkClasses = `block px-3 py-3 rounded-md text-base font-medium transition-colors flex items-center gap-3`;
    
    const unreadCount = currentUser ? notifications.filter(n => n.userId === currentUser.id && !n.isRead).length : 0;

    const navLinks = [
        { to: "/", label: "UCL Wall", icon: <HomeIcon />, auth: false, admin: false },
        { to: "/quests", label: "Quests", icon: <TrophyIcon />, auth: false, admin: false },
        { to: "/teams", label: "Teams", icon: <UserGroupIcon />, auth: false, admin: false },
        { to: "/free-agents", label: "Free Agents", icon: <UserIcon />, auth: false, admin: false },
        { to: "/messages", label: "Messages", icon: <MessageIcon />, auth: true, admin: false },
        { to: "/admin", label: "Admin", icon: <ShieldCheckIcon />, auth: true, admin: true }
    ];

    const renderNavLinks = (isMobile = false) => {
        return navLinks.filter(link => {
            if (link.admin) return currentUser?.role === 'admin';
            if (link.auth) return !!currentUser;
            return true;
        }).map(link => (
            <NavLink
                key={link.to}
                to={link.to}
                onClick={() => isMobile && setIsMobileMenuOpen(false)}
                className={({ isActive }) => `${isMobile ? mobileLinkClasses : linkClasses} ${isActive ? activeLinkClass : inactiveLinkClass}`}
            >
                {link.icon}
                <span>{link.label}</span>
            </NavLink>
        ));
    };

    return (
        <nav className="bg-black/80 backdrop-blur-sm shadow-lg sticky top-0 z-50 border-b border-brand-border/50">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex items-center justify-between h-16">
                    <div className="flex items-center">
                        <Link to="/" className="text-2xl font-bold text-brand-accent">UCL</Link>
                        <div className="hidden md:block">
                            <div className="ml-10 flex items-baseline space-x-2">
                                {renderNavLinks()}
                            </div>
                        </div>
                    </div>

                    <div className="hidden md:block">
                        <div className="ml-4 flex items-center md:ml-6">
                            {currentUser ? (
                                <>
                                    <NavLink to="/notifications" className="relative text-brand-text-muted hover:text-white p-2 rounded-full hover:bg-brand-surface transition-colors mr-3">
                                        <BellIcon />
                                        {unreadCount > 0 && (
                                            <span className="absolute -top-1 -right-1 block h-5 w-5 rounded-full ring-2 ring-black bg-red-500 text-white text-xs font-bold flex items-center justify-center">
                                                {unreadCount}
                                            </span>
                                        )}
                                    </NavLink>
                                    
                                    <div className="relative" ref={profileRef}>
                                        <button onClick={() => setIsProfileOpen(!isProfileOpen)} className="flex items-center gap-2 p-1 rounded-full hover:bg-brand-surface transition-colors">
                                            <img src={currentUser.profilePicture} alt="Profile" className="w-8 h-8 rounded-full object-cover bg-brand-border" />
                                            <ShimmeringGamertag user={currentUser} baseClassName="font-semibold text-brand-text-muted text-sm" />
                                        </button>

                                        {isProfileOpen && (
                                            <div className="origin-top-right absolute right-0 mt-2 w-56 rounded-md shadow-lg bg-brand-surface ring-1 ring-brand-border/50 focus:outline-none">
                                                <div className="py-1">
                                                    <div className="px-4 py-3 border-b border-brand-border/50">
                                                        <p className="text-sm text-white font-semibold truncate" aria-disabled="true">{currentUser.gamertag}</p>
                                                        <div className="mt-1"><RoleBadge role={currentUser.role} /></div>
                                                    </div>
                                                    <NavLink to="/profile" className="flex items-center gap-3 w-full text-left px-4 py-2 text-sm text-brand-text-muted hover:bg-brand-border hover:text-white" onClick={() => setIsProfileOpen(false)}>
                                                        <UserIcon /> Profile
                                                    </NavLink>
                                                    <NavLink to="/settings" className="flex items-center gap-3 w-full text-left px-4 py-2 text-sm text-brand-text-muted hover:bg-brand-border hover:text-white" onClick={() => setIsProfileOpen(false)}>
                                                        <SettingsIcon /> Settings
                                                    </NavLink>
                                                    <div className="border-t border-brand-border/50 mt-1">
                                                        <button onClick={() => { logout(); setIsProfileOpen(false); }} className="flex items-center gap-3 w-full text-left px-4 py-2 text-sm text-red-400 hover:bg-red-500/20 hover:text-red-300">
                                                            <LogoutIcon /> Log Out
                                                        </button>
                                                    </div>
                                                </div>
                                            </div>
                                        )}
                                    </div>
                                </>
                            ) : (
                                <div className="space-x-2">
                                    <Link to="/login" className="bg-brand-interactive hover:bg-green-500 text-black font-bold py-2 px-4 rounded-md transition-colors">Log In</Link>
                                    <Link to="/signup" className="bg-brand-surface hover:bg-brand-border text-white font-bold py-2 px-4 rounded-md transition-colors">Sign Up</Link>
                                </div>
                            )}
                        </div>
                    </div>

                    <div className="-mr-2 flex md:hidden">
                        <button onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)} className="bg-brand-surface inline-flex items-center justify-center p-2 rounded-md text-gray-400 hover:text-white hover:bg-brand-border focus:outline-none">
                            <span className="sr-only">Open main menu</span>
                            {isMobileMenuOpen ? <CloseIcon /> : <MenuIcon />}
                        </button>
                    </div>
                </div>
            </div>

            <div className={`md:hidden transition-all duration-300 ease-in-out overflow-y-hidden ${isMobileMenuOpen ? 'max-h-[80vh]' : 'max-h-0'}`} id="mobile-menu">
                <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
                   {renderNavLinks(true)}
                </div>
                <div className="pt-4 pb-3 border-t border-brand-border">
                    {currentUser ? (
                         <div className="px-5">
                            <div className="flex items-center justify-between">
                                <div className="flex items-center gap-3">
                                    <img src={currentUser.profilePicture} alt="Profile" className="w-10 h-10 rounded-full object-cover bg-brand-border" />
                                    <div>
                                        <ShimmeringGamertag user={currentUser} baseClassName="text-base font-medium text-white" />
                                        <RoleBadge role={currentUser.role} />
                                    </div>
                                </div>
                                <NavLink to="/notifications" onClick={() => setIsMobileMenuOpen(false)} className="relative text-brand-text-muted hover:text-white p-2 rounded-full hover:bg-brand-surface transition-colors">
                                    <BellIcon />
                                    {unreadCount > 0 && (
                                        <span className="absolute -top-1 -right-1 block h-5 w-5 rounded-full ring-2 ring-black bg-red-500 text-white text-xs font-bold flex items-center justify-center">{unreadCount}</span>
                                    )}
                                </NavLink>
                            </div>
                            <div className="mt-3 space-y-1">
                                <NavLink to="/profile" onClick={() => setIsMobileMenuOpen(false)} className={`${mobileLinkClasses} ${inactiveLinkClass}`}><UserIcon /> Your Profile</NavLink>
                                <NavLink to="/settings" onClick={() => setIsMobileMenuOpen(false)} className={`${mobileLinkClasses} ${inactiveLinkClass}`}><SettingsIcon /> Settings</NavLink>
                                <button onClick={() => { logout(); setIsMobileMenuOpen(false); }} className={`w-full text-left ${mobileLinkClasses} ${inactiveLinkClass} text-red-400`}><LogoutIcon /> Log Out</button>
                            </div>
                        </div>
                    ) : (
                        <div className="px-5 space-y-2">
                            <Link to="/login" onClick={() => setIsMobileMenuOpen(false)} className="block w-full text-center bg-brand-interactive hover:bg-green-500 text-black font-bold py-2 px-4 rounded-md transition-colors">Log In</Link>
                            <Link to="/signup" onClick={() => setIsMobileMenuOpen(false)} className="block w-full text-center bg-brand-surface hover:bg-brand-border text-white font-bold py-2 px-4 rounded-md transition-colors">Sign Up</Link>
                        </div>
                    )}
                </div>
            </div>
        </nav>
    );
};
