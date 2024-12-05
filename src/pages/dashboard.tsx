import React, { useEffect } from 'react';
import { useAppSelector } from '../redux/store';
import { Outlet, useNavigate, useLocation } from 'react-router-dom';
import Sidebar from '../component/dashboardsComponents/Sidebar';

const Dashboard: React.FC = () => {
    const { user } = useAppSelector((state) => state.auth);
    const navigate = useNavigate();
    const location = useLocation();

    useEffect(() => {
        if (!user) {
            navigate('/', { replace: true });
            return;
        }

        if (location.pathname === '/dashboard') {
            switch (user.role) {
                case 'Admin':
                    navigate('/dashboard/admin/tasks', { replace: true });
                    break;
                case 'Organisation':
                    navigate('/dashboard/organisation', { replace: true });
                    break;
                default:
                    navigate('/dashboard/user', { replace: true });
            }
        }
    }, [user, navigate, location]);

    if (!user) {
        return null;
    }

    return (
        <div className="min-h-screen bg-zinc-200 flex w-full">
            <Sidebar />
            <div className="ml-[4%] flex-1 overflow-x-hidden">
                <Outlet />
            </div>
        </div>
    );
};

export default Dashboard;