import React, { Suspense, lazy, useEffect } from 'react';
import {
    BrowserRouter as Router,
    Routes,
    Route,
    Navigate,
    useNavigate
} from 'react-router-dom';
import { useAppDispatch, useAppSelector } from './redux/store';
import { setCredentials, finishInitialLoad } from './redux/reducers/authSlice';
import ErrorBoundary from './components/ErrorBoundary';
import LoadingSpinner from './components/LoadingSpinner';
import { adminRoutes } from './routes/adminRoutes';
import { organisationRoutes } from './routes/organisationRoutes';
import { preloadRoute } from './utils/preload';
import ProtectedRoute from './components/ProtectedRoute';
import { ProjectProvider } from './context/ProjectContext';
import { TeamProvider } from './context/TeamContext';
import { AuthProvider } from './context/AuthContext';
import { verifyToken, verifyOrgToken } from './api/fetch';

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

    return <LoadingSpinner />;
};

const App: React.FC = () => {
    const dispatch = useAppDispatch();
    const { isAuthenticated, isLoading } = useAppSelector((state) => state.auth);

    useEffect(() => {
        const initAuth = async () => {
            const token = localStorage.getItem('token');

            if (token && !isAuthenticated) {
                try {
                    let user = await verifyToken(token);

                    if (!user) {
                        user = await verifyOrgToken(token);
                    }

                    if (user) {
                        const { password, ...userWithoutPassword } = user;
                        dispatch(setCredentials({ user: userWithoutPassword, token }));
                    } else {
                        localStorage.removeItem('token');
                        dispatch(finishInitialLoad());
                    }
                } catch (error) {
                    console.error('Auth initialization failed:', error);
                    localStorage.removeItem('token');
                    dispatch(finishInitialLoad());
                }
            } else {
                dispatch(finishInitialLoad());
            }
        };

        initAuth();
    }, [dispatch, isAuthenticated]);

    if (isLoading) {
        return <LoadingSpinner />;
    }

    return (
        <ErrorBoundary>
            <AuthProvider>
                <ProjectProvider>
                    <TeamProvider>
                        <Router>
                            <Suspense fallback={<LoadingSpinner />}>
                                <Routes>
                                    <Route path="/" element={<LandingPage />} />
                                    <Route path="/auth" element={
                                        isAuthenticated ? <Navigate to="/dashboard" replace /> : <Auth />
                                    } />
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
