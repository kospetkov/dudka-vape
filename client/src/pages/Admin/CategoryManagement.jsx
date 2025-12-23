import { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import api from '../../utils/api';
import './CategoryManagement.css';

const CategoryManagement = () => {
    const { t } = useTranslation();
    const [categories, setCategories] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [showModal, setShowModal] = useState(false);
    const [editingCategory, setEditingCategory] = useState(null);
    const [formData, setFormData] = useState({
        name: { ua: '', ru: '', en: '' },
        description: { ua: '', ru: '', en: '' },
        image: '',
        order: 0
    });

    useEffect(() => {
        fetchCategories();
    }, []);

    const fetchCategories = async () => {
        try {
            setLoading(true);
            const response = await api.get('/categories');
            setCategories(response.data);
        } catch (err) {
            setError('Failed to load categories');
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;

        if (name.includes('.')) {
            const [field, lang] = name.split('.');
            setFormData(prev => ({
                ...prev,
                [field]: {
                    ...prev[field],
                    [lang]: value
                }
            }));
        } else {
            setFormData(prev => ({
                ...prev,
                [name]: value
            }));
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const slug = formData.name.ua
                .toLowerCase()
                .replace(/[^a-z0-9а-яіїє\s-]/g, '')
                .replace(/\s+/g, '-');

            const categoryData = {
                ...formData,
                slug,
                order: Number(formData.order)
            };

            if (editingCategory) {
                await api.put(`/admin/categories/${editingCategory._id}`, categoryData);
            } else {
                await api.post('/admin/categories', categoryData);
            }

            setShowModal(false);
            resetForm();
            fetchCategories();
        } catch (err) {
            setError(err.response?.data?.message || 'Failed to save category');
        }
    };

    const handleEdit = (category) => {
        setEditingCategory(category);
        setFormData({
            name: category.name,
            description: category.description || { ua: '', ru: '', en: '' },
            image: category.image || '',
            order: category.order || 0
        });
        setShowModal(true);
    };

    const handleDelete = async (id) => {
        if (!window.confirm('Are you sure you want to delete this category?')) return;

        try {
            await api.delete(`/admin/categories/${id}`);
            fetchCategories();
        } catch (err) {
            setError('Failed to delete category');
        }
    };

    const resetForm = () => {
        setEditingCategory(null);
        setFormData({
            name: { ua: '', ru: '', en: '' },
            description: { ua: '', ru: '', en: '' },
            image: '',
            order: 0
        });
    };

    if (loading) return <div className="admin-loading">{t('common.loading')}</div>;

    return (
        <div className="category-management">
            <div className="cm-header">
                <h1>{t('admin.categories')}</h1>
                <button className="btn-primary" onClick={() => { resetForm(); setShowModal(true); }}>
                    Додати категорію
                </button>
            </div>

            {error && <div className="alert alert-error">{error}</div>}

            <div className="category-grid">
                {categories.map(category => (
                    <div key={category._id} className="category-card">
                        {category.image && (
                            <div className="category-image">
                                <img src={category.image} alt={category.name.ua} />
                            </div>
                        )}
                        <div className="category-content">
                            <h3>{category.name.ua}</h3>
                            <p className="category-slug">slug: {category.slug}</p>
                            {category.description?.ua && (
                                <p className="category-desc">{category.description.ua}</p>
                            )}
                            <div className="category-meta">
                                <span className="category-order">Порядок: {category.order}</span>
                            </div>
                        </div>
                        <div className="category-actions">
                            <button className="btn-edit" onClick={() => handleEdit(category)}>
                                {t('common.edit')}
                            </button>
                            <button className="btn-delete" onClick={() => handleDelete(category._id)}>
                                {t('common.delete')}
                            </button>
                        </div>
                    </div>
                ))}
            </div>

            {showModal && (
                <div className="modal-overlay" onClick={() => setShowModal(false)}>
                    <div className="modal-content" onClick={e => e.stopPropagation()}>
                        <div className="modal-header">
                            <h2>{editingCategory ? 'Редагувати категорію' : 'Додати категорію'}</h2>
                            <button className="modal-close" onClick={() => setShowModal(false)}>&times;</button>
                        </div>

                        <form onSubmit={handleSubmit} className="category-form">
                            <div className="form-section">
                                <h3>Назви категорії</h3>
                                <div className="form-group">
                                    <label>Назва (UA)*</label>
                                    <input
                                        type="text"
                                        name="name.ua"
                                        value={formData.name.ua}
                                        onChange={handleInputChange}
                                        required
                                    />
                                </div>
                                <div className="form-group">
                                    <label>Назва (RU)</label>
                                    <input
                                        type="text"
                                        name="name.ru"
                                        value={formData.name.ru}
                                        onChange={handleInputChange}
                                    />
                                </div>
                                <div className="form-group">
                                    <label>Назва (EN)</label>
                                    <input
                                        type="text"
                                        name="name.en"
                                        value={formData.name.en}
                                        onChange={handleInputChange}
                                    />
                                </div>
                            </div>

                            <div className="form-section">
                                <h3>Описи категорії</h3>
                                <div className="form-group">
                                    <label>Опис (UA)</label>
                                    <textarea
                                        name="description.ua"
                                        value={formData.description.ua}
                                        onChange={handleInputChange}
                                        rows="3"
                                    />
                                </div>
                                <div className="form-group">
                                    <label>Опис (RU)</label>
                                    <textarea
                                        name="description.ru"
                                        value={formData.description.ru}
                                        onChange={handleInputChange}
                                        rows="3"
                                    />
                                </div>
                                <div className="form-group">
                                    <label>Опис (EN)</label>
                                    <textarea
                                        name="description.en"
                                        value={formData.description.en}
                                        onChange={handleInputChange}
                                        rows="3"
                                    />
                                </div>
                            </div>

                            <div className="form-section">
                                <h3>Додаткові налаштування</h3>
                                <div className="form-group">
                                    <label>URL зображення</label>
                                    <input
                                        type="url"
                                        name="image"
                                        value={formData.image}
                                        onChange={handleInputChange}
                                        placeholder="https://example.com/image.jpg"
                                    />
                                </div>
                                <div className="form-group">
                                    <label>Порядок відображення</label>
                                    <input
                                        type="number"
                                        name="order"
                                        value={formData.order}
                                        onChange={handleInputChange}
                                        min="0"
                                    />
                                    <small>Менші числа з'являються першими</small>
                                </div>
                            </div>

                            <div className="modal-footer">
                                <button type="button" className="btn-secondary" onClick={() => setShowModal(false)}>
                                    {t('common.cancel')}
                                </button>
                                <button type="submit" className="btn-primary">
                                    {editingCategory ? 'Оновити категорію' : 'Створити категорію'}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};

export default CategoryManagement;
