import { Router } from 'express';
import { body }   from 'express-validator';
import { register, login, logout, getMe } from '../controllers/auth.controller.js';
import { validate, protect }              from '../middleware/auth.middleware.js';

const router = Router();

const registerRules = [
  body('Name').trim().notEmpty().withMessage('الاسم مطلوب')
    .isLength({ min: 3 }).withMessage('الاسم يجب أن يكون 3 أحرف على الأقل'),
  body('Specialization').trim().notEmpty().withMessage('التخصص مطلوب'),
  body('email').trim().isEmail().withMessage('البريد الإلكتروني غير صحيح').normalizeEmail(),
  body('password').isLength({ min: 8 }).withMessage('كلمة المرور يجب أن تكون 8 أحرف على الأقل')
    .matches(/[A-Z]/).withMessage('يجب أن تحتوي على حرف كبير')
    .matches(/[0-9]/).withMessage('يجب أن تحتوي على رقم'),
];

const loginRules = [
  body('email').trim().isEmail().withMessage('البريد الإلكتروني غير صحيح').normalizeEmail(),
  body('password').notEmpty().withMessage('كلمة المرور مطلوبة'),
];

router.post('/register', validate(registerRules), register);
router.post('/login',    validate(loginRules),    login);
router.post('/logout',                            logout);
router.get('/me',        protect,                 getMe);

export default router;