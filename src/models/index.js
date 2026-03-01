import Doctor       from './doctor.model.js';
import Department   from './department.model.js';
import Employee     from './employee.model.js';
import DoctorFamily from './doctorFamily.model.js';
import Patient      from './patient.model.js';
import Symptom      from './symptom.model.js';
import ThyroidTest  from './thyroidTest.model.js';

// Associations
Doctor.hasMany(DoctorFamily, { foreignKey: 'Doc_id', onDelete: 'CASCADE' });
DoctorFamily.belongsTo(Doctor, { foreignKey: 'Doc_id' });

Doctor.hasMany(Patient,      { foreignKey: 'Doc_id' });
Patient.belongsTo(Doctor,    { foreignKey: 'Doc_id' });

Doctor.hasMany(ThyroidTest,     { foreignKey: 'Doc_id', onDelete: 'CASCADE' });
ThyroidTest.belongsTo(Doctor,   { foreignKey: 'Doc_id' });

Department.hasMany(Employee,    { foreignKey: 'Dept_id', onDelete: 'SET NULL' });
Employee.belongsTo(Department,  { foreignKey: 'Dept_id' });

Patient.hasMany(Symptom,        { foreignKey: 'Patient_id', onDelete: 'CASCADE' });
Symptom.belongsTo(Patient,      { foreignKey: 'Patient_id' });

Patient.hasMany(ThyroidTest,    { foreignKey: 'Patient_id', onDelete: 'CASCADE' });
ThyroidTest.belongsTo(Patient,  { foreignKey: 'Patient_id' });

export { Doctor, Department, Employee, DoctorFamily, Patient, Symptom, ThyroidTest };