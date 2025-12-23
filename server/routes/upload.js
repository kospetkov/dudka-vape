import express from 'express';
import { upload } from '../config/cloudinary.js';
import { protect, admin } from '../middleware/auth.js';

const router = express.Router();

// @route   POST /api/upload
// @desc    Upload single image
// @access  Private/Admin
router.post('/', protect, admin, upload.single('image'), (req, res) => {
    try {
        if (!req.file) {
            return res.status(400).json({ message: 'No file uploaded' });
        }

        res.json({
            url: req.file.path,
            publicId: req.file.filename
        });
    } catch (error) {
        console.error('Upload error:', error);
        res.status(500).json({ message: 'Error uploading file' });
    }
});

// @route   POST /api/upload/multiple
// @desc    Upload multiple images
// @access  Private/Admin
router.post('/multiple', protect, admin, upload.array('images', 10), (req, res) => {
    try {
        if (!req.files || req.files.length === 0) {
            return res.status(400).json({ message: 'No files uploaded' });
        }

        const uploadedFiles = req.files.map(file => ({
            url: file.path,
            publicId: file.filename
        }));

        res.json(uploadedFiles);
    } catch (error) {
        console.error('Upload error:', error);
        res.status(500).json({ message: 'Error uploading files' });
    }
});

export default router;
