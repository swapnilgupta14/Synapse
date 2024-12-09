import React, { useEffect } from 'react';
import {
    BrowserRouter as Router,
    Routes,
    Route,
    Navigate,
    useNavigate
} from 'react-router-dom';
import { Provider } from 'react-redux';
import { store, useAppSelector } from './redux/store';

import Dashboard from './pages/dashboard';
import Auth from './pages/auth';
import LandingPage from './LandingPage';
import ProtectedRoute from './ProtectedRoute';

import AdminDashboard from './pages/dashboards/AdminDashboard';
import AllTasks from './pages/dashboards/AdminDashboard/allTasks';
import AllProjects from './pages/dashboards/AdminDashboard/allProjects';
import AllUsers from './pages/dashboards/AdminDashboard/allUsers';
import Analytics from './pages/dashboards/AdminDashboard/analytics';
import AllTeams from './pages/dashboards/AdminDashboard/allTeams';

import UserDashboard from './pages/dashboards/UserDashboard';
import OrganisationDashboard from './pages/dashboards/OrganisationDashboard';

import { User } from './types';
import OrganizationHierarchyPage from "./pages/dashboards/OrganisationDashboard/Hierarchy";
import CreateProject from './pages/dashboards/OrganisationDashboard/CreateProject';

const DashboardRedirect: React.FC = () => {
    const { user } = useAppSelector((state) => state.auth);
    const navigate = useNavigate();

    useEffect(() => {
        if (user) {
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
    }, [user, navigate]);

    return null;
};

const App: React.FC = () => {
    useEffect(() => {
        const adminExists = JSON.parse(localStorage.getItem('SignedUpUsers') || '[]').find(
            (user: User) => user.username === 'admin'
        );
        if (!adminExists) {
            const adminUser: User = {
                id: 1,
                username: 'admin',
                password: 'admin12',
                role: 'Admin',
                email: 'admin@gmail.com',
                token: '',
                createdAt: new Date().toISOString(),
            };

            const existingUsers = JSON.parse(localStorage.getItem('SignedUpUsers') || '[]');
            localStorage.setItem(
                'SignedUpUsers',
                JSON.stringify([...existingUsers, adminUser])
            );
        }
    }, []);

    const allowedRoles = ["Admin", "Organisation", "Project Manager", "Team Manager", "Team Member"];

    return (
        <Provider store={store}>
            <Router>
                <Routes>
                    <Route path="/" element={<LandingPage />} />
                    <Route path="/auth" element={<Auth />} />
                    <Route element={<ProtectedRoute allowedRoles={allowedRoles} />}>
                        <Route path="/dashboard" element={<Dashboard />}>
                            <Route index element={<DashboardRedirect />} />

                            <Route path="admin" element={<AdminDashboard />}>
                                <Route path="tasks" element={<AllTasks />} />
                                <Route path="projects" element={<AllProjects />} />
                                <Route path="users" element={<AllUsers />} />
                                <Route path="analytics" element={<Analytics />} />
                                <Route path="teams" element={<AllTeams />} />
                            </Route>

                            <Route path="organisation" element={<OrganisationDashboard />}>
                                <Route path="createProject" element={<CreateProject />} />
                                <Route path="hierarchy" element={<OrganizationHierarchyPage />} />
                            </Route>

                            <Route path="user" element={<UserDashboard />} />
                        </Route>
                    </Route>
                    <Route path="*" element={<Navigate to="/" replace />} />
                </Routes>
            </Router>
        </Provider>
    );
};

export default App;
