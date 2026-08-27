import { Router } from 'express';
import { protect, authorize } from '../middleware/auth.js';
import { upload } from '../middleware/upload.js';
import { getResume, uploadResume, deleteResume } from '../controllers/resumeController.js';

const router = Router();
router.use(protect, authorize('student'));
router.get('/', getResume);
router.post('/', upload.single('resume'), uploadResume);
router.delete('/', deleteResume);
export default router;
