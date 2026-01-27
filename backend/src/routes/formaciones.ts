import { Router } from 'express';
import { FormacionController } from '../controllers/formacionController';

const router = Router();

router.get('/', FormacionController.getAll);
router.get('/:id', FormacionController.getById);
router.get('/:id/asistentes', FormacionController.getAsistentes);
router.post('/', FormacionController.create);
router.put('/:id', FormacionController.update);
router.delete('/:id', FormacionController.delete);

export default router;
