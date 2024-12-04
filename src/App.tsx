import React, { useEffect } from 'react';
import {
    BrowserRouter as Router,
    Routes,
    Route,
    Navigate,
} from 'react-router-dom';
import { Provider } from 'react-redux';
import { store } from './redux/store';

import Dashboard from './pages/dashboard';
import Auth from './pages/auth';
import LandingPage from './LandingPage';
import ProtectedRoute from './ProtectedRoute';

import { User } from './types';
// import { useDispatch } from 'react-redux';


const App: React.FC = () => {
    // const dispatch = useDispatch();

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

    return (
        <Provider store={store}>
            <Router>
                <Routes>
                    <Route path="/" element={<LandingPage />} />
                    <Route path="/auth" element={<Auth />} />
                    <Route element={<ProtectedRoute allowedRoles={["Admin"
                        , "Organisation"
                        , "Project Manager"
                        , "Team Manager"
                        , "Team Member"]} />}>
                        <Route path="/dashboard" element={<Dashboard />} />
                    </Route>
                    <Route path="*" element={<Navigate to="/" replace />} />
                </Routes>
            </Router>

        </Provider >
    );
};

export default App;