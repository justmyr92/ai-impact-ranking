const multer = require("multer");
const path = require("path");

// Define storage for the uploaded files
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, "uploads/"); // Specify your uploads directory
    },
    filename: (req, file, cb) => {
        // Save the file with its original name and extension
        cb(null, `${Date.now()}-${file.originalname}`);
    },
});

// Define file filter for image and PDF types
const fileFilter = (req, file, cb) => {
    const allowedTypes = /jpeg|jpg|png|gif|pdf/;
    const extname = allowedTypes.test(
        path.extname(file.originalname).toLowerCase()
    );
    const mimetype = allowedTypes.test(file.mimetype);

    if (extname && mimetype) {
        return cb(null, true);
    } else {
        cb(new Error("Only images and PDFs are allowed!"), false);
    }
};

// Create upload instance
const upload = multer({
    storage: storage,
    fileFilter: fileFilter,
    limits: { fileSize: 10 * 1024 * 1024 }, // Limit file size to 10MB
});

module.exports = upload;
