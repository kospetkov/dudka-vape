import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useSettings } from '../context/SettingsContext';
import './Legal/Legal.css';
import './Contact.css';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

const Contact = () => {
    const { storeName, contactEmails, contactPhones, address, workingHours, socialLinks } = useSettings();
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
        document.title = `Контакти | ${storeName || 'Shop'}`;
        window.scrollTo(0, 0);
    }, [storeName]);

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
                    
                    {address && (
                        <div className="contact-item">
                            <span className="contact-icon">📍</span>
                            <div>
                                <strong>Адреса</strong>
                                <p>{address}</p>
                            </div>
                        </div>
                    )}

                    {workingHours && (
                        <div className="contact-item">
                            <span className="contact-icon">🕐</span>
                            <div>
                                <strong>Режим роботи</strong>
                                {workingHours.weekdays && <p>Пн-Пт: {workingHours.weekdays}</p>}
                                {workingHours.saturday && <p>Сб: {workingHours.saturday}</p>}
                                {workingHours.sunday && <p>Нд: {workingHours.sunday}</p>}
                            </div>
                        </div>
                    )}

                    {contactPhones?.length > 0 && (
                        <div className="contact-item">
                            <span className="contact-icon">📱</span>
                            <div>
                                <strong>Телефон{contactPhones.length > 1 ? 'и' : ''}</strong>
                                {contactPhones.map((phone, idx) => (
                                    phone && <p key={idx}><a href={`tel:${phone.replace(/[^0-9+]/g, '')}`}>{phone}</a></p>
                                ))}
                            </div>
                        </div>
                    )}

                    {contactEmails?.length > 0 && (
                        <div className="contact-item">
                            <span className="contact-icon">✉️</span>
                            <div>
                                <strong>Email</strong>
                                {contactEmails.map((email, idx) => (
                                    email && <p key={idx}><a href={`mailto:${email}`}>{email}</a></p>
                                ))}
                            </div>
                        </div>
                    )}

                    {(socialLinks?.instagram || socialLinks?.telegram || socialLinks?.tiktok || socialLinks?.youtube || socialLinks?.facebook) && (
                        <div className="contact-socials">
                            <h3>Ми в соцмережах</h3>
                            <div className="social-links">
                                {socialLinks?.instagram && (
                                    <a href={socialLinks.instagram} target="_blank" rel="noopener noreferrer">
                                        Instagram
                                    </a>
                                )}
                                {socialLinks?.telegram && (
                                    <a href={socialLinks.telegram} target="_blank" rel="noopener noreferrer">
                                        Telegram
                                    </a>
                                )}
                                {socialLinks?.tiktok && (
                                    <a href={socialLinks.tiktok} target="_blank" rel="noopener noreferrer">
                                        TikTok
                                    </a>
                                )}
                                {socialLinks?.youtube && (
                                    <a href={socialLinks.youtube} target="_blank" rel="noopener noreferrer">
                                        YouTube
                                    </a>
                                )}
                                {socialLinks?.facebook && (
                                    <a href={socialLinks.facebook} target="_blank" rel="noopener noreferrer">
                                        Facebook
                                    </a>
                                )}
                            </div>
                        </div>
                    )}
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
