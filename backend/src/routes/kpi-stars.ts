import { Router } from 'express';
import { KPIStarsController } from '../controllers/kpiStarsController';

const router = Router();

// Main KPI dashboard endpoint
router.get('/dashboard', KPIStarsController.getKPIDashboard);

// Power BI integration endpoint
router.get('/powerbi', KPIStarsController.getPowerBIData);

// Historical KPI data
router.get('/historico', KPIStarsController.getKPIHistorico);

// Individual KPI detail
router.get('/detalle/:codigo', KPIStarsController.getKPIDetalle);

// KPI breakdown (detailed items)
router.get('/breakdown/:codigo', KPIStarsController.getKPIBreakdown);

// Register daily snapshot
router.post('/snapshot', KPIStarsController.registrarSnapshot);

export default router;
