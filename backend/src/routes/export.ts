import { Router } from 'express';
import { ExportController } from '../controllers/exportController';
import { authenticateAPIKey, rateLimit } from '../middleware/auth';

const router = Router();

// Apply authentication and rate limiting to all export routes
// In development, authentication is bypassed
// In production, requires X-API-Key header
router.use(authenticateAPIKey);
router.use(rateLimit(20, 60000)); // 20 requests per minute

/**
 * @route GET /api/export/data
 * @desc Export specific entity data
 * @access Protected (requires API key in production)
 */
router.get('/data', ExportController.exportData);

/**
 * @route GET /api/export/comprehensive
 * @desc Export comprehensive project report
 * @access Protected (requires API key in production)
 */
router.get('/comprehensive', ExportController.exportComprehensiveReport);

export default router;
