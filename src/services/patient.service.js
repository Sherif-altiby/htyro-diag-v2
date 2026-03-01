import Patient from '../models/patient.model.js';
import Doctor  from '../models/doctor.model.js';

export const createPatient = async (doctorId, body) => {
  const { fullName, age, gender, phone, email, clinicalHistory } = body;

  // Split fullName into First and Last
  const nameParts = fullName.trim().split(' ');
  const First_Name = nameParts[0];
  const Last_Name  = nameParts.slice(1).join(' ') || nameParts[0];

  // Auto generate file number
  const count      = await Patient.count({ where: { Doc_id: doctorId } });
  const fileNumber = `TX-${String(count + 1).padStart(5, '0')}`;

  const patient = await Patient.create({
    Doc_id:          doctorId,
    First_Name,
    Last_Name,
    Age:             age,
    Gender:          gender,
    phone:           phone           || null,
    email:           email           || null,
    clinicalHistory: clinicalHistory || null,
    fileNumber,
    conditionStatus: 'unknown',
  });

  return patient;
};

export const getAllPatients = async (doctorId, { search, condition, page, limit }) => {
  const { Op } = await import('sequelize');

  const where = { Doc_id: doctorId };

  if (condition && condition !== 'all') {
    where.conditionStatus = condition;
  }

  if (search) {
    where[Op.or] = [
      { First_Name: { [Op.like]: `%${search}%` } },
      { Last_Name:  { [Op.like]: `%${search}%` } },
    ];
  }

  const pageNum  = parseInt(page)  || 1;
  const limitNum = parseInt(limit) || 10;
  const offset   = (pageNum - 1) * limitNum;

  const { count, rows } = await Patient.findAndCountAll({
    where,
    limit:   limitNum,
    offset,
    order:   [['createdAt', 'DESC']],
    include: [{ model: Doctor, attributes: ['Name', 'Specialization'] }],
  });

  return {
    patients: rows.map(p => ({
      ...p.toJSON(),
      fullName: `${p.First_Name} ${p.Last_Name}`,
      initials: `${p.First_Name[0]}${p.Last_Name[0]}`,
    })),
    pagination: {
      total:      count,
      page:       pageNum,
      limit:      limitNum,
      totalPages: Math.ceil(count / limitNum),
    },
  };
};

export const getPatientById = async (doctorId, patientId) => {
  const patient = await Patient.findOne({
    where:   { Patient_id: patientId, Doc_id: doctorId },
    include: [{ model: Doctor, attributes: ['Name', 'Specialization'] }],
  });
  if (!patient) {
    const err = new Error('المريض غير موجود');
    err.status = 404;
    throw err;
  }
  return {
    ...patient.toJSON(),
    fullName: `${patient.First_Name} ${patient.Last_Name}`,
  };
};

export const updatePatient = async (doctorId, patientId, body) => {
  const patient = await Patient.findOne({
    where: { Patient_id: patientId, Doc_id: doctorId },
  });
  if (!patient) {
    const err = new Error('المريض غير موجود');
    err.status = 404;
    throw err;
  }

  const { fullName, age, gender, phone, email, clinicalHistory, conditionStatus } = body;

  if (fullName) {
    const nameParts      = fullName.trim().split(' ');
    patient.First_Name   = nameParts[0];
    patient.Last_Name    = nameParts.slice(1).join(' ') || nameParts[0];
  }

  if (age)              patient.Age             = age;
  if (gender)           patient.Gender          = gender;
  if (phone)            patient.phone           = phone;
  if (email)            patient.email           = email;
  if (clinicalHistory)  patient.clinicalHistory = clinicalHistory;
  if (conditionStatus)  patient.conditionStatus = conditionStatus;

  await patient.save();
  return patient;
};

export const deletePatient = async (doctorId, patientId) => {
  const patient = await Patient.findOne({
    where: { Patient_id: patientId, Doc_id: doctorId },
  });
  if (!patient) {
    const err = new Error('المريض غير موجود');
    err.status = 404;
    throw err;
  }
  await patient.destroy();
  return true;
};