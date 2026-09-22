import express from 'express';
import { 
  getUserProfile, 
  updateUserProfile, 
  deleteUserProfile, 
  getUserOutfits,
  saveUndertone,
  getRecentTarot
} from '../controllers/userController.js';
import { verifyToken } from '../middlewares/authMiddleware.js';

const router = express.Router();

router.use(verifyToken);
router.get('/profile', getUserProfile);
router.post('/profile', updateUserProfile);
router.put('/profile', updateUserProfile);
router.delete('/profile', deleteUserProfile);
router.get('/outfits', getUserOutfits);

export default router;