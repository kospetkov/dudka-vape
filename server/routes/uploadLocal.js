import express from 'express';
import path from 'path';
import fs from 'fs';
import { uploadLocal } from '../config/localStorage.js';
import { protect, admin } from '../middleware/auth.js';

const router = express.Router();

// Get base URL for images
const getImageUrl = (req, filename) => {
    const protocol = req.protocol;
    const host = req.get('host');
    return `${protocol}://${host}/uploads/${filename}`;
};

// @route   POST /api/upload-local
// @desc    Upload single image to local storage
// @access  Private/Admin
router.post('/', protect, admin, uploadLocal.single('image'), (req, res) => {
    try {
        if (!req.file) {
            return res.status(400).json({ message: 'No file uploaded' });
        }

        res.json({
            url: getImageUrl(req, req.file.filename),
            filename: req.file.filename,
            originalName: req.file.originalname,
            size: req.file.size
        });
    } catch (error) {
        console.error('Upload error:', error);
        res.status(500).json({ message: 'Error uploading file' });
    }
});

// @route   POST /api/upload-local/multiple
// @desc    Upload multiple images to local storage
// @access  Private/Admin
router.post('/multiple', protect, admin, uploadLocal.array('images', 10), (req, res) => {
    try {
        if (!req.files || req.files.length === 0) {
            return res.status(400).json({ message: 'No files uploaded' });
        }

        const uploadedFiles = req.files.map(file => ({
            url: getImageUrl(req, file.filename),
            filename: file.filename,
            originalName: file.originalname,
            size: file.size
        }));

        res.json(uploadedFiles);
    } catch (error) {
        console.error('Upload error:', error);
        res.status(500).json({ message: 'Error uploading files' });
    }
});

// @route   DELETE /api/upload-local/:filename
// @desc    Delete image from local storage
// @access  Private/Admin
router.delete('/:filename', protect, admin, (req, res) => {
    try {
        const filePath = path.join(process.cwd(), 'uploads', req.params.filename);
        
        if (fs.existsSync(filePath)) {
            fs.unlinkSync(filePath);
            res.json({ message: 'File deleted successfully' });
        } else {
            res.status(404).json({ message: 'File not found' });
        }
    } catch (error) {
        console.error('Delete error:', error);
        res.status(500).json({ message: 'Error deleting file' });
    }
});

export default router;
