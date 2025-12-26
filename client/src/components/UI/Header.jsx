import { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useAuth } from '../../context/AuthContext';
import { useCart } from '../../context/CartContext';
import { useWishlist } from '../../context/WishlistContext';
import './Header.css';

const Header = ({ logoUrl = '/logo.png', storeName = 'DUDKA' }) => {
    const { t } = useTranslation();
    const [isScrolled, setIsScrolled] = useState(false);
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
    const [showAuthModal, setShowAuthModal] = useState(false);
    const [authMode, setAuthMode] = useState('login');
    const [authForm, setAuthForm] = useState({ name: '', email: '', password: '' });
    const [authError, setAuthError] = useState('');
    const [authLoading, setAuthLoading] = useState(false);
    
    const { isAuthenticated, user, isAdmin, login, register } = useAuth();
    const { getCartCount } = useCart();
    const { wishlist, wishlistCount } = useWishlist();
    const location = useLocation();

    const itemCount = typeof getCartCount === 'function' ? getCartCount() : 0;

    useEffect(() => {
        const handleScroll = () => setIsScrolled(window.scrollY > 50);
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    useEffect(() => {
        setIsMobileMenuOpen(false);
    }, [location]);

    useEffect(() => {
        document.body.style.overflow = (isMobileMenuOpen || showAuthModal) ? 'hidden' : '';
        return () => { document.body.style.overflow = ''; };
    }, [isMobileMenuOpen, showAuthModal]);

    const getInitials = (name) => {
        if (!name) return 'U';
        return name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2);
    };

    const handleAuthSubmit = async (e) => {
        e.preventDefault();
        setAuthError('');
        setAuthLoading(true);
        
        try {
            let result;
            if (authMode === 'login') {
                result = await login(authForm.email, authForm.password);
            } else {
                result = await register({
                    name: authForm.name,
                    email: authForm.email,
                    password: authForm.password
                });
            }
            
            if (result.success) {
                setShowAuthModal(false);
                setAuthForm({ name: '', email: '', password: '' });
            } else {
                setAuthError(result.error || t('auth.loginError'));
            }
        } catch (err) {
            setAuthError(err.response?.data?.message || err.message || t('auth.loginError'));
        } finally {
            setAuthLoading(false);
        }
    };

    const openAuth = (mode = 'login') => {
        setAuthMode(mode);
        setAuthError('');
        setAuthForm({ name: '', email: '', password: '' });
        setShowAuthModal(true);
    };

    const navLinks = [
        { to: '/', label: t('home.title', 'Головна'), icon: '🏠' },
        { to: '/catalog', label: t('header.catalog'), icon: '📦' },
        { to: '/about', label: 'Про нас', icon: 'ℹ️' },
        { to: '/contact', label: 'Контакти', icon: '📞' },
    ];

    const legalLinks = [
        { to: '/privacy', label: 'Конфіденційність' },
        { to: '/terms', label: 'Умови' },
        { to: '/offer', label: 'Оферта' },
    ];

    const isActive = (path) => {
        if (path === '/') return location.pathname === '/';
        return location.pathname.startsWith(path);
    };

    return (
        <>
            <header className={`header ${isScrolled ? 'scrolled' : ''}`}>
                <div className="header-content">
                    <Link to="/" className="header-logo">
                        {logoUrl ? (
                            <img src={logoUrl} alt={storeName} className="header-logo-image" />
                        ) : (
                            <div className="header-logo-placeholder">
                                {storeName.slice(0, 2).toUpperCase()}
                            </div>
                        )}
                    </Link>

                    <nav className="header-nav">
                        {navLinks.map(({ to, label }) => (
                            <Link
                                key={to}
                                to={to}
                                className={`header-nav-link ${isActive(to) ? 'active' : ''}`}
                            >
                                {label}
                            </Link>
                        ))}
                        
                        {/* Legal Dropdown */}
                        <div className="header-nav-dropdown">
                            <span className="header-nav-link header-nav-dropdown-trigger">
                                Документи ▾
                            </span>
                            <div className="header-nav-dropdown-menu">
                                {legalLinks.map(({ to, label }) => (
                                    <Link key={to} to={to} className="header-nav-dropdown-item">
                                        {label}
                                    </Link>
                                ))}
                            </div>
                        </div>
                    </nav>

                    <div className="header-actions">
                        <Link to="/wishlist" className="header-action-btn header-wishlist-btn" title="Список бажань">
                            ❤️
                            {wishlistCount > 0 && (
                                <span className="header-action-badge">{wishlistCount}</span>
                            )}
                        </Link>
                        <button className="header-action-btn" title={t('header.cart')}>
                            🛒
                            {itemCount > 0 && (
                                <span className="header-action-badge">{itemCount}</span>
                            )}
                        </button>

                        {isAuthenticated ? (
                            <Link to="/account" className="header-user-btn">
                                <div className="header-user-avatar">
                                    {getInitials(user?.name)}
                                </div>
                                <span>{user?.name?.split(' ')[0] || t('profile.title')}</span>
                            </Link>
                        ) : (
                            <button 
                                className="header-user-btn"
                                onClick={() => openAuth('login')}
                            >
                                👤 {t('header.login')}
                            </button>
                        )}

                        {isAdmin && (
                            <Link to="/admin" className="header-action-btn header-admin-btn" title={t('header.admin')}>
                                ⚙️
                            </Link>
                        )}

                        <button
                            className="header-mobile-btn"
                            onClick={() => setIsMobileMenuOpen(true)}
                            aria-label="Меню"
                        >
                            ☰
                        </button>
                    </div>
                </div>
            </header>

            {/* Mobile Menu */}
            <div
                className={`mobile-menu-overlay ${isMobileMenuOpen ? 'active' : ''}`}
                onClick={() => setIsMobileMenuOpen(false)}
            />
            <div className={`mobile-menu ${isMobileMenuOpen ? 'active' : ''}`}>
                <div className="mobile-menu-header">
                    <Link to="/" className="header-logo">
                        <img src={logoUrl} alt={storeName} className="header-logo-image" />
                    </Link>
                    <button className="mobile-menu-close" onClick={() => setIsMobileMenuOpen(false)}>
                        ✕
                    </button>
                </div>
                <nav className="mobile-menu-nav">
                    {navLinks.map(({ to, label, icon }) => (
                        <Link key={to} to={to} className={`mobile-menu-link ${isActive(to) ? 'active' : ''}`}>
                            <span className="mobile-menu-icon">{icon}</span>
                            {label}
                        </Link>
                    ))}
                    <Link to="/wishlist" className={`mobile-menu-link ${isActive('/wishlist') ? 'active' : ''}`}>
                        <span className="mobile-menu-icon">❤️</span>
                        Список бажань {wishlistCount > 0 && `(${wishlistCount})`}
                    </Link>
                    {isAuthenticated ? (
                        <Link to="/account" className={`mobile-menu-link ${isActive('/account') ? 'active' : ''}`}>
                            <span className="mobile-menu-icon">👤</span>
                            {t('profile.title')}
                        </Link>
                    ) : (
                        <button className="mobile-menu-link" onClick={() => { setIsMobileMenuOpen(false); openAuth('login'); }}>
                            <span className="mobile-menu-icon">👤</span>
                            {t('header.login')}
                        </button>
                    )}
                    {isAdmin && (
                        <Link to="/admin" className={`mobile-menu-link ${isActive('/admin') ? 'active' : ''}`}>
                            <span className="mobile-menu-icon">⚙️</span>
                            {t('header.admin')}
                        </Link>
                    )}
                    
                    {/* Legal Links */}
                    <div className="mobile-menu-divider"></div>
                    <div className="mobile-menu-legal">
                        <Link to="/privacy">Конфіденційність</Link>
                        <Link to="/terms">Умови</Link>
                        <Link to="/offer">Оферта</Link>
                    </div>
                </nav>
            </div>

            {/* Auth Modal */}
            {showAuthModal && (
                <div className="auth-modal-overlay" onClick={() => setShowAuthModal(false)}>
                    <div className="auth-modal" onClick={(e) => e.stopPropagation()}>
                        <button className="auth-modal-close" onClick={() => setShowAuthModal(false)}>✕</button>
                        
                        <h2 className="auth-modal-title">
                            {authMode === 'login' ? t('auth.login') : t('auth.register')}
                        </h2>
                        
                        {authError && (
                            <div className="auth-error">{authError}</div>
                        )}
                        
                        <form onSubmit={handleAuthSubmit} className="auth-form">
                            {authMode === 'register' && (
                                <div className="auth-field">
                                    <label>{t('auth.name')}</label>
                                    <input
                                        type="text"
                                        value={authForm.name}
                                        onChange={(e) => setAuthForm({...authForm, name: e.target.value})}
                                        placeholder={t('auth.name')}
                                        required
                                    />
                                </div>
                            )}
                            
                            <div className="auth-field">
                                <label>{t('auth.email')}</label>
                                <input
                                    type="email"
                                    value={authForm.email}
                                    onChange={(e) => setAuthForm({...authForm, email: e.target.value})}
                                    placeholder="email@example.com"
                                    required
                                />
                            </div>
                            
                            <div className="auth-field">
                                <label>{t('auth.password')}</label>
                                <input
                                    type="password"
                                    value={authForm.password}
                                    onChange={(e) => setAuthForm({...authForm, password: e.target.value})}
                                    placeholder="••••••••"
                                    required
                                    minLength={6}
                                />
                            </div>
                            
                            <button type="submit" className="auth-submit-btn" disabled={authLoading}>
                                {authLoading ? t('common.loading') : (authMode === 'login' ? t('auth.loginButton') : t('auth.registerButton'))}
                            </button>
                        </form>
                        
                        <div className="auth-switch">
                            {authMode === 'login' ? (
                                <p>{t('auth.noAccount')} <button onClick={() => setAuthMode('register')}>{t('auth.registerButton')}</button></p>
                            ) : (
                                <p>{t('auth.haveAccount')} <button onClick={() => setAuthMode('login')}>{t('auth.loginButton')}</button></p>
                            )}
                        </div>
                    </div>
                </div>
            )}
        </>
    );
};

export default Header;
