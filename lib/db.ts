import { DATABASE_URL } from '@/config/config';
import { neon } from '@neondatabase/serverless';

if (!DATABASE_URL) {
  throw new Error('DATABASE_URL environment variable is not set');
}

const sql = neon(DATABASE_URL);

export { sql };
