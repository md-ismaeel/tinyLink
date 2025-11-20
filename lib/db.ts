import { DATABASE_URI } from '@/config/config';
import { neon } from '@neondatabase/serverless';

if (!DATABASE_URI) {
  throw new Error('DATABASE_URL environment variable is not set');
}

const sql = neon(DATABASE_URI);

export { sql };
