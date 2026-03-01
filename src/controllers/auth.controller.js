import * as authService from '../services/auth.service.js';

const cookieOptions = {
  httpOnly: true,
  secure:   process.env.NODE_ENV === 'production',
  sameSite: 'strict',
  maxAge:   7 * 24 * 60 * 60 * 1000,
};

// POST /api/auth/register
export const register = async (req, res, next) => {
  try {
    const doctor = await authService.register(req.body);
    const { doctor: d, token } = await authService.login({
      email:    req.body.email,
      password: req.body.password,
    });
    res.cookie('token', token, cookieOptions);
    res.status(201).json({ success: true, token, data: { doctor: d } });
  } catch (err) {
    next(err);
  }
};

// POST /api/auth/login
export const login = async (req, res, next) => {
  try {
    const { doctor, token } = await authService.login(req.body);
    res.cookie('token', token, cookieOptions);
    res.status(200).json({ success: true, token, data: { doctor } });
  } catch (err) {
    next(err);
  }
};

// POST /api/auth/logout
export const logout = (req, res) => {
  res.clearCookie('token', {
    httpOnly: true,
    secure:   process.env.NODE_ENV === 'production',
    sameSite: 'strict',
  });
  res.status(200).json({ success: true, message: 'تم تسجيل الخروج بنجاح' });
};

// GET /api/auth/me
export const getMe = async (req, res, next) => {
  try {
    const doctor = await authService.getById(req.doctor.Doc_id);
    res.status(200).json({ success: true, data: { doctor } });
  } catch (err) {
    next(err);
  }
};