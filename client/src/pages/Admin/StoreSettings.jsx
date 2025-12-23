import { useState, useEffect } from 'react';
import api from '../../utils/api';
import './Admin.css';

const StoreSettings = () => {
    const [settings, setSettings] = useState({
        storeName: 'DUDKA',
        storeDescription: 'Преміум вейп продукція',
        logoUrl: '/logo.png',
        contactEmails: ['info@dudka.ua'],
        contactPhones: ['+380 (50) 123-45-67'],
        workingHours: {
            weekdays: '10:00 - 20:00',
            saturday: '10:00 - 18:00',
            sunday: 'Вихідний'
        },
        heroTitle: 'Преміум Вейп Продукція',
        heroSubtitle: 'Відкрийте найкращий вибір e-liquid, пристроїв та аксесуарів',
        heroEnabled: true,
        heroSliderEnabled: false,
        heroSlider: []
    });
    
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [message, setMessage] = useState({ type: '', text: '' });
    const [newSlide, setNewSlide] = useState({
        title: '',
        subtitle: '',
        tag: '🎁 Акція',
        image: '',
        buttonText: '',
        buttonLink: '/catalog'
    });

    // Load settings from API
    useEffect(() => {
        const fetchSettings = async () => {
            try {
                const response = await api.get('/settings');
                setSettings(prev => ({ ...prev, ...response.data }));
            } catch (error) {
                console.error('Failed to fetch settings:', error);
                setMessage({ type: 'error', text: 'Помилка завантаження налаштувань' });
            } finally {
                setLoading(false);
            }
        };
        fetchSettings();
    }, []);

    const handleChange = (field, value) => {
        setSettings(prev => ({ ...prev, [field]: value }));
    };

    const handleWorkingHoursChange = (day, value) => {
        setSettings(prev => ({
            ...prev,
            workingHours: { ...prev.workingHours, [day]: value }
        }));
    };

    // Multiple emails
    const addEmail = () => {
        setSettings(prev => ({
            ...prev,
            contactEmails: [...prev.contactEmails, '']
        }));
    };

    const updateEmail = (index, value) => {
        setSettings(prev => ({
            ...prev,
            contactEmails: prev.contactEmails.map((e, i) => i === index ? value : e)
        }));
    };

    const removeEmail = (index) => {
        if (settings.contactEmails.length <= 1) return;
        setSettings(prev => ({
            ...prev,
            contactEmails: prev.contactEmails.filter((_, i) => i !== index)
        }));
    };

    // Multiple phones
    const addPhone = () => {
        setSettings(prev => ({
            ...prev,
            contactPhones: [...prev.contactPhones, '']
        }));
    };

    const updatePhone = (index, value) => {
        setSettings(prev => ({
            ...prev,
            contactPhones: prev.contactPhones.map((p, i) => i === index ? value : p)
        }));
    };

    const removePhone = (index) => {
        if (settings.contactPhones.length <= 1) return;
        setSettings(prev => ({
            ...prev,
            contactPhones: prev.contactPhones.filter((_, i) => i !== index)
        }));
    };

    // Save to API
    const handleSave = async () => {
        setSaving(true);
        setMessage({ type: '', text: '' });
        
        try {
            await api.put('/settings', settings);
            setMessage({ type: 'success', text: 'Налаштування збережено!' });
        } catch (error) {
            console.error('Save error:', error);
            setMessage({ type: 'error', text: 'Помилка збереження' });
        } finally {
            setSaving(false);
        }
    };

    const uploadImage = async (file) => {
        const formData = new FormData();
        formData.append('image', file);

        try {
            const response = await api.post('/upload', formData, {
                headers: { 'Content-Type': 'multipart/form-data' }
            });
            return response.data.url;
        } catch (error) {
            try {
                const localResponse = await api.post('/upload-local', formData, {
                    headers: { 'Content-Type': 'multipart/form-data' }
                });
                return localResponse.data.url;
            } catch (localError) {
                throw new Error('Upload failed');
            }
        }
    };

    const handleLogoUpload = async (e) => {
        const file = e.target.files[0];
        if (!file) return;

        try {
            setLoading(true);
            const url = await uploadImage(file);
            handleChange('logoUrl', url);
            setMessage({ type: 'success', text: 'Логотип завантажено!' });
        } catch (error) {
            setMessage({ type: 'error', text: 'Помилка завантаження логотипу' });
        } finally {
            setLoading(false);
        }
    };

    const handleSlideImageUpload = async (e) => {
        const file = e.target.files[0];
        if (!file) return;

        try {
            setLoading(true);
            const url = await uploadImage(file);
            setNewSlide(prev => ({ ...prev, image: url }));
        } catch (error) {
            setMessage({ type: 'error', text: 'Помилка завантаження зображення' });
        } finally {
            setLoading(false);
        }
    };

    const addSlide = () => {
        if (!newSlide.title || !newSlide.image) {
            setMessage({ type: 'error', text: 'Заповніть заголовок та зображення' });
            return;
        }

        setSettings(prev => ({
            ...prev,
            heroSlider: [...prev.heroSlider, { ...newSlide, _id: Date.now().toString() }]
        }));

        setNewSlide({
            title: '',
            subtitle: '',
            tag: '🎁 Акція',
            image: '',
            buttonText: '',
            buttonLink: '/catalog'
        });
        setMessage({ type: 'info', text: 'Слайд додано! Натисніть "Зберегти" для збереження.' });
    };

    const removeSlide = (id) => {
        setSettings(prev => ({
            ...prev,
            heroSlider: prev.heroSlider.filter(s => (s._id || s.id) !== id)
        }));
        setMessage({ type: 'info', text: 'Слайд видалено! Натисніть "Зберегти" для збереження.' });
    };

    const moveSlide = (index, direction) => {
        const newSlider = [...settings.heroSlider];
        const newIndex = index + direction;
        if (newIndex < 0 || newIndex >= newSlider.length) return;
        [newSlider[index], newSlider[newIndex]] = [newSlider[newIndex], newSlider[index]];
        setSettings(prev => ({ ...prev, heroSlider: newSlider }));
    };

    if (loading) {
        return (
            <div className="admin-page">
                <div className="loading-container">
                    <div className="loading-spinner"></div>
                    <p>Завантаження налаштувань...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="admin-page">
            <div className="admin-header">
                <h1>⚙️ Налаштування магазину</h1>
                <button 
                    className="btn btn-primary"
                    onClick={handleSave}
                    disabled={saving}
                >
                    {saving ? 'Збереження...' : '💾 Зберегти'}
                </button>
            </div>

            {message.text && (
                <div className={`admin-message ${message.type}`}>
                    {message.text}
                </div>
            )}

            <div className="admin-sections">
                {/* Basic Info */}
                <section className="admin-section">
                    <h2>📋 Основна інформація</h2>
                    
                    <div className="admin-form-group">
                        <label>Назва магазину</label>
                        <input
                            type="text"
                            value={settings.storeName}
                            onChange={(e) => handleChange('storeName', e.target.value)}
                            placeholder="DUDKA"
                        />
                    </div>

                    <div className="admin-form-group">
                        <label>Опис магазину</label>
                        <textarea
                            value={settings.storeDescription}
                            onChange={(e) => handleChange('storeDescription', e.target.value)}
                            placeholder="Преміум вейп продукція"
                            rows={3}
                        />
                    </div>

                    <div className="admin-form-group">
                        <label>Логотип</label>
                        <div className="logo-upload-container">
                            {settings.logoUrl && (
                                <img 
                                    src={settings.logoUrl} 
                                    alt="Logo" 
                                    className="logo-preview"
                                />
                            )}
                            <input
                                type="file"
                                accept="image/*"
                                onChange={handleLogoUpload}
                                disabled={loading}
                            />
                            <input
                                type="text"
                                value={settings.logoUrl}
                                onChange={(e) => handleChange('logoUrl', e.target.value)}
                                placeholder="URL логотипу"
                            />
                        </div>
                    </div>
                </section>

                {/* Contact Info */}
                <section className="admin-section">
                    <h2>📞 Контактна інформація</h2>
                    
                    <div className="admin-form-group">
                        <label>Email адреси</label>
                        {settings.contactEmails.map((email, index) => (
                            <div key={index} className="multi-input-row">
                                <input
                                    type="email"
                                    value={email}
                                    onChange={(e) => updateEmail(index, e.target.value)}
                                    placeholder="info@dudka.ua"
                                />
                                {settings.contactEmails.length > 1 && (
                                    <button 
                                        type="button"
                                        className="btn btn-danger btn-sm"
                                        onClick={() => removeEmail(index)}
                                    >
                                        ✕
                                    </button>
                                )}
                            </div>
                        ))}
                        <button 
                            type="button"
                            className="btn btn-secondary btn-sm"
                            onClick={addEmail}
                        >
                            ➕ Додати email
                        </button>
                    </div>

                    <div className="admin-form-group">
                        <label>Телефони</label>
                        {settings.contactPhones.map((phone, index) => (
                            <div key={index} className="multi-input-row">
                                <input
                                    type="text"
                                    value={phone}
                                    onChange={(e) => updatePhone(index, e.target.value)}
                                    placeholder="+380 (50) 123-45-67"
                                />
                                {settings.contactPhones.length > 1 && (
                                    <button 
                                        type="button"
                                        className="btn btn-danger btn-sm"
                                        onClick={() => removePhone(index)}
                                    >
                                        ✕
                                    </button>
                                )}
                            </div>
                        ))}
                        <button 
                            type="button"
                            className="btn btn-secondary btn-sm"
                            onClick={addPhone}
                        >
                            ➕ Додати телефон
                        </button>
                    </div>
                </section>

                {/* Working Hours */}
                <section className="admin-section">
                    <h2>🕐 Час роботи</h2>
                    
                    <div className="admin-form-group">
                        <label>Пн-Пт</label>
                        <input
                            type="text"
                            value={settings.workingHours?.weekdays || ''}
                            onChange={(e) => handleWorkingHoursChange('weekdays', e.target.value)}
                            placeholder="10:00 - 20:00"
                        />
                    </div>

                    <div className="admin-form-group">
                        <label>Субота</label>
                        <input
                            type="text"
                            value={settings.workingHours?.saturday || ''}
                            onChange={(e) => handleWorkingHoursChange('saturday', e.target.value)}
                            placeholder="10:00 - 18:00"
                        />
                    </div>

                    <div className="admin-form-group">
                        <label>Неділя</label>
                        <input
                            type="text"
                            value={settings.workingHours?.sunday || ''}
                            onChange={(e) => handleWorkingHoursChange('sunday', e.target.value)}
                            placeholder="Вихідний"
                        />
                    </div>
                </section>

                {/* Hero Section */}
                <section className="admin-section">
                    <h2>🎯 Hero секція (статична)</h2>
                    
                    <div className="admin-form-group">
                        <label className="toggle-label">
                            <input
                                type="checkbox"
                                checked={settings.heroEnabled !== false}
                                onChange={(e) => handleChange('heroEnabled', e.target.checked)}
                            />
                            <span className="toggle-text">
                                {settings.heroEnabled !== false ? '✅ Hero увімкнено' : '❌ Hero вимкнено'}
                            </span>
                        </label>
                    </div>
                    
                    <div className="admin-form-group">
                        <label>Заголовок</label>
                        <input
                            type="text"
                            value={settings.heroTitle}
                            onChange={(e) => handleChange('heroTitle', e.target.value)}
                            placeholder="Преміум Вейп Продукція"
                        />
                    </div>

                    <div className="admin-form-group">
                        <label>Підзаголовок</label>
                        <textarea
                            value={settings.heroSubtitle}
                            onChange={(e) => handleChange('heroSubtitle', e.target.value)}
                            placeholder="Опис..."
                            rows={2}
                        />
                    </div>
                </section>

                {/* Hero Slider */}
                <section className="admin-section">
                    <h2>🖼️ Промо слайдер</h2>
                    
                    <div className="admin-form-group">
                        <label className="toggle-label">
                            <input
                                type="checkbox"
                                checked={settings.heroSliderEnabled}
                                onChange={(e) => handleChange('heroSliderEnabled', e.target.checked)}
                            />
                            <span className="toggle-text">
                                {settings.heroSliderEnabled ? '✅ Слайдер увімкнено' : '❌ Слайдер вимкнено'}
                            </span>
                        </label>
                        <p className="admin-hint">
                            {settings.heroSliderEnabled 
                                ? 'Слайдер відображається замість статичного hero' 
                                : 'Буде показано статичний hero блок'}
                        </p>
                    </div>

                    {settings.heroSliderEnabled && (
                        <>
                            {settings.heroSlider.length > 0 && (
                                <div className="slides-list">
                                    <h4>Поточні слайди ({settings.heroSlider.length})</h4>
                                    {settings.heroSlider.map((slide, index) => (
                                        <div key={slide._id || slide.id || index} className="slide-item">
                                            <div className="slide-order">
                                                <button 
                                                    className="btn-order"
                                                    onClick={() => moveSlide(index, -1)}
                                                    disabled={index === 0}
                                                >
                                                    ▲
                                                </button>
                                                <span>{index + 1}</span>
                                                <button 
                                                    className="btn-order"
                                                    onClick={() => moveSlide(index, 1)}
                                                    disabled={index === settings.heroSlider.length - 1}
                                                >
                                                    ▼
                                                </button>
                                            </div>
                                            <img src={slide.image} alt={slide.title} className="slide-thumb" />
                                            <div className="slide-info">
                                                <strong>{slide.title}</strong>
                                                <span>{slide.subtitle}</span>
                                            </div>
                                            <button 
                                                className="btn btn-danger btn-sm"
                                                onClick={() => removeSlide(slide._id || slide.id)}
                                            >
                                                🗑️
                                            </button>
                                        </div>
                                    ))}
                                </div>
                            )}

                            <div className="add-slide-form">
                                <h4>➕ Додати слайд</h4>
                                
                                <div className="admin-form-group">
                                    <label>Тег (напр. "🎁 Акція")</label>
                                    <input
                                        type="text"
                                        value={newSlide.tag}
                                        onChange={(e) => setNewSlide(prev => ({ ...prev, tag: e.target.value }))}
                                        placeholder="🎁 Акція"
                                    />
                                </div>

                                <div className="admin-form-group">
                                    <label>Заголовок *</label>
                                    <input
                                        type="text"
                                        value={newSlide.title}
                                        onChange={(e) => setNewSlide(prev => ({ ...prev, title: e.target.value }))}
                                        placeholder="Новинки сезону"
                                    />
                                </div>

                                <div className="admin-form-group">
                                    <label>Підзаголовок</label>
                                    <input
                                        type="text"
                                        value={newSlide.subtitle}
                                        onChange={(e) => setNewSlide(prev => ({ ...prev, subtitle: e.target.value }))}
                                        placeholder="Знижки до 30%"
                                    />
                                </div>

                                <div className="admin-form-group">
                                    <label>Зображення *</label>
                                    <input
                                        type="file"
                                        accept="image/*"
                                        onChange={handleSlideImageUpload}
                                        disabled={loading}
                                    />
                                    <input
                                        type="text"
                                        value={newSlide.image}
                                        onChange={(e) => setNewSlide(prev => ({ ...prev, image: e.target.value }))}
                                        placeholder="URL зображення"
                                    />
                                    {newSlide.image && (
                                        <img src={newSlide.image} alt="Preview" className="slide-preview" />
                                    )}
                                </div>

                                <div className="admin-form-row">
                                    <div className="admin-form-group">
                                        <label>Текст кнопки</label>
                                        <input
                                            type="text"
                                            value={newSlide.buttonText}
                                            onChange={(e) => setNewSlide(prev => ({ ...prev, buttonText: e.target.value }))}
                                            placeholder="Переглянути"
                                        />
                                    </div>

                                    <div className="admin-form-group">
                                        <label>Посилання кнопки</label>
                                        <input
                                            type="text"
                                            value={newSlide.buttonLink}
                                            onChange={(e) => setNewSlide(prev => ({ ...prev, buttonLink: e.target.value }))}
                                            placeholder="/catalog"
                                        />
                                    </div>
                                </div>

                                <button 
                                    className="btn btn-secondary"
                                    onClick={addSlide}
                                    disabled={!newSlide.title || !newSlide.image || loading}
                                >
                                    {loading ? 'Завантаження...' : '➕ Додати слайд'}
                                </button>
                            </div>
                        </>
                    )}
                </section>
            </div>
        </div>
    );
};

export default StoreSettings;
