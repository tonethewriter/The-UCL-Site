
import React from 'react';
import { HashRouter, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import { Navbar } from './components/Navbar';
import { HomePage } from './pages/HomePage';
import { LoginPage } from './pages/LoginPage';
import { SignUpPage } from './pages/SignUpPage';
import { AdminDashboardPage } from './pages/AdminDashboardPage';
import { ProtectedRoute } from './components/ProtectedRoute';

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
            </HashRouter>
        </AuthProvider>
    );
};

export default App;
