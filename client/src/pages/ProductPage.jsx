import { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import ProductCard from '../components/UI/ProductCard';
import api from '../utils/api';
import './ProductPage.css';

const ProductPage = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const { addItem } = useCart();
    
    const [product, setProduct] = useState(null);
    const [relatedProducts, setRelatedProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [selectedImage, setSelectedImage] = useState(0);
    const [quantity, setQuantity] = useState(1);
    const [selectedVariants, setSelectedVariants] = useState({});
    const [activeTab, setActiveTab] = useState('description');
    const [isZoomed, setIsZoomed] = useState(false);
    const [isAdding, setIsAdding] = useState(false);

    useEffect(() => {
        const fetchProduct = async () => {
            try {
                setLoading(true);
                const res = await api.get(`/products/${id}`);
                const productData = res.data;
                setProduct(productData);
                
                // Initialize variants
                if (productData.nicotineLevels?.length) {
                    setSelectedVariants(prev => ({ ...prev, nicotine: productData.nicotineLevels[0] }));
                }
                if (productData.sizes?.length) {
                    setSelectedVariants(prev => ({ ...prev, size: productData.sizes[0] }));
                }
                if (productData.colors?.length) {
                    setSelectedVariants(prev => ({ ...prev, color: productData.colors[0] }));
                }
                
                // Fetch related products
                if (productData.category) {
                    const categoryId = typeof productData.category === 'object' 
                        ? productData.category._id 
                        : productData.category;
                    const relatedRes = await api.get(`/products?category=${categoryId}&limit=4`);
                    const related = (relatedRes.data.products || relatedRes.data || [])
                        .filter(p => p._id !== productData._id)
                        .slice(0, 4);
                    setRelatedProducts(related);
                }
            } catch (error) {
                console.error('Failed to fetch product:', error);
                navigate('/');
            } finally {
                setLoading(false);
            }
        };
        
        fetchProduct();
        window.scrollTo(0, 0);
    }, [id, navigate]);

    const getProductName = (p = product) => {
        if (!p) return '';
        if (typeof p.name === 'object') {
            return p.name.ua || p.name.en || p.name.ru || 'Товар';
        }
        return p.name || 'Товар';
    };

    const getProductDescription = () => {
        if (!product) return '';
        if (typeof product.description === 'object') {
            return product.description.ua || product.description.en || product.description.ru || '';
        }
        return product.description || '';
    };

    const formatPrice = (price) => {
        return new Intl.NumberFormat('uk-UA', {
            style: 'currency',
            currency: 'UAH',
            minimumFractionDigits: 0
        }).format(price);
    };

    const handleQuantityChange = (delta) => {
        setQuantity(prev => Math.max(1, Math.min(99, prev + delta)));
    };

    const handleVariantSelect = (type, value) => {
        setSelectedVariants(prev => ({ ...prev, [type]: value }));
    };

    const handleAddToCart = async () => {
        if (isAdding) return;
        
        setIsAdding(true);
        try {
            const variantString = Object.entries(selectedVariants)
                .map(([key, value]) => `${key}: ${value}`)
                .join(', ');
            
            await addItem({
                ...product,
                variant: variantString || undefined
            }, quantity);
            
            setTimeout(() => setIsAdding(false), 1000);
        } catch (error) {
            console.error('Failed to add to cart:', error);
            setIsAdding(false);
        }
    };

    const handleBuyNow = async () => {
        await handleAddToCart();
        // Open floating cart or navigate to checkout
    };

    const images = product?.images?.length > 0 
        ? product.images 
        : [{ url: product?.image || '/placeholder.jpg' }];

    const discountPercent = product?.discount || (product?.oldPrice 
        ? Math.round((1 - product.price / product.oldPrice) * 100) 
        : 0);

    if (loading) {
        return (
            <div className="loading-container">
                <div className="loading-spinner"></div>
            </div>
        );
    }

    if (!product) {
        return (
            <div className="empty-state">
                <div className="empty-state-icon">😕</div>
                <h3 className="empty-state-title">Товар не знайдено</h3>
                <Link to="/" className="btn btn-primary">На головну</Link>
            </div>
        );
    }

    return (
        <div className="product-page">
            {/* Breadcrumb */}
            <nav className="breadcrumb">
                <Link to="/" className="breadcrumb-link">Головна</Link>
                <span className="breadcrumb-separator">/</span>
                <Link to="/catalog" className="breadcrumb-link">Каталог</Link>
                <span className="breadcrumb-separator">/</span>
                <span className="breadcrumb-current">{getProductName()}</span>
            </nav>

            {/* Product Details */}
            <div className="product-details">
                {/* Gallery */}
                <div className="product-gallery">
                    <div className="gallery-main">
                        <img 
                            src={images[selectedImage]?.url || images[selectedImage]} 
                            alt={getProductName()}
                            className="gallery-main-image"
                            onClick={() => setIsZoomed(true)}
                        />
                        <button 
                            className="gallery-zoom-btn"
                            onClick={() => setIsZoomed(true)}
                        >
                            🔍
                        </button>
                    </div>
                    
                    {images.length > 1 && (
                        <div className="gallery-thumbnails">
                            {images.map((img, index) => (
                                <button
                                    key={index}
                                    className={`gallery-thumbnail ${selectedImage === index ? 'active' : ''}`}
                                    onClick={() => setSelectedImage(index)}
                                >
                                    <img src={img.url || img} alt={`${getProductName()} ${index + 1}`} />
                                </button>
                            ))}
                        </div>
                    )}
                </div>

                {/* Info */}
                <div className="product-info">
                    <h1 className="product-title">{getProductName()}</h1>
                    
                    {/* Rating */}
                    {product.rating && (
                        <div className="product-rating">
                            <span className="product-stars">
                                {'★'.repeat(Math.floor(product.rating))}
                                {'☆'.repeat(5 - Math.floor(product.rating))}
                            </span>
                            <span className="product-rating-text">{product.rating}</span>
                            <a href="#reviews" className="product-rating-reviews">(відгуки)</a>
                        </div>
                    )}

                    {/* Price */}
                    <div className="price-block">
                        <span className="product-price">{formatPrice(product.price)}</span>
                        {product.oldPrice && (
                            <span className="product-old-price">{formatPrice(product.oldPrice)}</span>
                        )}
                        {discountPercent > 0 && (
                            <span className="product-discount-badge">-{discountPercent}%</span>
                        )}
                    </div>

                    {/* Description */}
                    <div 
                        className="product-description"
                        dangerouslySetInnerHTML={{ __html: getProductDescription() }}
                    />

                    {/* Variants */}
                    <div className="variant-section">
                        {product.nicotineLevels?.length > 0 && (
                            <div className="variant-group">
                                <span className="variant-label">Нікотин:</span>
                                <div className="variant-options">
                                    {product.nicotineLevels.map(level => (
                                        <button
                                            key={level}
                                            className={`variant-option ${selectedVariants.nicotine === level ? 'active' : ''}`}
                                            onClick={() => handleVariantSelect('nicotine', level)}
                                        >
                                            {level}mg
                                        </button>
                                    ))}
                                </div>
                            </div>
                        )}

                        {product.sizes?.length > 0 && (
                            <div className="variant-group">
                                <span className="variant-label">Розмір:</span>
                                <div className="variant-options">
                                    {product.sizes.map(size => (
                                        <button
                                            key={size}
                                            className={`variant-option ${selectedVariants.size === size ? 'active' : ''}`}
                                            onClick={() => handleVariantSelect('size', size)}
                                        >
                                            {size}
                                        </button>
                                    ))}
                                </div>
                            </div>
                        )}

                        {product.colors?.length > 0 && (
                            <div className="variant-group">
                                <span className="variant-label">Колір:</span>
                                <div className="variant-options">
                                    {product.colors.map(color => (
                                        <button
                                            key={color}
                                            className={`variant-option ${selectedVariants.color === color ? 'active' : ''}`}
                                            onClick={() => handleVariantSelect('color', color)}
                                        >
                                            {color}
                                        </button>
                                    ))}
                                </div>
                            </div>
                        )}
                    </div>

                    {/* Stock Status */}
                    <div className={`stock-status ${product.stock > 0 || product.inStock ? 'in-stock' : 'out-of-stock'}`}>
                        {product.stock > 0 || product.inStock ? (
                            <>✓ В наявності {product.stock && `(${product.stock} шт.)`}</>
                        ) : (
                            <>✕ Немає в наявності</>
                        )}
                    </div>

                    {/* Purchase Section */}
                    <div className="purchase-section">
                        <div className="quantity-selector">
                            <button 
                                className="quantity-btn"
                                onClick={() => handleQuantityChange(-1)}
                            >
                                −
                            </button>
                            <input 
                                type="number"
                                className="quantity-input"
                                value={quantity}
                                onChange={(e) => setQuantity(Math.max(1, Math.min(99, parseInt(e.target.value) || 1)))}
                                min="1"
                                max="99"
                            />
                            <button 
                                className="quantity-btn"
                                onClick={() => handleQuantityChange(1)}
                            >
                                +
                            </button>
                        </div>
                        
                        <button 
                            className="add-to-cart-btn"
                            onClick={handleAddToCart}
                            disabled={isAdding || (!product.inStock && product.stock <= 0)}
                        >
                            {isAdding ? '✓ Додано!' : 'Додати в кошик'}
                        </button>
                    </div>

                    {/* Meta Info */}
                    {(product.battery || product.wattage || product.capacity || product.brand) && (
                        <div className="product-meta">
                            {product.brand && (
                                <div className="meta-item">
                                    <span className="meta-label">Бренд:</span>
                                    <span className="meta-value">{product.brand}</span>
                                </div>
                            )}
                            {product.battery && (
                                <div className="meta-item">
                                    <span className="meta-label">Батарея:</span>
                                    <span className="meta-value">{product.battery}</span>
                                </div>
                            )}
                            {product.wattage && (
                                <div className="meta-item">
                                    <span className="meta-label">Потужність:</span>
                                    <span className="meta-value">{product.wattage}</span>
                                </div>
                            )}
                            {product.capacity && (
                                <div className="meta-item">
                                    <span className="meta-label">Ємність:</span>
                                    <span className="meta-value">{product.capacity}</span>
                                </div>
                            )}
                        </div>
                    )}
                </div>
            </div>

            {/* Tabs */}
            <div className="product-tabs">
                <div className="product-tabs-header">
                    <button
                        className={`product-tab ${activeTab === 'description' ? 'active' : ''}`}
                        onClick={() => setActiveTab('description')}
                    >
                        Опис
                    </button>
                    {product.characteristics && (
                        <button
                            className={`product-tab ${activeTab === 'characteristics' ? 'active' : ''}`}
                            onClick={() => setActiveTab('characteristics')}
                        >
                            Характеристики
                        </button>
                    )}
                    <button
                        className={`product-tab ${activeTab === 'reviews' ? 'active' : ''}`}
                        onClick={() => setActiveTab('reviews')}
                        id="reviews"
                    >
                        Відгуки
                    </button>
                </div>

                <div className="product-tab-content">
                    {activeTab === 'description' && (
                        <div>
                            <div 
                                className="tab-description-content"
                                dangerouslySetInnerHTML={{ __html: getProductDescription() }}
                            />
                            {product.application && (
                                <div style={{ marginTop: 'var(--spacing-lg)' }}>
                                    <h4>Застосування:</h4>
                                    <ul>
                                        {(product.application.ua || product.application || []).map((item, i) => (
                                            <li key={i}>{item}</li>
                                        ))}
                                    </ul>
                                </div>
                            )}
                        </div>
                    )}

                    {activeTab === 'characteristics' && product.characteristics && (
                        <table className="characteristics-table">
                            <tbody>
                                {(product.characteristics.ua || product.characteristics || []).map((char, i) => (
                                    <tr key={i}>
                                        <td>{char.key}</td>
                                        <td>{char.value}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    )}

                    {activeTab === 'reviews' && (
                        <div className="empty-state">
                            <p>Відгуків поки немає. Будьте першим!</p>
                        </div>
                    )}
                </div>
            </div>

            {/* Related Products */}
            {relatedProducts.length > 0 && (
                <section className="related-section">
                    <h2 className="related-title gradient-text">Схожі товари</h2>
                    <div className="related-grid">
                        {relatedProducts.map((p, index) => (
                            <ProductCard 
                                key={p._id || index}
                                product={p}
                                className="animate-fade-in-up"
                                style={{ animationDelay: `${index * 0.1}s` }}
                            />
                        ))}
                    </div>
                </section>
            )}

            {/* Zoom Modal */}
            {isZoomed && (
                <div className="zoom-modal" onClick={() => setIsZoomed(false)}>
                    <button className="zoom-modal-close">✕</button>
                    <img 
                        src={images[selectedImage]?.url || images[selectedImage]}
                        alt={getProductName()}
                        className="zoom-modal-image"
                    />
                </div>
            )}
        </div>
    );
};

export default ProductPage;
