import { Link } from 'react-router-dom';
import { useEffect } from 'react';
import { useSettings } from '../../context/SettingsContext';
import './Legal.css';

const PublicOffer = () => {
    const { storeName, contacts } = useSettings();

    useEffect(() => {
        document.title = `Публічна оферта | ${storeName || 'Shop'}`;
        window.scrollTo(0, 0);
    }, [storeName]);

    return (
        <div className="legal-page">
            <div className="legal-breadcrumbs">
                <Link to="/">Головна</Link>
                <span>/</span>
                <span>Публічна оферта</span>
            </div>

            <h1>Публічна оферта</h1>
            <p className="last-updated">Останнє оновлення: 19 грудня 2025 року</p>

            <p>
                Цей документ є офіційною публічною пропозицією (офертою) інтернет-магазину 
                {storeName || 'Shop'} укласти договір купівлі-продажу товарів.
            </p>

            <h2>1. Терміни та визначення</h2>
            <ul>
                <li><strong>Продавець</strong> — інтернет-магазин {storeName || 'Shop'}</li>
                <li><strong>Покупець</strong> — фізична особа, яка досягла 18 років</li>
                <li><strong>Товар</strong> — продукція, представлена на сайті</li>
            </ul>

            <h2>2. Предмет договору</h2>
            <p>
                Продавець зобов'язується передати у власність Покупцю Товар, а Покупець 
                зобов'язується оплатити та прийняти Товар на умовах цього Договору.
            </p>

            <h2>3. Ціна та порядок оплати</h2>
            <p>
                Ціна кожного товару вказана на Сайті в українських гривнях (UAH).
            </p>

            <h2>4. Доставка товару</h2>
            <ul>
                <li><strong>Нова Пошта:</strong> доставка у відділення або кур'єром</li>
                <li><strong>Укрпошта:</strong> доставка у відділення</li>
            </ul>

            <h2>5. Гарантія та повернення</h2>
            <p>
                На електронні пристрої надається гарантія виробника. 
                Рідини та одноразові вейпи не підлягають поверненню.
            </p>

            <div className="contact-info">
                <h3>Реквізити Продавця</h3>
                <p>
                    <strong>{storeName || 'Shop'}</strong><br />
                    {contacts?.email && <>Email: <a href={`mailto:${contacts.email}`}>{contacts.email}</a><br /></>}
                    {contacts?.phone && <>Телефон: <a href={`tel:${contacts.phone.replace(/[^0-9+]/g, '')}`}>{contacts.phone}</a></>}
                </p>
            </div>
        </div>
    );
};

export default PublicOffer;
