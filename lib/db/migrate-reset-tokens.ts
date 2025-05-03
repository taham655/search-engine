import { config } from 'dotenv';
import { drizzle } from 'drizzle-orm/postgres-js';
import postgres from 'postgres';
import { addResetTokenFields } from './migrations/add-reset-token-fields';

// Load environment variables
config({
  path: '.env.local',
});

const runMigrate = async () => {
  if (!process.env.POSTGRES_URL) {
    throw new Error('POSTGRES_URL is not defined');
  }

  const connection = postgres(process.env.POSTGRES_URL, { max: 1 });
  const db = drizzle(connection);

  console.log('⏳ Running reset token migration...');

  try {
    const start = Date.now();
    await addResetTokenFields();
    const end = Date.now();

    console.log('✅ Reset token migration completed in', end - start, 'ms');
  } catch (error) {
    console.error('❌ Reset token migration failed', error);
  } finally {
    process.exit(0);
  }
};

runMigrate().catch((err) => {
  console.error('❌ Migration script failed');
  console.error(err);
  process.exit(1);
});