import express from 'express';
import Settings from '../models/Settings.js';
import { protect, admin } from '../middleware/auth.js';

const router = express.Router();

// @route   GET /api/settings
// @desc    Get store settings (public)
// @access  Public
router.get('/', async (req, res) => {
    try {
        const settings = await Settings.getSettings();
        res.json(settings);
    } catch (error) {
        console.error('Get settings error:', error);
        res.status(500).json({ message: 'Помилка отримання налаштувань' });
    }
});

// @route   PUT /api/settings
// @desc    Update store settings
// @access  Admin
router.put('/', protect, admin, async (req, res) => {
    try {
        const updates = req.body;
        
        // Remove fields that shouldn't be updated directly
        delete updates._id;
        delete updates.key;
        delete updates.__v;
        delete updates.createdAt;
        delete updates.updatedAt;
        
        // Clean up heroSlider - remove invalid _id fields
        if (updates.heroSlider && Array.isArray(updates.heroSlider)) {
            updates.heroSlider = updates.heroSlider.map(slide => {
                const cleanSlide = { ...slide };
                // Remove _id if it's not a valid ObjectId (temp IDs from frontend)
                if (cleanSlide._id && !cleanSlide._id.match(/^[0-9a-fA-F]{24}$/)) {
                    delete cleanSlide._id;
                }
                return cleanSlide;
            });
        }
        
        const settings = await Settings.updateSettings(updates);
        res.json(settings);
    } catch (error) {
        console.error('Update settings error:', error);
        res.status(500).json({ message: 'Помилка збереження налаштувань' });
    }
});

// @route   POST /api/settings/slider
// @desc    Add slide to slider
// @access  Admin
router.post('/slider', protect, admin, async (req, res) => {
    try {
        const { title, subtitle, image, buttonText, buttonLink } = req.body;
        
        if (!title || !image) {
            return res.status(400).json({ message: 'Заголовок та зображення обов\'язкові' });
        }
        
        const settings = await Settings.getSettings();
        settings.heroSlider.push({
            title,
            subtitle: subtitle || '',
            image,
            buttonText: buttonText || '',
            buttonLink: buttonLink || '/catalog',
            order: settings.heroSlider.length
        });
        
        await settings.save();
        res.json(settings);
    } catch (error) {
        console.error('Add slide error:', error);
        res.status(500).json({ message: 'Помилка додавання слайду' });
    }
});

// @route   DELETE /api/settings/slider/:slideId
// @desc    Remove slide from slider
// @access  Admin
router.delete('/slider/:slideId', protect, admin, async (req, res) => {
    try {
        const settings = await Settings.getSettings();
        settings.heroSlider = settings.heroSlider.filter(
            slide => slide._id.toString() !== req.params.slideId
        );
        await settings.save();
        res.json(settings);
    } catch (error) {
        console.error('Remove slide error:', error);
        res.status(500).json({ message: 'Помилка видалення слайду' });
    }
});

// @route   PUT /api/settings/slider/reorder
// @desc    Reorder slides
// @access  Admin
router.put('/slider/reorder', protect, admin, async (req, res) => {
    try {
        const { slideIds } = req.body; // Array of slide IDs in new order
        
        const settings = await Settings.getSettings();
        const reorderedSlides = slideIds.map((id, index) => {
            const slide = settings.heroSlider.find(s => s._id.toString() === id);
            if (slide) {
                slide.order = index;
                return slide;
            }
            return null;
        }).filter(Boolean);
        
        settings.heroSlider = reorderedSlides;
        await settings.save();
        res.json(settings);
    } catch (error) {
        console.error('Reorder slides error:', error);
        res.status(500).json({ message: 'Помилка сортування слайдів' });
    }
});

export default router;
