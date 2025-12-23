import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useAuth } from '../../context/AuthContext';

const RegisterForm = ({ onSuccess }) => {
    const { t } = useTranslation();
    const { register } = useAuth();
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        phone: '',
        password: '',
        confirmPassword: ''
    });
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');

        if (formData.password !== formData.confirmPassword) {
            setError(t('auth.passwordMismatch'));
            return;
        }

        setLoading(true);
        const result = await register({
            name: formData.name,
            email: formData.email,
            phone: formData.phone,
            password: formData.password
        });

        if (result.success) {
            onSuccess();
        } else {
            setError(result.error);
        }
        setLoading(false);
    };

    return (
        <form onSubmit={handleSubmit}>
            {error && (
                <div style={{ padding: 'var(--spacing-sm)', background: 'var(--color-danger)', color: 'white', borderRadius: 'var(--radius-md)', marginBottom: 'var(--spacing-md)' }}>
                    {error}
                </div>
            )}

            <div className="mb-md">
                <label className="text-small text-muted">{t('auth.name')}</label>
                <input
                    type="text"
                    className="input"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    required
                />
            </div>

            <div className="mb-md">
                <label className="text-small text-muted">{t('auth.email')}</label>
                <input
                    type="email"
                    className="input"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    required
                />
            </div>

            <div className="mb-md">
                <label className="text-small text-muted">{t('auth.phone')}</label>
                <input
                    type="tel"
                    className="input"
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    required
                />
            </div>

            <div className="mb-md">
                <label className="text-small text-muted">{t('auth.password')}</label>
                <input
                    type="password"
                    className="input"
                    value={formData.password}
                    onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                    required
                    minLength={6}
                />
            </div>

            <div className="mb-md">
                <label className="text-small text-muted">{t('auth.confirmPassword')}</label>
                <input
                    type="password"
                    className="input"
                    value={formData.confirmPassword}
                    onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
                    required
                    minLength={6}
                />
            </div>

            <button type="submit" className="btn btn-primary" style={{ width: '100%' }} disabled={loading}>
                {loading ? t('common.loading') : t('auth.registerButton')}
            </button>
        </form>
    );
};

export default RegisterForm;
