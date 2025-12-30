import { createContext, useContext, useState, useEffect, useRef } from 'react';
import api from '../utils/api';
import { getToken, saveToken, getUser, saveUser, clearAuth } from '../utils/localStorage';

const AuthContext = createContext();

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error('useAuth must be used within AuthProvider');
    }
    return context;
};

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(getUser());
    const [token, setToken] = useState(getToken());
    const [loading, setLoading] = useState(false);
    const [initializing, setInitializing] = useState(true);
    const isLoggingIn = useRef(false);

    useEffect(() => {
        const verifyToken = async () => {
            if (token && !isLoggingIn.current) {
                try {
                    const response = await api.get('/auth/profile');
                    setUser(response.data);
                    saveUser(response.data);
                } catch (error) {
                    // Токен невалидный — очищаем только если не в процессе логина
                    if (!isLoggingIn.current) {
                        logout();
                    }
                }
            }
            setInitializing(false);
        };

        verifyToken();
    }, []);

    const login = async (email, password) => {
        isLoggingIn.current = true;
        setLoading(true);
        try {
            const response = await api.post('/auth/login', { email, password });
            const { token: newToken, ...userData } = response.data;

            setToken(newToken);
            setUser(userData);
            saveToken(newToken);
            saveUser(userData);

            return { success: true };
        } catch (error) {
            return {
                success: false,
                error: error.response?.data?.message || 'Login failed'
            };
        } finally {
            setLoading(false);
            isLoggingIn.current = false;
        }
    };

    const register = async (userData) => {
        isLoggingIn.current = true;
        setLoading(true);
        try {
            const response = await api.post('/auth/register', userData);
            const { token: newToken, ...user } = response.data;

            setToken(newToken);
            setUser(user);
            saveToken(newToken);
            saveUser(user);

            return { success: true };
        } catch (error) {
            return {
                success: false,
                error: error.response?.data?.message || 'Registration failed'
            };
        } finally {
            setLoading(false);
            isLoggingIn.current = false;
        }
    };

    const logout = () => {
        setToken(null);
        setUser(null);
        clearAuth();
    };

    const updateProfile = async (profileData) => {
        setLoading(true);
        try {
            const response = await api.put('/auth/profile', profileData);
            const { token: newToken, ...userData } = response.data;

            setUser(userData);
            saveUser(userData);
            if (newToken) {
                setToken(newToken);
                saveToken(newToken);
            }

            return { success: true };
        } catch (error) {
            return {
                success: false,
                error: error.response?.data?.message || 'Update failed'
            };
        } finally {
            setLoading(false);
        }
    };

    const value = {
        user,
        token,
        loading,
        initializing,
        isAuthenticated: !!token,
        isAdmin: user?.role === 'admin',
        login,
        register,
        logout,
        updateProfile
    };

    return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
