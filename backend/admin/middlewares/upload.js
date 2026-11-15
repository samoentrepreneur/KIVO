const multer = require("multer");
const storage = multer.diskStorage({});

const allowedMimeTypes = new Set([
    "image/jpeg",
    "image/png",
    "image/webp",
    "image/gif",
    "image/avif"
]);

module.exports = multer({
    storage,
    limits: { fileSize: 5 * 1024 * 1024 },
    fileFilter: (req, file, callback) => {
        if (!allowedMimeTypes.has(file.mimetype)) {
            return callback(new Error("Unsupported image type. Use JPG, PNG, WEBP, GIF or AVIF."));
        }
        callback(null, true);
    }
});
