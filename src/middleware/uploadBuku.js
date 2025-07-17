import multer from 'multer';
import path from 'path';
import fs from 'fs';

const uploadDir = 'uploads_buku/';
if (!fs.existsSync(uploadDir)) {
    fs.mkdirSync(uploadDir, { recursive: true });
}

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, uploadDir);
    },
    filename: (req, file, cb) => {
        cb(null, `${Date.now()}-${file.originalname}`);
    },
});

const fileFilter = (req, file, cb) => {
    const allowType = ['image/jpeg', 'image/png', 'image/jpg'];
    const extname = path.extname(file.originalname).toLowerCase();

    if (allowType.includes(file.mimetype) && ['.jpg', '.jpeg', '.png'].includes(extname)) {
        cb(null, true);
    } else {
        cb(new Error(`Format File '${file.originalname}' Tidak Didukung. Hanya .jpg, .jpeg, dan .png yang diizinkan.`), false);
    }
};

const uploadBuku = multer({
    storage: storage,
    fileFilter: fileFilter,
    limits: { fileSize: 100 * 1024 * 1024 } 
});

export default uploadBuku;