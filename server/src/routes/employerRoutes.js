import { Router } from 'express';
import { protect, authorize } from '../middleware/auth.js';
import { upload } from '../middleware/upload.js';
import { getCompany, getDashboard, updateCompany } from '../controllers/employerController.js';
import { searchCandidates } from '../controllers/studentController.js';

const router = Router();
router.use(protect, authorize('employer'));
router.get('/dashboard', getDashboard);
router.get('/company', getCompany);
router.put('/company', upload.single('logo'), updateCompany);
router.get('/candidates', searchCandidates);
export default router;
