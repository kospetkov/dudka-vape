import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import path from 'path';
import { fileURLToPath } from 'url';
import connectDB from './config/db.js';
import { initCronJobs } from './services/cronJobs.js';
import { triggerParser } from './services/parser.js';

// Routes
import authRoutes from './routes/auth.js';
import productRoutes from './routes/products.js';
import categoryRoutes from './routes/categories.js';
import orderRoutes from './routes/orders.js';
import adminRoutes from './routes/admin.js';
import uploadRoutes from './routes/upload.js';
import uploadLocalRoutes from './routes/uploadLocal.js';
import paymentRoutes from './routes/payment.js';
import deliveryRoutes from './routes/delivery.js';
import wishlistRoutes from './routes/wishlist.js';
import contactRoutes from './routes/contact.js';
import settingsRoutes from './routes/settings.js';

// Load environment variables
dotenv.config();

// Get __dirname equivalent for ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Connect to MongoDB
connectDB();

// Initialize Express app
const app = express();

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Serve uploaded files statically
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/products', productRoutes);
app.use('/api/categories', categoryRoutes);
app.use('/api/orders', orderRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/upload', uploadRoutes);           // Cloudinary uploads
app.use('/api/upload-local', uploadLocalRoutes); // Local file uploads
app.use('/api/payment', paymentRoutes);          // LiqPay integration
app.use('/api/delivery', deliveryRoutes);        // Nova Poshta integration
app.use('/api/wishlist', wishlistRoutes);        // Wishlist functionality
app.use('/api/contact', contactRoutes);          // Contact form
app.use('/api/settings', settingsRoutes);        // Store settings

// Manual parser trigger (for testing)
app.post('/api/parser/trigger', triggerParser);

// Health check
app.get('/api/health', (req, res) => {
    res.json({ 
        status: 'OK', 
        message: 'Server is running',
        features: {
            payment: process.env.LIQPAY_PUBLIC_KEY ? 'configured' : 'demo',
            delivery: process.env.NOVAPOSHTA_API_KEY ? 'configured' : 'demo',
            uploads: process.env.CLOUDINARY_CLOUD_NAME ? 'cloudinary' : 'local'
        }
    });
});

// Error handling middleware
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).json({ message: 'Something went wrong!' });
});

// Initialize cron jobs
initCronJobs();

// Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`🚀 Server running on port ${PORT}`);
    console.log(`📊 Environment: ${process.env.NODE_ENV || 'development'}`);
    console.log(`💳 LiqPay: ${process.env.LIQPAY_PUBLIC_KEY ? '✓ Configured' : '⚠ Demo mode'}`);
    console.log(`📦 Nova Poshta: ${process.env.NOVAPOSHTA_API_KEY ? '✓ Configured' : '⚠ Demo mode'}`);
});
