import { createContext, useContext, useState, useEffect } from 'react';
import { useToast } from './ToastContext';
import { DEMO_USERS } from '../utils/demoData';

const AuthContext = createContext(null);

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error('useAuth must be used within AuthProvider');
    }
    return context;
};

export const AuthProvider = ({ children }) => {
    const { showSuccess, showError, showInfo } = useToast();
    const [currentUser, setCurrentUser] = useState(null);
    const [isLoading, setIsLoading] = useState(true);

    // Load session from localStorage on mount
    useEffect(() => {
        const savedSession = localStorage.getItem('hvac_auth_session');
        if (savedSession) {
            try {
                const session = JSON.parse(savedSession);
                setCurrentUser(session.user);
            } catch (error) {
                console.error('Failed to restore session:', error);
                localStorage.removeItem('hvac_auth_session');
            }
        }
        setIsLoading(false);
    }, []);

    // Save session to localStorage whenever currentUser changes
    useEffect(() => {
        if (currentUser) {
            localStorage.setItem('hvac_auth_session', JSON.stringify({
                user: currentUser,
                timestamp: Date.now(),
            }));
        } else {
            localStorage.removeItem('hvac_auth_session');
        }
    }, [currentUser]);

    const login = (email, password) => {
        // Get users from localStorage, fallback to demo users
        const storedUsers = JSON.parse(localStorage.getItem('hvac_users') || '[]');
        const users = storedUsers.length > 0 ? storedUsers : DEMO_USERS;

        // Find user by email
        const user = users.find(u => u.email === email && u.password === password);

        if (user) {
            // Save to localStorage if not already there
            if (storedUsers.length === 0) {
                localStorage.setItem('hvac_users', JSON.stringify(DEMO_USERS));
            }

            // Remove password from session
            const { password: _, ...userWithoutPassword } = user;
            setCurrentUser(userWithoutPassword);
            showSuccess(`Bem-vindo, ${user.name}!`);
            return { success: true };
        }

        showError('Email ou password incorretos');
        return { success: false, error: 'Email ou password incorretos' };
    };

    const register = (userData) => {
        // Get existing users
        const users = JSON.parse(localStorage.getItem('hvac_users') || '[]');

        // Check if email already exists
        if (users.some(u => u.email === userData.email)) {
            return { success: false, error: 'Email já registado' };
        }

        // Create new user
        const newUser = {
            id: `user-${Date.now()}`,
            ...userData,
            createdAt: Date.now(),
        };

        // Save to localStorage
        users.push(newUser);
        localStorage.setItem('hvac_users', JSON.stringify(users));

        // Auto login
        const { password: _, ...userWithoutPassword } = newUser;
        setCurrentUser(userWithoutPassword);

        showSuccess('Conta criada com sucesso!');
        return { success: true };
    };

    const logout = () => {
        setCurrentUser(null);
        showInfo('Sessão terminada');
    };

    const updateProfile = (updates) => {
        if (!currentUser) return { success: false, error: 'Não autenticado' };

        // Get users from localStorage
        const users = JSON.parse(localStorage.getItem('hvac_users') || '[]');

        // Find and update user
        const userIndex = users.findIndex(u => u.id === currentUser.id);
        if (userIndex === -1) return { success: false, error: 'Utilizador não encontrado' };

        users[userIndex] = { ...users[userIndex], ...updates };
        localStorage.setItem('hvac_users', JSON.stringify(users));

        // Update current user (without password)
        const { password: _, ...userWithoutPassword } = users[userIndex];
        setCurrentUser(userWithoutPassword);

        showSuccess('Perfil atualizado com sucesso!');
        return { success: true };
    };

    const isAuthenticated = () => {
        return currentUser !== null;
    };

    const value = {
        currentUser,
        isLoading,
        login,
        register,
        logout,
        updateProfile,
        isAuthenticated,
    };

    return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export default AuthContext;
