#!/usr/bin/env node
/**
 * Quick start script for Food Delivery App
 * Installs dependencies, seeds DB, and starts servers
 */

const { spawn } = require('child_process');
const path = require('path');
const fs = require('fs');

const rootDir = __dirname;
const backendDir = path.join(rootDir, 'backend');
const frontendDir = path.join(rootDir, 'frontend');

console.log(`
╔════════════════════════════════════════════════════════════╗
║           🍕 Food Delivery App - Startup Script 🍕          ║
╚════════════════════════════════════════════════════════════╝
`);

async function runCommand(cmd, args, cwd, label) {
  return new Promise((resolve, reject) => {
    console.log(`⏳ ${label}...`);
    const proc = spawn(cmd, args, { cwd, stdio: 'inherit', shell: true });
    proc.on('close', (code) => {
      if (code === 0) {
        console.log(`✅ ${label} complete\n`);
        resolve();
      } else {
        reject(new Error(`${label} failed with code ${code}`));
      }
    });
    proc.on('error', reject);
  });
}

async function main() {
  try {
    // 1. Install backend deps
    console.log('\n📦 STEP 1: Installing backend dependencies...');
    await runCommand('npm', ['install'], backendDir, 'Backend npm install');

    // 2. Install frontend deps
    console.log('\n📦 STEP 2: Installing frontend dependencies...');
    await runCommand('npm', ['install'], frontendDir, 'Frontend npm install');

    // 3. Seed database
    console.log('\n📦 STEP 3: Seeding database...');
    await runCommand('node', ['seed.js'], backendDir, 'Database seeding');

    // 4. Start backend in background
    console.log('\n📦 STEP 4: Starting backend server...');
    const backendProc = spawn('npm', ['run', 'dev'], { cwd: backendDir, stdio: 'inherit', shell: true });
    backendProc.on('error', console.error);

    // Wait a bit for backend to start
    await new Promise(resolve => setTimeout(resolve, 3000));

    // 5. Start frontend
    console.log('\n📦 STEP 5: Starting frontend server...');
    console.log(`✅ Backend is running on http://localhost:5000`);
    console.log(`⏳ Starting frontend on http://localhost:3000...\n`);
    
    const frontendProc = spawn('npm', ['start'], { cwd: frontendDir, stdio: 'inherit', shell: true });
    frontendProc.on('error', console.error);

    // Keep process alive
    process.on('SIGINT', () => {
      console.log('\n🛑 Shutting down...');
      backendProc.kill();
      frontendProc.kill();
      process.exit(0);
    });

  } catch (error) {
    console.error('\n❌ Error:', error.message);
    process.exit(1);
  }
}

main();
