import * as patientService from '../services/patient.service.js';

// POST /api/patients
export const createPatient = async (req, res, next) => {
  try {
    const patient = await patientService.createPatient(req.doctor.Doc_id, req.body);
    res.status(201).json({
      success: true,
      message: 'تم إضافة المريض بنجاح',
      data:    { patient },
    });
  } catch (err) {
    next(err);
  }
};

// GET /api/patients
export const getAllPatients = async (req, res, next) => {
  try {
    const { search, condition, page, limit } = req.query;
    const data = await patientService.getAllPatients(req.doctor.Doc_id, {
      search, condition, page, limit,
    });
    res.status(200).json({ success: true, ...data });
  } catch (err) {
    next(err);
  }
};

// GET /api/patients/:patientId
export const getPatientById = async (req, res, next) => {
  try {
    const patient = await patientService.getPatientById(
      req.doctor.Doc_id,
      req.params.patientId,
    );
    res.status(200).json({ success: true, data: { patient } });
  } catch (err) {
    next(err);
  }
};

// PUT /api/patients/:patientId
export const updatePatient = async (req, res, next) => {
  try {
    const patient = await patientService.updatePatient(
      req.doctor.Doc_id,
      req.params.patientId,
      req.body,
    );
    res.status(200).json({
      success: true,
      message: 'تم تحديث بيانات المريض بنجاح',
      data:    { patient },
    });
  } catch (err) {
    next(err);
  }
};

// DELETE /api/patients/:patientId
export const deletePatient = async (req, res, next) => {
  try {
    await patientService.deletePatient(req.doctor.Doc_id, req.params.patientId);
    res.status(200).json({
      success: true,
      message: 'تم حذف المريض بنجاح',
    });
  } catch (err) {
    next(err);
  }
};