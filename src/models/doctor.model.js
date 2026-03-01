import { DataTypes } from 'sequelize';
import sequelize     from '../config/db.js';

const Doctor = sequelize.define('Doctor', {
  Doc_id: {
    type:          DataTypes.INTEGER,
    primaryKey:    true,
    autoIncrement: true,
  },
  Name: {
    type:      DataTypes.STRING(100),
    allowNull: false,
  },
  Specialization: {
    type:      DataTypes.STRING(100),
    allowNull: false,
  },
  Clinic_address: {
    type:      DataTypes.STRING(200),
    allowNull: true,
  },
  email: {
    type:      DataTypes.STRING(100),
    allowNull: false,
    unique:    true,
  },
  passwordHash: {
    type:      DataTypes.STRING(255),
    allowNull: false,
  },
}, {
  tableName:  'doctor',
  timestamps: false,
});

export default Doctor;