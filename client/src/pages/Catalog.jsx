import { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import api from '../utils/api';
import ProductCard from '../components/ProductCard';
import './Catalog.css';

const Catalog = () => {
    const { t, i18n } = useTranslation();
    const [products, setProducts] = useState([]);
    const [categories, setCategories] = useState([]);
    const [brands, setBrands] = useState([]);
    const [loading, setLoading] = useState(true);
    const [filters, setFilters] = useState({
        category: '',
        brand: '',
        minPrice: '',
        maxPrice: '',
        search: ''
    });

    useEffect(() => {
        fetchCategories();
        fetchBrands();
    }, []);

    useEffect(() => {
        fetchProducts();
    }, [filters]);

    const fetchCategories = async () => {
        try {
            const response = await api.get('/categories');
            setCategories(response.data);
        } catch (error) {
            console.error('Error fetching categories:', error);
        }
    };

    const fetchBrands = async () => {
        try {
            const response = await api.get('/products/brands');
            setBrands(response.data);
        } catch (error) {
            console.error('Error fetching brands:', error);
        }
    };

    const fetchProducts = async () => {
        setLoading(true);
        try {
            const params = new URLSearchParams();
            if (filters.category) params.append('category', filters.category);
            if (filters.brand) params.append('brand', filters.brand);
            if (filters.minPrice) params.append('minPrice', filters.minPrice);
            if (filters.maxPrice) params.append('maxPrice', filters.maxPrice);
            if (filters.search) params.append('search', filters.search);

            const response = await api.get(`/products?${params.toString()}`);
            setProducts(response.data.products);
        } catch (error) {
            console.error('Error fetching products:', error);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="container catalog-container">
            <h1 className="mb-xl text-gradient">{t('catalog.title')}</h1>

            <div className="catalog-layout">
                {/* Filters Sidebar */}
                <div className="filters-sidebar">
                    <h3 className="mb-lg" style={{ borderBottom: '1px solid rgba(255,255,255,0.1)', paddingBottom: '10px' }}>
                        {t('catalog.filters')}
                    </h3>

                    <div className="filter-group">
                        <label className="filter-label">{t('catalog.search')}</label>
                        <input
                            type="text"
                            className="filter-input"
                            value={filters.search}
                            onChange={(e) => setFilters({ ...filters, search: e.target.value })}
                            placeholder={t('catalog.search')}
                        />
                    </div>

                    <div className="filter-group">
                        <label className="filter-label">{t('catalog.category')}</label>
                        <select
                            className="filter-select"
                            value={filters.category}
                            onChange={(e) => setFilters({ ...filters, category: e.target.value })}
                        >
                            <option value="">{t('catalog.allCategories')}</option>
                            {categories.map(cat => (
                                <option key={cat._id} value={cat._id}>{cat.name[i18n.language] || cat.name.ua}</option>
                            ))}
                        </select>
                    </div>

                    <div className="filter-group">
                        <label className="filter-label">{t('catalog.brand')}</label>
                        <select
                            className="filter-select"
                            value={filters.brand}
                            onChange={(e) => setFilters({ ...filters, brand: e.target.value })}
                        >
                            <option value="">{t('catalog.allBrands')}</option>
                            {brands.map(brand => (
                                <option key={brand} value={brand}>{brand}</option>
                            ))}
                        </select>
                    </div>

                    <div className="filter-group">
                        <label className="filter-label">{t('catalog.price')}</label>
                        <div className="price-inputs">
                            <input
                                type="number"
                                className="filter-input price-input"
                                placeholder={t('catalog.priceFrom')}
                                value={filters.minPrice}
                                onChange={(e) => setFilters({ ...filters, minPrice: e.target.value })}
                            />
                            <input
                                type="number"
                                className="filter-input price-input"
                                placeholder={t('catalog.priceTo')}
                                value={filters.maxPrice}
                                onChange={(e) => setFilters({ ...filters, maxPrice: e.target.value })}
                            />
                        </div>
                    </div>
                </div>

                {/* Products Grid */}
                <div>
                    {loading ? (
                        <div className="flex-center" style={{ padding: 'var(--spacing-3xl)' }}>
                            <div className="spinner"></div>
                        </div>
                    ) : products.length > 0 ? (
                        <div className="products-grid">
                            {products.map((product, index) => (
                                <div
                                    key={product._id}
                                    className="product-card-wrapper"
                                    style={{ animationDelay: `${index * 0.05}s` }}
                                >
                                    <ProductCard product={product} />
                                </div>
                            ))}
                        </div>
                    ) : (
                        <div className="no-products">
                            <p className="text-muted text-lg">{t('catalog.noProducts')}</p>
                            <button
                                className="btn btn-outline mt-md"
                                onClick={() => setFilters({ category: '', brand: '', minPrice: '', maxPrice: '', search: '' })}
                            >
                                {t('common.resetFilters', 'Скинути фільтри')}
                            </button>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default Catalog;
