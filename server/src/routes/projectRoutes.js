import { Router } from 'express';
import { protect, authorize } from '../middleware/auth.js';
import { upload } from '../middleware/upload.js';
import { createProject, deleteProject, listProjects, updateProject } from '../controllers/projectController.js';

const router = Router();
router.use(protect, authorize('student'));
router.get('/', listProjects);
router.post('/', upload.array('images', 4), createProject);
router.put('/:id', upload.array('images', 4), updateProject);
router.delete('/:id', deleteProject);
export default router;
