import { Link } from 'react-router-dom';
import { useEffect } from 'react';
import { useSettings } from '../context/SettingsContext';
import './Legal/Legal.css';

const About = () => {
    const { storeName, contacts, socialLinks } = useSettings();

    useEffect(() => {
        document.title = `Про нас | ${storeName || 'Shop'}`;
        window.scrollTo(0, 0);
    }, [storeName]);

    return (
        <div className="legal-page about-page">
            <div className="legal-breadcrumbs">
                <Link to="/">Головна</Link>
                <span>/</span>
                <span>Про нас</span>
            </div>

            <h1>Про {storeName || 'нас'}</h1>

            <p>
                <strong>{storeName || 'Shop'}</strong> – це мережа спеціалізованих магазинів, що пропонують 
                широкий асортимент сучасних вейп-пристроїв та ароматизаторів найвищої якості.
            </p>

            <h2>Наша історія</h2>
            <p>
                Три роки ми завойовуємо довіру наших клієнтів, пропонуючи виняткові вейп-рішення. 
                За цей час ми виросли з одного магазину в мережу локацій по всій Україні.
            </p>

            <h2>Чим ми виділяємося</h2>
            <ul>
                <li><strong>Офіційний представник</strong> топових світових виробників</li>
                <li><strong>Професійна консультація</strong></li>
                <li><strong>Новинки першими</strong></li>
                <li><strong>Конкурентні ціни</strong></li>
                <li><strong>Гарантована якість</strong></li>
            </ul>

            <div className="contact-info">
                <h3>{storeName || 'Shop'} – краще для кращих</h3>
                <p><strong>Режим роботи:</strong> 10:00–20:00 щодня</p>
                {(socialLinks?.telegram || socialLinks?.instagram) && (
                    <p>
                        Слідкуйте за нами в{' '}
                        {socialLinks?.instagram && <a href={socialLinks.instagram} target="_blank" rel="noopener noreferrer">Instagram</a>}
                        {socialLinks?.instagram && socialLinks?.telegram && ' та '}
                        {socialLinks?.telegram && <a href={socialLinks.telegram} target="_blank" rel="noopener noreferrer">Telegram</a>}
                    </p>
                )}
            </div>
        </div>
    );
};

export default About;
