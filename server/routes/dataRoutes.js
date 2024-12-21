import express from 'express';
import { 
  fetchAnalyticsData, 
} from '../controllers/dataController.js';
import authenticateUser from '../middleware/authMiddleware.js';

const router = express.Router();

router.get('/analytics', authenticateUser, fetchAnalyticsData);

export default router;