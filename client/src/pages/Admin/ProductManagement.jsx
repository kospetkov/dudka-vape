import { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import api from '../../utils/api';
import './ProductManagement.css';

const ProductManagement = () => {
    const { t } = useTranslation();
    const [products, setProducts] = useState([]);
    const [categories, setCategories] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [showModal, setShowModal] = useState(false);
    const [editingProduct, setEditingProduct] = useState(null);
    const [formData, setFormData] = useState({
        name: { ua: '', ru: '', en: '' },
        description: { ua: '', ru: '', en: '' },
        price: '',
        category: '',
        brand: 'VAPORESSO',
        stock: 10,
        images: [{ url: '', alt: '' }],
        featured: false,
        active: true
    });

    useEffect(() => {
        fetchProducts();
        fetchCategories();
    }, []);

    const fetchProducts = async () => {
        try {
            setLoading(true);
            const response = await api.get('/products');
            setProducts(response.data.products || response.data);
        } catch (err) {
            setError('Failed to load products');
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    const fetchCategories = async () => {
        try {
            const response = await api.get('/categories');
            setCategories(response.data);
        } catch (err) {
            console.error('Failed to load categories:', err);
        }
    };

    const handleInputChange = (e) => {
        const { name, value, type, checked } = e.target;

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
                [name]: type === 'checkbox' ? checked : value
            }));
        }
    };

    const handleImageChange = (index, field, value) => {
        const newImages = [...formData.images];
        newImages[index] = { ...newImages[index], [field]: value };
        setFormData(prev => ({ ...prev, images: newImages }));
    };

    const addImageField = () => {
        setFormData(prev => ({
            ...prev,
            images: [...prev.images, { url: '', alt: '' }]
        }));
    };

    const removeImageField = (index) => {
        setFormData(prev => ({
            ...prev,
            images: prev.images.filter((_, i) => i !== index)
        }));
    };

    const handleImageUpload = async (index, file) => {
        if (!file) return;

        try {
            const formDataUpload = new FormData();
            formDataUpload.append('image', file);

            const response = await api.post('/upload', formDataUpload, {
                headers: {
                    'Content-Type': 'multipart/form-data'
                }
            });

            // Update the image URL with the uploaded URL
            handleImageChange(index, 'url', response.data.url);
            handleImageChange(index, 'alt', formData.name.ua || 'Product image');
        } catch (err) {
            console.error('Upload error:', err);
            setError('Помилка завантаження зображення');
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            // Generate slug from Ukrainian name
            const slug = formData.name.ua
                .toLowerCase()
                .replace(/[^a-z0-9а-яіїє\s-]/g, '')
                .replace(/\s+/g, '-');

            const productData = {
                ...formData,
                slug,
                price: Number(formData.price),
                stock: Number(formData.stock)
            };

            if (editingProduct) {
                await api.put(`/admin/products/${editingProduct._id}`, productData);
            } else {
                await api.post('/admin/products', productData);
            }

            setShowModal(false);
            resetForm();
            fetchProducts();
        } catch (err) {
            setError(err.response?.data?.message || 'Failed to save product');
        }
    };

    const handleEdit = (product) => {
        setEditingProduct(product);
        setFormData({
            name: product.name,
            description: product.description || { ua: '', ru: '', en: '' },
            price: product.price,
            category: product.category._id || product.category,
            brand: product.brand,
            stock: product.stock,
            images: product.images.length > 0 ? product.images : [{ url: '', alt: '' }],
            featured: product.featured,
            active: product.active
        });
        setShowModal(true);
    };

    const handleDelete = async (id) => {
        if (!window.confirm('Are you sure you want to delete this product?')) return;

        try {
            await api.delete(`/admin/products/${id}`);
            fetchProducts();
        } catch (err) {
            setError('Failed to delete product');
        }
    };

    const resetForm = () => {
        setEditingProduct(null);
        setFormData({
            name: { ua: '', ru: '', en: '' },
            description: { ua: '', ru: '', en: '' },
            price: '',
            category: '',
            brand: 'VAPORESSO',
            stock: 10,
            images: [{ url: '', alt: '' }],
            featured: false,
            active: true
        });
    };

    if (loading) return <div className="admin-loading">{t('common.loading')}</div>;

    return (
        <div className="product-management">
            <div className="pm-header">
                <h1>{t('admin.products')}</h1>
                <button className="btn-primary" onClick={() => { resetForm(); setShowModal(true); }}>
                    {t('admin.addProduct')}
                </button>
            </div>

            {error && <div className="alert alert-error">{error}</div>}

            <div className="pm-table-container">
                <table className="pm-table">
                    <thead>
                        <tr>
                            <th>Фото</th>
                            <th>Назва</th>
                            <th>{t('admin.productBrand')}</th>
                            <th>{t('admin.productPrice')}</th>
                            <th>{t('admin.productStock')}</th>
                            <th>{t('admin.productCategory')}</th>
                            <th>Статус</th>
                            <th>Дії</th>
                        </tr>
                    </thead>
                    <tbody>
                        {products.map(product => (
                            <tr key={product._id}>
                                <td>
                                    {product.images[0]?.url && (
                                        <img src={product.images[0].url} alt={product.name.ua} className="pm-thumb" />
                                    )}
                                </td>
                                <td>{product.name.ua}</td>
                                <td>{product.brand}</td>
                                <td>{product.price} грн</td>
                                <td className={product.stock === 0 ? 'out-of-stock' : ''}>{product.stock}</td>
                                <td>{product.category?.name?.ua || 'N/A'}</td>
                                <td>
                                    <span className={`status-badge ${product.active ? 'active' : 'inactive'}`}>
                                        {product.active ? 'Активний' : 'Неактивний'}
                                    </span>
                                </td>
                                <td>
                                    <div className="action-buttons">
                                        <button className="btn-edit" onClick={() => handleEdit(product)}>{t('common.edit')}</button>
                                        <button className="btn-delete" onClick={() => handleDelete(product._id)}>{t('common.delete')}</button>
                                    </div>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            {showModal && (
                <div className="modal-overlay" onClick={() => setShowModal(false)}>
                    <div className="modal-content" onClick={e => e.stopPropagation()}>
                        <div className="modal-header">
                            <h2>{editingProduct ? t('admin.editProduct') : t('admin.addProduct')}</h2>
                            <button className="modal-close" onClick={() => setShowModal(false)}>&times;</button>
                        </div>

                        <form onSubmit={handleSubmit} className="product-form">
                            <div className="form-section">
                                <h3>Назви товару</h3>
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
                                <h3>Деталі товару</h3>
                                <div className="form-row">
                                    <div className="form-group">
                                        <label>{t('admin.productPrice')} (грн)*</label>
                                        <input
                                            type="number"
                                            name="price"
                                            value={formData.price}
                                            onChange={handleInputChange}
                                            required
                                            min="0"
                                        />
                                    </div>
                                    <div className="form-group">
                                        <label>{t('admin.productStock')}*</label>
                                        <input
                                            type="number"
                                            name="stock"
                                            value={formData.stock}
                                            onChange={handleInputChange}
                                            required
                                            min="0"
                                        />
                                    </div>
                                </div>

                                <div className="form-row">
                                    <div className="form-group">
                                        <label>{t('admin.productBrand')}*</label>
                                        <input
                                            type="text"
                                            name="brand"
                                            value={formData.brand}
                                            onChange={handleInputChange}
                                            required
                                        />
                                    </div>
                                    <div className="form-group">
                                        <label>{t('admin.productCategory')}*</label>
                                        <select
                                            name="category"
                                            value={formData.category}
                                            onChange={handleInputChange}
                                            required
                                        >
                                            <option value="">Оберіть категорію</option>
                                            {categories.map(cat => (
                                                <option key={cat._id} value={cat._id}>{cat.name.ua}</option>
                                            ))}
                                        </select>
                                    </div>
                                </div>
                            </div>

                            <div className="form-section">
                                <h3>Зображення</h3>
                                {formData.images.map((image, index) => (
                                    <div key={index} className="image-field">
                                        <div className="image-field-row">
                                            <input
                                                type="url"
                                                placeholder="URL зображення або завантажте файл нижче"
                                                value={image.url}
                                                onChange={e => handleImageChange(index, 'url', e.target.value)}
                                            />
                                        </div>
                                        <div className="image-field-row">
                                            <input
                                                type="file"
                                                accept="image/*"
                                                onChange={e => handleImageUpload(index, e.target.files[0])}
                                                style={{ flex: 1 }}
                                            />
                                            <span style={{ color: 'var(--text-secondary)', fontSize: '0.875rem', padding: 'var(--spacing-sm)' }}>
                                                або
                                            </span>
                                        </div>
                                        <div className="image-field-row">
                                            <input
                                                type="text"
                                                placeholder="Альт текст"
                                                value={image.alt}
                                                onChange={e => handleImageChange(index, 'alt', e.target.value)}
                                            />
                                            {formData.images.length > 1 && (
                                                <button type="button" onClick={() => removeImageField(index)} className="btn-remove">
                                                    Видалити
                                                </button>
                                            )}
                                        </div>
                                        {image.url && (
                                            <div className="image-preview">
                                                <img src={image.url} alt="Preview" style={{ maxWidth: '200px', maxHeight: '200px', objectFit: 'cover', borderRadius: 'var(--radius-sm)' }} />
                                            </div>
                                        )}
                                    </div>
                                ))}
                                <button type="button" onClick={addImageField} className="btn-add">
                                    Додати зображення
                                </button>
                            </div>

                            <div className="form-section">
                                <h3>Опції</h3>
                                <div className="form-checkboxes">
                                    <label>
                                        <input
                                            type="checkbox"
                                            name="featured"
                                            checked={formData.featured}
                                            onChange={handleInputChange}
                                        />
                                        Рекомендований товар
                                    </label>
                                    <label>
                                        <input
                                            type="checkbox"
                                            name="active"
                                            checked={formData.active}
                                            onChange={handleInputChange}
                                        />
                                        Активний
                                    </label>
                                </div>
                            </div>

                            <div className="modal-footer">
                                <button type="button" className="btn-secondary" onClick={() => setShowModal(false)}>
                                    {t('common.cancel')}
                                </button>
                                <button type="submit" className="btn-primary">
                                    {editingProduct ? 'Оновити товар' : 'Створити товар'}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};

export default ProductManagement;
