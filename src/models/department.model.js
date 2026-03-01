import { DataTypes } from 'sequelize';
import sequelize     from '../config/db.js';

const Department = sequelize.define('Department', {
  Dept_id: {
    type:          DataTypes.INTEGER,
    primaryKey:    true,
    autoIncrement: true,
  },
  Name: {
    type:      DataTypes.STRING(50),
    allowNull: false,
  },
  Location: {
    type:      DataTypes.STRING(100),
    allowNull: true,
  },
  Drugs: {
    type:      DataTypes.STRING(200),
    allowNull: true,
  },
  Side_Effects: {
    type:      DataTypes.STRING(200),
    allowNull: true,
  },
}, {
  tableName:  'department',
  timestamps: false,
});

export default Department;