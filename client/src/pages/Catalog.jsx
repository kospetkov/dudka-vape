import { useState, useEffect, useCallback } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import ProductCard from '../components/UI/ProductCard';
import { useWishlist } from '../context/WishlistContext';
import api from '../utils/api';
import './Catalog.css';

const Catalog = () => {
    const [searchParams, setSearchParams] = useSearchParams();
    const { isInWishlist, toggleWishlist } = useWishlist();
    const [products, setProducts] = useState([]);
    const [categories, setCategories] = useState([]);
    const [brands, setBrands] = useState([]);
    const [loading, setLoading] = useState(true);
    const [totalProducts, setTotalProducts] = useState(0);
    const [totalPages, setTotalPages] = useState(1);
    
    // Filter states from URL
    const [filters, setFilters] = useState({
        search: searchParams.get('search') || '',
        category: searchParams.get('category') || '',
        brand: searchParams.get('brand') || '',
        minPrice: searchParams.get('minPrice') || '',
        maxPrice: searchParams.get('maxPrice') || '',
        inStock: searchParams.get('inStock') === 'true',
        sort: searchParams.get('sort') || 'newest',
        page: parseInt(searchParams.get('page')) || 1,
    });
    
    const [gridColumns, setGridColumns] = useState(4);
    const [mobileFiltersOpen, setMobileFiltersOpen] = useState(false);

    // Fetch categories and brands
    useEffect(() => {
        const fetchFiltersData = async () => {
            try {
                const [catRes, brandRes] = await Promise.all([
                    api.get('/categories'),
                    api.get('/products/brands')
                ]);
                setCategories(catRes.data || []);
                setBrands(brandRes.data || []);
            } catch (err) {
                console.error('Failed to fetch filter data:', err);
            }
        };
        fetchFiltersData();
    }, []);

    // Fetch products
    const fetchProducts = useCallback(async () => {
        setLoading(true);
        try {
            const params = new URLSearchParams();
            
            if (filters.search) params.append('search', filters.search);
            if (filters.category) params.append('category', filters.category);
            if (filters.brand) params.append('brand', filters.brand);
            if (filters.minPrice) params.append('minPrice', filters.minPrice);
            if (filters.maxPrice) params.append('maxPrice', filters.maxPrice);
            if (filters.inStock) params.append('inStock', 'true');
            params.append('page', filters.page);
            params.append('limit', 12);
            
            const sortMap = {
                'newest': '-createdAt',
                'price_asc': 'price',
                'price_desc': '-price',
                'popular': '-views'
            };
            if (filters.sort) params.append('sort', sortMap[filters.sort] || '-createdAt');

            const res = await api.get(`/products?${params.toString()}`);
            setProducts(res.data.products || []);
            setTotalProducts(res.data.total || 0);
            setTotalPages(res.data.totalPages || 1);
        } catch (err) {
            console.error('Failed to fetch products:', err);
            setProducts([]);
        } finally {
            setLoading(false);
        }
    }, [filters]);

    useEffect(() => {
        fetchProducts();
    }, [fetchProducts]);

    // Update URL params
    useEffect(() => {
        const params = new URLSearchParams();
        Object.entries(filters).forEach(([key, value]) => {
            if (value && value !== '' && value !== false && !(key === 'page' && value === 1)) {
                params.set(key, value);
            }
        });
        setSearchParams(params, { replace: true });
    }, [filters, setSearchParams]);

    const updateFilter = (key, value) => {
        setFilters(prev => ({
            ...prev,
            [key]: value,
            page: key !== 'page' ? 1 : value
        }));
    };

    const resetFilters = () => {
        setFilters({
            search: '',
            category: '',
            brand: '',
            minPrice: '',
            maxPrice: '',
            inStock: false,
            sort: 'newest',
            page: 1,
        });
    };

    const activeFiltersCount = [
        filters.search,
        filters.category,
        filters.brand,
        filters.minPrice,
        filters.maxPrice,
        filters.inStock,
    ].filter(Boolean).length;

    const getCategoryName = (cat) => {
        if (!cat) return '';
        if (typeof cat.name === 'object') {
            return cat.name.ua || cat.name.ru || cat.name.en;
        }
        return cat.name || cat.slug;
    };

    const closeMobileFilters = () => setMobileFiltersOpen(false);

    // Pagination range
    const getPaginationRange = () => {
        const range = [];
        const delta = 2;
        const left = Math.max(1, filters.page - delta);
        const right = Math.min(totalPages, filters.page + delta);

        if (left > 1) {
            range.push(1);
            if (left > 2) range.push('...');
        }

        for (let i = left; i <= right; i++) {
            range.push(i);
        }

        if (right < totalPages) {
            if (right < totalPages - 1) range.push('...');
            range.push(totalPages);
        }

        return range;
    };

    return (
        <div className="catalog-page">
            {/* Top Bar */}
            <div className="catalog-topbar">
                <div className="catalog-topbar-left">
                    <div className="catalog-breadcrumbs">
                        <Link to="/">Головна</Link>
                        <span className="breadcrumb-sep">/</span>
                        <span>Каталог</span>
                    </div>
                    <span className="catalog-results-count">
                        Знайдено <strong>{totalProducts}</strong> товарів
                    </span>
                </div>
                
                <div className="catalog-topbar-right">
                    <div className="catalog-sort">
                        <select 
                            value={filters.sort} 
                            onChange={(e) => updateFilter('sort', e.target.value)}
                        >
                            <option value="newest">Новинки</option>
                            <option value="popular">За популярністю</option>
                            <option value="price_asc">Ціна ↑</option>
                            <option value="price_desc">Ціна ↓</option>
                        </select>
                    </div>

                    <div className="catalog-view-toggle">
                        {[2, 3, 4].map(cols => (
                            <button 
                                key={cols}
                                className={gridColumns === cols ? 'active' : ''} 
                                onClick={() => setGridColumns(cols)}
                                title={`${cols} колонки`}
                            >
                                {cols}
                            </button>
                        ))}
                    </div>
                </div>
            </div>

            {/* Mobile Filter Button */}
            <button 
                className="catalog-mobile-filter-btn"
                onClick={() => setMobileFiltersOpen(true)}
            >
                <span>🎛️ Фільтри</span>
                {activeFiltersCount > 0 && (
                    <span className="filter-badge">{activeFiltersCount}</span>
                )}
            </button>

            <div className="catalog-content">
                {/* Sidebar Overlay */}
                {mobileFiltersOpen && (
                    <div className="catalog-overlay" onClick={closeMobileFilters} />
                )}

                {/* Sidebar Filters */}
                <aside className={`catalog-sidebar ${mobileFiltersOpen ? 'open' : ''}`}>
                    <div className="sidebar-header">
                        <h3>Фільтри</h3>
                        <button className="sidebar-close" onClick={closeMobileFilters}>✕</button>
                    </div>

                    {/* Search */}
                    <div className="filter-group">
                        <div className="filter-search">
                            <span className="search-icon">🔍</span>
                            <input
                                type="text"
                                placeholder="Пошук товарів..."
                                value={filters.search}
                                onChange={(e) => updateFilter('search', e.target.value)}
                            />
                        </div>
                    </div>

                    {/* Categories */}
                    {categories.length > 0 && (
                        <div className="filter-group">
                            <h4 className="filter-title">Категорії</h4>
                            <div className="filter-options">
                                {categories.map(cat => (
                                    <label key={cat._id} className="filter-checkbox">
                                        <input
                                            type="checkbox"
                                            checked={filters.category === cat._id}
                                            onChange={() => updateFilter('category', filters.category === cat._id ? '' : cat._id)}
                                        />
                                        <span className="checkmark"></span>
                                        <span className="label-text">{getCategoryName(cat)}</span>
                                    </label>
                                ))}
                            </div>
                        </div>
                    )}

                    {/* Brands */}
                    {brands.length > 0 && (
                        <div className="filter-group">
                            <h4 className="filter-title">Бренд</h4>
                            <div className="filter-options">
                                {brands.map(brand => (
                                    <label key={brand} className="filter-checkbox">
                                        <input
                                            type="checkbox"
                                            checked={filters.brand === brand}
                                            onChange={() => updateFilter('brand', filters.brand === brand ? '' : brand)}
                                        />
                                        <span className="checkmark"></span>
                                        <span className="label-text">{brand}</span>
                                    </label>
                                ))}
                            </div>
                        </div>
                    )}

                    {/* Price Range */}
                    <div className="filter-group">
                        <h4 className="filter-title">Ціна, ₴</h4>
                        <div className="filter-price-range">
                            <input
                                type="number"
                                placeholder="Від"
                                value={filters.minPrice}
                                onChange={(e) => updateFilter('minPrice', e.target.value)}
                            />
                            <span className="price-separator">—</span>
                            <input
                                type="number"
                                placeholder="До"
                                value={filters.maxPrice}
                                onChange={(e) => updateFilter('maxPrice', e.target.value)}
                            />
                        </div>
                    </div>

                    {/* In Stock Toggle */}
                    <div className="filter-group">
                        <label className="filter-toggle">
                            <span className="toggle-label">Тільки в наявності</span>
                            <div 
                                className={`toggle-switch ${filters.inStock ? 'active' : ''}`}
                                onClick={() => updateFilter('inStock', !filters.inStock)}
                            >
                                <span className="toggle-knob"></span>
                            </div>
                        </label>
                    </div>

                    {/* Reset Button */}
                    {activeFiltersCount > 0 && (
                        <button className="filter-reset-btn" onClick={resetFilters}>
                            Скинути фільтри
                        </button>
                    )}
                </aside>

                {/* Products Grid */}
                <div className="catalog-products">
                    {loading ? (
                        <div className={`products-grid cols-${gridColumns}`}>
                            {[...Array(8)].map((_, i) => (
                                <div key={i} className="product-skeleton">
                                    <div className="skeleton-image"></div>
                                    <div className="skeleton-text"></div>
                                    <div className="skeleton-text short"></div>
                                    <div className="skeleton-button"></div>
                                </div>
                            ))}
                        </div>
                    ) : products.length > 0 ? (
                        <>
                            <div className={`products-grid cols-${gridColumns}`}>
                                {products.map(product => (
                                    <ProductCard 
                                                    key={product._id} 
                                                    product={product}
                                                    isInWishlist={isInWishlist(product._id)}
                                                    onWishlistToggle={toggleWishlist}
                                                />
                                ))}
                            </div>

                            {/* Pagination */}
                            {totalPages > 1 && (
                                <div className="catalog-pagination">
                                    <button
                                        className="page-btn"
                                        disabled={filters.page <= 1}
                                        onClick={() => updateFilter('page', filters.page - 1)}
                                    >
                                        ←
                                    </button>
                                    
                                    {getPaginationRange().map((page, idx) => (
                                        page === '...' ? (
                                            <span key={`dots-${idx}`} className="page-dots">...</span>
                                        ) : (
                                            <button
                                                key={page}
                                                className={`page-btn ${filters.page === page ? 'active' : ''}`}
                                                onClick={() => updateFilter('page', page)}
                                            >
                                                {page}
                                            </button>
                                        )
                                    ))}
                                    
                                    <button
                                        className="page-btn"
                                        disabled={filters.page >= totalPages}
                                        onClick={() => updateFilter('page', filters.page + 1)}
                                    >
                                        →
                                    </button>
                                </div>
                            )}
                        </>
                    ) : (
                        <div className="catalog-empty">
                            <div className="empty-icon">🔍</div>
                            <h3>Товарів не знайдено</h3>
                            <p>Спробуйте змінити параметри фільтрації</p>
                            <button onClick={resetFilters}>Скинути фільтри</button>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default Catalog;
