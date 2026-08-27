import { Router } from 'express';
import { protect } from '../middleware/auth.js';
import { connectGithub } from '../controllers/githubController.js';

const router = Router();
router.post('/', protect, connectGithub);
router.get('/', protect, connectGithub);
export default router;
