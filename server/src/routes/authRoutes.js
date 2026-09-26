import express from 'express';
import { register, login, verifyEmail, checkDefaultPassword, getMe } from '../controllers/authController.js';
import { verifyToken } from '../middlewares/authMiddleware.js';
import { loginSchema, registerSchema, validateRequest } from '../middlewares/validator.js';

const router = express.Router();

router.post('/register', validateRequest(registerSchema), register);
router.post('/login', validateRequest(loginSchema), login);
router.get('/verify-email', verifyEmail);
router.post('/check-default', checkDefaultPassword);
router.get('/me', verifyToken, getMe);
router.post('/logout', (req, res) => res.json({ success: true }));

export default router;