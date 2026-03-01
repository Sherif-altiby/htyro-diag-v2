import { validationResult } from 'express-validator';
import jwt    from 'jsonwebtoken';
import Doctor from '../models/doctor.model.js';

// Validation runner
export const validate = (rules) => async (req, res, next) => {
  await Promise.all(rules.map((rule) => rule.run(req)));
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(422).json({
      success: false,
      message: 'بيانات غير صالحة',
      errors:  errors.array().map((e) => ({ field: e.path, message: e.msg })),
    });
  }
  next();
};

// JWT protect
export const protect = async (req, res, next) => {
  try {
    let token = req.cookies?.token;
    if (!token && req.headers.authorization?.startsWith('Bearer ')) {
      token = req.headers.authorization.split(' ')[1];
    }
    if (!token) {
      return res.status(401).json({ success: false, message: 'غير مصرح — يرجى تسجيل الدخول' });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const doctor  = await Doctor.findByPk(decoded.id, {
      attributes: { exclude: ['passwordHash'] },
    });
    if (!doctor) {
      return res.status(401).json({ success: false, message: 'الحساب غير موجود' });
    }

    req.doctor = doctor;
    next();
  } catch (err) {
    if (err.name === 'JsonWebTokenError')  return res.status(401).json({ success: false, message: 'رمز غير صالح' });
    if (err.name === 'TokenExpiredError') return res.status(401).json({ success: false, message: 'انتهت صلاحية الرمز' });
    next(err);
  }
};

// Global error handler
export const errorHandler = (err, req, res, next) => {
  const status = err.status || 500;
  res.status(status).json({ success: false, message: err.message || 'خطأ في الخادم' });
};