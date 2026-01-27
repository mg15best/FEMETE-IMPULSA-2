import { Router } from 'express';
import { ActivityController } from '../controllers/activityController';

const router = Router();

router.get('/', ActivityController.getAll);
router.get('/:id', ActivityController.getById);
router.post('/', ActivityController.create);
router.put('/:id', ActivityController.update);
router.delete('/:id', ActivityController.delete);

export default router;
