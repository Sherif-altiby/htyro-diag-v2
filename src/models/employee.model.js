import { DataTypes } from 'sequelize';
import sequelize     from '../config/db.js';

const Employee = sequelize.define('Employee', {
  Employee_id: {
    type:          DataTypes.INTEGER,
    primaryKey:    true,
    autoIncrement: true,
  },
  Name: {
    type:      DataTypes.STRING(100),
    allowNull: false,
  },
  Position: {
    type:      DataTypes.STRING(50),
    allowNull: true,
  },
  Salary: {
    type:      DataTypes.DECIMAL(10, 2),
    allowNull: true,
  },
  Dept_id: {
    type:      DataTypes.INTEGER,
    allowNull: true,
  },
}, {
  tableName:  'employees',
  timestamps: false,
});

export default Employee;