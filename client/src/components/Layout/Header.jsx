import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useAuth } from '../../context/AuthContext';
import { useCart } from '../../context/CartContext';
import { useState } from 'react';
import AuthModal from '../Auth/AuthModal';
import './Header.css';

const Header = () => {
    const { t, i18n } = useTranslation();
    const { isAuthenticated, isAdmin, user, logout } = useAuth();
    const { getCartCount } = useCart();
    const [showAuthModal, setShowAuthModal] = useState(false);
    const [authMode, setAuthMode] = useState('login');
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

    const changeLanguage = (lng) => {
        i18n.changeLanguage(lng);
    };

    const handleAuthClick = (mode) => {
        setAuthMode(mode);
        setShowAuthModal(true);
        setMobileMenuOpen(false);
    };

    const toggleMobileMenu = () => {
        setMobileMenuOpen(!mobileMenuOpen);
    };

    return (
        <>
            <header className="header">
                <div className="container">
                    <div className="header-content">
                        {/* Mobile menu button */}
                        <button
                            className="mobile-menu-btn"
                            onClick={toggleMobileMenu}
                            aria-label="Menu"
                        >
                            <span className={`hamburger ${mobileMenuOpen ? 'open' : ''}`}>
                                <span></span>
                                <span></span>
                                <span></span>
                            </span>
                        </button>

                        <Link to="/" className="logo">
                            <img src="/logo.png" alt="Vape Shop" className="logo-img" />
                        </Link>

                        <nav className={`nav ${mobileMenuOpen ? 'mobile-open' : ''}`}>
                            <Link to="/catalog" className="nav-link" onClick={() => setMobileMenuOpen(false)}>
                                {t('header.catalog')}
                            </Link>
                        </nav>

                        <div className="header-actions">
                            <div className="language-switcher">
                                <button
                                    className={`lang-btn ${i18n.language === 'ua' ? 'active' : ''}`}
                                    onClick={() => changeLanguage('ua')}
                                >
                                    UA
                                </button>
                                <button
                                    className={`lang-btn ${i18n.language === 'ru' ? 'active' : ''}`}
                                    onClick={() => changeLanguage('ru')}
                                >
                                    RU
                                </button>
                                <button
                                    className={`lang-btn ${i18n.language === 'en' ? 'active' : ''}`}
                                    onClick={() => changeLanguage('en')}
                                >
                                    EN
                                </button>
                            </div>

                            <Link to="/checkout" className="cart-btn">
                                🛒
                                {getCartCount() > 0 && (
                                    <span className="badge badge-sm">{getCartCount()}</span>
                                )}
                            </Link>

                            {isAuthenticated ? (
                                <div className="user-menu">
                                    <span className="user-name">{user?.name}</span>
                                    {isAdmin && (
                                        <Link to="/admin" className="btn btn-sm btn-secondary">
                                            {t('header.admin')}
                                        </Link>
                                    )}
                                    <Link to="/profile" className="btn btn-sm btn-outline">
                                        {t('header.profile')}
                                    </Link>
                                    <button onClick={logout} className="btn btn-sm btn-outline">
                                        {t('header.logout')}
                                    </button>
                                </div>
                            ) : (
                                <div className="auth-buttons">
                                    <button
                                        onClick={() => handleAuthClick('login')}
                                        className="btn btn-sm btn-outline"
                                    >
                                        {t('header.login')}
                                    </button>
                                    <button
                                        onClick={() => handleAuthClick('register')}
                                        className="btn btn-sm btn-primary"
                                    >
                                        {t('header.register')}
                                    </button>
                                </div>
                            )}
                        </div>
                    </div>
                </div>

                {/* Mobile overlay */}
                {mobileMenuOpen && (
                    <div className="mobile-overlay" onClick={() => setMobileMenuOpen(false)}></div>
                )}
            </header>

            {showAuthModal && (
                <AuthModal
                    mode={authMode}
                    onClose={() => setShowAuthModal(false)}
                />
            )}
        </>
    );
};

export default Header;
