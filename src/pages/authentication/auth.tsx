import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAppDispatch } from '../../redux/store';
import { setCredentials } from '../../redux/reducers/authSlice';
import { AuthUI } from '../authentication/authUI';
import {
    createUser,
    createOrganisation,
    getUserByCredentials,
    getOrgByCredentials
} from '../../api/fetch';
import toast from 'react-hot-toast';

const Auth: React.FC = () => {
    const [isSignup, setIsSignup] = useState(false);
    const [formData, setFormData] = useState({
        username: '',
        password: '',
        email: '',
    });
    const [isOrganisation, setIsOrganisation] = useState(false);

    const dispatch = useAppDispatch();
    const navigate = useNavigate();
    const location = useLocation();

    useEffect(() => {
        const params = new URLSearchParams(location.search);
        setIsSignup(params.get('mode') === 'signup');
        setIsOrganisation(params.get('role') === 'organisation');
    }, [location]);

    const handleAuth = async (e: React.FormEvent) => {
        e.preventDefault();

        try {
            if (isSignup) {
                const token = `${Date.now()}-${Math.random().toString(36).substring(2)}`;
                const newUserData = {
                    id: Date.now(),
                    username: formData.username,
                    email: formData.email,
                    password: formData.password,
                    role: isOrganisation ? 'Organisation' as const : 'Team Member' as const,
                    token,
                    createdAt: new Date().toISOString(),
                };

                if (isOrganisation) {
                    const orgData = {
                        ...newUserData,
                        organisationId: Date.now(),
                        ownerId: newUserData.id,
                    };
                    await createOrganisation(orgData);
                    toast.success('Organisation created successfully! Please login.');
                } else {
                    await createUser(newUserData);
                    toast.success('Signup successful! Please login.');
                }

                setIsSignup(false);
                return;
            }

            const user = isOrganisation
                ? await getOrgByCredentials(formData.username, formData.password)
                : await getUserByCredentials(formData.username, formData.password);

            if (!user) {
                toast.error('No account found with the provided credentials');
            }

            const { password, ...userWithoutPassword } = user;

            dispatch(setCredentials({ user: userWithoutPassword, token: user.token }));
            localStorage.setItem('token', user.token);

            navigate('/dashboard');
            toast.success('Login successful');

        } catch (error) {
            console.log(error instanceof Error ? error.message : 'Authentication failed');
        }
    };

    return (
        <AuthUI
            isSignup={isSignup}
            formData={formData}
            setFormData={setFormData}
            onSubmit={handleAuth}
            isOrganisation={isOrganisation}
            setIsSignup={setIsSignup}
        />
    );
};

export default Auth;