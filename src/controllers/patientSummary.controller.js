import * as summaryService from '../services/patientSummary.service.js';

// GET /api/patients/:patientId/summary
export const getPatientSummary = async (req, res, next) => {
  try {
    const data = await summaryService.getPatientSummary(
      req.doctor.Doc_id,
      req.params.patientId,
    );
    res.status(200).json({ success: true, data });
  } catch (err) {
    next(err);
  }
};

// PUT /api/patients/:patientId/summary/diagnosis
export const updateDiagnosisNotes = async (req, res, next) => {
  try {
    const result = await summaryService.updateDiagnosisNotes(
      req.doctor.Doc_id,
      req.params.patientId,
      req.body,
    );
    res.status(200).json({ success: true, ...result });
  } catch (err) {
    next(err);
  }
};