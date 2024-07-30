const express = require('express');
const multer = require('multer');
const Image = require('../models/Image');
const router = express.Router();

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        return cb(null, require('path').resolve('./')+"/uploads");
    },
    filename: (req, file, cb) => {
       return cb(null, `${file.originalname}`);
    },
});

const upload = multer({
    storage: storage,
    limits: { fileSize: 5 * 1024 * 1024 },
    fileFilter: (req, file, cb) => {
        if (file.mimetype === 'image/jpeg' || file.mimetype === 'image/png') {
            cb(null, true);
        } else {
            cb(new Error('Unsupported file format'), false);
        }
    },
});

router.post('/uploads', upload.single('image'), async (req, res) => {
    try {
        const { file } = req;
        console.log("file", file);
        if (!file) {
            return res.status(400).json({ message: 'No file uploaded' });
        }
        const imageUrl = `${req.protocol}://${req.get('host')}/uploads/${file.filename}`;
        const image = new Image({
            url: imageUrl,
            filename: file.filename,
            size: file.size,
            mimetype: file.mimetype,
        });
        await image.save();
        res.status(201).json(image);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

router.get('/', async (req, res) => {
    try {
        const images = await Image.find();
        res.status(200).json(images);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

router.delete('/:id', async (req, res) => {
    try {
        const imageId = req.params.id;

        const image = await Image.findByIdAndDelete(imageId);

        if (!image) {
            return res.status(404).json({ message: 'Image not found' });
        }

        res.json({ message: 'Image deleted successfully' });
    } catch (error) {
        console.error('Error deleting image:', error);
        res.status(500).json({ message: 'Internal Server Error' });
    }
});

module.exports = router;
