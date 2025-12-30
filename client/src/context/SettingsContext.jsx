import { createContext, useContext, useState, useEffect } from 'react';
import api from '../utils/api';

const SettingsContext = createContext();

export const useSettings = () => {
    const context = useContext(SettingsContext);
    if (!context) {
        throw new Error('useSettings must be used within SettingsProvider');
    }
    return context;
};

export const SettingsProvider = ({ children }) => {
    const [settings, setSettings] = useState({
        storeName: 'DUDKA',
        storeDescription: 'Преміум вейп продукція',
        logoUrl: '/logo.png',
        contactEmails: [],
        contactPhones: [],
        workingHours: {},
        heroTitle: '',
        heroSubtitle: '',
        heroEnabled: true,
        heroSliderEnabled: false,
        heroSlider: []
    });
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchSettings = async () => {
            try {
                const response = await api.get('/settings');
                setSettings(response.data);
                setError(null);
            } catch (err) {
                console.error('Failed to fetch settings:', err);
                setError('Не вдалося завантажити налаштування');
            } finally {
                setLoading(false);
            }
        };

        fetchSettings();
    }, []);

    const updateSettings = async (newSettings) => {
        try {
            const response = await api.put('/settings', newSettings);
            setSettings(response.data);
            return { success: true };
        } catch (err) {
            console.error('Failed to update settings:', err);
            return { success: false, error: err.message };
        }
    };

    const refreshSettings = async () => {
        try {
            const response = await api.get('/settings');
            setSettings(response.data);
        } catch (err) {
            console.error('Failed to refresh settings:', err);
        }
    };

    return (
        <SettingsContext.Provider value={{
            settings,
            loading,
            error,
            updateSettings,
            refreshSettings,
            storeName: settings.storeName,
            logoUrl: settings.logoUrl,
            storeDescription: settings.storeDescription
        }}>
            {children}
        </SettingsContext.Provider>
    );
};
