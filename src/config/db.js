import { Sequelize } from 'sequelize';

const sequelize = new Sequelize(
  process.env.DB_NAME || 'thyroid_project',
  process.env.DB_USER || 'root',
  process.env.DB_PASS || 'Root@123',
  {
    host:    process.env.DB_HOST || 'localhost',
    port:    process.env.DB_PORT || 3306,
    dialect: 'mysql',
    logging: false,
    dialectOptions: {
      dateStrings: true,
      typeCast:    true,
    },
  }
);

export const connectDB = async () => {
  try {
    // Disable strict mode before sync
    await sequelize.query("SET SESSION sql_mode = ''");
    await sequelize.authenticate();
    await sequelize.sync({ alter: true });
    console.log('✅ MySQL connected successfully');
  } catch (err) {
    console.error('❌ Database error:', err.message);
    throw err;
  }
};

export default sequelize;