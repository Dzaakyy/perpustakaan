import { body, validationResult } from 'express-validator';

const handleValidationErrors = (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }
    next();
};

export const validateKategori = [
    body('nama_kategori')
        .notEmpty().withMessage('Nama tidak boleh kosong.')
        .isString().withMessage('Nama harus berupa teks.')
        .isLength({ max: 100 }).withMessage('Nama tidak boleh lebih dari 100 karakter.'),

    body('deskripsi')
        .notEmpty().withMessage('Deskripsi tidak boleh kosong.')
        .isString().withMessage('Deskripsi harus berupa teks.')
        .isLength({ max: 255 }).withMessage('Deskripsi tidak boleh lebih dari 255 karakter.'),

    handleValidationErrors
];