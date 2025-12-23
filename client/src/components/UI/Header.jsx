import { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useCart } from '../../context/CartContext';
import './Header.css';

const Header = ({ logoUrl, storeName = 'DudkaVape' }) => {
    const [isScrolled, setIsScrolled] = useState(false);
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
    const { isAuthenticated, user, isAdmin } = useAuth();
    const { itemCount } = useCart();
    const location = useLocation();

    // Handle scroll
    useEffect(() => {
        const handleScroll = () => {
            setIsScrolled(window.scrollY > 50);
        };
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    // Close mobile menu on route change
    useEffect(() => {
        setIsMobileMenuOpen(false);
    }, [location]);

    // Prevent body scroll when mobile menu is open
    useEffect(() => {
        if (isMobileMenuOpen) {
            document.body.style.overflow = 'hidden';
        } else {
            document.body.style.overflow = '';
        }
        return () => {
            document.body.style.overflow = '';
        };
    }, [isMobileMenuOpen]);

    const getInitials = (name) => {
        if (!name) return 'U';
        return name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2);
    };

    const navLinks = [
        { to: '/', label: 'Головна', icon: '🏠' },
        { to: '/catalog', label: 'Каталог', icon: '📦' },
    ];

    const isActive = (path) => {
        if (path === '/') return location.pathname === '/';
        return location.pathname.startsWith(path);
    };

    return (
        <>
            <header className={`header ${isScrolled ? 'scrolled' : ''}`}>
                <div className="header-content">
                    {/* Logo */}
                    <Link to="/" className="header-logo">
                        {logoUrl ? (
                            <img src={logoUrl} alt={storeName} className="header-logo-image" />
                        ) : (
                            <div className="header-logo-placeholder">
                                {storeName.slice(0, 2).toUpperCase()}
                            </div>
                        )}
                        <span className="header-logo-text">{storeName}</span>
                    </Link>

                    {/* Desktop Navigation */}
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
                    </nav>

                    {/* Actions */}
                    <div className="header-actions">
                        {/* Cart */}
                        <button className="header-action-btn" title="Кошик">
                            🛒
                            {itemCount > 0 && (
                                <span className="header-action-badge">{itemCount}</span>
                            )}
                        </button>

                        {/* User */}
                        {isAuthenticated ? (
                            <Link to="/account" className="header-user-btn">
                                <div className="header-user-avatar">
                                    {getInitials(user?.name)}
                                </div>
                                <span>{user?.name?.split(' ')[0] || 'Кабінет'}</span>
                            </Link>
                        ) : (
                            <button className="header-user-btn">
                                👤 Увійти
                            </button>
                        )}

                        {/* Admin Link */}
                        {isAdmin && (
                            <Link to="/admin" className="header-action-btn" title="Адмін панель">
                                ⚙️
                            </Link>
                        )}

                        {/* Mobile Menu Button */}
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

            {/* Mobile Menu Overlay */}
            <div
                className={`mobile-menu-overlay ${isMobileMenuOpen ? 'active' : ''}`}
                onClick={() => setIsMobileMenuOpen(false)}
            />

            {/* Mobile Menu */}
            <div className={`mobile-menu ${isMobileMenuOpen ? 'active' : ''}`}>
                <div className="mobile-menu-header">
                    <Link to="/" className="header-logo">
                        <span className="header-logo-text">{storeName}</span>
                    </Link>
                    <button
                        className="mobile-menu-close"
                        onClick={() => setIsMobileMenuOpen(false)}
                    >
                        ✕
                    </button>
                </div>

                <nav className="mobile-menu-nav">
                    {navLinks.map(({ to, label, icon }) => (
                        <Link
                            key={to}
                            to={to}
                            className={`mobile-menu-link ${isActive(to) ? 'active' : ''}`}
                        >
                            <span className="mobile-menu-icon">{icon}</span>
                            {label}
                        </Link>
                    ))}
                    
                    <Link
                        to="/account"
                        className={`mobile-menu-link ${isActive('/account') ? 'active' : ''}`}
                    >
                        <span className="mobile-menu-icon">👤</span>
                        {isAuthenticated ? 'Мій кабінет' : 'Увійти'}
                    </Link>

                    {isAdmin && (
                        <Link
                            to="/admin"
                            className={`mobile-menu-link ${isActive('/admin') ? 'active' : ''}`}
                        >
                            <span className="mobile-menu-icon">⚙️</span>
                            Адмін панель
                        </Link>
                    )}
                </nav>
            </div>
        </>
    );
};

export default Header;
