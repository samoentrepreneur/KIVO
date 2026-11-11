const multer = require("multer");

// temp store, then upload to Cloudinary
const storage = multer.diskStorage({});

module.exports = multer({ storage });
