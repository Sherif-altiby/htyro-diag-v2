import Symptom from '../models/symptom.model.js';
import Patient from '../models/patient.model.js';
import Doctor  from '../models/doctor.model.js';

// ── Prediction engine ──────────────────────────────────────────────────────
const predictDiagnosis = (s) => {

  // Hypothyroidism score
  let hypoScore = 0;
  if (s.feeling_cold)         hypoScore++;
  if (s.weight_gain)          hypoScore++;
  if (s.cold_sensitivity)     hypoScore++;
  if (s.slow_metabolism)      hypoScore++;
  if (s.chronic_constipation) hypoScore++;
  if (s.muscle_pain)          hypoScore++;
  if (s.muscle_cramps)        hypoScore++;
  if (s.dry_skin)             hypoScore++;
  if (s.hair_loss)            hypoScore++;
  if (s.less_sweating)        hypoScore++;
  if (s.depression)           hypoScore++;
  if (s.mood_swings)          hypoScore++;
  if (s.face_swelling)        hypoScore++;
  if (s.neck_swelling)        hypoScore++;
  if (s.slow_heart_rate)      hypoScore++;

  // Hyperthyroidism score
  let hyperScore = 0;
  if (s.sudden_weight_loss)   hyperScore++;
  if (s.increased_appetite)   hyperScore++;
  if (s.heat_sensitivity)     hyperScore++;
  if (s.excessive_sweating)   hyperScore++;
  if (s.anxiety)              hyperScore++;
  if (s.tremors)              hyperScore++;
  if (s.mood_changes)         hyperScore++;
  if (s.insomnia)             hyperScore++;
  if (s.fast_heart_rate)      hyperScore++;
  if (s.heart_palpitations)   hyperScore++;
  if (s.bowel_activity)       hyperScore++;
  if (s.eye_bulging)          hyperScore++;
  if (s.thin_skin)            hyperScore++;
  if (s.thin_hair)            hyperScore++;

  // Determine result
  if (hypoScore === 0 && hyperScore === 0) {
    return {
      result:     'طبيعي',
      diagnosis:  'normal',
      hypoScore,
      hyperScore,
    };
  }

  if (hypoScore > hyperScore) {
    return {
      result:    'خمول في الغدة',
      diagnosis: 'hypothyroidism',
      hypoScore,
      hyperScore,
    };
  }

  if (hyperScore > hypoScore) {
    return {
      result:    'نشاط في الغدة',
      diagnosis: 'hyperthyroidism',
      hypoScore,
      hyperScore,
    };
  }

  return {
    result:    'غير محدد — يحتاج تقييم إضافي',
    diagnosis: 'unknown',
    hypoScore,
    hyperScore,
  };
};

// ── Create symptom ─────────────────────────────────────────────────────────
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
    Patient_id: patientId,

    // Hypo symptoms
    feeling_cold:         body.feeling_cold         || false,
    weight_gain:          body.weight_gain           || false,
    cold_sensitivity:     body.cold_sensitivity      || false,
    slow_metabolism:      body.slow_metabolism       || false,
    chronic_constipation: body.chronic_constipation  || false,
    muscle_pain:          body.muscle_pain           || false,
    muscle_cramps:        body.muscle_cramps         || false,
    dry_skin:             body.dry_skin              || false,
    hair_loss:            body.hair_loss             || false,
    less_sweating:        body.less_sweating         || false,
    depression:           body.depression            || false,
    mood_swings:          body.mood_swings           || false,
    face_swelling:        body.face_swelling         || false,
    neck_swelling:        body.neck_swelling         || false,
    slow_heart_rate:      body.slow_heart_rate       || false,

    // Hyper symptoms
    sudden_weight_loss:   body.sudden_weight_loss    || false,
    increased_appetite:   body.increased_appetite    || false,
    heat_sensitivity:     body.heat_sensitivity      || false,
    excessive_sweating:   body.excessive_sweating    || false,
    anxiety:              body.anxiety               || false,
    tremors:              body.tremors               || false,
    mood_changes:         body.mood_changes          || false,
    insomnia:             body.insomnia              || false,
    fast_heart_rate:      body.fast_heart_rate       || false,
    heart_palpitations:   body.heart_palpitations    || false,
    bowel_activity:       body.bowel_activity        || false,
    eye_bulging:          body.eye_bulging           || false,
    thin_skin:            body.thin_skin             || false,
    thin_hair:            body.thin_hair             || false,

    additional_notes:     body.additional_notes      || null,
  });

  const prediction = predictDiagnosis(symptom);
  return { symptom, prediction };
};

// ── Get symptoms ───────────────────────────────────────────────────────────
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