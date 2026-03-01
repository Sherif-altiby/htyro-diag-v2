import * as thyroidTestService from '../services/thyroidTest.service.js';

// POST /api/patients/:patientId/tests
export const createTest = async (req, res, next) => {
  try {
    const result = await thyroidTestService.createThyroidTest(
      req.doctor.Doc_id,
      req.params.patientId,
      req.body,
    );
    res.status(201).json({
      success: true,
      message: 'تم حفظ نتائج التحليل بنجاح',
      data:    result,
    });
  } catch (err) {
    next(err);
  }
};

// GET /api/patients/:patientId/tests
export const getTests = async (req, res, next) => {
  try {
    const data = await thyroidTestService.getPatientTests(
      req.doctor.Doc_id,
      req.params.patientId,
    );
    res.status(200).json({ success: true, data });
  } catch (err) {
    next(err);
  }
};