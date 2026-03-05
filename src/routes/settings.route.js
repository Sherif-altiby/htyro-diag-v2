import { Router } from 'express';
import { body }   from 'express-validator';
import {
  getSettings, updatePersonalInfo,
  updatePassword, updatePreferences,
} from '../controllers/settings.controller.js';
import { protect, validate } from '../middleware/auth.middleware.js';

const router = Router();

const passwordRules = [
  body('currentPassword').notEmpty().withMessage('كلمة المرور الحالية مطلوبة'),
  body('newPassword')
    .isLength({ min: 8 }).withMessage('كلمة المرور يجب أن تكون 8 أحرف على الأقل')
    .matches(/[A-Z]/).withMessage('يجب أن تحتوي على حرف كبير')
    .matches(/[0-9]/).withMessage('يجب أن تحتوي على رقم'),
];

const preferencesRules = [
  body('notificationsEnabled').optional().isBoolean(),
  body('darkModeEnabled').optional().isBoolean(),
  body('language').optional().isIn(['ar', 'en']).withMessage('اللغة يجب أن تكون ar أو en'),
  body('privacyEnabled').optional().isBoolean(),
];

router.use(protect);

router.get('/',              getSettings);
router.put('/personal-info', updatePersonalInfo);
router.put('/password',      validate(passwordRules),    updatePassword);
router.put('/preferences',   validate(preferencesRules), updatePreferences);

export default router;