import { useState, useEffect } from 'react';
import api from '../../utils/api';
import './ContactMessages.css';

const ContactMessages = () => {
    const [messages, setMessages] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [filter, setFilter] = useState('all');
    const [selectedMessage, setSelectedMessage] = useState(null);
    const [newCount, setNewCount] = useState(0);

    useEffect(() => {
        fetchMessages();
    }, [filter]);

    const fetchMessages = async () => {
        try {
            setLoading(true);
            const res = await api.get(`/contact?status=${filter}`);
            setMessages(res.data.messages);
            setNewCount(res.data.newCount);
        } catch (err) {
            setError(err.response?.data?.message || 'Помилка завантаження');
        } finally {
            setLoading(false);
        }
    };

    const updateStatus = async (id, status) => {
        try {
            await api.patch(`/contact/${id}`, { status });
            setMessages(messages.map(m => 
                m._id === id ? { ...m, status } : m
            ));
            if (status !== 'new') {
                setNewCount(prev => Math.max(0, prev - 1));
            }
            if (selectedMessage?._id === id) {
                setSelectedMessage({ ...selectedMessage, status });
            }
        } catch (err) {
            alert('Помилка оновлення статусу');
        }
    };

    const deleteMessage = async (id) => {
        if (!window.confirm('Видалити повідомлення?')) return;
        
        try {
            await api.delete(`/contact/${id}`);
            setMessages(messages.filter(m => m._id !== id));
            if (selectedMessage?._id === id) {
                setSelectedMessage(null);
            }
        } catch (err) {
            alert('Помилка видалення');
        }
    };

    const formatDate = (date) => {
        return new Date(date).toLocaleDateString('uk-UA', {
            day: 'numeric',
            month: 'short',
            year: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });
    };

    const getStatusBadge = (status) => {
        const badges = {
            new: { label: 'Нове', class: 'status-new' },
            read: { label: 'Прочитано', class: 'status-read' },
            replied: { label: 'Відповідь надіслано', class: 'status-replied' },
            archived: { label: 'Архів', class: 'status-archived' }
        };
        return badges[status] || badges.new;
    };

    const openMessage = (message) => {
        setSelectedMessage(message);
        if (message.status === 'new') {
            updateStatus(message._id, 'read');
        }
    };

    if (loading && messages.length === 0) {
        return (
            <div className="contact-messages">
                <div className="loading-container">
                    <div className="loading-spinner"></div>
                </div>
            </div>
        );
    }

    return (
        <div className="contact-messages">
            <div className="cm-header">
                <div>
                    <h1>📬 Повідомлення</h1>
                    <p className="cm-subtitle">
                        {newCount > 0 && <span className="cm-new-badge">{newCount} нових</span>}
                        Всього: {messages.length}
                    </p>
                </div>
                <div className="cm-filters">
                    {['all', 'new', 'read', 'replied', 'archived'].map(status => (
                        <button
                            key={status}
                            className={`cm-filter-btn ${filter === status ? 'active' : ''}`}
                            onClick={() => setFilter(status)}
                        >
                            {status === 'all' && 'Всі'}
                            {status === 'new' && '🔴 Нові'}
                            {status === 'read' && 'Прочитані'}
                            {status === 'replied' && 'Відповіді'}
                            {status === 'archived' && 'Архів'}
                        </button>
                    ))}
                </div>
            </div>

            {error && <div className="alert alert-error">{error}</div>}

            <div className="cm-layout">
                {/* Messages List */}
                <div className="cm-list">
                    {messages.length === 0 ? (
                        <div className="cm-empty">
                            <span>📭</span>
                            <p>Повідомлень немає</p>
                        </div>
                    ) : (
                        messages.map(message => (
                            <div
                                key={message._id}
                                className={`cm-item ${selectedMessage?._id === message._id ? 'selected' : ''} ${message.status === 'new' ? 'unread' : ''}`}
                                onClick={() => openMessage(message)}
                            >
                                <div className="cm-item-header">
                                    <span className="cm-item-name">{message.name}</span>
                                    <span className="cm-item-date">{formatDate(message.createdAt)}</span>
                                </div>
                                <div className="cm-item-email">{message.email}</div>
                                {message.subject && (
                                    <div className="cm-item-subject">{message.subject}</div>
                                )}
                                <div className="cm-item-preview">
                                    {message.message.slice(0, 80)}...
                                </div>
                                <span className={`cm-status-badge ${getStatusBadge(message.status).class}`}>
                                    {getStatusBadge(message.status).label}
                                </span>
                            </div>
                        ))
                    )}
                </div>

                {/* Message Detail */}
                <div className="cm-detail">
                    {selectedMessage ? (
                        <>
                            <div className="cm-detail-header">
                                <div>
                                    <h2>{selectedMessage.name}</h2>
                                    <a href={`mailto:${selectedMessage.email}`} className="cm-detail-email">
                                        {selectedMessage.email}
                                    </a>
                                    {selectedMessage.phone && (
                                        <a href={`tel:${selectedMessage.phone}`} className="cm-detail-phone">
                                            {selectedMessage.phone}
                                        </a>
                                    )}
                                </div>
                                <span className="cm-detail-date">{formatDate(selectedMessage.createdAt)}</span>
                            </div>

                            {selectedMessage.subject && (
                                <div className="cm-detail-subject">
                                    <strong>Тема:</strong> {selectedMessage.subject}
                                </div>
                            )}

                            <div className="cm-detail-message">
                                {selectedMessage.message}
                            </div>

                            <div className="cm-detail-actions">
                                <div className="cm-status-actions">
                                    <span>Статус:</span>
                                    <select
                                        value={selectedMessage.status}
                                        onChange={(e) => updateStatus(selectedMessage._id, e.target.value)}
                                        className="cm-status-select"
                                    >
                                        <option value="new">Нове</option>
                                        <option value="read">Прочитано</option>
                                        <option value="replied">Відповідь надіслано</option>
                                        <option value="archived">Архів</option>
                                    </select>
                                </div>

                                <div className="cm-action-buttons">
                                    <a
                                        href={`mailto:${selectedMessage.email}?subject=Re: ${selectedMessage.subject || 'Ваше звернення до DUDKA'}`}
                                        className="btn btn-primary"
                                    >
                                        ✉️ Відповісти
                                    </a>
                                    <button
                                        className="btn btn-danger"
                                        onClick={() => deleteMessage(selectedMessage._id)}
                                    >
                                        🗑️ Видалити
                                    </button>
                                </div>
                            </div>
                        </>
                    ) : (
                        <div className="cm-detail-empty">
                            <span>📧</span>
                            <p>Виберіть повідомлення для перегляду</p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default ContactMessages;
