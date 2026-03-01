import { DataTypes } from 'sequelize';
import sequelize     from '../config/db.js';

const ThyroidTest = sequelize.define('ThyroidTest', {
  Test_id: {
    type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true,
  },
  Patient_id: { type: DataTypes.INTEGER, allowNull: false },
  Doc_id:     { type: DataTypes.INTEGER, allowNull: false },
  TSH_Value:  { type: DataTypes.FLOAT,   allowNull: false },
  Free_T4:    { type: DataTypes.FLOAT,   allowNull: true  },
  Free_T3:    { type: DataTypes.FLOAT,   allowNull: true  },
  Test_Date:  { type: DataTypes.DATEONLY, allowNull: false },
  Notes:      { type: DataTypes.TEXT,    allowNull: true  },
  Image_Url:  { type: DataTypes.STRING(255), allowNull: true },

  // Auto-computed status fields
  TSH_Status:   { type: DataTypes.ENUM('low', 'normal', 'high'), allowNull: true },
  FreeT4_Status:{ type: DataTypes.ENUM('low', 'normal', 'high'), allowNull: true },
  FreeT3_Status:{ type: DataTypes.ENUM('low', 'normal', 'high'), allowNull: true },
}, {
  tableName:  'thyroid_tests',
  timestamps: true,
});

export default ThyroidTest;