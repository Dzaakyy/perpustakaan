import express from "express";
import kartuPustakaController from "../controllers/kartuPustakaControllers.js";
import { validateKartuPustaka } from "../middleware/kartuPustakaValidator.js";
import { verifyToken } from "../middleware/auth.js";

const router = express.Router();

router.get('/kartu-pustaka', verifyToken, kartuPustakaController.getAllKartuPustaka);
router.get('/kartu-pustaka/:id', verifyToken, kartuPustakaController.getKartuPustakaById);
router.post('/kartu-pustaka', verifyToken, validateKartuPustaka, kartuPustakaController.createKartuPustaka);
router.put('/kartu-pustaka/:id', verifyToken, validateKartuPustaka, kartuPustakaController.updateKartuPustaka);
router.delete('/kartu-pustaka/:id', verifyToken, kartuPustakaController.deleteKartuPustaka);

export default router;