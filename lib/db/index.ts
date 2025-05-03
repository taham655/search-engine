import { drizzle } from 'drizzle-orm/postgres-js';
import postgres from 'postgres';

// Initialize db connection
// biome-ignore lint: Forbidden non-null assertion
const client = postgres(process.env.POSTGRES_URL!);
export const db = drizzle(client);