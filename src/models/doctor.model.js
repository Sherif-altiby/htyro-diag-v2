import { DataTypes } from 'sequelize';
import sequelize     from '../config/db.js';

const Doctor = sequelize.define('Doctor', {
  Doc_id: {
    type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true,
  },
  Name:           { type: DataTypes.STRING(100), allowNull: false },
  Specialization: { type: DataTypes.STRING(100), allowNull: false },
  Clinic_address: { type: DataTypes.STRING(200), allowNull: true  },
  email:          { type: DataTypes.STRING(100), allowNull: false, unique: true },
  passwordHash:   { type: DataTypes.STRING(255), allowNull: false },
  certifications: { type: DataTypes.TEXT,        allowNull: true  },
  photoUrl:       { type: DataTypes.STRING(255), allowNull: true  },

  // Settings
  notificationsEnabled: { type: DataTypes.BOOLEAN, defaultValue: true  },
  darkModeEnabled:      { type: DataTypes.BOOLEAN, defaultValue: false },
  language:             { type: DataTypes.ENUM('ar', 'en'), defaultValue: 'ar' },
  privacyEnabled:       { type: DataTypes.BOOLEAN, defaultValue: true  },
}, {
  tableName:  'doctor',
  timestamps: true,
});

export default Doctor;