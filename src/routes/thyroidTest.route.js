import { Router } from 'express';
import { body }   from 'express-validator';
import { createTest, getTests } from '../controllers/thyroidTest.controller.js';
import { protect, validate }    from '../middleware/auth.middleware.js';

const router = Router({ mergeParams: true });

const testRules = [
  body('TSH_Value').notEmpty().withMessage('قيمة TSH مطلوبة')
    .isFloat({ min: 0 }).withMessage('قيمة TSH يجب أن تكون رقماً موجباً'),
  body('Free_T4').optional()
    .isFloat({ min: 0 }).withMessage('قيمة Free T4 يجب أن تكون رقماً موجباً'),
  body('Free_T3').optional()
    .isFloat({ min: 0 }).withMessage('قيمة Free T3 يجب أن تكون رقماً موجباً'),
  body('Test_Date').notEmpty().withMessage('تاريخ الفحص مطلوب'),
  body('Notes').optional().trim(),
  body('Image_Url').optional(),
];

router.use(protect);

router.get('/',  getTests);
router.post('/', validate(testRules), createTest);

export default router;