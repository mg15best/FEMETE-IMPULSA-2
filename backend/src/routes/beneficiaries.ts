import { Router } from 'express';
import { BeneficiaryController } from '../controllers/beneficiaryController';

const router = Router();

router.get('/', BeneficiaryController.getAll);
router.get('/:id', BeneficiaryController.getById);
router.post('/', BeneficiaryController.create);
router.put('/:id', BeneficiaryController.update);
router.delete('/:id', BeneficiaryController.delete);

export default router;
