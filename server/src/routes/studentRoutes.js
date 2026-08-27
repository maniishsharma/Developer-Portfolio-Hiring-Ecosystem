import { Router } from 'express';
import { protect, authorize } from '../middleware/auth.js';
import { upload } from '../middleware/upload.js';
import {
  getAnalytics,
  getDashboard,
  getProfile,
  getSavedJobs,
  toggleSaveJob,
  updateProfile,
} from '../controllers/studentController.js';

const router = Router();
router.use(protect, authorize('student'));
router.get('/dashboard', getDashboard);
router.get('/profile', getProfile);
router.put('/profile', upload.single('avatar'), updateProfile);
router.get('/analytics', getAnalytics);
router.get('/saved-jobs', getSavedJobs);
router.post('/saved-jobs/:jobId', toggleSaveJob);
export default router;
