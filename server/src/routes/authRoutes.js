import express from 'express';
import { register, login, checkDefaultPassword, getMe } from '../controllers/authController.js';
import { verifyToken } from '../middlewares/authMiddleware.js';

const router = express.Router();

router.post('/register', register);
router.post('/login', login);
router.post('/check-default', checkDefaultPassword);
router.get('/me', verifyToken, getMe);
router.post('/logout', (req, res) => res.json({ success: true }));

export default router;