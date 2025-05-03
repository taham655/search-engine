#!/usr/bin/env node

import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
import { spawn } from 'child_process';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Path to the database setup script
const setupScript = join(__dirname, '..', 'lib', 'db', 'setup.ts');

console.log('Running database setup script...');
console.log(`Script path: ${setupScript}`);

// Use ts-node to run the TypeScript file
const child = spawn('npx', ['tsx', setupScript], {
  stdio: 'inherit',
  shell: true
});

child.on('close', (code) => {
  if (code === 0) {
    console.log('Database setup completed successfully');
  } else {
    console.error(`Database setup failed with code ${code}`);
    process.exit(code);
  }
});