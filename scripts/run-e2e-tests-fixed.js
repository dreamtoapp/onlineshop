#!/usr/bin/env node

const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

console.log('🚀 Starting E2E Tests with Improved Error Handling...\n');

// Configuration
const config = {
  baseUrl: 'http://localhost:3000',
  timeout: 60000,
  retries: 2,
  testPatterns: [
    'tests/e2e/shopping/cart.spec.ts',
    'tests/e2e/shopping/checkout.spec.ts',
    'tests/e2e/shopping/homepage.spec.ts'
  ]
};

// Colors for console output
const colors = {
  reset: '\x1b[0m',
  bright: '\x1b[1m',
  red: '\x1b[31m',
  green: '\x1b[32m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  magenta: '\x1b[35m',
  cyan: '\x1b[36m'
};

function log(message, color = 'reset') {
  console.log(`${colors[color]}${message}${colors.reset}`);
}

// Check if dev server is running
function checkServer() {
  try {
    const response = execSync(`curl -s -o /dev/null -w "%{http_code}" ${config.baseUrl}`, { timeout: 5000 });
    return response.toString().trim() === '200';
  } catch (error) {
    return false;
  }
}

// Wait for server to be ready
function waitForServer(maxAttempts = 30) {
  log('⏳ Checking if development server is running...', 'yellow');
  
  for (let i = 0; i < maxAttempts; i++) {
    if (checkServer()) {
      log('✅ Development server is running!', 'green');
      return true;
    }
    
    log(`⏳ Waiting for server... (${i + 1}/${maxAttempts})`, 'yellow');
    execSync('sleep 2');
  }
  
  log('❌ Development server is not responding', 'red');
  return false;
}

// Run a single test file
function runTest(testFile, retryCount = 0) {
  const testName = path.basename(testFile, '.spec.ts');
  
  log(`\n🧪 Running ${testName}...`, 'cyan');
  
  try {
    const command = `npx playwright test "${testFile}" --timeout=${config.timeout} --reporter=list`;
    const result = execSync(command, { 
      stdio: 'inherit',
      timeout: config.timeout + 10000 
    });
    
    log(`✅ ${testName} passed!`, 'green');
    return { success: true, file: testFile };
    
  } catch (error) {
    log(`❌ ${testName} failed (attempt ${retryCount + 1})`, 'red');
    
    if (retryCount < config.retries) {
      log(`🔄 Retrying ${testName}...`, 'yellow');
      execSync('sleep 5'); // Wait before retry
      return runTest(testFile, retryCount + 1);
    }
    
    return { success: false, file: testFile, error: error.message };
  }
}

// Main execution
async function main() {
  log('🎯 E2E Test Runner - Improved Version', 'bright');
  log('=====================================\n', 'bright');
  
  // Check prerequisites
  log('🔍 Checking prerequisites...', 'blue');
  
  // Check if Playwright is installed
  try {
    execSync('npx playwright --version', { stdio: 'ignore' });
    log('✅ Playwright is installed', 'green');
  } catch (error) {
    log('❌ Playwright is not installed. Run: npx playwright install', 'red');
    process.exit(1);
  }
  
  // Check if test files exist
  for (const testFile of config.testPatterns) {
    if (!fs.existsSync(testFile)) {
      log(`❌ Test file not found: ${testFile}`, 'red');
      process.exit(1);
    }
  }
  log('✅ All test files found', 'green');
  
  // Wait for server
  if (!waitForServer()) {
    log('\n💡 Please start your development server with: pnpm dev', 'yellow');
    log('   Then run this script again.', 'yellow');
    process.exit(1);
  }
  
  // Run tests
  log('\n🚀 Starting test execution...', 'blue');
  
  const results = [];
  let passed = 0;
  let failed = 0;
  
  for (const testFile of config.testPatterns) {
    const result = runTest(testFile);
    results.push(result);
    
    if (result.success) {
      passed++;
    } else {
      failed++;
    }
  }
  
  // Summary
  log('\n📊 Test Results Summary', 'bright');
  log('======================', 'bright');
  
  results.forEach(result => {
    if (result.success) {
      log(`✅ ${path.basename(result.file, '.spec.ts')} - PASSED`, 'green');
    } else {
      log(`❌ ${path.basename(result.file, '.spec.ts')} - FAILED`, 'red');
    }
  });
  
  log(`\n📈 Summary: ${passed} passed, ${failed} failed`, failed > 0 ? 'red' : 'green');
  
  if (failed > 0) {
    log('\n🔧 Troubleshooting Tips:', 'yellow');
    log('1. Check if your dev server is running smoothly', 'yellow');
    log('2. Look for any console errors in the browser', 'yellow');
    log('3. Verify that all Arabic selectors match your UI', 'yellow');
    log('4. Check the test-results folder for detailed reports', 'yellow');
    log('5. Try running individual tests: npx playwright test tests/e2e/shopping/cart.spec.ts', 'yellow');
    
    log('\n📁 Test reports available at:', 'cyan');
    log('   - test-results/ (screenshots and videos)', 'cyan');
    log('   - playwright-report/ (HTML report)', 'cyan');
    
    process.exit(1);
  } else {
    log('\n🎉 All tests passed! Your application is ready for deployment.', 'green');
  }
}

// Handle process termination
process.on('SIGINT', () => {
  log('\n\n⏹️  Test execution interrupted by user', 'yellow');
  process.exit(0);
});

process.on('SIGTERM', () => {
  log('\n\n⏹️  Test execution terminated', 'yellow');
  process.exit(0);
});

// Run the main function
main().catch(error => {
  log(`\n💥 Unexpected error: ${error.message}`, 'red');
  process.exit(1);
}); 