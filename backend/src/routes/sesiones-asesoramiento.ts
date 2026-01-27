import { Router } from 'express';
import { SesionAsesoramientoController } from '../controllers/sesionAsesoramientoController';

const router = Router();

router.get('/', SesionAsesoramientoController.getAll);
router.get('/:id', SesionAsesoramientoController.getById);
router.post('/', SesionAsesoramientoController.create);
router.put('/:id', SesionAsesoramientoController.update);
router.delete('/:id', SesionAsesoramientoController.delete);

export default router;
