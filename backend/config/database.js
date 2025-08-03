const { Pool } = require('pg');
require('dotenv').config();

const pool = new Pool({
  host: process.env.DB_HOST || 'localhost',
  port: parseInt(process.env.DB_PORT) || 5432,
  database: process.env.DB_NAME || 'funnel_analytics',
  user: process.env.DB_USER || 'postgres',
  password: process.env.DB_PASSWORD,
  max: 20,
  idleTimeoutMillis: 30000,
  connectionTimeoutMillis: 2000,
});

pool.on('connect', () => {
  console.log('✅ PostgreSQL connected successfully for Landing');
});

pool.on('error', (err) => {
  console.error('❌ PostgreSQL connection error for Landing:', err);
});

const executeQuery = async (text, params = []) => {
  const start = Date.now();
  try {
    const result = await pool.query(text, params);
    const duration = Date.now() - start;
    console.log(`🔍 Query executed in ${duration}ms:`, {
      query: text.substring(0, 100) + (text.length > 100 ? '...' : ''),
      rows: result.rowCount
    });
    return result;
  } catch (error) {
    console.error('❌ Database query error:', error);
    throw error;
  }
};

module.exports = { executeQuery };
