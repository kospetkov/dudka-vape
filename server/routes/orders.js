import express from 'express';
import Order from '../models/Order.js';
import User from '../models/User.js';
import { protect } from '../middleware/auth.js';

const router = express.Router();

// @route   POST /api/orders
// @desc    Create new order
// @access  Public (guest) or Private (user)
router.post('/', async (req, res) => {
    try {
        const { items, total, donationAmount, guestInfo } = req.body;

        // Validate items
        if (!items || items.length === 0) {
            return res.status(400).json({ message: 'No order items' });
        }

        // Create order object
        const orderData = {
            items,
            total,
            donationAmount: donationAmount || 0
        };

        // If user is authenticated
        if (req.headers.authorization) {
            try {
                const token = req.headers.authorization.split(' ')[1];
                const jwt = await import('jsonwebtoken');
                const decoded = jwt.verify(token, process.env.JWT_SECRET);
                const user = await User.findById(decoded.id);

                if (user) {
                    orderData.user = user._id;
                }
            } catch (error) {
                // Token invalid, treat as guest
                console.log('Invalid token, treating as guest order');
            }
        }

        // If guest order
        if (!orderData.user) {
            if (!guestInfo || !guestInfo.name || !guestInfo.email || !guestInfo.phone) {
                return res.status(400).json({
                    message: 'Guest information required (name, email, phone)'
                });
            }
            orderData.guestInfo = guestInfo;
        }

        // Create order
        const order = await Order.create(orderData);

        // If user order, add to user's order history
        if (orderData.user) {
            await User.findByIdAndUpdate(
                orderData.user,
                { $push: { orderHistory: order._id } }
            );
        }

        res.status(201).json(order);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// @route   GET /api/orders/my
// @desc    Get logged in user orders
// @access  Private
router.get('/my', protect, async (req, res) => {
    try {
        const orders = await Order.find({ user: req.user._id })
            .populate('items.product')
            .sort({ createdAt: -1 });

        res.json(orders);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// @route   GET /api/orders/:id
// @desc    Get order by ID
// @access  Private
router.get('/:id', protect, async (req, res) => {
    try {
        const order = await Order.findById(req.params.id)
            .populate('items.product')
            .populate('user', 'name email');

        if (order) {
            // Check if order belongs to user
            if (order.user && order.user._id.toString() !== req.user._id.toString()) {
                return res.status(403).json({ message: 'Not authorized' });
            }
            res.json(order);
        } else {
            res.status(404).json({ message: 'Order not found' });
        }
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

export default router;
