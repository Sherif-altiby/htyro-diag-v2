import { Router } from 'express';
import { body }   from 'express-validator';
import { getPatientSummary, updateDiagnosisNotes } from '../controllers/patientSummary.controller.js';
import { protect, validate } from '../middleware/auth.middleware.js';

const router = Router({ mergeParams: true });

const diagnosisRules = [
  body('treatmentNotes').optional().trim(),
  body('conditionStatus').optional()
    .isIn(['normal', 'hypothyroidism', 'hyperthyroidism', 'unknown'])
    .withMessage('حالة المريض غير صحيحة'),
];

router.use(protect);

router.get('/',          getPatientSummary);
router.put('/diagnosis', validate(diagnosisRules), updateDiagnosisNotes);

export default router;