import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import api from '../../utils/api';

const AdminDashboard = () => {
    const { t } = useTranslation();
    const [stats, setStats] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchStats = async () => {
            try {
                const response = await api.get('/admin/stats');
                setStats(response.data);
            } catch (error) {
                console.error('Error fetching stats:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchStats();
    }, []);

    if (loading) {
        return (
            <div className="container flex-center" style={{ minHeight: '50vh' }}>
                <div className="spinner"></div>
            </div>
        );
    }

    return (
        <div className="container" style={{ paddingTop: 'var(--spacing-2xl)', paddingBottom: 'var(--spacing-2xl)' }}>
            <h1 className="mb-lg">{t('admin.dashboard')}</h1>

            <div className="grid grid-4 mb-xl">
                <div className="card text-center">
                    <h3>{stats?.totalUsers || 0}</h3>
                    <p className="text-muted">{t('admin.totalUsers')}</p>
                </div>
                <div className="card text-center">
                    <h3>{stats?.totalProducts || 0}</h3>
                    <p className="text-muted">{t('admin.totalProducts')}</p>
                </div>
                <div className="card text-center">
                    <h3>{stats?.totalOrders || 0}</h3>
                    <p className="text-muted">{t('admin.totalOrders')}</p>
                </div>
                <div className="card text-center">
                    <h3>{stats?.totalRevenue || 0} ₴</h3>
                    <p className="text-muted">{t('admin.totalRevenue')}</p>
                </div>
            </div>

            <div className="grid grid-2">
                <Link to="/admin/products" className="card" style={{ textDecoration: 'none' }}>
                    <h3>📦 {"Товари"}</h3>
                    <p className="text-muted">Управління товарами</p>
                </Link>
                <Link to="/admin/categories" className="card" style={{ textDecoration: 'none' }}>
                    <h3>🎯 {"Категорії"}</h3>
                    <p className="text-muted">Управління категоріями</p>
                </Link>
                <Link to="/admin/orders" className="card" style={{ textDecoration: 'none' }}>
                    <h3>📄 {"Замовлення"}</h3>
                    <p className="text-muted">Управління замовленнями</p>
                </Link>
                <Link to="/admin/users" className="card" style={{ textDecoration: 'none' }}>
                    <h3>👥 {"Користувачі"}</h3>
                    <p className="text-muted">Управління користувачами</p>
                </Link>
                <Link to="/admin/messages" className="card" style={{ textDecoration: 'none' }}>
                    <h3>📬 {"Повідомлення"}</h3>
                    <p className="text-muted">Звернення з форми контактів</p>
                </Link>
                <Link to="/admin/settings" className="card" style={{ textDecoration: 'none', gridColumn: '1 / -1' }}>
                    <h3>⚙️ {"Налаштування магазину"}</h3>
                    <p className="text-muted">Логотип, назва, промо-блоки, контакти</p>
                </Link>
            </div>
        </div>
    );
};

export default AdminDashboard;
