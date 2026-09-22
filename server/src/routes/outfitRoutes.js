import express from 'express';
import {
  getOutfits,
  getOutfitById,
  createOutfit,
  updateOutfit,
  deleteOutfit
} from '../controllers/outfitController.js';
import { verifyToken, requireRole } from '../middlewares/authMiddleware.js';
import { validateRequest, outfitSchemaValidation } from '../middlewares/validator.js';

const router = express.Router();

// Public Catalog Access
router.get('/', getOutfits);
router.get('/:id', getOutfitById);

// Admin-Only Catalog Management
router.post('/', verifyToken, requireRole('admin'), validateRequest(outfitSchemaValidation), createOutfit);
router.put('/:id', verifyToken, requireRole('admin'), updateOutfit);
router.delete('/:id', verifyToken, requireRole('admin'), deleteOutfit);

export default router;