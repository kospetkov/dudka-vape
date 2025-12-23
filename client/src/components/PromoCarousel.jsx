import { useState, useEffect, useCallback } from 'react';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import './PromoCarousel.css';

const PromoCarousel = () => {
    const { t } = useTranslation();
    const [currentSlide, setCurrentSlide] = useState(0);
    const [isPaused, setIsPaused] = useState(false);

    const slides = [
        {
            id: 1,
            title: t('promo.blackFriday.title', 'BLACK FRIDAY SALE'),
            subtitle: t('promo.blackFriday.subtitle', 'Знижки до -50% на топові девайси'),
            cta: t('promo.blackFriday.cta', 'Встигнути купити'),
            link: '/catalog',
            background: 'linear-gradient(135deg, #000000 0%, #1a0b2e 50%, #4a0e4e 100%)',
            accent: '#ff00ff',
            tag: '-50%'
        },
        {
            id: 2,
            title: t('promo.newArrivals.title', 'VAPORESSO XROS 4'),
            subtitle: t('promo.newArrivals.subtitle', 'Нове покоління смаку та стилю'),
            cta: t('promo.newArrivals.cta', 'Детальніше'),
            link: '/catalog?brand=vaporesso',
            background: 'linear-gradient(135deg, #000000 0%, #0b1a2e 50%, #0e4e4a 100%)',
            accent: '#00ffff',
            tag: 'NEW'
        },
        {
            id: 3,
            title: t('promo.premium.title', 'ПРЕМІУМ РІДИНИ'),
            subtitle: t('promo.premium.subtitle', 'Найкращі смаки від світових брендів'),
            cta: t('promo.premium.cta', 'Обрати смак'),
            link: '/catalog?category=liquids',
            background: 'linear-gradient(135deg, #000000 0%, #2e1a0b 50%, #4e3a0e 100%)',
            accent: '#ffaa00',
            tag: 'PREMIUM'
        },
        {
            id: 4,
            title: t('promo.starter.title', 'СТАРТОВІ НАБОРИ'),
            subtitle: t('promo.starter.subtitle', 'Ідеальний вибір для новачків'),
            cta: t('promo.starter.cta', 'Перейти до каталогу'),
            link: '/catalog?category=starter-kits',
            background: 'linear-gradient(135deg, #000000 0%, #0b2e1a 50%, #0e4e1a 100%)',
            accent: '#00ff00',
            tag: 'STARTER'
        },
        {
            id: 5,
            title: t('promo.hotDeal.title', 'ГАРЯЧА ПРОПОЗИЦІЯ'),
            subtitle: t('promo.hotDeal.subtitle', 'Купуй Pod-систему та отримай рідину в подарунок'),
            cta: t('promo.hotDeal.cta', 'Отримати подарунок'),
            link: '/catalog',
            background: 'linear-gradient(135deg, #000000 0%, #2e0b1a 50%, #4e0e2a 100%)',
            accent: '#ff0055',
            tag: 'HOT DEAL'
        }
    ];

    const nextSlide = useCallback(() => {
        setCurrentSlide((prev) => (prev + 1) % slides.length);
    }, [slides.length]);

    const prevSlide = () => {
        setCurrentSlide((prev) => (prev - 1 + slides.length) % slides.length);
    };

    const goToSlide = (index) => {
        setCurrentSlide(index);
    };

    // Auto-advance carousel
    useEffect(() => {
        if (!isPaused) {
            const interval = setInterval(nextSlide, 5000);
            return () => clearInterval(interval);
        }
    }, [isPaused, nextSlide]);

    return (
        <div
            className="promo-carousel"
            onMouseEnter={() => setIsPaused(true)}
            onMouseLeave={() => setIsPaused(false)}
        >
            <div className="carousel-container">
                {slides.map((slide, index) => (
                    <div
                        key={slide.id}
                        className={`carousel-slide ${index === currentSlide ? 'active' : ''}`}
                        style={{ background: slide.background }}
                    >
                        <div className="slide-content">
                            <div className="slide-tag" style={{ borderColor: slide.accent, color: slide.accent }}>
                                {slide.tag}
                            </div>
                            <h1 className="slide-title">
                                {slide.title}
                            </h1>
                            <p className="slide-subtitle">{slide.subtitle}</p>
                            <Link
                                to={slide.link}
                                className="slide-cta"
                            >
                                {slide.cta}
                            </Link>
                        </div>
                    </div>
                ))}
            </div>

            {/* Navigation Arrows */}
            <button
                className="carousel-arrow carousel-arrow-left"
                onClick={prevSlide}
                aria-label="Previous slide"
            >
                ‹
            </button>
            <button
                className="carousel-arrow carousel-arrow-right"
                onClick={nextSlide}
                aria-label="Next slide"
            >
                ›
            </button>

            {/* Navigation Dots */}
            <div className="carousel-dots">
                {slides.map((_, index) => (
                    <button
                        key={index}
                        className={`carousel-dot ${index === currentSlide ? 'active' : ''}`}
                        onClick={() => goToSlide(index)}
                        aria-label={`Go to slide ${index + 1}`}
                    />
                ))}
            </div>
        </div>
    );
};

export default PromoCarousel;
