import express from "express";
import bukuController from "../controllers/bukuControllers.js";
import { validateBuku, validateBukuUpdate } from "../middleware/bukuValidator.js";
import { verifyToken } from "../middleware/auth.js"; 
import uploadBuku from "../middleware/uploadBuku.js";

const router = express.Router();


router.post('/buku', verifyToken, uploadBuku.array('images', 100), validateBuku, bukuController.createBuku);
router.put('/buku/:id', verifyToken, uploadBuku.array('images', 100), validateBukuUpdate, bukuController.updateBuku);
router.get('/buku', bukuController.getAllBuku);
router.get('/buku/:id', bukuController.getBukuById);
router.delete('/buku/:id', verifyToken, bukuController.deleteBuku);

export default router;