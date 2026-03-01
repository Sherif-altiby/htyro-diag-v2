import * as symptomService from '../services/symptom.service.js';

// POST /api/patients/:patientId/symptoms
export const createSymptom = async (req, res, next) => {
  try {
    const symptom = await symptomService.createSymptom(
      req.doctor.Doc_id,
      req.params.patientId,
      req.body
    );
    res.status(201).json({
      success: true,
      message: 'تم حفظ الأعراض بنجاح',
      data:    { symptom },
    });
  } catch (err) {
    next(err);
  }
};

// GET /api/patients/:patientId/symptoms
export const getPatientSymptoms = async (req, res, next) => {
  try {
    const data = await symptomService.getPatientSymptoms(
      req.doctor.Doc_id,
      req.params.patientId,
    );
    res.status(200).json({ success: true, data });
  } catch (err) {
    next(err);
  }
};