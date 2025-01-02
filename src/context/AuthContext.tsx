import React, { createContext, useContext } from 'react';
import { useAppSelector } from '../redux/store';

interface AuthContextType {
    user: any;
    isAuthenticated: boolean;
    isOrganisation: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const { user, isAuthenticated, isOrganisation } = useAppSelector((state) => state.auth);
    
    // useEffect(() => {
    //     console.log('Auth state changed:', {
    //         isAuthenticated,
    //         isOrganisation,
    //         hasUser: !!user
    //     });
    // }, [user, isAuthenticated, isOrganisation]);

    const value = {
        user,
        isAuthenticated,
        isOrganisation,
    };

    return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (context === undefined) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
};