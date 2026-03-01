import Symptom from '../models/symptom.model.js';
import Patient from '../models/patient.model.js';
import Doctor  from '../models/doctor.model.js';

// ── Diagnosis prediction engine ────────────────────────────────────────────
const predictDiagnosis = (symptom) => {
  let hypothyroidismScore  = 0;
  let hyperthyroidismScore = 0;

  // ── General symptoms scoring ───────────────────────────────────────────
  const severityScore = { none: 0, mild: 1, moderate: 2, severe: 3 };

  // Hypothyroidism indicators
  hypothyroidismScore  += severityScore[symptom.Fatigue]                || 0;
  hypothyroidismScore  += severityScore[symptom.Weight_Change]          || 0;
  hypothyroidismScore  += severityScore[symptom.Cold_Heat_Intolerance]  || 0;
  hypothyroidismScore  += symptom.Hair_Loss     ? 2 : 0;
  hypothyroidismScore  += symptom.Dry_Skin      ? 2 : 0;
  hypothyroidismScore  += symptom.Neck_Swelling ? 1 : 0;
  hypothyroidismScore  += symptom.Concentration_Difficulty > 60 ? 2 : 0;
  hypothyroidismScore  += symptom.Mood_Swings              > 60 ? 1 : 0;

  // Hyperthyroidism indicators
  hyperthyroidismScore += severityScore[symptom.Weight_Change]         || 0;
  hyperthyroidismScore += symptom.Anxiety       > 60 ? 3 : 0;
  hyperthyroidismScore += symptom.Mood_Swings   > 70 ? 2 : 0;
  hyperthyroidismScore += symptom.Neck_Swelling ? 2  : 0;
  hyperthyroidismScore += severityScore[symptom.Cold_Heat_Intolerance] || 0;

  // ── Determine diagnosis ────────────────────────────────────────────────
  const totalScore = Math.max(hypothyroidismScore, hyperthyroidismScore);
  let diagnosis, confidence, description, recommendations;

  if (hypothyroidismScore > hyperthyroidismScore) {
    diagnosis    = 'hypothyroidism';
    confidence   = Math.min(Math.round((hypothyroidismScore / 15) * 100), 95);
    description  = 'قصور الغدة الدرقية (Hypothyroidism)';
    recommendations = [
      'إجراء تحليل TSH و Free T4',
      'مراجعة طبيب الغدد الصماء',
      'فحص الأجسام المضادة TPO',
      'متابعة مستوى الطاقة والوزن',
    ];
  } else if (hyperthyroidismScore > hypothyroidismScore) {
    diagnosis    = 'hyperthyroidism';
    confidence   = Math.min(Math.round((hyperthyroidismScore / 15) * 100), 95);
    description  = 'فرط نشاط الغدة الدرقية (Hyperthyroidism)';
    recommendations = [
      'إجراء تحليل TSH و Free T3 و Free T4',
      'فحص مستوى القلب والنبض',
      'تقييم مرض غريفز',
      'مراجعة طبيب الغدد الصماء فوراً',
    ];
  } else if (totalScore === 0) {
    diagnosis    = 'normal';
    confidence   = 90;
    description  = 'لا توجد أعراض واضحة — الغدة الدرقية طبيعية';
    recommendations = [
      'متابعة دورية سنوية',
      'فحص TSH كل عام كإجراء وقائي',
    ];
  } else {
    diagnosis    = 'unknown';
    confidence   = 40;
    description  = 'الأعراض غير حاسمة — يحتاج تقييم إضافي';
    recommendations = [
      'إجراء تحاليل شاملة للغدة الدرقية',
      'متابعة الأعراض لمدة أسبوعين',
      'مراجعة الطبيب للتقييم السريري',
    ];
  }

  return {
    diagnosis,
    description,
    confidence:      `${confidence}%`,
    hypothyroidismScore,
    hyperthyroidismScore,
    riskLevel:       totalScore >= 10 ? 'high' : totalScore >= 5 ? 'medium' : 'low',
    recommendations,
  };
};

// ── Create symptom record ──────────────────────────────────────────────────
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

  // Predict diagnosis immediately after saving
  const prediction = predictDiagnosis(symptom);

  return { symptom, prediction };
};

// ── Get patient symptoms + prediction ─────────────────────────────────────
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

  // Predict from latest symptom record
  const latest    = symptoms[0];
  const prediction = latest ? predictDiagnosis(latest) : null;

  // Active symptoms list
  const activeSymptoms = [];
  if (latest) {
    if (latest.Fatigue       !== 'none') activeSymptoms.push(`إجهاد — ${latest.Fatigue}`);
    if (latest.Weight_Change !== 'none') activeSymptoms.push(`تغير في الوزن — ${latest.Weight_Change}`);
    if (latest.Cold_Heat_Intolerance !== 'none') activeSymptoms.push(`عدم تحمل البرد/الحرارة — ${latest.Cold_Heat_Intolerance}`);
    if (latest.Hair_Loss)     activeSymptoms.push('تساقط الشعر');
    if (latest.Dry_Skin)      activeSymptoms.push('جفاف الجلد');
    if (latest.Neck_Swelling) activeSymptoms.push('تضخم في الرقبة');
    if (latest.Anxiety                  > 0) activeSymptoms.push(`قلق — ${latest.Anxiety}%`);
    if (latest.Mood_Swings              > 0) activeSymptoms.push(`تقلبات مزاج — ${latest.Mood_Swings}%`);
    if (latest.Concentration_Difficulty > 0) activeSymptoms.push(`صعوبة تركيز — ${latest.Concentration_Difficulty}%`);
  }

  return {
    patient: {
      Patient_id: patient.Patient_id,
      fullName:   `${patient.First_Name} ${patient.Last_Name}`,
      fileNumber: patient.fileNumber,
      condition:  patient.conditionStatus,
      doctor:     patient.Doctor,
    },
    prediction,
    activeSymptoms,
    totalRecords: symptoms.length,
    symptoms,
  };
};