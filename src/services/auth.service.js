import bcrypt from 'bcryptjs';
import jwt    from 'jsonwebtoken';
import Doctor from '../models/doctor.model.js';

export const register = async ({ Name, Specialization, Clinic_address, email, password }) => {
  const existing = await Doctor.findOne({ where: { email } });
  if (existing) {
    const err = new Error('البريد الإلكتروني مسجل مسبقاً');
    err.status = 409;
    throw err;
  }

  const passwordHash = await bcrypt.hash(password, 12);
  const doctor = await Doctor.create({
    Name,
    Specialization,
    Clinic_address: Clinic_address || null,
    email,
    passwordHash,
  });

  doctor.passwordHash = undefined;
  return doctor;
};

export const login = async ({ email, password }) => {
  const doctor = await Doctor.findOne({ where: { email } });
  if (!doctor) {
    const err = new Error('البريد الإلكتروني أو كلمة المرور غير صحيحة');
    err.status = 401;
    throw err;
  }

  const isMatch = await bcrypt.compare(password, doctor.passwordHash);
  if (!isMatch) {
    const err = new Error('البريد الإلكتروني أو كلمة المرور غير صحيحة');
    err.status = 401;
    throw err;
  }

  const token = jwt.sign(
    { id: doctor.Doc_id },
    process.env.JWT_SECRET,
    { expiresIn: process.env.JWT_EXPIRES_IN || '7d' }
  );

  doctor.passwordHash = undefined;
  return { doctor, token };
};

export const getById = async (id) => {
  const doctor = await Doctor.findByPk(id, {
    attributes: { exclude: ['passwordHash'] },
  });
  if (!doctor) {
    const err = new Error('الحساب غير موجود');
    err.status = 404;
    throw err;
  }
  return doctor;
};