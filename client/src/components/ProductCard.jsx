import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useCart } from '../context/CartContext';
import DiscountTag from './DiscountTag';
import './ProductCard.css';

const ProductCard = ({ product }) => {
    const { t, i18n } = useTranslation();
    const { addToCart } = useCart();
    const lang = i18n.language;

    const handleAddToCart = () => {
        addToCart(product, 1);
    };

    // Determine tag type
    const getTagType = () => {
        if (product.tags?.includes('new')) return 'new';
        if (product.tags?.includes('hot') || product.tags?.includes('bestseller')) return 'hot';
        if (product.tags?.includes('premium')) return 'premium';
        if (product.discount || product.oldPrice) return 'discount';
        return null;
    };

    const tagType = getTagType();

    return (
        <div className="product-card card">
            {/* Discount/New/Hot Tag */}
            {tagType && (
                <DiscountTag
                    type={tagType}
                    value={product.discount}
                />
            )}

            <Link to={`/product/${product._id}`} className="product-link">
                <img
                    src={product.images?.[0]?.url || ''}
                    alt={product.name[lang]}
                    className="product-image"
                    onError={(e) => {
                        //e.target.src = 'https://placehold.co//1C1C1E/00D9C5?text=Product';
                    }}
                />
                <h3 className="product-name">{product.name[lang]}</h3>
                <p className="product-brand text-muted text-small">{product.brand}</p>

                <div className="product-price-container">
                    {product.oldPrice && (
                        <span className="product-old-price">{product.oldPrice} ₴</span>
                    )}
                    <p className="product-price">{product.price} ₴</p>
                </div>
            </Link>
            <button
                onClick={handleAddToCart}
                className="btn btn-primary"
                style={{ width: '100%', marginTop: 'var(--spacing-sm)' }}
                disabled={product.stock === 0}
            >
                {product.stock > 0 ? t('product.addToCart') : t('product.outOfStock')}
            </button>
        </div>
    );
};

export default ProductCard;
