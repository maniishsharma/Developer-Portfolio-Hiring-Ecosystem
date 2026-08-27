import { Router } from 'express';
import { listCompanies } from '../controllers/employerController.js';
import { publicDevelopers, publicPortfolio } from '../controllers/studentController.js';

const router = Router();
router.get('/developers', publicDevelopers);
router.get('/developers/:id', publicPortfolio);
router.get('/companies', listCompanies);
export default router;
