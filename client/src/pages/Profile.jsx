import { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { useAuth } from '../context/AuthContext';
import api from '../utils/api';

const Profile = () => {
    const { t, i18n } = useTranslation();
    const { user } = useAuth();
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);
    const lang = i18n.language;

    useEffect(() => {
        const fetchOrders = async () => {
            try {
                const response = await api.get('/orders/my');
                setOrders(response.data);
            } catch (error) {
                console.error('Error fetching orders:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchOrders();
    }, []);

    return (
        <div className="container" style={{ paddingTop: 'var(--spacing-2xl)', paddingBottom: 'var(--spacing-2xl)' }}>
            <h1 className="mb-lg">{t('profile.title')}</h1>

            <div className="card mb-lg">
                <h3 className="mb-md">{t('profile.personalInfo')}</h3>
                <p><strong>{t('auth.name')}:</strong> {user?.name}</p>
                <p><strong>{t('auth.email')}:</strong> {user?.email}</p>
                <p><strong>{t('auth.phone')}:</strong> {user?.phone}</p>
            </div>

            <div className="card">
                <h3 className="mb-md">{t('profile.orderHistory')}</h3>

                {loading ? (
                    <div className="flex-center" style={{ padding: 'var(--spacing-xl)' }}>
                        <div className="spinner"></div>
                    </div>
                ) : orders.length > 0 ? (
                    <div>
                        {orders.map(order => (
                            <div key={order._id} className="card mb-md" style={{ background: 'var(--color-bg-secondary)' }}>
                                <div className="flex-between mb-sm">
                                    <span className="text-small text-muted">
                                        {new Date(order.createdAt).toLocaleDateString()}
                                    </span>
                                    <span className="badge">{order.status}</span>
                                </div>
                                <div className="flex-between">
                                    <span>{order.items.length} {t('cart.items')}</span>
                                    <span className="font-weight-600">{order.total} ₴</span>
                                </div>
                                {order.donationAmount > 0 && (
                                    <p className="text-small text-muted mt-sm">
                                        {t('cart.donation')}: {order.donationAmount} ₴
                                    </p>
                                )}
                            </div>
                        ))}
                    </div>
                ) : (
                    <p className="text-muted">{t('profile.noOrders')}</p>
                )}
            </div>
        </div>
    );
};

export default Profile;
