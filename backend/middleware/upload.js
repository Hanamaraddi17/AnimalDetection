const multer = require('multer');

// Configure Multer to store files in memory (buffer)
const storage = multer.memoryStorage();
const upload = multer({ storage });

module.exports = upload;
