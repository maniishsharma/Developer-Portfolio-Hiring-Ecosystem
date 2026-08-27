import { Router } from 'express';
import { protect, authorize } from '../middleware/auth.js';
import { career, resumeAnalyzer, skillMatch } from '../controllers/aiController.js';

const router = Router();
router.use(protect, authorize('student'));
router.get('/resume', resumeAnalyzer);
router.post('/match', skillMatch);
router.get('/career', career);
export default router;
