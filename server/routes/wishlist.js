import express from 'express';
import User from '../models/User.js';
import { protect } from '../middleware/auth.js';

const router = express.Router();

// @route   GET /api/wishlist
// @desc    Get user's wishlist
// @access  Private
router.get('/', protect, async (req, res) => {
    try {
        const user = await User.findById(req.user._id)
            .populate('wishlist', 'name price oldPrice images stock slug');
        
        res.json(user.wishlist || []);
    } catch (error) {
        console.error('Get wishlist error:', error);
        res.status(500).json({ message: 'Помилка сервера' });
    }
});

// @route   POST /api/wishlist/add/:productId
// @desc    Add product to wishlist
// @access  Private
router.post('/add/:productId', protect, async (req, res) => {
    try {
        const { productId } = req.params;
        const user = await User.findById(req.user._id);

        // Check if already in wishlist
        if (user.wishlist.includes(productId)) {
            return res.status(400).json({ message: 'Товар вже в списку бажань' });
        }

        user.wishlist.push(productId);
        await user.save();

        res.json({ 
            message: 'Товар додано до списку бажань',
            wishlist: user.wishlist 
        });
    } catch (error) {
        console.error('Add to wishlist error:', error);
        res.status(500).json({ message: 'Помилка сервера' });
    }
});

// @route   DELETE /api/wishlist/remove/:productId
// @desc    Remove product from wishlist
// @access  Private
router.delete('/remove/:productId', protect, async (req, res) => {
    try {
        const { productId } = req.params;
        const user = await User.findById(req.user._id);

        user.wishlist = user.wishlist.filter(
            id => id.toString() !== productId
        );
        await user.save();

        res.json({ 
            message: 'Товар видалено зі списку бажань',
            wishlist: user.wishlist 
        });
    } catch (error) {
        console.error('Remove from wishlist error:', error);
        res.status(500).json({ message: 'Помилка сервера' });
    }
});

// @route   POST /api/wishlist/toggle/:productId
// @desc    Toggle product in wishlist (add if not present, remove if present)
// @access  Private
router.post('/toggle/:productId', protect, async (req, res) => {
    try {
        const { productId } = req.params;
        const user = await User.findById(req.user._id);

        const isInWishlist = user.wishlist.some(
            id => id.toString() === productId
        );

        if (isInWishlist) {
            user.wishlist = user.wishlist.filter(
                id => id.toString() !== productId
            );
        } else {
            user.wishlist.push(productId);
        }

        await user.save();

        res.json({ 
            message: isInWishlist ? 'Видалено зі списку бажань' : 'Додано до списку бажань',
            isInWishlist: !isInWishlist,
            wishlist: user.wishlist 
        });
    } catch (error) {
        console.error('Toggle wishlist error:', error);
        res.status(500).json({ message: 'Помилка сервера' });
    }
});

export default router;
