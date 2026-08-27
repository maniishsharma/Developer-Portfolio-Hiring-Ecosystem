import { Router } from 'express';
import { protect } from '../middleware/auth.js';
import { conversations, directory, history } from '../controllers/messageController.js';

const router = Router();
router.use(protect);
router.get('/conversations', conversations);
router.get('/directory', directory);
router.get('/:userId', history);
export default router;
