import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAppDispatch } from '../redux/store';
import { login } from '../redux/authSlice';
import { Organisation, User } from '../types';
import { AuthUI } from './authUI';
import { generateToken } from '../utils/generateToken';

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
        const storedToken = localStorage.getItem('token');
        const storedUser = localStorage.getItem('userCurrent');

        if (storedToken && storedUser) {
            const parsedUser = JSON.parse(storedUser);
            dispatch(login({
                user: parsedUser,
                token: storedToken
            }));
            navigate('/dashboard');
        }
    }, [dispatch, navigate]);

    useEffect(() => {
        const queryParams = new URLSearchParams(location.search);
        const mode = queryParams.get('mode');
        const role = queryParams.get("role");
        setIsOrganisation(role === "organisation");
        setIsSignup(mode === 'signup');
    }, [location.search]);


    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!username || !password) {
            alert('Please enter username and password');
            return;
        }

        try {
            const users = JSON.parse(localStorage.getItem('SignedUpUsers') || '[]');
            const orgs = JSON.parse(localStorage.getItem('SignedUpOrgs') || '[]');

            let userOrOrg: User | Organisation | null = null;
            let isOrgLogin = false;

            if (!isOrganisation) {
                userOrOrg = users.find(
                    (u: User) => u.username === username && u.password === password
                );
            } else {
                userOrOrg = orgs.find(
                    (o: Organisation) => o.username === username && o.password === password
                );
                isOrgLogin = true;
            }

            if (!userOrOrg) {
                alert('Invalid credentials');
                return;
            }

            const newToken = await generateToken(
                isOrgLogin ? (userOrOrg as Organisation).organisationId : (userOrOrg as User).id,
                username
            );

            if (isOrgLogin) {
                const updatedOrgs = orgs.map((o: Organisation) =>
                    o.username === username ? { ...o, token: newToken } : o
                );
                localStorage.setItem('SignedUpOrgs', JSON.stringify(updatedOrgs));
            } else {
                const updatedUsers = users.map((u: User) =>
                    u.username === username ? { ...u, token: newToken } : u
                );
                localStorage.setItem('SignedUpUsers', JSON.stringify(updatedUsers));
            }

            const userForState: Omit<User, "email"> = {
                id: isOrgLogin
                    ? (userOrOrg as Organisation).organisationId
                    : (userOrOrg as User).id,
                username: username,
                // email: isOrgLogin
                //     ? (userOrOrg as Organisation).email
                //     : (userOrOrg as User).email,
                role: isOrgLogin ? 'Organisation' : (userOrOrg as User).role,
                token: newToken,
                createdAt: isOrgLogin
                    ? (userOrOrg as Organisation).createdAt
                    : (userOrOrg as User).createdAt
            };

            dispatch(
                login({
                    user: userForState,
                    token: newToken,
                })
            );

            navigate('/dashboard');
        } catch (error) {
            console.error('Login error:', error);
            alert('An error occurred during login');
        }
    };

    const handleSignup = async (e: React.FormEvent) => {
        e.preventDefault();

        try {
            if (password.length < 6) {
                alert('Password must be at least 6 characters long');
                return;
            }

            const existingUsers = JSON.parse(localStorage.getItem('SignedUpUsers') || '[]');
            const userExists = existingUsers.find(
                (u: User) => u.username === username || u.email === email
            );

            const existingOrgs = JSON.parse(localStorage.getItem('SignedUpOrgs') || '[]');
            const orgExists = existingOrgs.find(
                (o: Organisation) => o.username === username || o.email === email
            );

            if (orgExists) {
                alert('Organisation name or E-mail already exists!');
                return;
            }

            if (userExists) {
                alert('Username or email already exists!');
                return;
            }

            const userId = Date.now();
            const hashedPassword = password;
            console.log("Signup --- token made using: ", userId, username);
            const token = await generateToken(userId, username);
            console.log("Signup, token generated is: ", token);

            const newOrg: Organisation = {
                id: userId,
                organisationId: userId,
                ownerId: userId,
                username,
                email,
                role: 'Organisation',
                token,
                createdAt: new Date().toISOString(),
                password: hashedPassword,
            }

            const newUser: User = {
                id: userId,
                username,
                email,
                password: hashedPassword,
                role: 'Team Member',
                token,
                createdAt: new Date().toISOString(),
            };

            if (isOrganisation) {
                localStorage.setItem(
                    'SignedUpOrgs',
                    JSON.stringify([...existingOrgs, newOrg])
                );
            } else {
                localStorage.setItem(
                    'SignedUpUsers',
                    JSON.stringify([...existingUsers, newUser])
                );
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
