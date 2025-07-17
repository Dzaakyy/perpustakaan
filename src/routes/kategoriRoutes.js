import express from "express";
import kategoriController from "../controllers/kategoriControllers.js";
import { validateKategori } from "../middleware/kategoriValidator.js";
import { verifyToken } from "../middleware/auth.js";

const router = express.Router();

router.get('/kategori', kategoriController.getAllKategori);
router.get('/kategori/:id', kategoriController.getKategoriById);
router.delete('/kategori/:id', verifyToken, kategoriController.deleteKategori);
router.post('/kategori', verifyToken,validateKategori, kategoriController.createKategori);
router.put('/kategori/:id', verifyToken, validateKategori, kategoriController.updateKategori);


export default router;