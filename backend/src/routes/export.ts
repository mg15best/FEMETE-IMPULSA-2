import { Router } from 'express';
import { ExportController } from '../controllers/exportController';

const router = Router();

router.get('/data', ExportController.exportData);
router.get('/comprehensive', ExportController.exportComprehensiveReport);

export default router;
