import { Router } from 'express';
import { ObjectiveController } from '../controllers/objectiveController';

const router = Router();

router.get('/', ObjectiveController.getAll);
router.get('/:id', ObjectiveController.getById);
router.post('/', ObjectiveController.create);
router.put('/:id', ObjectiveController.update);
router.delete('/:id', ObjectiveController.delete);

export default router;
