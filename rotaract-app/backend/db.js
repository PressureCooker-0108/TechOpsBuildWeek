import 'dotenv/config';
import pg from 'pg';

const { Pool } = pg;

// Prefer DATABASE_URL in cloud deployments; fallback to discrete local vars.
const connectionString = process.env.DATABASE_URL;
const poolConfig = {
  host: process.env.DB_HOST || 'localhost',
  port: Number(process.env.DB_PORT || 5432),
  user: process.env.DB_USER || 'postgres',
  database: process.env.DB_NAME || 'rotaract_db'
};

// Include password only when provided so local trust-auth setups still work.
if (process.env.DB_PASSWORD) {
  poolConfig.password = process.env.DB_PASSWORD;
}

// If DATABASE_URL exists use SSL-friendly config (common on hosted Postgres).
const pool = connectionString
  ? new Pool({
      connectionString,
      ssl: { rejectUnauthorized: false }
    })
  : new Pool({
      ...poolConfig
    });

export default pool;

