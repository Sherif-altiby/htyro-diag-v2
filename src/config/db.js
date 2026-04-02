import { Sequelize } from 'sequelize';
import mysql2 from 'mysql2';

// Aiven requires SSL; this config handles both provided CA certs and default SSL
const sslConfig = process.env.DB_SSL_CERT
  ? { ca: Buffer.from(process.env.DB_SSL_CERT, 'base64') }
  : { rejectUnauthorized: false };

const sequelize = new Sequelize(
  process.env.DB_NAME,
  process.env.DB_USER,
  process.env.DB_PASS,
  {
    host: process.env.DB_HOST,
    port: process.env.DB_PORT || 3306,
    dialect: 'mysql',
    dialectModule: mysql2,
    logging: false,
    dialectOptions: {
      ssl: sslConfig,
    },
  }
);

export const connectDB = async () => {
  try {
    await sequelize.authenticate();
    
    // Disabling strict mode helps with some MySQL version compatibility issues
    await sequelize.query("SET SESSION sql_mode = ''");

    /**
     * ⚠️ FIX FOR "TOO MANY KEYS" ERROR:
     * 1. Change 'alter: true' to 'force: true' for JUST ONE RESTART.
     * 2. After the server starts successfully once, change it back to 'alter: false' or just 'sync()'.
     * 'force: true' drops the table and recreates it, clearing the 64+ duplicate keys.
     */
    await sequelize.sync({ alter: false }); 

    console.log('✅ MySQL connected successfully');
  } catch (err) {
    console.error('❌ Database error:', err.message);
    throw err;
  }
};

export default sequelize;