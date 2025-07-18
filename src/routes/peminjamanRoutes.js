import express from "express";
import peminjamanController from "../controllers/peminjamanControllers.js";
import { validatePeminjaman     } from "../middleware/peminjamanValidator.js";
import { verifyToken } from "../middleware/auth.js";

const router = express.Router();

router.get('/peminjaman', verifyToken, peminjamanController.getAllPeminjaman);
router.get('/peminjaman/riwayat-saya', verifyToken, peminjamanController.getRiwayatPeminjamanByUser);
router.get('/peminjaman/:id', verifyToken, peminjamanController.getPeminjamanById);
router.post('/peminjaman', verifyToken, validatePeminjaman, peminjamanController.createPeminjaman);


export default router;