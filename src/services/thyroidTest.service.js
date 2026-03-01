import ThyroidTest from '../models/thyroidTest.model.js';
import Patient     from '../models/patient.model.js';

// ── Reference ranges (ATA 2024) ────────────────────────────────────────────
const RANGES = {
  TSH:    { low: 0.4,  high: 4.0  },  // mIU/L
  FreeT4: { low: 0.8,  high: 1.8  },  // pmol/L
  FreeT3: { low: 2.3,  high: 4.2  },  // pmol/L
};

const calcStatus = (value, low, high) => {
  if (value == null) return null;
  if (value < low)   return 'low';
  if (value > high)  return 'high';
  return 'normal';
};

// ── Disease prediction engine ──────────────────────────────────────────────
const predictDisease = (TSH, FreeT4, FreeT3) => {
  const tshStatus   = calcStatus(TSH,    RANGES.TSH.low,    RANGES.TSH.high);
  const t4Status    = calcStatus(FreeT4, RANGES.FreeT4.low, RANGES.FreeT4.high);
  const t3Status    = calcStatus(FreeT3, RANGES.FreeT3.low, RANGES.FreeT3.high);

  let diagnosis, description, confidence, details, recommendations;

  // ── Hypothyroidism: HIGH TSH + LOW T4/T3 ──────────────────────────────
  if (tshStatus === 'high' && (t4Status === 'low' || t3Status === 'low')) {
    diagnosis   = 'hypothyroidism';
    description = 'قصور الغدة الدرقية الأولي (Primary Hypothyroidism)';
    confidence  = 92;
    details     = 'ارتفاع TSH مع انخفاض T4/T3 يشير بوضوح إلى فشل الغدة الدرقية في إنتاج الهرمونات الكافية.';
    recommendations = [
      'بدء علاج الليفوثيروكسين (Levothyroxine)',
      'إعادة فحص TSH بعد 6 أسابيع من بدء العلاج',
      'فحص الأجسام المضادة TPO لاستبعاد هاشيموتو',
      'مراجعة طبيب الغدد الصماء',
    ];

  // ── Hyperthyroidism: LOW TSH + HIGH T4/T3 ─────────────────────────────
  } else if (tshStatus === 'low' && (t4Status === 'high' || t3Status === 'high')) {
    diagnosis   = 'hyperthyroidism';
    description = 'فرط نشاط الغدة الدرقية (Hyperthyroidism)';
    confidence  = 90;
    details     = 'انخفاض حاد في TSH مع ارتفاع T4/T3 يشير إلى إنتاج مفرط لهرمونات الغدة الدرقية.';
    recommendations = [
      'بدء علاج مضاد للغدة الدرقية (Methimazole)',
      'فحص الأجسام المضادة TRAb لاستبعاد مرض غريفز',
      'مراقبة وظائف الكبد كل 4 أسابيع',
      'مراجعة طبيب الغدد الصماء فوراً',
    ];

  // ── Subclinical Hypothyroidism: HIGH TSH + NORMAL T4/T3 ───────────────
  } else if (tshStatus === 'high' && t4Status === 'normal') {
    diagnosis   = 'subclinical_hypothyroidism';
    description = 'قصور الغدة الدرقية تحت السريري (Subclinical Hypothyroidism)';
    confidence  = 85;
    details     = 'ارتفاع TSH مع T4 طبيعي — مرحلة مبكرة من قصور الغدة.';
    recommendations = [
      'متابعة دورية كل 3-6 أشهر',
      'فحص الأجسام المضادة TPO',
      'قد يحتاج علاجاً إذا TSH > 10',
      'متابعة الأعراض السريرية',
    ];

  // ── Subclinical Hyperthyroidism: LOW TSH + NORMAL T4/T3 ───────────────
  } else if (tshStatus === 'low' && t4Status === 'normal' && t3Status === 'normal') {
    diagnosis   = 'subclinical_hyperthyroidism';
    description = 'فرط نشاط الغدة الدرقية تحت السريري (Subclinical Hyperthyroidism)';
    confidence  = 80;
    details     = 'انخفاض TSH مع هرمونات طبيعية — مرحلة مبكرة من فرط النشاط.';
    recommendations = [
      'متابعة دورية كل 3 أشهر',
      'فحص كثافة العظام',
      'تقييم وظائف القلب',
      'مراقبة الأعراض',
    ];

  // ── Normal ─────────────────────────────────────────────────────────────
  } else if (tshStatus === 'normal' && t4Status === 'normal') {
    diagnosis   = 'normal';
    description = 'وظائف الغدة الدرقية طبيعية';
    confidence  = 95;
    details     = 'جميع المؤشرات ضمن النطاق الطبيعي. لا يوجد ما يدعو للقلق.';
    recommendations = [
      'متابعة سنوية روتينية',
      'فحص TSH كل عام كإجراء وقائي',
    ];

  // ── Unknown ────────────────────────────────────────────────────────────
  } else {
    diagnosis   = 'unknown';
    description = 'نتائج غير حاسمة — تحتاج تقييم إضافي';
    confidence  = 45;
    details     = 'النتائج لا تتطابق مع نمط محدد. يحتاج فحوصات تكميلية.';
    recommendations = [
      'إعادة التحاليل بعد أسبوعين',
      'فحص سريري شامل',
      'مراجعة الطبيب للتقييم',
    ];
  }

  return {
    diagnosis,
    description,
    confidence: `${confidence}%`,
    details,
    labSummary: {
      TSH:    { value: TSH,    status: tshStatus,  range: '0.4 – 4.0 mIU/L'  },
      FreeT4: { value: FreeT4, status: t4Status,   range: '0.8 – 1.8 pmol/L' },
      FreeT3: { value: FreeT3, status: t3Status,   range: '2.3 – 4.2 pmol/L' },
    },
    recommendations,
  };
};

// ── Create lab result ──────────────────────────────────────────────────────
export const createThyroidTest = async (doctorId, patientId, body) => {
  const patient = await Patient.findOne({
    where: { Patient_id: patientId, Doc_id: doctorId },
  });
  if (!patient) {
    const err = new Error('المريض غير موجود');
    err.status = 404;
    throw err;
  }

  const { TSH_Value, Free_T4, Free_T3, Test_Date, Notes, Image_Url } = body;

  if (!TSH_Value) {
    const err = new Error('قيمة TSH مطلوبة');
    err.status = 422;
    throw err;
  }

  if (!Test_Date) {
    const err = new Error('تاريخ الفحص مطلوب');
    err.status = 422;
    throw err;
  }

  // Compute statuses
  const TSH_Status    = calcStatus(TSH_Value, RANGES.TSH.low,    RANGES.TSH.high);
  const FreeT4_Status = calcStatus(Free_T4,   RANGES.FreeT4.low, RANGES.FreeT4.high);
  const FreeT3_Status = calcStatus(Free_T3,   RANGES.FreeT3.low, RANGES.FreeT3.high);

  const test = await ThyroidTest.create({
    Patient_id: patientId,
    Doc_id:     doctorId,
    TSH_Value,
    Free_T4:    Free_T4   || null,
    Free_T3:    Free_T3   || null,
    Test_Date,
    Notes:      Notes     || null,
    Image_Url:  Image_Url || null,
    TSH_Status,
    FreeT4_Status,
    FreeT3_Status,
  });

  // Predict disease from lab values
  const prediction = predictDisease(TSH_Value, Free_T4, Free_T3);

  // Update patient condition status
  if (prediction.diagnosis !== 'unknown') {
    await Patient.update(
      { conditionStatus: prediction.diagnosis.includes('hypo') ? 'hypothyroidism'
                       : prediction.diagnosis.includes('hyper') ? 'hyperthyroidism'
                       : 'normal' },
      { where: { Patient_id: patientId } }
    );
  }

  return { test, prediction };
};

// ── Get all tests for patient ──────────────────────────────────────────────
export const getPatientTests = async (doctorId, patientId) => {
  const patient = await Patient.findOne({
    where: { Patient_id: patientId, Doc_id: doctorId },
  });
  if (!patient) {
    const err = new Error('المريض غير موجود');
    err.status = 404;
    throw err;
  }

  const tests = await ThyroidTest.findAll({
    where: { Patient_id: patientId },
    order: [['Test_Date', 'DESC']],
  });

  // Predict from latest test
  const latest     = tests[0];
  const prediction = latest
    ? predictDisease(latest.TSH_Value, latest.Free_T4, latest.Free_T3)
    : null;

  return {
    patient: {
      Patient_id: patient.Patient_id,
      fullName:   `${patient.First_Name} ${patient.Last_Name}`,
      fileNumber: patient.fileNumber,
      condition:  patient.conditionStatus,
    },
    prediction,
    totalTests: tests.length,
    tests,
  };
};