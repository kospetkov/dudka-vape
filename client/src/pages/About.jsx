import { Link } from 'react-router-dom';
import { useEffect } from 'react';
import './Legal/Legal.css';

const About = () => {
    useEffect(() => {
        document.title = 'Про нас | DUDKA';
        window.scrollTo(0, 0);
    }, []);

    return (
        <div className="legal-page about-page">
            <div className="legal-breadcrumbs">
                <Link to="/">Головна</Link>
                <span>/</span>
                <span>Про нас</span>
            </div>

            <h1>Про DUDKA</h1>

            <p>
                <strong>DUDKA</strong> – це мережа спеціалізованих магазинів, що пропонують 
                широкий асортимент сучасних вейп-пристроїв та ароматизаторів найвищої якості.
            </p>

            <h2>Наша історія</h2>
            <p>
                Три роки ми завойовуємо довіру наших клієнтів, пропонуючи виняткові вейп-рішення. 
                За цей час DUDKA виросла з одного магазину в мережу з 9 локацій по всій Україні, 
                кожна з яких відрізняється зручним розташуванням та величезним асортиментом продукції.
            </p>

            <h2>Чим ми виділяємося</h2>
            <ul>
                <li><strong>Офіційний представник</strong> брендів Vaporesso, Dinner Lady та інших топових світових виробників</li>
                <li><strong>Професійна консультація</strong> – наші спеціалісти допоможуть підібрати ідеальне рішення</li>
                <li><strong>Новинки першими</strong> – у нас з'являються найсвіжіші моделі пристроїв</li>
                <li><strong>Конкурентні ціни</strong> – як офіційний представник, ми пропонуємо найкращі умови</li>
                <li><strong>Гарантована якість</strong> – тільки оригінальна продукція</li>
            </ul>

            <h2>Наш асортимент</h2>
            <ul>
                <li>Вейп-пристрої (Vaporesso Xros Pro 2, Voopoo Vmate та інші преміум-серії)</li>
                <li>Ароматизатори світових брендів (Dinner Lady, Chaser та інші)</li>
                <li>Аксесуари та комплектуючі</li>
                <li>Стартові набори для новачків</li>
            </ul>

            <h2>Чому обирають DUDKA?</h2>
            <p>
                Ми не просто продаємо девайси – ми створюємо спільноту поціновувачів якісного паріння. 
                Кожен клієнт для нас важливий, і ми пам'ятаємо кожного, хто обирає саме нас. 
                Наші регулярні розіграші, спеціальні акції та нові відкриття магазинів – це спосіб 
                сказати дякую вам за довіру.
            </p>

            <div className="contact-info">
                <h3>DUDKA – краще для кращих</h3>
                <p>
                    <strong>Режим роботи:</strong> 10:00–20:00 щодня<br />
                    <strong>Зв'язок:</strong> <a href="https://t.me/dudkavape" target="_blank" rel="noopener noreferrer">Telegram</a>
                </p>
                <p>
                    Слідкуйте за нами в <a href="https://instagram.com/dudkavape" target="_blank" rel="noopener noreferrer">Instagram</a> та{' '}
                    <a href="https://t.me/dudkavape" target="_blank" rel="noopener noreferrer">Telegram</a> для новин, 
                    розіграшів та ексклюзивних пропозицій.
                </p>
            </div>
        </div>
    );
};

export default About;
