import { useNavigate, useLocation } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import React from 'react';
import {
    User as UserIcon,
    Users,
    Building2,
    Activity,
    List,
    ComputerIcon,
    LogOut,
    Trees,
} from 'lucide-react';
import { logout } from '../../redux/reducers/authSlice';
import { useAppSelector } from '../../redux/store';

const Sidebar = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const dispatch = useDispatch();

    const { user } = useAppSelector((state) => state.auth);
    if (user === null) return null;

    const getMenuItemsForRole = () => {
        switch (user.role) {
            case 'Admin':
                return [
                    { name: 'All Tasks', icon: <List />, path: '/dashboard/admin/tasks' },
                    { name: 'Analytics', icon: <Activity />, path: '/dashboard/admin/analytics' },
                    { name: 'All Users', icon: <UserIcon />, path: '/dashboard/admin/users' },
                    { name: 'All Teams', icon: <Users />, path: '/dashboard/admin/teams' },
                    { name: 'All Projects', icon: <ComputerIcon />, path: '/dashboard/admin/projects' },
                ];
            case 'Organisation':
                return [
                    { name: 'Organisation Dashboard', icon: <Building2 />, path: '/dashboard/organisation/createProject' },
                    { name: 'Hierarchy', icon: <Trees />, path: '/dashboard/organisation/hierarchy' },
                ];
            case 'Project Manager':
            case 'Team Manager':
            case 'Team Member':
                return [
                    { name: 'Team Dashboard', icon: <Users />, path: '/dashboard/user' },
                ];
            default:
                return [];
        }
    };

    const menuItems = getMenuItemsForRole().map(item => ({
        ...item,
        onClick: () => {
            if (item.path !== location.pathname) navigate(item.path);
        },
    }));

    return (
        <div className="w-[4%] h-[100vh] bg-white fixed left-0 top-0 flex flex-col items-center py-4">
            <div className="mb-8">
                <h1 className="text-lg bg-black text-white font-extrabold rounded-lg p-2 py-1">TY</h1>
            </div>

            <div className="flex-1 flex flex-col w-full justify-start">
                {menuItems.map((item, index) => (
                    <div key={index} className="relative group">
                        <button
                            className={`flex flex-col items-center py-3 w-full ${location.pathname === item.path
                                    ? 'bg-zinc-100 text-blue-600'
                                    : 'text-zinc-600 hover:bg-zinc-100 hover:text-black'
                                } transition duration-200`}
                            onClick={item.onClick}
                        >
                            <div className={`mb-2 ${location.pathname === item.path ? "bg-blue-100" : "bg-zinc-200" } p-2 rounded-full`}>
                                {React.cloneElement(item.icon, {
                                    className: location.pathname === item.path ? 'text-blue-600' : ''
                                })}
                            </div>
                        </button>
                        <div className="absolute left-full ml-2 p-2 bg-gray-300 text-black text-sm rounded opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 whitespace-nowrap">
                            {item.name}
                        </div>
                    </div>
                ))}
            </div>

            <div className="mt-auto w-full flex justify-center">
                <div className="relative group">
                    <div className="w-8 h-8 bg-red-600 rounded-md flex items-center justify-center hover:bg-red-200 transition duration-200">
                        <button
                            className="flex items-center justify-center text-white hover:text-red-600 w-full h-full"
                            onClick={() => dispatch(logout())}
                        >
                            <LogOut className="w-4 h-4" />
                        </button>
                    </div>
                    {/* Logout Tooltip */}
                    <div className="absolute left-full ml-2 px-2 py-1 bg-gray-800 text-white text-sm rounded opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 whitespace-nowrap">
                        Logout
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Sidebar;