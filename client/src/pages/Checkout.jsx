import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import { getCheckoutForm, saveCheckoutForm, clearCheckoutForm } from '../utils/localStorage';
import api from '../utils/api';

const Checkout = () => {
    const { t, i18n } = useTranslation();
    const navigate = useNavigate();
    const { cart, getCartTotal, clearCart } = useCart();
    const { isAuthenticated, user } = useAuth();
    const lang = i18n.language;

    const [formData, setFormData] = useState(getCheckoutForm() || {
        name: user?.name || '',
        email: user?.email || '',
        phone: user?.phone || '',
        address: '',
        comment: ''
    });
    const [donationAmount, setDonationAmount] = useState(0);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        saveCheckoutForm(formData);
    }, [formData]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);

        try {
            const orderData = {
                items: cart.map(item => ({
                    product: item.product._id,
                    quantity: item.quantity,
                    price: item.product.price,
                    name: item.product.name
                })),
                total: getCartTotal() + donationAmount,
                donationAmount,
                guestInfo: !isAuthenticated ? formData : undefined
            };

            const response = await api.post('/orders', orderData);

            clearCart();
            clearCheckoutForm();
            alert(t('checkout.orderSuccess') + ' #' + response.data._id);
            navigate('/');
        } catch (error) {
            alert(t('common.error') + ': ' + (error.response?.data?.message || error.message));
        } finally {
            setLoading(false);
        }
    };

    if (cart.length === 0) {
        return (
            <div className="container text-center" style={{ paddingTop: 'var(--spacing-3xl)' }}>
                <h2>{t('cart.empty')}</h2>
                <button onClick={() => navigate('/catalog')} className="btn btn-primary mt-md">
                    {t('cart.continueShopping')}
                </button>
            </div>
        );
    }

    return (
        <div className="container" style={{ paddingTop: 'var(--spacing-2xl)', paddingBottom: 'var(--spacing-2xl)' }}>
            <h1 className="mb-lg">{t('checkout.title')}</h1>

            <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: 'var(--spacing-xl)' }}>
                <form onSubmit={handleSubmit}>
                    <div className="card mb-lg">
                        <h3 className="mb-md">{t('checkout.contactInfo')}</h3>

                        <div className="mb-md">
                            <label className="text-small text-muted">{t('checkout.name')}</label>
                            <input
                                type="text"
                                className="input"
                                value={formData.name}
                                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                required
                            />
                        </div>

                        <div className="mb-md">
                            <label className="text-small text-muted">{t('checkout.email')}</label>
                            <input
                                type="email"
                                className="input"
                                value={formData.email}
                                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                                required
                            />
                        </div>

                        <div className="mb-md">
                            <label className="text-small text-muted">{t('checkout.phone')}</label>
                            <input
                                type="tel"
                                className="input"
                                value={formData.phone}
                                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                                required
                            />
                        </div>

                        <div className="mb-md">
                            <label className="text-small text-muted">{t('checkout.address')}</label>
                            <textarea
                                className="textarea"
                                value={formData.address}
                                onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                                required
                            />
                        </div>

                        <div className="mb-md">
                            <label className="text-small text-muted">{t('checkout.comment')}</label>
                            <textarea
                                className="textarea"
                                value={formData.comment}
                                onChange={(e) => setFormData({ ...formData, comment: e.target.value })}
                            />
                        </div>
                    </div>

                    <div className="card mb-lg">
                        <h3 className="mb-md">{t('cart.donation')}</h3>
                        <p className="text-muted text-small mb-md">{t('cart.donationDescription')}</p>
                        <input
                            type="number"
                            className="input"
                            min="0"
                            value={donationAmount}
                            onChange={(e) => setDonationAmount(parseInt(e.target.value) || 0)}
                            placeholder={t('cart.donationAmount')}
                        />
                    </div>

                    <button type="submit" className="btn btn-primary btn-lg" style={{ width: '100%' }} disabled={loading}>
                        {loading ? t('common.loading') : t('checkout.placeOrder')}
                    </button>
                </form>

                <div>
                    <div className="card">
                        <h3 className="mb-md">{t('checkout.orderSummary')}</h3>

                        {cart.map(item => (
                            <div key={item.product._id} className="flex-between mb-sm">
                                <span className="text-small">{item.product.name[lang]} x{item.quantity}</span>
                                <span className="text-small">{item.product.price * item.quantity} ₴</span>
                            </div>
                        ))}

                        <hr style={{ margin: 'var(--spacing-md) 0', border: 'none', borderTop: '1px solid var(--color-border)' }} />

                        <div className="flex-between mb-sm">
                            <span>{t('checkout.subtotal')}</span>
                            <span>{getCartTotal()} ₴</span>
                        </div>

                        {donationAmount > 0 && (
                            <div className="flex-between mb-sm">
                                <span>{t('checkout.donation')}</span>
                                <span>{donationAmount} ₴</span>
                            </div>
                        )}

                        <div className="flex-between mt-md" style={{ fontSize: 'var(--font-size-lg)', fontWeight: 600 }}>
                            <span>{t('checkout.total')}</span>
                            <span style={{ color: 'var(--color-primary)' }}>{getCartTotal() + donationAmount} ₴</span>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Checkout;
