
import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';

interface ProtectedRouteProps {
    children: React.ReactElement;
}

export const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children }) => {
    const { currentUser } = useAuth();

    if (!currentUser || currentUser.role !== 'admin') {
        return <Navigate to="/login" replace />;
    }

    return children;
};
