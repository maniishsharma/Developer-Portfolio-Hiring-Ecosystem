import { Router } from 'express';
import { protect, authorize } from '../middleware/auth.js';
import {
  applyJob,
  employerApplications,
  myApplications,
  scheduleInterview,
  updateStatus,
} from '../controllers/applicationController.js';

const router = Router();
router.post('/:jobId', protect, authorize('student'), applyJob);
router.get('/mine', protect, authorize('student'), myApplications);
router.get('/employer', protect, authorize('employer'), employerApplications);
router.patch('/:id/status', protect, authorize('employer'), updateStatus);
router.post('/:id/interview', protect, authorize('employer'), scheduleInterview);
export default router;
