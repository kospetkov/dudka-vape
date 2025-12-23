import { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import api from '../../utils/api';
import './OrderManagement.css';

const OrderManagement = () => {
    const { t } = useTranslation();
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [selectedOrder, setSelectedOrder] = useState(null);
    const [showModal, setShowModal] = useState(false);

    const STATUS_OPTIONS = ['pending', 'processing', 'shipped', 'delivered', 'cancelled'];
    const STATUS_COLORS = {
        pending: '#ffaa00',
        processing: '#00aaff',
        shipped: '#aa00ff',
        delivered: '#00ff00',
        cancelled: '#ff0000'
    };

    useEffect(() => {
        fetchOrders();
    }, []);

    const fetchOrders = async () => {
        try {
            setLoading(true);
            const response = await api.get('/admin/orders');
            setOrders(response.data);
        } catch (err) {
            setError('Failed to load orders');
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    const handleStatusChange = async (orderId, newStatus) => {
        try {
            await api.put(`/admin/orders/${orderId}`, { status: newStatus });
            fetchOrders();
            if (selectedOrder?._id === orderId) {
                setSelectedOrder(prev => ({ ...prev, status: newStatus }));
            }
        } catch (err) {
            setError('Failed to update order status');
        }
    };

    const viewOrderDetails = (order) => {
        setSelectedOrder(order);
        setShowModal(true);
    };

    const formatDate = (dateString) => {
        return new Date(dateString).toLocaleDateString('uk-UA', {
            year: 'numeric',
            month: 'long',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });
    };

    if (loading) return <div className="admin-loading">{t('common.loading')}</div>;

    return (
        <div className="order-management">
            <div className="om-header">
                <h1>{t('admin.orders')}</h1>
                <div className="om-stats">
                    <div className="stat-card">
                        <span className="stat-label">{t('admin.totalOrders')}</span>
                        <span className="stat-value">{orders.length}</span>
                    </div>
                    <div className="stat-card">
                        <span className="stat-label">{t('admin.pending')}</span>
                        <span className="stat-value">{orders.filter(o => o.status === 'pending').length}</span>
                    </div>
                    <div className="stat-card">
                        <span className="stat-label">{t('admin.processing')}</span>
                        <span className="stat-value">{orders.filter(o => o.status === 'processing').length}</span>
                    </div>
                </div>
            </div>

            {error && <div className="alert alert-error">{error}</div>}

            <div className="om-table-container">
                <table className="om-table">
                    <thead>
                        <tr>
                            <th>ID замовлення</th>
                            <th>Клієнт</th>
                            <th>Товари</th>
                            <th>Сума</th>
                            <th>{t('admin.orderStatus')}</th>
                            <th>Дата</th>
                            <th>Дії</th>
                        </tr>
                    </thead>
                    <tbody>
                        {orders.map(order => (
                            <tr key={order._id}>
                                <td className="order-id">#{order._id.slice(-8).toUpperCase()}</td>
                                <td>
                                    <div className="customer-info">
                                        <div>{order.user?.name || order.guestInfo?.name || 'Guest'}</div>
                                        <div className="customer-email">
                                            {order.user?.email || order.guestInfo?.email}
                                        </div>
                                    </div>
                                </td>
                                <td>{order.items.length} шт</td>
                                <td className="order-total">{order.total} грн</td>
                                <td>
                                    <select
                                        className="status-select"
                                        value={order.status}
                                        onChange={(e) => handleStatusChange(order._id, e.target.value)}
                                        style={{ borderColor: STATUS_COLORS[order.status] }}
                                    >
                                        {STATUS_OPTIONS.map(status => (
                                            <option key={status} value={status}>
                                                {t(`admin.${status}`)}
                                            </option>
                                        ))}
                                    </select>
                                </td>
                                <td>{formatDate(order.createdAt)}</td>
                                <td>
                                    <button
                                        className="btn-view"
                                        onClick={() => viewOrderDetails(order)}
                                    >
                                        Переглянути
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            {showModal && selectedOrder && (
                <div className="modal-overlay" onClick={() => setShowModal(false)}>
                    <div className="modal-content order-modal" onClick={e => e.stopPropagation()}>
                        <div className="modal-header">
                            <h2>Order Details - #{selectedOrder._id.slice(-8).toUpperCase()}</h2>
                            <button className="modal-close" onClick={() => setShowModal(false)}>&times;</button>
                        </div>

                        <div className="order-details">
                            {/* Customer Information */}
                            <div className="detail-section">
                                <h3>Customer Information</h3>
                                <div className="detail-grid">
                                    <div className="detail-item">
                                        <span className="detail-label">Name:</span>
                                        <span>{selectedOrder.user?.name || selectedOrder.guestInfo?.name}</span>
                                    </div>
                                    <div className="detail-item">
                                        <span className="detail-label">Email:</span>
                                        <span>{selectedOrder.user?.email || selectedOrder.guestInfo?.email}</span>
                                    </div>
                                    <div className="detail-item">
                                        <span className="detail-label">Phone:</span>
                                        <span>{selectedOrder.guestInfo?.phone || 'N/A'}</span>
                                    </div>
                                    <div className="detail-item">
                                        <span className="detail-label">Address:</span>
                                        <span>{selectedOrder.guestInfo?.address || 'N/A'}</span>
                                    </div>
                                </div>
                                {selectedOrder.guestInfo?.comment && (
                                    <div className="detail-item full-width">
                                        <span className="detail-label">Comment:</span>
                                        <p className="order-comment">{selectedOrder.guestInfo.comment}</p>
                                    </div>
                                )}
                            </div>

                            {/* Order Items */}
                            <div className="detail-section">
                                <h3>Order Items</h3>
                                <div className="order-items">
                                    {selectedOrder.items.map((item, index) => (
                                        <div key={index} className="order-item">
                                            <div className="item-name">{item.name?.ua || item.name}</div>
                                            <div className="item-details">
                                                <span>Quantity: {item.quantity}</span>
                                                <span>Price: {item.price} грн</span>
                                                <span className="item-total">
                                                    Total: {item.price * item.quantity} грн
                                                </span>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>

                            {/* Order Summary */}
                            <div className="detail-section">
                                <h3>Order Summary</h3>
                                <div className="order-summary">
                                    <div className="summary-row">
                                        <span>Subtotal:</span>
                                        <span>{selectedOrder.total - (selectedOrder.donationAmount || 0)} грн</span>
                                    </div>
                                    {selectedOrder.donationAmount > 0 && (
                                        <div className="summary-row">
                                            <span>Donation:</span>
                                            <span className="donation">{selectedOrder.donationAmount} грн</span>
                                        </div>
                                    )}
                                    <div className="summary-row total">
                                        <span>Total:</span>
                                        <span>{selectedOrder.total} грн</span>
                                    </div>
                                </div>
                            </div>

                            {/* Order Status */}
                            <div className="detail-section">
                                <h3>Update Status</h3>
                                <select
                                    className="status-select-large"
                                    value={selectedOrder.status}
                                    onChange={(e) => handleStatusChange(selectedOrder._id, e.target.value)}
                                    style={{ borderColor: STATUS_COLORS[selectedOrder.status] }}
                                >
                                    {STATUS_OPTIONS.map(status => (
                                        <option key={status} value={status}>
                                            {status.charAt(0).toUpperCase() + status.slice(1)}
                                        </option>
                                    ))}
                                </select>
                            </div>

                            {/* Order Meta */}
                            <div className="detail-section">
                                <h3>Order Information</h3>
                                <div className="detail-grid">
                                    <div className="detail-item">
                                        <span className="detail-label">Order ID:</span>
                                        <span className="order-id-full">{selectedOrder._id}</span>
                                    </div>
                                    <div className="detail-item">
                                        <span className="detail-label">Created:</span>
                                        <span>{formatDate(selectedOrder.createdAt)}</span>
                                    </div>
                                    <div className="detail-item">
                                        <span className="detail-label">Updated:</span>
                                        <span>{formatDate(selectedOrder.updatedAt)}</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default OrderManagement;
