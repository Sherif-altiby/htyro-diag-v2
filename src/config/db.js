import { Sequelize } from 'sequelize';
import mysql2 from 'mysql2'; // 1. Add this import

const sslConfig = process.env.DB_SSL_CERT
  ? { ca: Buffer.from(process.env.DB_SSL_CERT, 'base64') }
  : { rejectUnauthorized: false };

const sequelize = new Sequelize(
  process.env.DB_NAME,
  process.env.DB_USER,
  process.env.DB_PASS,
  {
    host:     process.env.DB_HOST,
    port:     process.env.DB_PORT || 3306,
    dialect: 'mysql',
    dialectModule: mysql2, // 2. Add this line here
    logging: false,
    dialectOptions: {
      ssl: sslConfig,
    },
  }
);

export const connectDB = async () => {
  try {
    // Note: It's safer to authenticate before running queries
    await sequelize.authenticate();
    await sequelize.query("SET SESSION sql_mode = ''");
    await sequelize.sync({ alter: true });
    console.log('✅ MySQL connected successfully');
  } catch (err) {
    console.error('❌ Database error:', err.message);
    throw err;
  }
};

export default sequelize;