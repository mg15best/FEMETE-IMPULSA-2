import { Router } from 'express';
import { EventoController } from '../controllers/eventoController';

const router = Router();

router.get('/', EventoController.getAll);
router.get('/:id', EventoController.getById);
router.get('/:id/asistentes', EventoController.getAsistentes);
router.post('/', EventoController.create);
router.put('/:id', EventoController.update);
router.delete('/:id', EventoController.delete);

export default router;
