import { Router } from 'express';
import { ResultController } from '../controllers/resultController';

const router = Router();

router.get('/', ResultController.getAll);
router.get('/:id', ResultController.getById);
router.post('/', ResultController.create);
router.put('/:id', ResultController.update);
router.delete('/:id', ResultController.delete);

export default router;
