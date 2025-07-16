import { body, validationResult } from 'express-validator';
import User from '../models/userModels.js';


const handleValidationErrors = (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }
    next();
};

export const validateRegistration = [
    body('nama')
        .notEmpty()
        .withMessage('Nama tidak boleh kosong.'),

    body('email')
        .notEmpty()
        .withMessage('Email tidak boleh kosong.')
        .isEmail()
        .withMessage('Format email tidak valid.')
        .custom(async (value) => {
            const user = await User.findOne({ where: { email: value } });
            if (user) {
                return Promise.reject('Email sudah digunakan.');
            }
        }),

    body('password')
        .notEmpty()
        .withMessage('Password tidak boleh kosong.')
        .isLength({ min: 5 })
        .withMessage('Password minimal 5 karakter.'),

    body('role_id').isInt().withMessage('Role ID harus berupa angka.'),

    handleValidationErrors
];