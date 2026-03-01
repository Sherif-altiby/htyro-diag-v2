import { DataTypes } from 'sequelize';
import sequelize     from '../config/db.js';

const Patient = sequelize.define('Patient', {
  Patient_id: {
    type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true,
  },
  First_Name:  { type: DataTypes.STRING(50),  allowNull: false },
  Last_Name:   { type: DataTypes.STRING(50),  allowNull: false },
  Gender:      { type: DataTypes.ENUM('Male', 'Female'), allowNull: false },
  Age:         { type: DataTypes.INTEGER,     allowNull: false },
  Weight_Gain: { type: DataTypes.FLOAT,       allowNull: true  },
  Doc_id:      { type: DataTypes.INTEGER,     allowNull: true  },

  // Extra fields
  phone:           { type: DataTypes.STRING(20),  allowNull: true },
  email:           { type: DataTypes.STRING(100), allowNull: true },
  clinicalHistory: { type: DataTypes.TEXT,        allowNull: true },
  fileNumber:      { type: DataTypes.STRING(20),  allowNull: true, unique: true },
  conditionStatus: {
    type:         DataTypes.ENUM('normal', 'hypothyroidism', 'hyperthyroidism', 'unknown'),
    defaultValue: 'unknown',
  },
  photoUrl: { type: DataTypes.STRING(255), allowNull: true },
}, {
  tableName:  'patient',
  timestamps: true,
});

export default Patient;