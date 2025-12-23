import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import './CategoryGrid.css';

const CategoryGrid = () => {
    const { t } = useTranslation();

    const categories = [
        {
            id: 'pod-systems',
            title: t('footer.podSystems'),
            image: 'https://images.unsplash.com/photo-1534119428203-33467ff5a774?auto=format&fit=crop&w=600&q=80', // Placeholder
            link: '/catalog?category=pod-systems',
            color: 'var(--gradient-purple-pink)'
        },
        {
            id: 'starter-kits',
            title: t('footer.starterKits'),
            image: 'https://images.unsplash.com/photo-1604169966373-6310d54d9241?auto=format&fit=crop&w=600&q=80', // Placeholder
            link: '/catalog?category=starter-kits',
            color: 'var(--gradient-cyan-purple)'
        },
        {
            id: 'liquids',
            title: t('footer.liquids'),
            image: 'https://images.unsplash.com/photo-1504194921103-f8b80cadd5e4?auto=format&fit=crop&w=600&q=80', // Placeholder
            link: '/catalog?category=liquids',
            color: 'var(--gradient-blue-cyan)'
        },
        {
            id: 'disposables',
            title: t('footer.disposables'),
            image: 'https://images.unsplash.com/photo-1563823251941-b07b4a26535c?auto=format&fit=crop&w=600&q=80', // Placeholder
            link: '/catalog?category=disposables',
            color: 'var(--gradient-pink-purple)'
        },
        {
            id: 'accessories',
            title: t('footer.accessories'),
            image: 'https://images.unsplash.com/photo-1558522669-82d2c7962261?auto=format&fit=crop&w=600&q=80', // Placeholder
            link: '/catalog?category=accessories',
            color: 'var(--gradient-orange-red)'
        }
    ];

    return (
        <section className="category-section">
            <div className="container">
                <h2 className="section-title">
                    {t('home.popularCategories')}
                    <span className="title-underline"></span>
                </h2>
                <div className="category-grid">
                    {categories.map((category) => (
                        <Link
                            to={category.link}
                            key={category.id}
                            className="category-card"
                        >
                            <div
                                className="category-bg"
                                style={{ backgroundImage: `url(${category.image})` }}
                            />
                            <div className="category-overlay" style={{ background: category.color }} />
                            <div className="category-content">
                                <h3 className="category-title">{category.title}</h3>
                                <span className="category-arrow">→</span>
                            </div>
                        </Link>
                    ))}
                </div>
            </div>
        </section>
    );
};

export default CategoryGrid;
