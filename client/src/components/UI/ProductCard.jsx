import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCart } from '../../context/CartContext';
import './ProductCard.css';

const ProductCard = ({ 
    product, 
    onQuickView,
    onWishlistToggle,
    isInWishlist = false,
    showAddToCart = true,
    className = '',
    style = {}
}) => {
    const navigate = useNavigate();
    const { addToCart } = useCart();
    const [isAdding, setIsAdding] = useState(false);

    const {
        _id,
        id,
        name,
        price,
        oldPrice,
        discount,
        images,
        image,
        rating,
        stock,
        inStock = true,
        slug
    } = product;

    const productId = _id || id;
    const productImage = images?.[0]?.url || image || '/placeholder.jpg';
    const productName = typeof name === 'object' ? (name.ua || name.en || name.ru) : name;
    const isAvailable = inStock !== false && (stock === undefined || stock > 0);
    
    const discountPercent = discount || (oldPrice ? Math.round((1 - price / oldPrice) * 100) : 0);

    const handleCardClick = () => {
        navigate(`/product/${slug || productId}`);
    };

    const handleAddToCart = async (e) => {
        e.stopPropagation();
        if (!isAvailable || isAdding) return;
        
        setIsAdding(true);
        try {
            addToCart(product, 1);
            setTimeout(() => setIsAdding(false), 500);
        } catch (error) {
            console.error('Failed to add to cart:', error);
            setIsAdding(false);
        }
    };

    const handleWishlistClick = (e) => {
        e.stopPropagation();
        onWishlistToggle?.(product); // Pass full product, not just ID
    };

    const handleQuickView = (e) => {
        e.stopPropagation();
        onQuickView?.(product);
    };

    const formatPrice = (p) => {
        return new Intl.NumberFormat('uk-UA', {
            style: 'currency',
            currency: 'UAH',
            minimumFractionDigits: 0
        }).format(p);
    };

    const renderStars = (r) => {
        const fullStars = Math.floor(r || 0);
        const hasHalf = (r || 0) % 1 >= 0.5;
        return (
            <span className="product-card-stars">
                {'★'.repeat(fullStars)}
                {hasHalf && '½'}
                {'☆'.repeat(5 - fullStars - (hasHalf ? 1 : 0))}
            </span>
        );
    };

    return (
        <article 
            className={`product-card ${className}`}
            onClick={handleCardClick}
            style={style}
        >
            {/* Image Section */}
            <div className="product-card-image-container">
                {/* Discount Badge */}
                {discountPercent > 0 && (
                    <div className="product-card-discount">
                        -{discountPercent}%
                    </div>
                )}

                {/* Wishlist Button */}
                <button 
                    className={`product-card-wishlist ${isInWishlist ? 'active' : ''}`}
                    onClick={handleWishlistClick}
                    aria-label={isInWishlist ? 'Видалити з обраного' : 'Додати в обране'}
                >
                    {isInWishlist ? '❤️' : '🤍'}
                </button>

                {/* Product Image */}
                <img 
                    src={productImage} 
                    alt={productName}
                    className="product-card-image"
                    loading="lazy"
                    onError={(e) => { e.target.src = '/placeholder.jpg'; }}
                />

                {/* Quick View Overlay */}
                {onQuickView && (
                    <div className="product-card-overlay">
                        <button 
                            className="product-card-quick-view"
                            onClick={handleQuickView}
                        >
                            Швидкий перегляд
                        </button>
                    </div>
                )}
            </div>

            {/* Content Section */}
            <div className="product-card-content">
                <h3 className="product-card-name">{productName}</h3>

                {/* Price */}
                <div className="product-card-price-section">
                    <span className="product-card-price">{formatPrice(price)}</span>
                    {oldPrice && (
                        <span className="product-card-old-price">{formatPrice(oldPrice)}</span>
                    )}
                </div>

                {/* Rating */}
                {rating && (
                    <div className="product-card-rating">
                        {renderStars(rating)}
                        <span className="product-card-rating-text">{rating}</span>
                    </div>
                )}

                {/* Out of Stock */}
                {!isAvailable && (
                    <span className="product-card-out-of-stock">Немає в наявності</span>
                )}

                {/* Add to Cart Button */}
                {showAddToCart && (
                    <button 
                        className="product-card-add-btn"
                        onClick={handleAddToCart}
                        disabled={!isAvailable || isAdding}
                    >
                        {isAdding ? '✓ Додано' : isAvailable ? 'Додати в кошик' : 'Немає в наявності'}
                    </button>
                )}
            </div>
        </article>
    );
};

export default ProductCard;
