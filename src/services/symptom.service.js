import Symptom from '../models/symptom.model.js';
import Patient from '../models/patient.model.js';
import Doctor  from '../models/doctor.model.js';

// ── Diagnosis prediction engine ────────────────────────────────────────────
const predictDiagnosis = (symptom) => {
  let hypothyroidismScore  = 0;
  let hyperthyroidismScore = 0;

  const severityScore = { none: 0, mild: 1, moderate: 2, severe: 3 };

  hypothyroidismScore += severityScore[symptom.Fatigue]               || 0;
  hypothyroidismScore += severityScore[symptom.Weight_Change]         || 0;
  hypothyroidismScore += severityScore[symptom.Cold_Heat_Intolerance] || 0;
  hypothyroidismScore += symptom.Hair_Loss     ? 2 : 0;
  hypothyroidismScore += symptom.Dry_Skin      ? 2 : 0;
  hypothyroidismScore += symptom.Neck_Swelling ? 1 : 0;
  hypothyroidismScore += symptom.Concentration_Difficulty > 60 ? 2 : 0;
  hypothyroidismScore += symptom.Mood_Swings              > 60 ? 1 : 0;

  hyperthyroidismScore += severityScore[symptom.Weight_Change]         || 0;
  hyperthyroidismScore += symptom.Anxiety       > 60 ? 3 : 0;
  hyperthyroidismScore += symptom.Mood_Swings   > 70 ? 2 : 0;
  hyperthyroidismScore += symptom.Neck_Swelling ? 2  : 0;
  hyperthyroidismScore += severityScore[symptom.Cold_Heat_Intolerance] || 0;

  if (hypothyroidismScore > hyperthyroidismScore) {
    return { result: 'خمول في الغدة' };
  } else {
    return { result: 'نشاط في الغدة' };
  }
};

// ── 👇 These exports are required ─────────────────────────────────────────

export const createSymptom = async (doctorId, patientId, body) => {
  const patient = await Patient.findOne({
    where: { Patient_id: patientId, Doc_id: doctorId },
  });
  if (!patient) {
    const err = new Error('المريض غير موجود');
    err.status = 404;
    throw err;
  }

  const symptom = await Symptom.create({
    Patient_id:               patientId,
    Fatigue:                  body.Fatigue                  || 'none',
    Weight_Change:            body.Weight_Change            || 'none',
    Cold_Heat_Intolerance:    body.Cold_Heat_Intolerance    || 'none',
    Hair_Loss:                body.Hair_Loss                || false,
    Dry_Skin:                 body.Dry_Skin                 || false,
    Neck_Swelling:            body.Neck_Swelling            || false,
    Anxiety:                  body.Anxiety                  || 0,
    Mood_Swings:              body.Mood_Swings              || 0,
    Concentration_Difficulty: body.Concentration_Difficulty || 0,
    Additional_Notes:         body.Additional_Notes         || null,
  });

  const prediction = predictDiagnosis(symptom);
  return { symptom, prediction };
};

export const getPatientSymptoms = async (doctorId, patientId) => {
  const patient = await Patient.findOne({
    where:   { Patient_id: patientId, Doc_id: doctorId },
    include: [{ model: Doctor, attributes: ['Name', 'Specialization'] }],
  });
  if (!patient) {
    const err = new Error('المريض غير موجود');
    err.status = 404;
    throw err;
  }

  const symptoms = await Symptom.findAll({
    where: { Patient_id: patientId },
    order: [['createdAt', 'DESC']],
  });

  const latest     = symptoms[0];
  const prediction = latest ? predictDiagnosis(latest) : null;

  return {
    patient: {
      Patient_id: patient.Patient_id,
      fullName:   `${patient.First_Name} ${patient.Last_Name}`,
      fileNumber: patient.fileNumber,
      condition:  patient.conditionStatus,
      doctor:     patient.Doctor,
    },
    prediction,
    totalRecords: symptoms.length,
    symptoms,
  };
};