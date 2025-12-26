import express from 'express';
import ContactMessage from '../models/ContactMessage.js';
import { protect, admin } from '../middleware/auth.js';

const router = express.Router();

// POST /api/contact - отправка сообщения (публичный)
router.post('/', async (req, res) => {
    try {
        const { name, email, phone, subject, message } = req.body;

        // Валидация
        if (!name || !email || !message) {
            return res.status(400).json({ 
                message: 'Заповніть обов\'язкові поля: ім\'я, email, повідомлення' 
            });
        }

        // Простая валидация email
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
            return res.status(400).json({ message: 'Невірний формат email' });
        }

        const contactMessage = new ContactMessage({
            name: name.trim(),
            email: email.trim(),
            phone: phone?.trim(),
            subject: subject?.trim(),
            message: message.trim(),
            ipAddress: req.ip || req.connection.remoteAddress
        });

        await contactMessage.save();

        res.status(201).json({ 
            message: 'Дякуємо! Ваше повідомлення надіслано.',
            id: contactMessage._id 
        });
    } catch (error) {
        console.error('Contact form error:', error);
        res.status(500).json({ message: 'Помилка сервера. Спробуйте пізніше.' });
    }
});

// GET /api/contact - список сообщений (только админ)
router.get('/', protect, admin, async (req, res) => {
    try {
        const { status, page = 1, limit = 20 } = req.query;
        
        const query = {};
        if (status && status !== 'all') {
            query.status = status;
        }

        const messages = await ContactMessage.find(query)
            .sort({ createdAt: -1 })
            .skip((page - 1) * limit)
            .limit(parseInt(limit));

        const total = await ContactMessage.countDocuments(query);
        const newCount = await ContactMessage.countDocuments({ status: 'new' });

        res.json({
            messages,
            pagination: {
                page: parseInt(page),
                limit: parseInt(limit),
                total,
                pages: Math.ceil(total / limit)
            },
            newCount
        });
    } catch (error) {
        console.error('Get messages error:', error);
        res.status(500).json({ message: 'Помилка сервера' });
    }
});

// PATCH /api/contact/:id - обновить статус (только админ)
router.patch('/:id', protect, admin, async (req, res) => {
    try {
        const { status, adminNotes } = req.body;
        
        const message = await ContactMessage.findByIdAndUpdate(
            req.params.id,
            { 
                ...(status && { status }),
                ...(adminNotes !== undefined && { adminNotes })
            },
            { new: true }
        );

        if (!message) {
            return res.status(404).json({ message: 'Повідомлення не знайдено' });
        }

        res.json(message);
    } catch (error) {
        console.error('Update message error:', error);
        res.status(500).json({ message: 'Помилка сервера' });
    }
});

// DELETE /api/contact/:id - удалить (только админ)
router.delete('/:id', protect, admin, async (req, res) => {
    try {
        const message = await ContactMessage.findByIdAndDelete(req.params.id);
        
        if (!message) {
            return res.status(404).json({ message: 'Повідомлення не знайдено' });
        }

        res.json({ message: 'Повідомлення видалено' });
    } catch (error) {
        console.error('Delete message error:', error);
        res.status(500).json({ message: 'Помилка сервера' });
    }
});

export default router;
