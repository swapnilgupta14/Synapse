import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { useAppSelector } from './redux/store';

interface ProtectedRouteProps {
    allowedRoles: string[];
    children?: React.ReactNode;
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ allowedRoles }) => {
    const { isAuthenticated, user } = useAppSelector(state => state.auth);

    if (!isAuthenticated) {
        return <Navigate to="/auth" replace />;
    }

    if (user && !allowedRoles.includes(user.role)) {
        return <Navigate to="/unauthorized" replace />;
    }

    return <Outlet />;
};

export default ProtectedRoute;
