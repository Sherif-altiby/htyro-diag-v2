import { Router } from 'express';
import { body }   from 'express-validator';
import { createSymptom, getPatientSymptoms } from '../controllers/symptom.controller.js';
import { protect, validate }                  from '../middleware/auth.middleware.js';

const router = Router({ mergeParams: true });

const SEVERITY = ['none', 'mild', 'moderate', 'severe'];

const symptomRules = [
  body('Fatigue').optional()
    .isIn(SEVERITY).withMessage('قيمة الخمول غير صحيحة'),
  body('Weight_Change').optional()
    .isIn(SEVERITY).withMessage('قيمة تغير الوزن غير صحيحة'),
  body('Cold_Heat_Intolerance').optional()
    .isIn(SEVERITY).withMessage('قيمة عدم تحمل البرد غير صحيحة'),
  body('Hair_Loss').optional()
    .isBoolean().withMessage('تساقط الشعر يجب أن يكون true أو false'),
  body('Dry_Skin').optional()
    .isBoolean().withMessage('جفاف الجلد يجب أن يكون true أو false'),
  body('Neck_Swelling').optional()
    .isBoolean().withMessage('تضخم الرقبة يجب أن يكون true أو false'),
  body('Anxiety').optional()
    .isInt({ min: 0, max: 100 }).withMessage('قيمة القلق يجب أن تكون بين 0 و 100'),
  body('Mood_Swings').optional()
    .isInt({ min: 0, max: 100 }).withMessage('قيمة تقلبات المزاج يجب أن تكون بين 0 و 100'),
  body('Concentration_Difficulty').optional()
    .isInt({ min: 0, max: 100 }).withMessage('قيمة صعوبة التركيز يجب أن تكون بين 0 و 100'),
  body('Additional_Notes').optional().trim(),
];

router.use(protect);

router.get('/',  getPatientSymptoms);
router.post('/', validate(symptomRules), createSymptom);

export default router;