import { useState, useEffect, useCallback } from 'react';
import { Link } from 'react-router-dom';
import ProductCard from '../components/UI/ProductCard';
import { useWishlist } from '../context/WishlistContext';
import Footer from '../components/Layout/Footer';
import api from '../utils/api';
import './Home.css';

const Home = () => {
    const { isInWishlist, toggleWishlist } = useWishlist();
    const [products, setProducts] = useState([]);
    const [featuredProducts, setFeaturedProducts] = useState([]);
    const [categories, setCategories] = useState([]);
    const [activeCategory, setActiveCategory] = useState('all');
    const [loading, setLoading] = useState(true);
    const [promoSliderIndex, setPromoSliderIndex] = useState(0);
    const [settings, setSettings] = useState({
        heroSlider: [],
        heroSliderEnabled: false,
        heroEnabled: true,
        storeName: '',
        heroTitle: '',
        heroSubtitle: ''
    });

    // Load settings from API
    useEffect(() => {
        const fetchSettings = async () => {
            try {
                const response = await api.get('/settings');
                setSettings(prev => ({ ...prev, ...response.data }));
            } catch (error) {
                console.error('Failed to fetch settings:', error);
            }
        };
        fetchSettings();
    }, []);

    // Fetch data
    useEffect(() => {
        const fetchData = async () => {
            try {
                setLoading(true);
                const [productsRes, categoriesRes] = await Promise.all([
                    api.get('/products'),
                    api.get('/categories')
                ]);
                
                const allProducts = productsRes.data.products || productsRes.data || [];
                setProducts(allProducts);
                setFeaturedProducts(allProducts.filter(p => p.featured).slice(0, 4));
                setCategories(categoriesRes.data || []);
            } catch (error) {
                console.error('Failed to fetch data:', error);
            } finally {
                setLoading(false);
            }
        };
        
        fetchData();
    }, []);

    // Promo Slider auto-rotation
    useEffect(() => {
        if (!settings.heroSliderEnabled || settings.heroSlider.length <= 1) return;
        
        const timer = setInterval(() => {
            setPromoSliderIndex(prev => (prev + 1) % settings.heroSlider.length);
        }, 6000);
        
        return () => clearInterval(timer);
    }, [settings.heroSliderEnabled, settings.heroSlider.length]);

    // Filter products by category
    const filteredProducts = activeCategory === 'all' 
        ? products 
        : products.filter(p => {
            const categoryId = typeof p.category === 'object' ? p.category._id : p.category;
            return categoryId === activeCategory;
        });

    const getCategoryName = (category) => {
        if (typeof category.name === 'object') {
            return category.name.ua || category.name.en || category.name.ru;
        }
        return category.name;
    };

    const scrollToProducts = () => {
        document.getElementById('products')?.scrollIntoView({ behavior: 'smooth' });
    };

    const nextPromoSlide = useCallback(() => {
        setPromoSliderIndex(prev => (prev + 1) % settings.heroSlider.length);
    }, [settings.heroSlider.length]);

    const prevPromoSlide = useCallback(() => {
        setPromoSliderIndex(prev => (prev - 1 + settings.heroSlider.length) % settings.heroSlider.length);
    }, [settings.heroSlider.length]);

    if (loading) {
        return (
            <div className="loading-container">
                <div className="loading-spinner"></div>
                <p className="loading-text">Завантаження...</p>
            </div>
        );
    }

    // Show promo slider if enabled and has slides
    const showPromoSlider = settings.heroSliderEnabled && settings.heroSlider.length > 0;
    const showStaticHero = settings.heroEnabled !== false;

    return (
        <div className="home-page">
            {/* Static Hero - Always on top if enabled */}
            {showStaticHero && (
                <section className="hero">
                    <div className="hero-background">
                        <div className="hero-gradient hero-gradient-1" />
                        <div className="hero-gradient hero-gradient-2" />
                    </div>
                    
                    <div className="hero-content">
                        <div className="hero-text">
                            <div className="hero-badge">
                                ✨ Преміум якість
                            </div>
                            <h1 className="hero-title">
                                <span className="hero-title-gradient">{settings.heroTitle}</span>
                            </h1>
                            <p className="hero-description">
                                {settings.heroSubtitle}
                            </p>
                            <div className="hero-buttons">
                                <button onClick={scrollToProducts} className="hero-btn hero-btn-primary">
                                    Переглянути каталог
                                    <span>→</span>
                                </button>
                                <Link to="/about" className="hero-btn hero-btn-secondary">
                                    Дізнатись більше
                                </Link>
                            </div>
                        </div>
                        
                        <div className="hero-image">
                            <div className="hero-image-container">
                                <img 
                                    src={settings.logoUrl || '/logo.png'} 
                                    alt="DUDKA Premium Vape"
                                    className="hero-main-image"
                                    onError={(e) => {
                                        e.target.src = 'https://images.unsplash.com/photo-1560024802-d7ae9e039abe?w=600&h=600&fit=crop';
                                    }}
                                />
                            </div>
                            
                            <div className="hero-floating-card hero-floating-card-1">
                                <span style={{ fontSize: '1.5rem' }}>🚀</span>
                                <span>Швидка доставка</span>
                            </div>
                            <div className="hero-floating-card hero-floating-card-2">
                                <span style={{ fontSize: '1.5rem' }}>⭐</span>
                                <span>Топ якість</span>
                            </div>
                        </div>
                    </div>
                </section>
            )}

            {/* Promo Slider - Like promo-banner but carousel */}
            {showPromoSlider && (
                <section className="promo-slider">
                    <div className="promo-slider-container">
                        <div 
                            className="promo-slider-track"
                            style={{ transform: `translateX(-${promoSliderIndex * 100}%)` }}
                        >
                            {settings.heroSlider.map((slide, index) => (
                                <div key={slide._id || index} className="promo-slide">
                                    <div className="promo-slide-content">
                                        {slide.tag && (
                                            <span className="promo-slide-tag">{slide.tag}</span>
                                        )}
                                        {!slide.tag && (
                                            <span className="promo-slide-tag">🎁 Акція</span>
                                        )}
                                        <h2 className="promo-slide-title">
                                            {slide.title}
                                        </h2>
                                        {slide.subtitle && (
                                            <p className="promo-slide-description">
                                                {slide.subtitle}
                                            </p>
                                        )}
                                        {slide.buttonText && (
                                            <Link 
                                                to={slide.buttonLink || '/catalog'} 
                                                className="hero-btn hero-btn-primary"
                                            >
                                                {slide.buttonText}
                                            </Link>
                                        )}
                                    </div>
                                    <div className="promo-slide-image">
                                        <img 
                                            src={slide.image} 
                                            alt={slide.title}
                                            onError={(e) => {
                                                e.target.src = 'https://images.unsplash.com/photo-1567103472667-6898f3a79cf2?w=500&h=400&fit=crop';
                                            }}
                                        />
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                    
                    {/* Navigation */}
                    {settings.heroSlider.length > 1 && (
                        <>
                            <button 
                                className="promo-slider-nav promo-slider-prev" 
                                onClick={prevPromoSlide}
                                aria-label="Попередній слайд"
                            >
                                ‹
                            </button>
                            <button 
                                className="promo-slider-nav promo-slider-next" 
                                onClick={nextPromoSlide}
                                aria-label="Наступний слайд"
                            >
                                ›
                            </button>
                            
                            <div className="promo-slider-dots">
                                {settings.heroSlider.map((_, index) => (
                                    <button
                                        key={index}
                                        className={`promo-slider-dot ${index === promoSliderIndex ? 'active' : ''}`}
                                        onClick={() => setPromoSliderIndex(index)}
                                        aria-label={`Слайд ${index + 1}`}
                                    />
                                ))}
                            </div>
                        </>
                    )}
                </section>
            )}

            {/* Featured Products */}
            {featuredProducts.length > 0 && (
                <section className="featured-section">
                    <div className="featured-header">
                        <h2 className="featured-title gradient-text">🔥 Хіти продажів</h2>
                        <Link to="/catalog" className="featured-link">
                            Всі товари <span>→</span>
                        </Link>
                    </div>
                    <div className="featured-grid">
                        {featuredProducts.map((product, index) => (
                            <ProductCard 
                                key={product._id || product.id || index}
                                product={product}
                                isInWishlist={isInWishlist(product._id)}
                                onWishlistToggle={toggleWishlist}
                                className="animate-fade-in-up"
                                style={{ animationDelay: `${index * 0.1}s` }}
                            />
                        ))}
                    </div>
                </section>
            )}

            {/* Static Promo Banner - показываем если слайдер выключен */}
            {!showPromoSlider && (
                <section className="promo-banner">
                    <div className="promo-content">
                        <span className="promo-tag">🎁 Акція</span>
                        <h2 className="promo-title">
                            Знижка <span className="gradient-text">20%</span> на перше замовлення
                        </h2>
                        <p className="promo-description">
                            Використовуйте промокод WELCOME20 при оформленні замовлення та отримайте знижку на весь асортимент.
                        </p>
                        <button onClick={scrollToProducts} className="hero-btn hero-btn-primary">
                            Скористатися знижкою
                        </button>
                    </div>
                    <div className="promo-image">
                        <img 
                            src="https://images.unsplash.com/photo-1567103472667-6898f3a79cf2?w=500&h=400&fit=crop"
                            alt="Promo"
                        />
                    </div>
                </section>
            )}

            {/* Products Catalog */}
            <section id="products" className="category-section">
                <div className="featured-header">
                    <h2 className="featured-title gradient-text">📦 Каталог товарів</h2>
                </div>

                <div className="category-tabs">
                    <button
                        className={`category-tab ${activeCategory === 'all' ? 'active' : ''}`}
                        onClick={() => setActiveCategory('all')}
                    >
                        Всі товари
                    </button>
                    {categories.map(category => (
                        <button
                            key={category._id}
                            className={`category-tab ${activeCategory === category._id ? 'active' : ''}`}
                            onClick={() => setActiveCategory(category._id)}
                        >
                            {getCategoryName(category)}
                        </button>
                    ))}
                </div>

                <div className="products-grid">
                    {filteredProducts.length > 0 ? (
                        filteredProducts.map((product, index) => (
                            <ProductCard 
                                key={product._id || product.id || index}
                                product={product}
                                isInWishlist={isInWishlist(product._id)}
                                onWishlistToggle={toggleWishlist}
                                className="animate-fade-in-up content-auto"
                                style={{ animationDelay: `${index * 0.05}s` }}
                            />
                        ))
                    ) : (
                        <div className="empty-state" style={{ gridColumn: '1 / -1' }}>
                            <div className="empty-state-icon">🔍</div>
                            <h3 className="empty-state-title">Товари не знайдено</h3>
                            <p className="empty-state-description">
                                Спробуйте вибрати іншу категорію
                            </p>
                        </div>
                    )}
                </div>
            </section>

            <Footer />
        </div>
    );
};

export default Home;
