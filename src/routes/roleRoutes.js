import express from "express";
import roleController from "../controllers/roleControllers.js";
import { validateRole } from "../middleware/roleValidator.js";

const router = express.Router();

router.get('/roles', roleController.getAllRoles);
router.get('/roles/:id', roleController.getRoleById);
router.delete('/roles/:id', roleController.deleteRole);
router.post('/roles', validateRole, roleController.createRole);
router.put('/roles/:id', validateRole, roleController.updateRole);


export default router;