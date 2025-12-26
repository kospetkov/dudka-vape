import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import './Legal/Legal.css';
import './Contact.css';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

const Contact = () => {
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        phone: '',
        subject: '',
        message: ''
    });
    const [status, setStatus] = useState({ type: '', message: '' });
    const [isSubmitting, setIsSubmitting] = useState(false);

    useEffect(() => {
        document.title = 'Контакти | DUDKA';
        window.scrollTo(0, 0);
    }, []);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsSubmitting(true);
        setStatus({ type: '', message: '' });

        try {
            const response = await fetch(`${API_URL}/api/contact`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(formData)
            });

            const data = await response.json();

            if (response.ok) {
                setStatus({ type: 'success', message: data.message });
                setFormData({ name: '', email: '', phone: '', subject: '', message: '' });
            } else {
                setStatus({ type: 'error', message: data.message });
            }
        } catch (error) {
            setStatus({ type: 'error', message: 'Помилка з\'єднання. Спробуйте пізніше.' });
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="legal-page contact-page">
            <div className="legal-breadcrumbs">
                <Link to="/">Головна</Link>
                <span>/</span>
                <span>Контакти</span>
            </div>

            <h1>Зв'яжіться з нами</h1>

            <div className="contact-grid">
                <div className="contact-info-block">
                    <h2>Контактна інформація</h2>
                    
                    <div className="contact-item">
                        <span className="contact-icon">📍</span>
                        <div>
                            <strong>Адреса</strong>
                            <p>м. Кропивницький, Україна</p>
                        </div>
                    </div>

                    <div className="contact-item">
                        <span className="contact-icon">🕐</span>
                        <div>
                            <strong>Режим роботи</strong>
                            <p>Щодня 10:00 – 20:00</p>
                        </div>
                    </div>

                    <div className="contact-item">
                        <span className="contact-icon">📱</span>
                        <div>
                            <strong>Телефон</strong>
                            <p><a href="tel:+380501234567">+380 (50) 123-45-67</a></p>
                        </div>
                    </div>

                    <div className="contact-item">
                        <span className="contact-icon">✉️</span>
                        <div>
                            <strong>Email</strong>
                            <p><a href="mailto:info@dudka.ua">info@dudka.ua</a></p>
                        </div>
                    </div>

                    <div className="contact-socials">
                        <h3>Ми в соцмережах</h3>
                        <div className="social-links">
                            <a href="https://instagram.com/dudkavape" target="_blank" rel="noopener noreferrer">
                                Instagram
                            </a>
                            <a href="https://t.me/dudkavape" target="_blank" rel="noopener noreferrer">
                                Telegram
                            </a>
                        </div>
                    </div>
                </div>

                <div className="contact-form-block">
                    <h2>Написати нам</h2>
                    
                    {status.message && (
                        <div className={`contact-alert ${status.type}`}>
                            {status.message}
                        </div>
                    )}

                    <form onSubmit={handleSubmit} className="contact-form">
                        <div className="form-group">
                            <label htmlFor="name">Ім'я *</label>
                            <input
                                type="text"
                                id="name"
                                name="name"
                                value={formData.name}
                                onChange={handleChange}
                                required
                                maxLength={100}
                                placeholder="Ваше ім'я"
                            />
                        </div>

                        <div className="form-group">
                            <label htmlFor="email">Email *</label>
                            <input
                                type="email"
                                id="email"
                                name="email"
                                value={formData.email}
                                onChange={handleChange}
                                required
                                placeholder="your@email.com"
                            />
                        </div>

                        <div className="form-group">
                            <label htmlFor="phone">Телефон</label>
                            <input
                                type="tel"
                                id="phone"
                                name="phone"
                                value={formData.phone}
                                onChange={handleChange}
                                placeholder="+380 XX XXX XX XX"
                            />
                        </div>

                        <div className="form-group">
                            <label htmlFor="subject">Тема</label>
                            <input
                                type="text"
                                id="subject"
                                name="subject"
                                value={formData.subject}
                                onChange={handleChange}
                                maxLength={200}
                                placeholder="Тема звернення"
                            />
                        </div>

                        <div className="form-group">
                            <label htmlFor="message">Повідомлення *</label>
                            <textarea
                                id="message"
                                name="message"
                                value={formData.message}
                                onChange={handleChange}
                                required
                                maxLength={2000}
                                rows={5}
                                placeholder="Ваше повідомлення..."
                            />
                        </div>

                        <button 
                            type="submit" 
                            className="btn btn-primary contact-submit"
                            disabled={isSubmitting}
                        >
                            {isSubmitting ? 'Надсилання...' : 'Надіслати повідомлення'}
                        </button>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default Contact;
