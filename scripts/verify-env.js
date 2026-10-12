#!/usr/bin/env node

/**
 * Environment Variables Verification Script
 *
 * This script helps verify that all required environment variables are set correctly.
 * Run with: node scripts/verify-env.js
 */

const requiredVars = [
  'NODE_ENV'
];

const optionalVars = [
  'NEXT_PUBLIC_APP_NAME',
  'NEXT_PUBLIC_APP_URL'
];

console.log('🔍 Verifying Environment Variables...\n');

let allGood = true;

// Check required variables
console.log('📋 Required Variables:');
requiredVars.forEach(varName => {
  const value = process.env[varName];
  if (value) {
    console.log(`  ✅ ${varName}: ${value}`);
  } else {
    console.log(`  ❌ ${varName}: MISSING`);
    allGood = false;
  }
});

// Check optional variables
console.log('\n📋 Optional Variables:');
optionalVars.forEach(varName => {
  const value = process.env[varName];
  if (value) {
    console.log(`  ✅ ${varName}: ${value}`);
  } else {
    console.log(`  ⚠️  ${varName}: Not set (using default)`);
  }
});

// Summary
console.log('\n' + '='.repeat(50));
if (allGood) {
  console.log('🎉 All environment variables are configured correctly!');
  console.log('✅ Your application should work properly.');
} else {
  console.log('⚠️  Some required environment variables are missing.');
  console.log('❌ Please check your configuration and try again.');
}
console.log('='.repeat(50));

console.log('\n💡 Tips:');
console.log('  • For local development: Check your .env.local file');
console.log('  • For Vercel: Check your project settings → Environment Variables');
console.log('  • Run this script again after making changes');
