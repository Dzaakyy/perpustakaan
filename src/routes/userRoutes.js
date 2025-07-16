import express from "express";
import userController from "../controllers/userControllers.js";
import { verifyToken } from "../middleware/auth.js";
import { validateRegistration } from "../middleware/userValidator.js";
const router = express.Router();


router.post('/user/register', validateRegistration, userController.register);
router.post('/user/login', userController.login);
router.delete('/user/logout', verifyToken, userController.logout);
router.get('/user', verifyToken, userController.getAllUsers);
router.get('/profile', verifyToken, userController.profileUser);
router.put('/profile', verifyToken, userController.updateProfile)


export default router;