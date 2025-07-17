import { body, validationResult } from 'express-validator';

const handleValidationErrors = (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }
    next();
};

export const validateKartuPustaka = [
    body('user_id').notEmpty().withMessage('User ID tidak boleh kosong.').isInt().withMessage('User ID harus berupa angka.'),
    body('nomor_resi').notEmpty().withMessage('Nomor resi tidak boleh kosong.'),
    body('berlaku_sampai').notEmpty().withMessage('Tanggal berlaku tidak boleh kosong.').isISO8601().toDate().withMessage('Format tanggal berlaku tidak valid.'),
    body('status').notEmpty().withMessage('Status tidak boleh kosong.'),
    handleValidationErrors
];