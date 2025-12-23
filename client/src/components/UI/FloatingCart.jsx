import { useState, useRef, useEffect } from 'react';
import { useCart } from '../../context/CartContext';
import './FloatingCart.css';

const FloatingCart = ({ onCheckout }) => {
    const [isExpanded, setIsExpanded] = useState(false);
    const [isPiPSupported, setIsPiPSupported] = useState(false);
    const cartRef = useRef(null);
    const { cart, updateQuantity, removeFromCart, clearCart, getCartTotal, getCartCount } = useCart();

    // Alias for compatibility
    const items = cart || [];
    const itemCount = getCartCount();
    const total = getCartTotal();

    // Check PiP support
    useEffect(() => {
        setIsPiPSupported('documentPictureInPicture' in window);
    }, []);

    // Close cart when clicking outside
    useEffect(() => {
        const handleClickOutside = (e) => {
            if (cartRef.current && !cartRef.current.contains(e.target)) {
                setIsExpanded(false);
            }
        };

        if (isExpanded) {
            document.addEventListener('mousedown', handleClickOutside);
        }

        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, [isExpanded]);

    const formatPrice = (price) => {
        return new Intl.NumberFormat('uk-UA', {
            style: 'currency',
            currency: 'UAH',
            minimumFractionDigits: 0
        }).format(price);
    };

    const getProductName = (item) => {
        const product = item.product || item;
        if (typeof product.name === 'object') {
            return product.name.ua || product.name.en || product.name.ru || 'Товар';
        }
        return product.name || 'Товар';
    };

    const getProductImage = (item) => {
        const product = item.product || item;
        return product.images?.[0]?.url || product.image || '/placeholder.jpg';
    };

    const getProductPrice = (item) => {
        const product = item.product || item;
        return product.price || 0;
    };

    const getProductId = (item) => {
        const product = item.product || item;
        return product._id || product.id;
    };

    // Picture-in-Picture functionality
    const openInPiP = async () => {
        if (!isPiPSupported) return;

        try {
            const pipWindow = await window.documentPictureInPicture.requestWindow({
                width: 400,
                height: 600,
            });

            // Copy styles
            const styleSheets = [...document.styleSheets];
            for (const styleSheet of styleSheets) {
                try {
                    const cssRules = [...styleSheet.cssRules].map(rule => rule.cssText).join('\n');
                    const style = document.createElement('style');
                    style.textContent = cssRules;
                    pipWindow.document.head.appendChild(style);
                } catch (e) {
                    const link = document.createElement('link');
                    link.rel = 'stylesheet';
                    link.href = styleSheet.href;
                    pipWindow.document.head.appendChild(link);
                }
            }

            // Create cart content
            const container = document.createElement('div');
            container.className = 'pip-cart-container';
            container.innerHTML = `
                <div class="floating-cart-panel" style="display: block;">
                    <div class="floating-cart-header">
                        <span class="floating-cart-title">
                            🛒 Кошик <span class="floating-cart-count">${itemCount}</span>
                        </span>
                    </div>
                    <div class="floating-cart-items">
                        ${items.length === 0 ? `
                            <div class="floating-cart-empty">
                                <div class="floating-cart-empty-icon">🛒</div>
                                <p>Кошик порожній</p>
                            </div>
                        ` : items.map(item => `
                            <div class="floating-cart-item">
                                <img src="${getProductImage(item)}" alt="${getProductName(item)}" class="floating-cart-item-image" />
                                <div class="floating-cart-item-info">
                                    <div class="floating-cart-item-name">${getProductName(item)}</div>
                                    <div class="floating-cart-item-price">${formatPrice(getProductPrice(item))}</div>
                                </div>
                                <div class="floating-cart-item-qty">
                                    <span>×${item.quantity}</span>
                                </div>
                            </div>
                        `).join('')}
                    </div>
                    <div class="floating-cart-footer">
                        <div class="floating-cart-subtotal">
                            <span class="floating-cart-subtotal-label">Всього:</span>
                            <span class="floating-cart-subtotal-value">${formatPrice(total)}</span>
                        </div>
                    </div>
                </div>
            `;

            pipWindow.document.body.appendChild(container);
            pipWindow.document.body.style.margin = '0';
            pipWindow.document.body.style.background = 'var(--color-bg)';

            setIsExpanded(false);
        } catch (error) {
            console.error('Failed to open PiP:', error);
        }
    };

    return (
        <div 
            ref={cartRef}
            className={`floating-cart ${isExpanded ? 'expanded' : 'minimized'}`}
        >
            {/* Expanded Panel */}
            {isExpanded && (
                <div className="floating-cart-panel">
                    {/* Header */}
                    <div className="floating-cart-header">
                        <span className="floating-cart-title">
                            🛒 Кошик 
                            {itemCount > 0 && (
                                <span className="floating-cart-count">{itemCount}</span>
                            )}
                        </span>
                        <div className="floating-cart-actions">
                            {isPiPSupported && (
                                <button 
                                    className="floating-cart-action-btn pip-btn"
                                    onClick={openInPiP}
                                    title="Відкрити в окремому вікні"
                                >
                                    📌
                                </button>
                            )}
                            {items.length > 0 && (
                                <button 
                                    className="floating-cart-action-btn"
                                    onClick={clearCart}
                                    title="Очистити кошик"
                                >
                                    🗑️
                                </button>
                            )}
                            <button 
                                className="floating-cart-action-btn"
                                onClick={() => setIsExpanded(false)}
                                title="Закрити"
                            >
                                ✕
                            </button>
                        </div>
                    </div>

                    {/* Items */}
                    <div className="floating-cart-items">
                        {items.length === 0 ? (
                            <div className="floating-cart-empty">
                                <div className="floating-cart-empty-icon">🛒</div>
                                <p>Кошик порожній</p>
                                <p>Додайте товари для оформлення замовлення</p>
                            </div>
                        ) : (
                            items.map((item, index) => (
                                <div key={getProductId(item) || index} className="floating-cart-item">
                                    <img 
                                        src={getProductImage(item)} 
                                        alt={getProductName(item)}
                                        className="floating-cart-item-image"
                                    />
                                    <div className="floating-cart-item-info">
                                        <div className="floating-cart-item-name">
                                            {getProductName(item)}
                                        </div>
                                        <div className="floating-cart-item-price">
                                            {formatPrice(getProductPrice(item) * item.quantity)}
                                        </div>
                                    </div>
                                    <div className="floating-cart-item-qty">
                                        <div className="floating-cart-qty-controls">
                                            <button 
                                                className="floating-cart-qty-btn"
                                                onClick={() => updateQuantity(getProductId(item), item.quantity - 1)}
                                            >
                                                −
                                            </button>
                                            <span className="floating-cart-qty-value">
                                                {item.quantity}
                                            </span>
                                            <button 
                                                className="floating-cart-qty-btn"
                                                onClick={() => updateQuantity(getProductId(item), item.quantity + 1)}
                                            >
                                                +
                                            </button>
                                        </div>
                                        <button 
                                            className="floating-cart-item-remove"
                                            onClick={() => removeFromCart(getProductId(item))}
                                        >
                                            Видалити
                                        </button>
                                    </div>
                                </div>
                            ))
                        )}
                    </div>

                    {/* Footer */}
                    {items.length > 0 && (
                        <div className="floating-cart-footer">
                            <div className="floating-cart-subtotal">
                                <span className="floating-cart-subtotal-label">Всього:</span>
                                <span className="floating-cart-subtotal-value">
                                    {formatPrice(total)}
                                </span>
                            </div>
                            <button 
                                className="floating-cart-checkout-btn"
                                onClick={onCheckout}
                            >
                                Оформити замовлення
                            </button>
                        </div>
                    )}
                </div>
            )}

            {/* Toggle Button */}
            <button 
                className="floating-cart-toggle"
                onClick={() => setIsExpanded(!isExpanded)}
                aria-label="Відкрити кошик"
            >
                <span className="floating-cart-toggle-icon">
                    {isExpanded ? '✕' : '🛒'}
                </span>
                {itemCount > 0 && !isExpanded && (
                    <span className="floating-cart-toggle-badge">{itemCount}</span>
                )}
            </button>
        </div>
    );
};

export default FloatingCart;
