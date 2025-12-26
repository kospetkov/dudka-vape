import { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useWishlist } from '../context/WishlistContext';
import { useCart } from '../context/CartContext';
import './Wishlist.css';

const Wishlist = () => {
    const { wishlist, removeFromWishlist, clearWishlist, loading } = useWishlist();
    const { addToCart } = useCart();

    useEffect(() => {
        document.title = 'Список бажань | DUDKA';
        window.scrollTo(0, 0);
    }, []);

    const getProductName = (product) => {
        if (!product) return 'Товар';
        if (typeof product.name === 'object') {
            return product.name.ua || product.name.en || product.name.ru || 'Товар';
        }
        return product.name || 'Товар';
    };

    const getProductImage = (product) => {
        if (!product) return '/placeholder.png';
        if (product.images && product.images.length > 0) {
            const img = product.images[0];
            return typeof img === 'object' ? img.url : img;
        }
        return product.image || '/placeholder.png';
    };

    const formatPrice = (price) => {
        return new Intl.NumberFormat('uk-UA').format(price);
    };

    const handleAddToCart = (product) => {
        addToCart(product, 1);
    };

    const handleRemove = (productId) => {
        removeFromWishlist(productId);
    };

    if (loading) {
        return (
            <div className="wishlist-page">
                <div className="container">
                    <div className="loading-container">
                        <div className="loading-spinner"></div>
                        <p>Завантаження...</p>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="wishlist-page">
            <div className="container">
                <div className="wishlist-header">
                    <h1>❤️ Список бажань</h1>
                    {wishlist.length > 0 && (
                        <button 
                            className="wishlist-clear-btn"
                            onClick={clearWishlist}
                        >
                            🗑️ Очистити все
                        </button>
                    )}
                </div>

                {wishlist.length === 0 ? (
                    <div className="wishlist-empty">
                        <div className="wishlist-empty-icon">💔</div>
                        <h2>Список бажань порожній</h2>
                        <p>Додайте товари, натиснувши на ❤️ на картці товару</p>
                        <Link to="/catalog" className="btn btn-primary">
                            Перейти до каталогу
                        </Link>
                    </div>
                ) : (
                    <>
                        <p className="wishlist-count">
                            {wishlist.length} {wishlist.length === 1 ? 'товар' : 
                                wishlist.length < 5 ? 'товари' : 'товарів'}
                        </p>

                        <div className="wishlist-grid">
                            {wishlist.map((product) => (
                                <div key={product._id} className="wishlist-item">
                                    <Link 
                                        to={`/product/${product._id}`} 
                                        className="wishlist-item-image"
                                    >
                                        <img 
                                            src={getProductImage(product)} 
                                            alt={getProductName(product)}
                                            onError={(e) => {
                                                e.target.src = '/placeholder.png';
                                            }}
                                        />
                                    </Link>

                                    <div className="wishlist-item-content">
                                        <Link 
                                            to={`/product/${product._id}`}
                                            className="wishlist-item-name"
                                        >
                                            {getProductName(product)}
                                        </Link>

                                        <div className="wishlist-item-price">
                                            {product.oldPrice || product.salePrice ? (
                                                <>
                                                    <span className="price-current">
                                                        {formatPrice(product.salePrice || product.price)} ₴
                                                    </span>
                                                    <span className="price-old">
                                                        {formatPrice(product.oldPrice || product.price)} ₴
                                                    </span>
                                                </>
                                            ) : (
                                                <span className="price-current">
                                                    {formatPrice(product.price)} ₴
                                                </span>
                                            )}
                                        </div>

                                        <div className="wishlist-item-stock">
                                            {product.stock > 0 || product.inStock !== false ? (
                                                <span className="in-stock">✓ В наявності</span>
                                            ) : (
                                                <span className="out-of-stock">✕ Немає в наявності</span>
                                            )}
                                        </div>

                                        <div className="wishlist-item-actions">
                                            <button
                                                className="btn btn-primary btn-sm"
                                                onClick={() => handleAddToCart(product)}
                                                disabled={product.stock === 0 && product.inStock === false}
                                            >
                                                🛒 До кошика
                                            </button>
                                            <button
                                                className="btn btn-outline btn-sm"
                                                onClick={() => handleRemove(product._id)}
                                            >
                                                🗑️
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </>
                )}
            </div>
        </div>
    );
};

export default Wishlist;
