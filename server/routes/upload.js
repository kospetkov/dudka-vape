import express from 'express';
import path from 'path';
import crypto from 'crypto';
import { protect, admin } from '../middleware/auth.js';
import { uploadLocal } from '../config/localStorage.js';

const router = express.Router();

// Check if Cloudinary is configured
let cloudinaryUpload = null;
try {
    if (process.env.CLOUDINARY_CLOUD_NAME && 
        process.env.CLOUDINARY_API_KEY && 
        process.env.CLOUDINARY_API_SECRET) {
        const { upload } = await import('../config/cloudinary.js');
        cloudinaryUpload = upload;
        console.log('☁️ Cloudinary configured');
    }
} catch (error) {
    console.log('📁 Using local storage for uploads');
}

// Get base URL for local images
const getImageUrl = (req, filename) => {
    const protocol = req.protocol;
    const host = req.get('host');
    return `${protocol}://${host}/uploads/${filename}`;
};

// Use local upload as fallback
const uploadMiddleware = cloudinaryUpload ? cloudinaryUpload.single('image') : uploadLocal.single('image');
const uploadMultipleMiddleware = cloudinaryUpload ? cloudinaryUpload.array('images', 10) : uploadLocal.array('images', 10);

// @route   POST /api/upload
// @desc    Upload single image (Cloudinary or Local)
// @access  Private/Admin
router.post('/', protect, admin, uploadMiddleware, (req, res) => {
    try {
        if (!req.file) {
            return res.status(400).json({ message: 'No file uploaded' });
        }

        // Cloudinary returns path as URL, local needs to build URL
        let url;
        if (cloudinaryUpload && req.file.path && req.file.path.startsWith('http')) {
            url = req.file.path;
        } else {
            url = getImageUrl(req, req.file.filename);
        }

        res.json({
            url: url,
            publicId: req.file.filename,
            originalName: req.file.originalname,
            size: req.file.size
        });
    } catch (error) {
        console.error('Upload error:', error);
        res.status(500).json({ message: 'Error uploading file' });
    }
});

// @route   POST /api/upload/multiple
// @desc    Upload multiple images
// @access  Private/Admin
router.post('/multiple', protect, admin, uploadMultipleMiddleware, (req, res) => {
    try {
        if (!req.files || req.files.length === 0) {
            return res.status(400).json({ message: 'No files uploaded' });
        }

        const uploadedFiles = req.files.map(file => {
            let url;
            if (cloudinaryUpload && file.path && file.path.startsWith('http')) {
                url = file.path;
            } else {
                url = getImageUrl(req, file.filename);
            }
            return {
                url: url,
                publicId: file.filename,
                originalName: file.originalname,
                size: file.size
            };
        });

        res.json(uploadedFiles);
    } catch (error) {
        console.error('Upload error:', error);
        res.status(500).json({ message: 'Error uploading files' });
    }
});

export default router;
