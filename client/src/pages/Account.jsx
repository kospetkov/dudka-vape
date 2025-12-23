import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import ProductCard from '../components/UI/ProductCard';
import api from '../utils/api';
import './Account.css';

const Account = () => {
    const navigate = useNavigate();
    const { user, isAuthenticated, logout } = useAuth();
    const [activeSection, setActiveSection] = useState('profile');
    const [loading, setLoading] = useState(false);
    const [orders, setOrders] = useState([]);
    const [wishlist, setWishlist] = useState([]);
    const [addresses, setAddresses] = useState([]);
    const [loyalty, setLoyalty] = useState({ points: 150, tier: 'bronze', progress: 30 });
    const [profileForm, setProfileForm] = useState({ name: '', email: '', phone: '' });
    const [settings, setSettings] = useState({ 
        emailNotifications: true, 
        smsNotifications: false,
        darkTheme: false 
    });

    useEffect(() => {
        if (!isAuthenticated) navigate('/');
    }, [isAuthenticated, navigate]);

    useEffect(() => {
        if (user) setProfileForm({ name: user.name || '', email: user.email || '', phone: user.phone || '' });
    }, [user]);

    // Load theme preference
    useEffect(() => {
        const savedTheme = localStorage.getItem('dudka-theme');
        if (savedTheme === 'dark') {
            setSettings(s => ({ ...s, darkTheme: true }));
            document.documentElement.setAttribute('data-theme', 'dark');
        }
    }, []);

    useEffect(() => {
        const fetchData = async () => {
            setLoading(true);
            try {
                if (activeSection === 'orders') {
                    const res = await api.get('/orders/my');
                    setOrders(res.data || []);
                }
            } catch (e) { console.error(e); }
            finally { setLoading(false); }
        };
        if (isAuthenticated) fetchData();
    }, [activeSection, isAuthenticated]);

    const getInitials = (name) => name ? name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2) : 'U';
    const formatPrice = (p) => new Intl.NumberFormat('uk-UA', { style: 'currency', currency: 'UAH', minimumFractionDigits: 0 }).format(p);
    const formatDate = (d) => new Date(d).toLocaleDateString('uk-UA', { day: 'numeric', month: 'long', year: 'numeric' });

    const handleProfileSubmit = async (e) => {
        e.preventDefault();
        try { await api.put('/auth/profile', profileForm); alert('Профіль оновлено!'); } catch (e) { console.error(e); }
    };

    const toggleDarkTheme = () => {
        const newDark = !settings.darkTheme;
        setSettings({ ...settings, darkTheme: newDark });
        
        if (newDark) {
            document.documentElement.setAttribute('data-theme', 'dark');
            localStorage.setItem('dudka-theme', 'dark');
        } else {
            document.documentElement.removeAttribute('data-theme');
            localStorage.setItem('dudka-theme', 'light');
        }
    };

    const navItems = [
        { id: 'profile', icon: '👤', label: 'Профіль' },
        { id: 'orders', icon: '📦', label: 'Мої замовлення' },
        { id: 'wishlist', icon: '❤️', label: 'Список бажань' },
        { id: 'loyalty', icon: '🎁', label: 'Бонуси' },
        { id: 'addresses', icon: '📍', label: 'Адреси' },
        { id: 'settings', icon: '⚙️', label: 'Налаштування' },
    ];

    const statusLabels = { pending: 'Очікує', paid: 'Оплачено', shipped: 'Відправлено', delivered: 'Доставлено' };
    const tierNames = { bronze: 'Бронза', silver: 'Срібло', gold: 'Золото', platinum: 'Платина' };
    const tierIcons = { bronze: '🥉', silver: '🥈', gold: '🥇', platinum: '💎' };

    if (!isAuthenticated) return null;

    return (
        <div className="account-page">
            <div className="account-container">
                <aside className="account-sidebar">
                    <div className="account-user-info">
                        <div className="account-avatar">{getInitials(user?.name)}</div>
                        <div>
                            <div className="account-user-name">{user?.name || 'Користувач'}</div>
                            <div className="account-user-email">{user?.email}</div>
                        </div>
                    </div>
                    <nav className="account-nav">
                        {navItems.map(item => (
                            <button key={item.id} className={`account-nav-item ${activeSection === item.id ? 'active' : ''}`} onClick={() => setActiveSection(item.id)}>
                                <span className="account-nav-icon">{item.icon}</span>{item.label}
                            </button>
                        ))}
                    </nav>
                    <div className="account-logout">
                        <button className="account-logout-btn" onClick={() => { logout(); navigate('/'); }}>🚪 Вийти</button>
                    </div>
                </aside>

                <main className="account-content">
                    {activeSection === 'profile' && (
                        <section className="account-section">
                            <div className="account-section-header"><h2 className="account-section-title">Особисті дані</h2></div>
                            <form className="profile-form" onSubmit={handleProfileSubmit}>
                                <div className="form-group">
                                    <label className="form-label">Ім'я</label>
                                    <input type="text" className="form-input" value={profileForm.name} onChange={(e) => setProfileForm({ ...profileForm, name: e.target.value })} />
                                </div>
                                <div className="profile-form-row">
                                    <div className="form-group">
                                        <label className="form-label">Email</label>
                                        <input type="email" className="form-input" value={profileForm.email} onChange={(e) => setProfileForm({ ...profileForm, email: e.target.value })} />
                                    </div>
                                    <div className="form-group">
                                        <label className="form-label">Телефон</label>
                                        <input type="tel" className="form-input" value={profileForm.phone} onChange={(e) => setProfileForm({ ...profileForm, phone: e.target.value })} placeholder="+380" />
                                    </div>
                                </div>
                                <button type="submit" className="btn btn-primary">Зберегти</button>
                            </form>
                        </section>
                    )}

                    {activeSection === 'orders' && (
                        <section className="account-section">
                            <div className="account-section-header"><h2 className="account-section-title">Мої замовлення</h2></div>
                            {loading ? <div className="loading-container"><div className="loading-spinner"></div></div> : orders.length > 0 ? (
                                <div className="orders-list">
                                    {orders.map(order => (
                                        <div key={order._id} className="order-card">
                                            <div className="order-header">
                                                <div><span className="order-number">#{order._id.slice(-6)}</span><span className="order-date"> · {formatDate(order.createdAt)}</span></div>
                                                <span className={`order-status ${order.status}`}>{statusLabels[order.status]}</span>
                                            </div>
                                            <div className="order-items">
                                                {order.items?.map((item, i) => (
                                                    <div key={i} className="order-item">
                                                        <img src={item.product?.images?.[0]?.url || '/placeholder.jpg'} alt="" className="order-item-image" />
                                                        <div className="order-item-info">
                                                            <div className="order-item-name">{typeof item.product?.name === 'object' ? item.product.name.ua : item.product?.name}</div>
                                                            <div className="order-item-qty">×{item.quantity}</div>
                                                        </div>
                                                        <div className="order-item-price">{formatPrice(item.price * item.quantity)}</div>
                                                    </div>
                                                ))}
                                            </div>
                                            <div className="order-footer">
                                                <div className="order-total"><span className="order-total-label">Всього:</span><span className="order-total-value">{formatPrice(order.total)}</span></div>
                                                <div className="order-actions">
                                                    <button className="order-action-btn">Деталі</button>
                                                    <button className="order-action-btn">Повторити</button>
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            ) : <div className="empty-state"><div className="empty-state-icon">📦</div><h3>Замовлень поки немає</h3></div>}
                        </section>
                    )}

                    {activeSection === 'loyalty' && (
                        <section className="account-section">
                            <div className="account-section-header"><h2 className="account-section-title">Бонуси та знижки</h2></div>
                            <div className="loyalty-card">
                                <div className="loyalty-header">
                                    <div className={`loyalty-tier ${loyalty.tier}`}>
                                        <span className="loyalty-tier-icon">{tierIcons[loyalty.tier]}</span>
                                        <span className="loyalty-tier-name">{tierNames[loyalty.tier]}</span>
                                    </div>
                                    <div className="loyalty-points">
                                        <div className="loyalty-points-value">{loyalty.points}</div>
                                        <div className="loyalty-points-label">балів</div>
                                    </div>
                                </div>
                                <div className="loyalty-progress">
                                    <div className="loyalty-progress-bar"><div className="loyalty-progress-fill" style={{ width: `${loyalty.progress}%` }}></div></div>
                                    <div className="loyalty-progress-text"><span>0</span><span>До {tierNames.silver}: 500 балів</span></div>
                                </div>
                            </div>
                            <h3 style={{ marginBottom: 'var(--spacing-lg)' }}>Доступні нагороди</h3>
                            <div className="loyalty-rewards">
                                <div className="loyalty-reward"><div className="loyalty-reward-icon">🎁</div><div className="loyalty-reward-name">Знижка 5%</div><div className="loyalty-reward-cost">100 балів</div></div>
                                <div className="loyalty-reward"><div className="loyalty-reward-icon">🚚</div><div className="loyalty-reward-name">Безкоштовна доставка</div><div className="loyalty-reward-cost">200 балів</div></div>
                                <div className="loyalty-reward"><div className="loyalty-reward-icon">⭐</div><div className="loyalty-reward-name">Знижка 10%</div><div className="loyalty-reward-cost">300 балів</div></div>
                            </div>
                        </section>
                    )}

                    {activeSection === 'wishlist' && (
                        <section className="account-section">
                            <div className="account-section-header"><h2 className="account-section-title">Список бажань</h2></div>
                            {wishlist.length > 0 ? (
                                <div className="wishlist-grid">{wishlist.map(p => <ProductCard key={p._id} product={p} />)}</div>
                            ) : <div className="empty-state"><div className="empty-state-icon">❤️</div><h3>Список бажань порожній</h3><p>Додавайте товари натискаючи 🤍</p></div>}
                        </section>
                    )}

                    {activeSection === 'addresses' && (
                        <section className="account-section">
                            <div className="account-section-header"><h2 className="account-section-title">Адреси доставки</h2><button className="btn btn-primary btn-sm">+ Додати</button></div>
                            {addresses.length > 0 ? (
                                <div className="addresses-list">{addresses.map((a, i) => (
                                    <div key={i} className={`address-card ${a.isDefault ? 'default' : ''}`}>
                                        {a.isDefault && <span className="address-default-badge">За замовчуванням</span>}
                                        <div className="address-name">{a.name}</div>
                                        <div className="address-details">{a.city}, {a.warehouse}</div>
                                        <div className="address-actions"><button className="btn btn-sm btn-ghost">Редагувати</button><button className="btn btn-sm btn-ghost">Видалити</button></div>
                                    </div>
                                ))}</div>
                            ) : <div className="empty-state"><div className="empty-state-icon">📍</div><h3>Немає збережених адрес</h3></div>}
                        </section>
                    )}

                    {activeSection === 'settings' && (
                        <section className="account-section">
                            <div className="account-section-header"><h2 className="account-section-title">Налаштування</h2></div>
                            
                            {/* Theme Settings */}
                            <div className="settings-group">
                                <div className="settings-group-title">Зовнішній вигляд</div>
                                <div className="settings-item">
                                    <div className="settings-item-info">
                                        <div className="settings-item-label">🌙 Темна тема</div>
                                        <div className="settings-item-description">Переключитися на темний режим інтерфейсу</div>
                                    </div>
                                    <div 
                                        className={`toggle-switch ${settings.darkTheme ? 'active' : ''}`} 
                                        onClick={toggleDarkTheme}
                                    ></div>
                                </div>
                            </div>

                            {/* Notification Settings */}
                            <div className="settings-group">
                                <div className="settings-group-title">Сповіщення</div>
                                <div className="settings-item">
                                    <div className="settings-item-info">
                                        <div className="settings-item-label">Email сповіщення</div>
                                        <div className="settings-item-description">Отримувати новини та акції на email</div>
                                    </div>
                                    <div className={`toggle-switch ${settings.emailNotifications ? 'active' : ''}`} onClick={() => setSettings({ ...settings, emailNotifications: !settings.emailNotifications })}></div>
                                </div>
                                <div className="settings-item">
                                    <div className="settings-item-info">
                                        <div className="settings-item-label">SMS сповіщення</div>
                                        <div className="settings-item-description">Отримувати SMS про статус замовлення</div>
                                    </div>
                                    <div className={`toggle-switch ${settings.smsNotifications ? 'active' : ''}`} onClick={() => setSettings({ ...settings, smsNotifications: !settings.smsNotifications })}></div>
                                </div>
                            </div>

                            {/* Danger Zone */}
                            <div className="settings-group">
                                <div className="settings-group-title">Небезпечна зона</div>
                                <button className="btn" style={{ background: 'var(--color-error)', color: 'white' }}>Видалити акаунт</button>
                            </div>
                        </section>
                    )}
                </main>
            </div>
        </div>
    );
};

export default Account;
