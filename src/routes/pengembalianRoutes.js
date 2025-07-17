import express from "express";
import pengembalianController from "../controllers/pengembalianControllers.js";
import { validatePengembalian } from "../middleware/pengembalianValidator.js";
import { verifyToken } from "../middleware/auth.js";

const router = express.Router();

router.get('/pengembalian', verifyToken, pengembalianController.getAllPengembalian);
router.get('/pengembalian/:id', verifyToken, pengembalianController.getPengembalianById);
router.post('/pengembalian', verifyToken, validatePengembalian, pengembalianController.createPengembalian);

export default router;