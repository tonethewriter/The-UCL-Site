import React from 'react';
import { HashRouter, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import { Navbar } from './components/Navbar';
import { HomePage } from './pages/HomePage';
import { LoginPage } from './pages/LoginPage';
import { SignUpPage } from './pages/SignUpPage';
import { AdminDashboardPage } from './pages/AdminDashboardPage';
import { ProtectedRoute } from './components/ProtectedRoute';
import { ProfilePage } from './pages/ProfilePage';
import { AuthenticatedRoute } from './components/AuthenticatedRoute';
import { UserProfilePage } from './pages/UserProfilePage';
import { TonesQuestsPage } from './pages/TonesQuestsPage';
import { MessagesPage } from './pages/MessagesPage';
import { FreeAgentsPage } from './pages/FreeAgentsPage';
import { NotificationsPage } from './pages/NotificationsPage';
import { SettingsPage } from './pages/SettingsPage';
import { FeedbackButton } from './components/FeedbackButton';
import { TeamsListPage } from './pages/TeamsListPage';
import { TeamPage } from './pages/TeamPage';

const App: React.FC = () => {
    return (
        <AuthProvider>
            <HashRouter>
                <Navbar />
                <main className="min-h-screen">
                    <Routes>
                        <Route path="/" element={<HomePage />} />
                        <Route path="/login" element={<LoginPage />} />
                        <Route path="/signup" element={<SignUpPage />} />
                        <Route path="/quests" element={<TonesQuestsPage />} />
                        <Route path="/users/:userId" element={<UserProfilePage />} />
                        <Route path="/teams" element={<TeamsListPage />} />
                        <Route path="/teams/:teamId" element={<TeamPage />} />
                         <Route
                            path="/messages"
                            element={
                                <AuthenticatedRoute>
                                    <MessagesPage />
                                </AuthenticatedRoute>
                            }
                        />
                         <Route
                            path="/free-agents"
                            element={
                                <AuthenticatedRoute>
                                    <FreeAgentsPage />
                                </AuthenticatedRoute>
                            }
                        />
                        <Route
                            path="/notifications"
                            element={
                                <AuthenticatedRoute>
                                    <NotificationsPage />
                                </AuthenticatedRoute>
                            }
                        />
                        <Route
                            path="/profile"
                            element={
                                <AuthenticatedRoute>
                                    <ProfilePage />
                                </AuthenticatedRoute>
                            }
                        />
                         <Route
                            path="/settings"
                            element={
                                <AuthenticatedRoute>
                                    <SettingsPage />
                                </AuthenticatedRoute>
                            }
                        />
                        <Route
                            path="/admin"
                            element={
                                <ProtectedRoute>
                                    <AdminDashboardPage />
                                </ProtectedRoute>
                            }
                        />
                    </Routes>
                </main>
                <FeedbackButton />
            </HashRouter>
        </AuthProvider>
    );
};

export default App;