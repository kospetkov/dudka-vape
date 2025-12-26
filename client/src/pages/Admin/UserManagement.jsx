import { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import api from '../../utils/api';
import './UserManagement.css';

const UserManagement = () => {
    const { t } = useTranslation();
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [editingUser, setEditingUser] = useState(null);
    const [searchTerm, setSearchTerm] = useState('');

    useEffect(() => {
        fetchUsers();
    }, []);

    const fetchUsers = async () => {
        try {
            setLoading(true);
            const res = await api.get('/admin/users');
            setUsers(res.data);
        } catch (err) {
            setError(err.response?.data?.message || 'Помилка завантаження');
        } finally {
            setLoading(false);
        }
    };

    const handleRoleChange = async (userId, newRole) => {
        try {
            await api.put(`/admin/users/${userId}`, { role: newRole });
            setUsers(users.map(u => u._id === userId ? { ...u, role: newRole } : u));
            setEditingUser(null);
        } catch (err) {
            alert(err.response?.data?.message || 'Помилка оновлення');
        }
    };

    const handleDelete = async (userId) => {
        if (!window.confirm('Видалити користувача? Цю дію неможливо скасувати.')) return;
        
        try {
            await api.delete(`/admin/users/${userId}`);
            setUsers(users.filter(u => u._id !== userId));
        } catch (err) {
            alert(err.response?.data?.message || 'Помилка видалення');
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

    const filteredUsers = users.filter(user => 
        user.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        user.email?.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const getRoleBadgeClass = (role) => {
        switch (role) {
            case 'admin': return 'role-badge admin';
            case 'manager': return 'role-badge manager';
            default: return 'role-badge user';
        }
    };

    const getRoleLabel = (role) => {
        switch (role) {
            case 'admin': return 'Адмін';
            case 'manager': return 'Менеджер';
            default: return 'Користувач';
        }
    };

    if (loading) {
        return (
            <div className="user-management">
                <div className="loading-container">
                    <div className="loading-spinner"></div>
                </div>
            </div>
        );
    }

    return (
        <div className="user-management">
            <div className="um-header">
                <div>
                    <h1>{t('admin.users')}</h1>
                    <p className="um-subtitle">Всього: {users.length} користувачів</p>
                </div>
                <div className="um-search">
                    <input
                        type="text"
                        placeholder="Пошук за ім'ям або email..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="um-search-input"
                    />
                </div>
            </div>

            {error && <div className="alert alert-error">{error}</div>}

            <div className="um-table-container">
                <table className="um-table">
                    <thead>
                        <tr>
                            <th>Користувач</th>
                            <th>Email</th>
                            <th>Телефон</th>
                            <th>Роль</th>
                            <th>Дата реєстрації</th>
                            <th>Дії</th>
                        </tr>
                    </thead>
                    <tbody>
                        {filteredUsers.length === 0 ? (
                            <tr>
                                <td colSpan="6" className="um-empty">
                                    {searchTerm ? 'Нічого не знайдено' : 'Користувачів поки немає'}
                                </td>
                            </tr>
                        ) : (
                            filteredUsers.map(user => (
                                <tr key={user._id}>
                                    <td>
                                        <div className="um-user-cell">
                                            <div className="um-avatar">
                                                {user.name?.charAt(0)?.toUpperCase() || 'U'}
                                            </div>
                                            <span className="um-name">{user.name || 'Без імені'}</span>
                                        </div>
                                    </td>
                                    <td>{user.email}</td>
                                    <td>{user.phone || '—'}</td>
                                    <td>
                                        {editingUser === user._id ? (
                                            <select
                                                value={user.role}
                                                onChange={(e) => handleRoleChange(user._id, e.target.value)}
                                                onBlur={() => setEditingUser(null)}
                                                autoFocus
                                                className="um-role-select"
                                            >
                                                <option value="user">Користувач</option>
                                                <option value="manager">Менеджер</option>
                                                <option value="admin">Адмін</option>
                                            </select>
                                        ) : (
                                            <span 
                                                className={getRoleBadgeClass(user.role)}
                                                onClick={() => setEditingUser(user._id)}
                                                title="Клікніть щоб змінити"
                                            >
                                                {getRoleLabel(user.role)}
                                            </span>
                                        )}
                                    </td>
                                    <td>{formatDate(user.createdAt)}</td>
                                    <td>
                                        <div className="um-actions">
                                            <button
                                                className="btn-icon btn-edit"
                                                onClick={() => setEditingUser(user._id)}
                                                title="Змінити роль"
                                            >
                                                ✏️
                                            </button>
                                            <button
                                                className="btn-icon btn-delete"
                                                onClick={() => handleDelete(user._id)}
                                                title="Видалити"
                                            >
                                                🗑️
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default UserManagement;
