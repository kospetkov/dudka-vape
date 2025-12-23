import { createContext, useContext, useState, useEffect } from 'react';
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

    useEffect(() => {
        if (token) {
            // Verify token is still valid
            api.get('/auth/profile')
                .then(response => {
                    setUser(response.data);
                    saveUser(response.data);
                })
                .catch(() => {
                    logout();
                });
        }
    }, []);

    const login = async (email, password) => {
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
        }
    };

    const register = async (userData) => {
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
        isAuthenticated: !!token,
        isAdmin: user?.role === 'admin',
        login,
        register,
        logout,
        updateProfile
    };

    return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
