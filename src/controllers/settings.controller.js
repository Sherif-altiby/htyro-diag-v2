import * as settingsService from '../services/settings.service.js';

// GET /api/settings
export const getSettings = async (req, res, next) => {
  try {
    const data = await settingsService.getSettings(req.doctor.Doc_id);
    res.status(200).json({ success: true, data });
  } catch (err) {
    next(err);
  }
};

// PUT /api/settings/personal-info
export const updatePersonalInfo = async (req, res, next) => {
  try {
    const doctor = await settingsService.updatePersonalInfo(req.doctor.Doc_id, req.body);
    res.status(200).json({
      success: true,
      message: 'تم تحديث المعلومات الشخصية بنجاح',
      data:    { doctor },
    });
  } catch (err) {
    next(err);
  }
};

// PUT /api/settings/password
export const updatePassword = async (req, res, next) => {
  try {
    const result = await settingsService.updatePassword(req.doctor.Doc_id, req.body);
    res.status(200).json({ success: true, ...result });
  } catch (err) {
    next(err);
  }
};

// PUT /api/settings/preferences
export const updatePreferences = async (req, res, next) => {
  try {
    const data = await settingsService.updatePreferences(req.doctor.Doc_id, req.body);
    res.status(200).json({
      success: true,
      message: 'تم تحديث التفضيلات بنجاح',
      data,
    });
  } catch (err) {
    next(err);
  }
};