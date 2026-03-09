import { Op }      from 'sequelize';
import Patient     from '../models/patient.model.js';
import Symptom     from '../models/symptom.model.js';
import ThyroidTest from '../models/thyroidTest.model.js';

// ── Build clinical tags from symptoms ─────────────────────────────────────
const buildClinicalTags = (symptom) => {
  if (!symptom) return [];

  const tags = [];
  const severityLabel = { mild: 'خفيف', moderate: 'متوسط', severe: 'شديد' };

  if (symptom.Fatigue !== 'none')
    tags.push({ label: `إجهاد ${severityLabel[symptom.Fatigue]}`,       type: 'warning' });
  if (symptom.Weight_Change !== 'none')
    tags.push({ label: `زيادة غير مبررة في الوزن`,                      type: 'warning' });
  if (symptom.Cold_Heat_Intolerance !== 'none')
    tags.push({ label: `حساسية مفرطة للبرد`,                            type: 'info'    });
  if (symptom.Hair_Loss)
    tags.push({ label: `تساقط شعر ${severityLabel[symptom.Fatigue] || ''}`, type: 'neutral' });
  if (symptom.Dry_Skin)
    tags.push({ label: `جفاف الجلد`,                                    type: 'neutral' });
  if (symptom.Neck_Swelling)
    tags.push({ label: `تضخم في الرقبة`,                                type: 'danger'  });
  if (symptom.Anxiety > 60)
    tags.push({ label: `قلق شديد`,                                      type: 'warning' });
  if (symptom.Mood_Swings > 60)
    tags.push({ label: `تقلبات مزاج`,                                   type: 'warning' });
  if (symptom.Concentration_Difficulty > 60)
    tags.push({ label: `صعوبة تركيز`,                                   type: 'neutral' });

  return tags;
};

// ── Predict diagnosis from lab + symptoms ─────────────────────────────────
const buildDiagnosis = (test, symptom) => {
  if (!test) return null;

  const tshHigh  = test.TSH_Value > 4.0;
  const tshLow   = test.TSH_Value < 0.4;
  const t4Low    = test.Free_T4 && test.Free_T4 < 0.8;
  const t4High   = test.Free_T4 && test.Free_T4 > 1.8;

  let diagnosis, confidence, explanation;

  if (tshHigh && t4Low) {
    diagnosis   = 'قصور الغدة الدرقية الأولي (Hypothyroidism)';
    confidence  = 92;
    explanation = 'تشير النتائج إلى احتمال كبير للإصابة بقصور الغدة الدرقية الأولي نظراً لارتفاع TSH وانخفاض T4.';
  } else if (tshLow && t4High) {
    diagnosis   = 'فرط نشاط الغدة الدرقية (Hyperthyroidism)';
    confidence  = 90;
    explanation = 'تشير النتائج إلى احتمال كبير للإصابة بفرط نشاط الغدة الدرقية نظراً لانخفاض TSH وارتفاع T4.';
  } else if (tshHigh) {
    diagnosis   = 'قصور الغدة الدرقية تحت السريري';
    confidence  = 75;
    explanation = 'ارتفاع TSH مع T4 طبيعي — مرحلة مبكرة من قصور الغدة.';
  } else if (tshLow) {
    diagnosis   = 'فرط نشاط الغدة الدرقية تحت السريري';
    confidence  = 70;
    explanation = 'انخفاض TSH مع هرمونات طبيعية — مرحلة مبكرة.';
  } else {
    diagnosis   = 'وظائف الغدة الدرقية طبيعية';
    confidence  = 95;
    explanation = 'جميع المؤشرات ضمن النطاق الطبيعي.';
  }

  return { diagnosis, confidence, explanation };
};

// ── Main summary service ───────────────────────────────────────────────────
export const getPatientSummary = async (doctorId, patientId) => {

  const patient = await Patient.findOne({
    where: { Patient_id: patientId, Doc_id: doctorId },
  });
  if (!patient) {
    const err = new Error('المريض غير موجود');
    err.status = 404;
    throw err;
  }

  // Get latest symptom record
  const latestSymptom = await Symptom.findOne({
    where: { Patient_id: patientId },
    order: [['createdAt', 'DESC']],
  });

  // Get latest lab test
  const latestTest = await ThyroidTest.findOne({
    where: { Patient_id: patientId },
    order: [['Test_Date', 'DESC']],
  });

  // Build clinical tags
  const clinicalTags = buildClinicalTags(latestSymptom);

  // Build diagnosis
  const diagnosisData = buildDiagnosis(latestTest, latestSymptom);

  // Build lab results
  const labResults = latestTest ? [
    {
      name:   'TSH',
      value:  latestTest.TSH_Value,
      unit:   'mIU/L',
      status: latestTest.TSH_Status,
      range:  '0.4 - 4.0',
    },
    {
      name:   'Free T4',
      value:  latestTest.Free_T4,
      unit:   'ng/dL',
      status: latestTest.FreeT4_Status,
      range:  '0.8 - 1.8',
    },
    {
      name:   'Total T3',
      value:  latestTest.Free_T3,
      unit:   'ng/dL',
      status: latestTest.FreeT3_Status,
      range:  '80 - 200',
    },
  ] : [];

  return {
    // ── Patient info ──────────────────────────────────────────────────────
    patient: {
      Patient_id: patient.Patient_id,
      fullName:   `${patient.First_Name} ${patient.Last_Name}`,
      age:        patient.Age,
      fileNumber: patient.fileNumber,
      condition:  patient.conditionStatus,
      photoUrl:   patient.photoUrl || null,
    },

    // ── Clinical data tags ────────────────────────────────────────────────
    clinicalTags,

    // ── Proposed diagnosis ────────────────────────────────────────────────
    proposedDiagnosis: {
      diagnosis:      diagnosisData?.diagnosis    || null,
      confidence:     diagnosisData?.confidence   || null,
      explanation:    diagnosisData?.explanation  || null,
      treatmentNotes: null, // doctor fills this manually
    },

    // ── Lab results ───────────────────────────────────────────────────────
    labResults,

    // ── Scan image ────────────────────────────────────────────────────────
    lastScanUrl: latestTest?.Image_Url || null,
  };
};

// ── Update diagnosis notes ─────────────────────────────────────────────────
export const updateDiagnosisNotes = async (doctorId, patientId, body) => {
  const patient = await Patient.findOne({
    where: { Patient_id: patientId, Doc_id: doctorId },
  });
  if (!patient) {
    const err = new Error('المريض غير موجود');
    err.status = 404;
    throw err;
  }

  const test = await ThyroidTest.findOne({
    where: { Patient_id: patientId },
    order: [['Test_Date', 'DESC']],
  });

  if (test) {
    if (body.treatmentNotes) test.Notes = body.treatmentNotes;
    await test.save();
  }

  // Update patient condition
  if (body.conditionStatus) {
    await Patient.update(
      { conditionStatus: body.conditionStatus },
      { where: { Patient_id: patientId } }
    );
  }

  return { message: 'تم تحديث التشخيص بنجاح' };
};