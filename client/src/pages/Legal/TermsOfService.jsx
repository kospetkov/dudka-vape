import { Link } from 'react-router-dom';
import { useEffect } from 'react';
import { useSettings } from '../../context/SettingsContext';
import './Legal.css';

const TermsOfService = () => {
    const { storeName, contacts } = useSettings();

    useEffect(() => {
        document.title = `Умови використання | ${storeName || 'Shop'}`;
        window.scrollTo(0, 0);
    }, [storeName]);

    return (
        <div className="legal-page">
            <div className="legal-breadcrumbs">
                <Link to="/">Головна</Link>
                <span>/</span>
                <span>Умови використання</span>
            </div>

            <h1>Умови використання</h1>
            <p className="last-updated">Останнє оновлення: 19 грудня 2025 року</p>

            <p>
                Ласкаво просимо до інтернет-магазину {storeName || 'Shop'}. Використовуючи наш сайт, 
                ви погоджуєтесь з цими Умовами використання.
            </p>

            <h2>1. Загальні положення</h2>
            <p>
                {storeName || 'Shop'} — це інтернет-магазин електронних сигарет, вейпів та супутніх товарів. 
                Ми здійснюємо продаж виключно повнолітнім особам (18+ років).
            </p>

            <h2>2. Оформлення замовлень</h2>
            <p>
                Розміщуючи замовлення, ви робите пропозицію придбати товар. Договір 
                купівлі-продажу вважається укладеним з моменту підтвердження замовлення.
            </p>

            <h2>3. Ціни та оплата</h2>
            <p>Всі ціни на сайті вказані в українських гривнях (UAH).</p>
            <p>Доступні способи оплати:</p>
            <ul>
                <li>Онлайн-оплата карткою через LiqPay</li>
                <li>Накладений платіж при отриманні</li>
            </ul>

            <h2>4. Доставка</h2>
            <p>
                Ми здійснюємо доставку по всій території України через Нову Пошту та Укрпошту.
            </p>

            <h2>5. Повернення та обмін</h2>
            <p>
                Ви маєте право повернути товар належної якості протягом 14 днів з моменту отримання.
            </p>

            {(contacts?.email || contacts?.phone) && (
                <div className="contact-info">
                    <h3>Контакти</h3>
                    <p>
                        {contacts?.email && <>Email: <a href={`mailto:${contacts.email}`}>{contacts.email}</a><br /></>}
                        {contacts?.phone && <>Телефон: <a href={`tel:${contacts.phone.replace(/[^0-9+]/g, '')}`}>{contacts.phone}</a></>}
                    </p>
                </div>
            )}
        </div>
    );
};

export default TermsOfService;
