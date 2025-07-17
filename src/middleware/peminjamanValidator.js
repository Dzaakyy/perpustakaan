import { body, validationResult } from 'express-validator';

const handleValidationErrors = (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }
    next();
};

const validateDateFormat = (value, { req, location, path }) => {
    const dateRegex = /^(\d{2})-(\d{2})-(\d{4})$/;
    if (!dateRegex.test(value)) {
        throw new Error(`Format ${path} harus DD-MM-YYYY (contoh: 17-07-2025).`);
    }
    const [day, month, year] = value.split('-');
    const date = new Date(`${year}-${month}-${day}`);
    if (isNaN(date.getTime()) || date.getFullYear() !== parseInt(year)) {
        throw new Error(`Tanggal ${path} tidak valid.`);
    }
    return true;
};

export const validatePeminjaman = [
    body('buku_id').notEmpty().withMessage('Buku ID tidak boleh kosong.').isInt().withMessage('Buku ID harus berupa angka.'),
    body('tanggal_pinjam').notEmpty().withMessage('Tanggal pinjam tidak boleh kosong.').custom(validateDateFormat),
    body('tanggal_kembali').notEmpty().withMessage('Tanggal kembali tidak boleh kosong.').custom(validateDateFormat),
    handleValidationErrors
];