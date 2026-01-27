import { Router } from 'express';
import { KPIController } from '../controllers/kpiController';

const router = Router();

router.get('/', KPIController.getAll);
router.get('/dashboard', KPIController.getDashboard);
router.get('/:id', KPIController.getById);
router.post('/', KPIController.create);
router.put('/:id', KPIController.update);
router.delete('/:id', KPIController.delete);

export default router;
