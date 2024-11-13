const express = require('express');
const { uploadAnimalImage, getAnimalImages} = require('../controllers/animalImageController');
const auth = require('../middleware/authMiddleware');
const upload = require('../middleware/upload'); // Adjust path if needed
const router = express.Router();

 
// Use `upload.single('image')` in the route to apply file upload middleware
router.post('/upload', auth, upload.single('image'), uploadAnimalImage);

router.get('/', auth, getAnimalImages);

module.exports = router;





