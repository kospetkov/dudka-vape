import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useAuth } from '../../context/AuthContext';
import LoginForm from './LoginForm';
import RegisterForm from './RegisterForm';

const AuthModal = ({ mode: initialMode, onClose }) => {
    const { t } = useTranslation();
    const [mode, setMode] = useState(initialMode);

    return (
        <div className="modal-overlay" onClick={onClose}>
            <div className="modal-content" onClick={(e) => e.stopPropagation()}>
                <div className="flex-between mb-lg">
                    <h2>{mode === 'login' ? t('auth.login') : t('auth.register')}</h2>
                    <button onClick={onClose} className="btn btn-sm btn-outline">
                        {t('common.close')}
                    </button>
                </div>

                {mode === 'login' ? (
                    <LoginForm onSuccess={onClose} />
                ) : (
                    <RegisterForm onSuccess={onClose} />
                )}

                <div className="text-center mt-md">
                    {mode === 'login' ? (
                        <p className="text-muted text-small">
                            {t('auth.noAccount')}{' '}
                            <button
                                onClick={() => setMode('register')}
                                className="btn-link"
                                style={{ color: 'var(--color-primary)', cursor: 'pointer', border: 'none', background: 'none' }}
                            >
                                {t('auth.registerButton')}
                            </button>
                        </p>
                    ) : (
                        <p className="text-muted text-small">
                            {t('auth.haveAccount')}{' '}
                            <button
                                onClick={() => setMode('login')}
                                className="btn-link"
                                style={{ color: 'var(--color-primary)', cursor: 'pointer', border: 'none', background: 'none' }}
                            >
                                {t('auth.loginButton')}
                            </button>
                        </p>
                    )}
                </div>
            </div>
        </div>
    );
};

export default AuthModal;
