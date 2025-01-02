import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAppDispatch } from '../redux/store';
import { login } from '../redux/reducers/authSlice';
import { AuthUI } from './authUI';
import { 
    createUser, 
    createOrganisation, 
    getUserByCredentials, 
    getOrgByCredentials,
    verifyToken,
    verifyOrgToken 
} from '../api/fetch';

const Auth: React.FC = () => {
    const [isSignup, setIsSignup] = useState(false);
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [email, setEmail] = useState('');
    const [isOrganisation, setIsOrganisation] = useState(false);

    const dispatch = useAppDispatch();
    const navigate = useNavigate();
    const location = useLocation();

    useEffect(() => {
        const checkAuth = async () => {
            const token = localStorage.getItem('token');
            const storedIsOrg = localStorage.getItem('isOrganisation') === 'true';
            
            if (token) {
                try {
                    const user = storedIsOrg
                        ? await verifyOrgToken(token)
                        : await verifyToken(token);
                    
                    if (user) {
                        dispatch(login({ 
                            user, 
                            token,
                            isOrganisation: storedIsOrg
                        }));
                        navigate('/dashboard');
                    }
                } catch (error) {
                    console.error('Token verification failed:', error);
                    localStorage.removeItem('token');
                    localStorage.removeItem('isOrganisation');
                }
            }
        };

        checkAuth();
    }, [dispatch, navigate]);

    useEffect(() => {
        const queryParams = new URLSearchParams(location.search);
        const mode = queryParams.get('mode');
        const role = queryParams.get('role');
        setIsOrganisation(role === 'organisation');
        setIsSignup(mode === 'signup');
    }, [location.search]);

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!username || !password) {
            alert('Please enter username and password');
            return;
        }

        try {
            const userOrOrg = isOrganisation
                ? await getOrgByCredentials(username, password)
                : await getUserByCredentials(username, password);

            if (!userOrOrg) {
                alert('Invalid credentials');
                return;
            }

            const isOrg = isOrganisation || userOrOrg.role === 'Organisation';
            
            dispatch(login({
                user: userOrOrg,
                token: userOrOrg.token,
                isOrganisation: isOrg
            }));

            localStorage.setItem('user', JSON.stringify(userOrOrg));
            localStorage.setItem('token', userOrOrg.token);
            localStorage.setItem('isOrganisation', String(isOrg));

            navigate('/dashboard');
        } catch (error) {
            console.error('Login error:', error);
            alert('An error occurred during login');
        }
    };

    const handleSignup = async (e: React.FormEvent) => {
        e.preventDefault();

        if (password.length < 6) {
            alert('Password must be at least 6 characters long');
            return;
        }

        try {
            const token = `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;

            if (isOrganisation) {
                const organisationId = Date.now();
                const newOrg = {
                    organisationId,
                    ownerId: organisationId,
                    username,
                    email,
                    role: 'Organisation' as const,
                    token,
                    createdAt: new Date().toISOString(),
                    password,
                };
                await createOrganisation(newOrg);
            } else {
                const newUser = {
                    id: Date.now(),
                    username,
                    email,
                    password,
                    role: 'Team Member' as const,
                    token,
                    createdAt: new Date().toISOString(),
                };
                await createUser(newUser);
            }

            alert('Signup successful! Please login to continue.');
            setIsSignup(false);
        } catch (error) {
            console.error('Signup error:', error);
            alert('An error occurred during signup');
        }
    };

    return (
        <AuthUI
            isSignup={isSignup}
            username={username}
            password={password}
            email={email}
            setUsername={setUsername}
            setPassword={setPassword}
            setEmail={setEmail}
            setIsSignup={setIsSignup}
            onLogin={handleLogin}
            onSignup={handleSignup}
            isOrganisation={isOrganisation}
        />
    );
};

export default Auth;