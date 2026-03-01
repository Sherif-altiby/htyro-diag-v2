import { Router } from 'express';
import { body }   from 'express-validator';
import {
  createPatient, getAllPatients,
  getPatientById, updatePatient, deletePatient,
} from '../controllers/patient.controller.js';
import { protect, validate } from '../middleware/auth.middleware.js';

const router = Router();

const createPatientRules = [
  body('fullName').trim().notEmpty().withMessage('الاسم الكامل مطلوب')
    .isLength({ min: 3 }).withMessage('الاسم يجب أن يكون 3 أحرف على الأقل'),
  body('age').notEmpty().withMessage('العمر مطلوب')
    .isInt({ min: 1, max: 130 }).withMessage('العمر يجب أن يكون رقماً صحيحاً'),
  body('gender').notEmpty().withMessage('الجنس مطلوب')
    .isIn(['Male', 'Female']).withMessage('الجنس يجب أن يكون Male أو Female'),
  body('phone').optional().trim(),
  body('email').optional().isEmail().withMessage('البريد الإلكتروني غير صحيح').normalizeEmail(),
  body('clinicalHistory').optional().trim(),
];

router.use(protect);

router.get('/',              getAllPatients);
router.post('/',             validate(createPatientRules), createPatient);
router.get('/:patientId',    getPatientById);
router.put('/:patientId',    updatePatient);
router.delete('/:patientId', deletePatient);

export default router;