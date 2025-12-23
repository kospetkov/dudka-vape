import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useAuth } from '../../context/AuthContext';

const LoginForm = ({ onSuccess }) => {
    const { t } = useTranslation();
    const { login } = useAuth();
    const [formData, setFormData] = useState({ email: '', password: '' });
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setLoading(true);

        const result = await login(formData.email, formData.password);

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
                <label className="text-small text-muted">{t('auth.password')}</label>
                <input
                    type="password"
                    className="input"
                    value={formData.password}
                    onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                    required
                />
            </div>

            <button type="submit" className="btn btn-primary" style={{ width: '100%' }} disabled={loading}>
                {loading ? t('common.loading') : t('auth.loginButton')}
            </button>
        </form>
    );
};

export default LoginForm;
