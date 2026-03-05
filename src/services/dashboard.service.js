import { Op } from 'sequelize';
import Patient     from '../models/patient.model.js';
import ThyroidTest from '../models/thyroidTest.model.js';

export const getDashboard = async (doctorId) => {

  const now       = new Date();
  const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);

  // ── Run all queries in parallel ────────────────────────────────────────
  const [
    totalPatients,
    pendingDiagnoses,
    casesThisMonth,
    recentPatients,
    recentTests,
  ] = await Promise.all([

    // Total patients
    Patient.count({
      where: { Doc_id: doctorId },
    }),

    // Pending diagnoses — patients with unknown condition
    Patient.count({
      where: { Doc_id: doctorId, conditionStatus: 'unknown' },
    }),

    // Cases this month — tests done this month
    ThyroidTest.count({
      where: {
        Doc_id:    doctorId,
        createdAt: { [Op.gte]: startOfMonth },
      },
    }),

    // Recent patients — last 5
    Patient.findAll({
      where: { Doc_id: doctorId },
      order: [['createdAt', 'DESC']],
      limit: 5,
      attributes: [
        'Patient_id', 'First_Name', 'Last_Name',
        'conditionStatus', 'createdAt',
      ],
    }),

    // Recent lab tests — last 5
    ThyroidTest.findAll({
      where: { Doc_id: doctorId },
      order: [['createdAt', 'DESC']],
      limit: 5,
      include: [{
        model:      Patient,
        attributes: ['First_Name', 'Last_Name'],
      }],
    }),
  ]);

  // ── Build recent activities ────────────────────────────────────────────
  const recentActivities = [];

  recentTests.forEach(test => {
    const name = test.Patient
      ? `${test.Patient.First_Name} ${test.Patient.Last_Name}`
      : 'مريض غير معروف';

    recentActivities.push({
      type:      'lab_test',
      icon:      '🧪',
      message:   `تم إصدار تقرير تشخيص للمريض ${name}`,
      createdAt: test.createdAt,
    });
  });

  recentPatients.forEach(patient => {
    recentActivities.push({
      type:      'new_patient',
      icon:      '👤',
      message:   `إضافة مريض جديد — ${patient.First_Name} ${patient.Last_Name}`,
      createdAt: patient.createdAt,
    });
  });

  // Sort activities by date
  recentActivities.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));

  return {
    doctor: {
      Doc_id:         doctorId,
      date: now.toLocaleDateString('ar-EG', {
        weekday: 'long',
        year:    'numeric',
        month:   'long',
        day:     'numeric',
      }),
    },
    stats: {
      totalPatients,
      pendingDiagnoses,
      casesThisMonth,
    },
    recentActivities: recentActivities.slice(0, 10),
  };
};