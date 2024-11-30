const { put } = require('@vercel/blob'); 
const AnimalImage = require('../models/animalImage');

// Function to upload animal image with latitude and longitude
exports.uploadAnimalImage = async (req, res) => {
    try {
        const { animalName, time, latitude, longitude } = req.body;

        // Validate required fields
        if (!animalName || !time || !latitude || !longitude || !req.file) {
            return res.status(400).json({ message: 'All fields (animalName, time, latitude, longitude, image) are required' });
        }

        // Parse latitude and longitude as floats and validate they are valid numbers
        const parsedLatitude = parseFloat(latitude);
        const parsedLongitude = parseFloat(longitude);

        if (isNaN(parsedLatitude) || isNaN(parsedLongitude)) {
            return res.status(400).json({ message: 'Latitude and Longitude must be valid numbers' });
        }

        // Upload the image to Vercel Blob Storage
        const blob = await put(req.file.originalname, req.file.buffer, {
            access: 'public',
            headers: {
                'Content-Type': req.file.mimetype,
            },
        });

        // Create and save the new animal image document in the database
        const animalImage = new AnimalImage({
            image: blob.url, // Store the URL of the uploaded image
            animalName,
            time,
            location: {
                latitude: parsedLatitude,
                longitude: parsedLongitude,
            },
            user: req.user.id,
        });

        await animalImage.save();

        res.status(201).json({ message: 'Image and location data uploaded successfully', animalImage });
    } catch (error) {
        console.error('Error uploading animal image:', error);
        res.status(500).json({ message: 'Something went wrong, please try again' });
    }
};

// Get all animal images for a specific user with latitude and longitude
exports.getAnimalImages = async (req, res) => {
    try {
        const images = await AnimalImage.find({ user: req.user.id });
        res.json(images);
    } catch (error) {
        console.error('Error fetching animal images:', error);
        res.status(500).json({ message: 'Something went wrong, please try again' });
    }
};

// Delete an animal image by ID
exports.deleteImage = async (req, res) => {
    try {
        const { id } = req.params;

        // Find the image by ID
        const image = await AnimalImage.findById(id);

        if (!image) {
            return res.status(404).json({ message: 'Image not found' });
        }

        // Verify ownership of the image
        if (image.user.toString() !== req.user.id) {
            return res.status(403).json({ message: 'You are not authorized to delete this image' });
        }

        // Delete the image document
        await image.deleteOne();

        res.status(200).json({ message: 'Image deleted successfully' });
    } catch (error) {
        console.error('Error deleting animal image:', error);
        res.status(500).json({ message: 'Something went wrong, please try again' });
    }
};
