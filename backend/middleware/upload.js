const multer = require('multer');
const path = require('path');
const fs = require('fs');

// Check if uploads directory exists, if not, create it
const uploadsDir = path.join(__dirname, '../uploads');

// Debug: Log the path to the uploads directory
console.log('Uploads Directory:', uploadsDir);

if (!fs.existsSync(uploadsDir)) {
    // Debug: Log when directory is created
    console.log('Uploads directory does not exist. Creating directory...');
    fs.mkdirSync(uploadsDir, { recursive: true });
    console.log('Uploads directory created.');
} else {
    console.log('Uploads directory already exists.');
}

// Set up Multer storage for saving uploaded images to the 'uploads/' directory
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        console.debug('Destination folder:', uploadsDir);
        cb(null, uploadsDir); // Directory to save the file
    },
    filename: (req, file, cb) => {
        console.debug('Received file in filename function:', file);  // Log file details here
        cb(null, `${Date.now()}-${file.originalname}`);
    }
});

// File filter to validate file types (jpeg, jpg, png, gif)
const fileFilter = (req, file, cb) => {
    console.log('Checking file type...'); // Debug
    const allowedTypes = /jpeg|jpg|png|gif/;
    const isValidExt = allowedTypes.test(path.extname(file.originalname).toLowerCase());
    const isValidMime = allowedTypes.test(file.mimetype);

    console.log('Is Valid Extension:', isValidExt); // Debug
    console.log('Is Valid MIME Type:', isValidMime); // Debug

    if (isValidExt && isValidMime) {
        cb(null, true);
    } else {
        console.log('Invalid file type detected. Only JPEG, PNG, and GIF are allowed.'); // Debug
        cb(new Error('Only JPEG, PNG, and GIF formats are allowed'));
    }
};

// File size limit (e.g., 2MB)
const fileSizeLimit = 20 * 1024 * 1024; // 2MB in bytes

// Initialize multer with storage settings, file filter, and file size limit
const upload = multer({
    storage,
    fileFilter,
    limits: {
        fileSize: fileSizeLimit // Set the file size limit
    }
});

// Debug: Log file size limit configuration
console.log(`File size limit set to: ${fileSizeLimit / (1024 * 1024)}MB`);

// Middleware to handle file uploads
module.exports = upload;
