import { Sequelize } from 'sequelize';

const sequelize = new Sequelize(
  process.env.DB_NAME || 'thyroid_project',
  process.env.DB_USER || 'root',
  process.env.DB_PASS || 'Root@123',
  {
    host:    process.env.DB_HOST || 'localhost',
    dialect: 'mysql',
    logging: false,
  }
);

export const connectDB = async () => {
  try {
    await sequelize.authenticate();
    await sequelize.sync({ alter: true });
    console.log('✅ MySQL connected successfully');
  } catch (err) {
    console.error('❌ Database error:', err.message);
    throw err;
  }
};

export default sequelize;