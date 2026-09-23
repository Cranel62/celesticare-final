import express from 'express';
import { 
  getUserProfile, 
  updateUserProfile, 
  deleteUserProfile, 
  getUserOutfits,
  saveUndertone,
  getRecentTarot,
  getAdminStats,
  getAdminUsersList,
  getAdminUserById,
  archiveUser,
  restoreUser,
  permanentDeleteUser,
  resetUserPassword
} from '../controllers/userController.js';
import { verifyToken } from '../middlewares/authMiddleware.js';

const router = express.Router();

router.use(verifyToken);

// Standard user routes
router.get('/profile', getUserProfile);
router.post('/profile', updateUserProfile);
router.put('/profile', updateUserProfile);
router.delete('/profile', deleteUserProfile);
router.get('/outfits', getUserOutfits);

// Protected Admin Middleware
const requireAdmin = (req, res, next) => {
  if (req.user && (req.user.role === 'admin' || req.user.is_admin)) {
    return next();
  }
  return res.status(403).json({ success: false, message: 'Access denied: Admin role required.' });
};

// Admin routes
router.get('/admin/stats', requireAdmin, getAdminStats);
router.get('/admin/list', requireAdmin, getAdminUsersList);
router.get('/admin/user/:id', requireAdmin, getAdminUserById);
router.post('/admin/archive/:id', requireAdmin, archiveUser);
router.post('/admin/restore/:id', requireAdmin, restoreUser);
router.delete('/admin/permanent/:id', requireAdmin, permanentDeleteUser);
router.post('/admin/reset-password/:id', requireAdmin, resetUserPassword);

export default router;