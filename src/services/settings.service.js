import bcrypt from 'bcryptjs';
import Doctor from '../models/doctor.model.js';

// ── Get settings ───────────────────────────────────────────────────────────
export const getSettings = async (doctorId) => {
  const doctor = await Doctor.findByPk(doctorId, {
    attributes: { exclude: ['passwordHash'] },
  });
  if (!doctor) {
    const err = new Error('الحساب غير موجود');
    err.status = 404;
    throw err;
  }

  return {
    account: {
      Doc_id:         doctor.Doc_id,
      Name:           doctor.Name,
      email:          doctor.email,
      Specialization: doctor.Specialization,
      Clinic_address: doctor.Clinic_address,
      certifications: doctor.certifications,
      photoUrl:       doctor.photoUrl,
    },
    preferences: {
      notificationsEnabled: doctor.notificationsEnabled,
      darkModeEnabled:      doctor.darkModeEnabled,
      language:             doctor.language,
      privacyEnabled:       doctor.privacyEnabled,
    },
  };
};

// ── Update personal info ───────────────────────────────────────────────────
export const updatePersonalInfo = async (doctorId, body) => {
  const doctor = await Doctor.findByPk(doctorId);
  if (!doctor) {
    const err = new Error('الحساب غير موجود');
    err.status = 404;
    throw err;
  }

  const { Name, Specialization, Clinic_address, certifications, photoUrl } = body;

  if (Name)           doctor.Name           = Name;
  if (Specialization) doctor.Specialization = Specialization;
  if (Clinic_address) doctor.Clinic_address = Clinic_address;
  if (certifications) doctor.certifications = certifications;
  if (photoUrl)       doctor.photoUrl       = photoUrl;

  await doctor.save();
  doctor.passwordHash = undefined;
  return doctor;
};

// ── Update password ────────────────────────────────────────────────────────
export const updatePassword = async (doctorId, { currentPassword, newPassword }) => {
  const doctor = await Doctor.findByPk(doctorId);
  if (!doctor) {
    const err = new Error('الحساب غير موجود');
    err.status = 404;
    throw err;
  }

  const isMatch = await bcrypt.compare(currentPassword, doctor.passwordHash);
  if (!isMatch) {
    const err = new Error('كلمة المرور الحالية غير صحيحة');
    err.status = 401;
    throw err;
  }

  doctor.passwordHash = await bcrypt.hash(newPassword, 12);
  await doctor.save();

  return { message: 'تم تغيير كلمة المرور بنجاح' };
};

// ── Update preferences ─────────────────────────────────────────────────────
export const updatePreferences = async (doctorId, body) => {
  const doctor = await Doctor.findByPk(doctorId);
  if (!doctor) {
    const err = new Error('الحساب غير موجود');
    err.status = 404;
    throw err;
  }

  const { notificationsEnabled, darkModeEnabled, language, privacyEnabled } = body;

  if (notificationsEnabled !== undefined) doctor.notificationsEnabled = notificationsEnabled;
  if (darkModeEnabled      !== undefined) doctor.darkModeEnabled      = darkModeEnabled;
  if (language             !== undefined) doctor.language             = language;
  if (privacyEnabled       !== undefined) doctor.privacyEnabled       = privacyEnabled;

  await doctor.save();
  doctor.passwordHash = undefined;

  return {
    preferences: {
      notificationsEnabled: doctor.notificationsEnabled,
      darkModeEnabled:      doctor.darkModeEnabled,
      language:             doctor.language,
      privacyEnabled:       doctor.privacyEnabled,
    },
  };
};