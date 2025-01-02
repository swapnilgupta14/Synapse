import { Navigate, Outlet } from 'react-router-dom';
import { useAppSelector } from '../redux/store';

interface ProtectedRouteProps {
    allowedRoles: string[];
}

const ProtectedRoute = ({ allowedRoles }: ProtectedRouteProps) => {
    const { user } = useAppSelector((state) => state.auth);

    if (!user) {
        return <Navigate to="/auth" replace />;
    }

    if (!allowedRoles.includes(user.role)) {
        return <Navigate to="/dashboard" replace />;
    }

    return <Outlet />;
};

export default ProtectedRoute; 