import { body, validationResult } from 'express-validator';

const handleValidationErrors = (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }
    next();
};

export const validateBuku = [
    body('judul').notEmpty().withMessage('Judul tidak boleh kosong.'),
    body('sinopsis').notEmpty().withMessage('Sinopsis tidak boleh kosong.'),
    body('penulis').notEmpty().withMessage('Penulis tidak boleh kosong.'),
    body('penerbit').notEmpty().withMessage('Penerbit tidak boleh kosong.'),
    body('kategori_id').notEmpty().withMessage('Kategori ID tidak boleh kosong.').isInt().withMessage('Kategori ID harus berupa angka.'),
    body('tahun_terbit').notEmpty().withMessage('Tahun terbit tidak boleh kosong.').isInt({ min: 1000, max: new Date().getFullYear() }).withMessage('Tahun terbit tidak valid.'),
    body('stok').notEmpty().withMessage('Stok tidak boleh kosong.').isInt({ min: 0 }).withMessage('Stok harus berupa angka positif.'),
    handleValidationErrors
];

export const validateBukuUpdate = [
    body('judul').optional().notEmpty().withMessage('Judul tidak boleh kosong.'),
    body('sinopsis').optional().notEmpty().withMessage('Sinopsi tidak boleh kosong.'),
    body('penulis').optional().notEmpty().withMessage('Penulis tidak boleh kosong.'),
    body('penerbit').optional().notEmpty().withMessage('Penerbit tidak boleh kosong.'),
    body('kategori_id').optional().isInt().withMessage('Kategori ID harus berupa angka.'),
    body('tahun_terbit').optional().isInt({ min: 1000, max: new Date().getFullYear() }).withMessage('Tahun terbit tidak valid.'),
    body('stok').optional().isInt({ min: 0 }).withMessage('Stok harus berupa angka positif.'),
    handleValidationErrors
];