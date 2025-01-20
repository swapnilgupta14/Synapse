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
import { useMutation, useQuery } from 'react-query';

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

    const { refetch: refetchUser } = useQuery(
        ['user', formData.username, formData.password],
        () =>
            isOrganisation
                ? getOrgByCredentials(formData.username, formData.password)
                : getUserByCredentials(formData.username, formData.password),
        {
            enabled: false,
            onSuccess: (data) => {
                if (!data) {
                    toast.error('No account found with the provided credentials');
                    return;
                }

                const { password, ...userWithoutPassword } = data;
                dispatch(setCredentials({ user: userWithoutPassword, token: data.token }));
                localStorage.setItem('token', data.token);

                navigate('/dashboard');
                toast.success('Login successful');
            },
            onError: () => {
                toast.error('Authentication failed. Please check your credentials.');
            },
        }
    );

    const createOrganisationMutation = useMutation(createOrganisation, {
        onSuccess: () => {
            toast.success('Organisation created successfully! Please login.');
        },
        onError: (error: any) => {
            toast.error(error.message || 'Failed to create organisation');
        },
    });

    const createUserMutation = useMutation(createUser, {
        onSuccess: () => {
            toast.success('Signup successful! Please login.');
        },
        onError: (error: any) => {
            toast.error(error.message || 'Failed to create user');
        },
    });

    const handleAuth = (e: React.FormEvent) => {
        e.preventDefault();

        const token = `${Date.now()}-${Math.random().toString(36).substring(2)}`;

        if (isSignup) {
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
                createOrganisationMutation.mutate(orgData);
            } else {
                createUserMutation.mutate(newUserData);
            }

            setIsSignup(false);
        } else {
            refetchUser();
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
