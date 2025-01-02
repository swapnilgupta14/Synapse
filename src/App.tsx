import React, { Suspense, lazy, useEffect } from 'react';
import {
    BrowserRouter as Router,
    Routes,
    Route,
    Navigate,
    useNavigate
} from 'react-router-dom';
import { useAppDispatch, useAppSelector } from './redux/store';
import { verifyOrgToken, verifyToken } from './api/fetch';
import { login, logout } from './redux/reducers/authSlice';
import ErrorBoundary from './components/ErrorBoundary';
import LoadingSpinner from './components/LoadingSpinner';
import { adminRoutes } from './routes/adminRoutes';
import { organisationRoutes } from './routes/organisationRoutes';
import { preloadRoute } from './utils/preload';
import ProtectedRoute from './components/ProtectedRoute';
import { ProjectProvider } from './context/ProjectContext';
import { TeamProvider } from './context/TeamContext';
import { AuthProvider } from './context/AuthContext';
import { Organisation, User } from './types';

const LandingPage = lazy(() => import('./LandingPage'));
const Auth = lazy(() => import('./pages/auth'));
const Dashboard = lazy(() => import('./pages/dashboard'));
const UserDashboard = lazy(() => import('./pages/dashboards/UserDashboard'));

const DashboardRedirect: React.FC = () => {
    const { user } = useAppSelector((state) => state.auth);
    const navigate = useNavigate();

    useEffect(() => {
        if (user) {
            const route = (() => {
                switch (user.role) {
                    case 'Admin':
                        setTimeout(() => preloadRoute('/dashboard/admin'), 100);
                        return '/dashboard/admin/tasks';
                    case 'Organisation':
                        setTimeout(() => preloadRoute('/dashboard/organisation'), 100);
                        return '/dashboard/organisation';
                    default:
                        return '/dashboard/user';
                }
            })();
            navigate(route, { replace: true });
        }
    }, [user, navigate]);

    return null;
};

const App: React.FC = () => {
    const dispatch = useAppDispatch();

    useEffect(() => {
        const initAuth = async () => {
            const storedUser = localStorage.getItem('user');

            const token = localStorage.getItem('token');
            if (token) {
                try {


                    let userOrOrg: User | Organisation;

                    const parsedUser: User | Organisation = storedUser ? JSON.parse(storedUser) : null;

                    if (parsedUser?.role === 'Organisation') {
                        userOrOrg = await verifyOrgToken(token);
                    } else {
                        userOrOrg = await verifyToken(token);
                    }

                    console.log('userOrOrg 63', userOrOrg);

                    if (userOrOrg) {
                        dispatch(login({ user: userOrOrg, token, isOrganisation: userOrOrg.role === 'Organisation' }));
                    } else {
                        dispatch(logout());
                    }

                } catch (error) {
                    console.error('Auth initialization failed:', error);
                    dispatch(logout());
                }
            }
        };

        initAuth();
    }, [dispatch]);

    return (
        <ErrorBoundary>
            <AuthProvider>
                <ProjectProvider>
                    <TeamProvider>
                        <Router>
                            <Suspense fallback={<LoadingSpinner />}>
                                <Routes>
                                    <Route path="/" element={<LandingPage />} />
                                    <Route path="/auth" element={<Auth />} />
                                    <Route
                                        element={
                                            <ProtectedRoute
                                                allowedRoles={["Admin", "Organisation", "Project Manager", "Team Manager", "Team Member"]}
                                            />
                                        }
                                    >
                                        <Route path="/dashboard" element={<Dashboard />}>
                                            <Route index element={<DashboardRedirect />} />
                                            <Route path="admin">
                                                {adminRoutes.children?.map((route) => (
                                                    <Route
                                                        key={route.path}
                                                        path={route.path}
                                                        element={route.element}
                                                    />
                                                ))}
                                            </Route>
                                            <Route path="organisation">
                                                {organisationRoutes.children?.map((route) => (
                                                    <Route
                                                        key={route.path}
                                                        path={route.path}
                                                        element={route.element}
                                                    />
                                                ))}
                                            </Route>
                                            <Route path="user" element={<UserDashboard />} />
                                        </Route>
                                    </Route>
                                    <Route path="*" element={<Navigate to="/" replace />} />
                                </Routes>
                            </Suspense>
                        </Router>
                    </TeamProvider>
                </ProjectProvider>
            </AuthProvider>
        </ErrorBoundary>
    );
};

export default App;
