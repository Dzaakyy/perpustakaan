import { body, validationResult } from 'express-validator';

const handleValidationErrors = (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }
    next();
};

export const validatePengembalian = [
    body('peminjaman_id').notEmpty().withMessage('Peminjaman ID tidak boleh kosong.').isInt().withMessage('Peminjaman ID harus berupa angka.'),
    body('kondisi_buku').notEmpty().withMessage('Kondisi buku tidak boleh kosong.'),
    handleValidationErrors
];