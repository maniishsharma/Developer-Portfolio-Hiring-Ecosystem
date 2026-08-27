import { Router } from 'express';
import { protect, authorize } from '../middleware/auth.js';
import { optionalAuth } from '../middleware/optionalAuth.js';
import { createJob, deleteJob, getJob, listJobs, myJobs, updateJob } from '../controllers/jobController.js';

const router = Router();
router.get('/', optionalAuth, listJobs);
router.get('/mine', protect, authorize('employer'), myJobs);
router.get('/:id', getJob);
router.post('/', protect, authorize('employer'), createJob);
router.put('/:id', protect, authorize('employer'), updateJob);
router.delete('/:id', protect, authorize('employer'), deleteJob);
export default router;
