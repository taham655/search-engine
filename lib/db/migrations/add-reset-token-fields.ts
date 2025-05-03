import { drizzle } from 'drizzle-orm/postgres-js';
import postgres from 'postgres';
import { sql } from 'drizzle-orm';

export async function addResetTokenFields() {
  if (!process.env.POSTGRES_URL) {
    throw new Error('POSTGRES_URL is not defined');
  }

  const connection = postgres(process.env.POSTGRES_URL, { max: 1 });
  const db = drizzle(connection);

  try {
    // First check if the columns already exist
    const checkQuery = await db.execute(sql`
      SELECT column_name
      FROM information_schema.columns
      WHERE table_name = 'User'
      AND column_name IN ('resetToken', 'resetTokenExpiry')
    `);

    // If we have both columns, don't do anything
    if (checkQuery.length === 2) {
      console.log('Reset token fields already exist, skipping migration');
      return;
    }

    // Add the resetToken column if it doesn't exist
    if (!checkQuery.some(row => row.column_name === 'resetToken')) {
      await db.execute(sql`
        ALTER TABLE "User" ADD COLUMN IF NOT EXISTS "resetToken" VARCHAR(256)
      `);
      console.log('Added resetToken column');
    }

    // Add the resetTokenExpiry column if it doesn't exist
    if (!checkQuery.some(row => row.column_name === 'resetTokenExpiry')) {
      await db.execute(sql`
        ALTER TABLE "User" ADD COLUMN IF NOT EXISTS "resetTokenExpiry" TIMESTAMP
      `);
      console.log('Added resetTokenExpiry column');
    }

    console.log('Reset token migration completed successfully');
  } finally {
    await connection.end();
  }
}