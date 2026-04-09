const multer = require('multer');
const path = require('path');

// Set storage engine
const storage = multer.diskStorage({
    destination: './public/images/',
    filename: function(req, file, cb) {
        cb(null, file.fieldname + '-' + Date.now() + path.extname(file.originalname));
    }
});

// Init upload
const upload = multer({
    storage: storage,
    limits: { fileSize: 5000000 }, // 5MB limit
    fileFilter: function(req, file, cb) {
        checkFileType(file, cb);
    }
});

// Kiểm tra loại file
function checkFileType(file, cb) {
    // Các định dạng file được phép
    const filetypes = /jpeg|jpg|png|gif/;
    // Kiểm tra định dạng file
    const extname = filetypes.test(path.extname(file.originalname).toLowerCase());
    // Kiểm tra mime
    const mimetype = filetypes.test(file.mimetype);

    if (mimetype && extname) {
        return cb(null, true);
    } else {
        cb('Error: Images Only!');
    }
}

module.exports = upload;
