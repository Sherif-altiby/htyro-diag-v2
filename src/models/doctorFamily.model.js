import { DataTypes } from 'sequelize';
import sequelize     from '../config/db.js';

const DoctorFamily = sequelize.define('DoctorFamily', {
  Family_id: {
    type:          DataTypes.INTEGER,
    primaryKey:    true,
    autoIncrement: true,
  },
  Doc_id: {
    type:      DataTypes.INTEGER,
    allowNull: false,
  },
  Relation: {
    type:      DataTypes.STRING(50),
    allowNull: true,
  },
  Experience: {
    type:      DataTypes.INTEGER,
    allowNull: true,
  },
}, {
  tableName:  'doctor_family',
  timestamps: false,
});

export default DoctorFamily;