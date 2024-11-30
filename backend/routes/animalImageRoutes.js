const express = require('express'); 
const { uploadAnimalImage, getAnimalImages, deleteImage } = require('../controllers/animalImageController');
const auth = require('../middleware/authMiddleware');
const upload = require('../middleware/upload'); // Ensure correct path
const router = express.Router();

// 1. POST Route: Upload Animal Image
router.post('/upload', auth, upload.single('image'), uploadAnimalImage);

// 2. GET Route: Retrieve All Animal Images
router.get('/', auth, getAnimalImages);

// 3. DELETE Route: Delete an Animal Image by ID
// Example: DELETE /data/12345
router.delete('/delete/:id', auth, async (req, res, next) => {
    const { id } = req.params; // Get 'id' from the route parameter
    if (!id) {
        return res.status(400).json({ message: 'Image ID is required to delete an image' });
    }
    try {
        await deleteImage(req, res, next); // Call your controller to handle deletion
    } catch (error) {
        next(error); // Pass errors to the error-handling middleware
    }
});


module.exports = router;
