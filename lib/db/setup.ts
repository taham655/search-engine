import { sql } from 'drizzle-orm';
import { drizzle } from 'drizzle-orm/postgres-js';
import postgres from 'postgres';

export async function setupDatabase() {
  console.log('Setting up database...');

  try {
    if (!process.env.POSTGRES_URL) {
      throw new Error('POSTGRES_URL environment variable is not set');
    }

    // Connect to the database
    const client = postgres(process.env.POSTGRES_URL);
    const db = drizzle(client);
    console.log('Connected to database');

    // Check if the User table has the reset token fields
    const checkResult = await sql`
      SELECT column_name
      FROM information_schema.columns
      WHERE table_name='User' AND column_name='resetToken'
    `.execute(db);

    // If column doesn't exist, add it
    if (!checkResult.rows.length) {
      console.log('Adding resetToken and resetTokenExpiry columns to User table...');

      await sql`
        ALTER TABLE "User"
        ADD COLUMN IF NOT EXISTS "resetToken" VARCHAR(256),
        ADD COLUMN IF NOT EXISTS "resetTokenExpiry" TIMESTAMP
      `.execute(db);

      console.log('Reset token fields added to User table successfully');
    } else {
      console.log('Reset token fields already exist in User table');
    }

    // Close the connection
    await client.end();

    console.log('Database setup completed successfully');
    return { success: true };
  } catch (error) {
    console.error('Database setup failed:', error);
    return { success: false, error };
  }
}

// Run this function if this file is executed directly
if (require.main === module) {
  setupDatabase().then((result) => {
    if (result.success) {
      console.log('Database setup completed');
      process.exit(0);
    } else {
      console.error('Database setup failed', result.error);
      process.exit(1);
    }
  });
}