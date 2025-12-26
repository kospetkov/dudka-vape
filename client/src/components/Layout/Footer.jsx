import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';
import './Footer.css';

// DUDKA Social Media Links
const SOCIAL_LINKS = {
    instagram: 'https://instagram.com/dudkavape',
    telegram: 'https://t.me/dudkavape',
    tiktok: 'https://tiktok.com/@dudkavape',
    youtube: 'https://youtube.com/@dudkavape'
};

// DUDKA Contact Info
const CONTACT_INFO = {
    email: 'info@dudka.ua',
    phone: '+380 (50) 123-45-67'
};

const Footer = () => {
    const { t } = useTranslation();

    return (
        <footer className="footer">
            <div className="container">
                <div className="footer-grid">
                    {/* Brand Section */}
                    <div className="footer-section">
                        <div className="footer-brand">
                            <img src="/logo.png" alt="DUDKA" className="footer-logo" />
                        </div>
                        <p className="footer-description">
                            Преміум вейп продукція для справжніх цінителів. 
                            Якість та надійність у кожному пристрої.
                        </p>
                    </div>

                    {/* Products Section */}
                    <div className="footer-section">
                        <h4 className="footer-title">{t('footer.products', 'Продукція')}</h4>
                        <ul className="footer-links">
                            <li><Link to="/catalog?category=pod-systems">{t('footer.podSystems', 'Pod-системи')}</Link></li>
                            <li><Link to="/catalog?category=starter-kits">{t('footer.starterKits', 'Стартові набори')}</Link></li>
                            <li><Link to="/catalog?category=liquids">{t('footer.liquids', 'Рідини')}</Link></li>
                            <li><Link to="/catalog?category=accessories">{t('footer.accessories', 'Аксесуари')}</Link></li>
                            <li><Link to="/catalog?category=disposables">{t('footer.disposables', 'Одноразові')}</Link></li>
                        </ul>
                    </div>

                    {/* Information Section */}
                    <div className="footer-section">
                        <h4 className="footer-title">{t('footer.information', 'Інформація')}</h4>
                        <ul className="footer-links">
                            <li><Link to="/about">{t('footer.aboutUs', 'Про нас')}</Link></li>
                            <li><Link to="/delivery">{t('footer.delivery', 'Доставка')}</Link></li>
                            <li><Link to="/contact">{t('footer.contacts', 'Контакти')}</Link></li>
                            <li><Link to="/privacy">Політика конфіденційності</Link></li>
                            <li><Link to="/terms">Умови використання</Link></li>
                            <li><Link to="/offer">Публічна оферта</Link></li>
                        </ul>
                    </div>

                    {/* Contact Section */}
                    <div className="footer-section">
                        <h4 className="footer-title">{t('footer.contactUs', 'Контакти')}</h4>
                        <ul className="footer-contact">
                            <li>
                                <strong>Email:</strong>
                                <a href={`mailto:${CONTACT_INFO.email}`}>{CONTACT_INFO.email}</a>
                            </li>
                            <li>
                                <strong>Телефон:</strong>
                                <a href={`tel:${CONTACT_INFO.phone.replace(/[^0-9+]/g, '')}`}>{CONTACT_INFO.phone}</a>
                            </li>
                            <li>
                                <strong>Графік роботи:</strong>
                                <span>Пн-Пт: 9:00-18:00, Сб: 10:00-15:00</span>
                            </li>
                        </ul>
                        
                        {/* Social Media */}
                        <h4 className="footer-title" style={{ marginTop: '1.5rem' }}>Ми в соцмережах</h4>
                        <div className="footer-social">
                            <a
                                href={SOCIAL_LINKS.instagram}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="social-icon"
                                aria-label="Instagram"
                            >
                                <svg viewBox="0 0 24 24" fill="currentColor">
                                    <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" />
                                </svg>
                            </a>
                            <a
                                href={SOCIAL_LINKS.telegram}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="social-icon"
                                aria-label="Telegram"
                            >
                                <svg viewBox="0 0 24 24" fill="currentColor">
                                    <path d="M11.944 0A12 12 0 0 0 0 12a12 12 0 0 0 12 12 12 12 0 0 0 12-12A12 12 0 0 0 12 0a12 12 0 0 0-.056 0zm4.962 7.224c.1-.002.321.023.465.14a.506.506 0 0 1 .171.325c.016.093.036.306.02.472-.18 1.898-.962 6.502-1.36 8.627-.168.9-.499 1.201-.82 1.23-.696.065-1.225-.46-1.9-.902-1.056-.693-1.653-1.124-2.678-1.8-1.185-.78-.417-1.21.258-1.91.177-.184 3.247-2.977 3.307-3.23.007-.032.014-.15-.056-.212s-.174-.041-.249-.024c-.106.024-1.793 1.14-5.061 3.345-.48.33-.913.49-1.302.48-.428-.008-1.252-.241-1.865-.44-.752-.245-1.349-.374-1.297-.789.027-.216.325-.437.893-.663 3.498-1.524 5.83-2.529 6.998-3.014 3.332-1.386 4.025-1.627 4.476-1.635z" />
                                </svg>
                            </a>
                            <a
                                href={SOCIAL_LINKS.tiktok}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="social-icon"
                                aria-label="TikTok"
                            >
                                <svg viewBox="0 0 24 24" fill="currentColor">
                                    <path d="M12.525.02c1.31-.02 2.61-.01 3.91-.02.08 1.53.63 3.09 1.75 4.17 1.12 1.11 2.7 1.62 4.24 1.79v4.03c-1.44-.05-2.89-.35-4.2-.97-.57-.26-1.1-.59-1.62-.93-.01 2.92.01 5.84-.02 8.75-.08 1.4-.54 2.79-1.35 3.94-1.31 1.92-3.58 3.17-5.91 3.21-1.43.08-2.86-.31-4.08-1.03-2.02-1.19-3.44-3.37-3.65-5.71-.02-.5-.03-1-.01-1.49.18-1.9 1.12-3.72 2.58-4.96 1.66-1.44 3.98-2.13 6.15-1.72.02 1.48-.04 2.96-.04 4.44-.99-.32-2.15-.23-3.02.37-.63.41-1.11 1.04-1.36 1.75-.21.51-.15 1.07-.14 1.61.24 1.64 1.82 3.02 3.5 2.87 1.12-.01 2.19-.66 2.77-1.61.19-.33.4-.67.41-1.06.1-1.79.06-3.57.07-5.36.01-4.03-.01-8.05.02-12.07z" />
                                </svg>
                            </a>
                            <a
                                href={SOCIAL_LINKS.youtube}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="social-icon"
                                aria-label="YouTube"
                            >
                                <svg viewBox="0 0 24 24" fill="currentColor">
                                    <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z" />
                                </svg>
                            </a>
                        </div>
                    </div>
                </div>

                {/* Copyright */}
                <div className="footer-bottom">
                    <p>© 2026 DUDKA. Всі права захищено.</p>
                    <p className="footer-legal-links">
                        <Link to="/privacy">Конфіденційність</Link>
                        <span>•</span>
                        <Link to="/terms">Умови</Link>
                        <span>•</span>
                        <Link to="/offer">Оферта</Link>
                    </p>
                </div>
            </div>
        </footer>
    );
};

export default Footer;
