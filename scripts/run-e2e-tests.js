#!/usr/bin/env node

/**
 * 🧪 E2E Test Runner Script
 * 
 * This script runs comprehensive E2E tests before deployment
 * to ensure all critical user flows work correctly.
 */

const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

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

function logSection(title) {
  console.log('\n' + '='.repeat(60));
  log(`🧪 ${title}`, 'cyan');
  console.log('='.repeat(60));
}

function logStep(step) {
  log(`\n📋 ${step}`, 'yellow');
}

function logSuccess(message) {
  log(`✅ ${message}`, 'green');
}

function logError(message) {
  log(`❌ ${message}`, 'red');
}

function logWarning(message) {
  log(`⚠️  ${message}`, 'yellow');
}

function logInfo(message) {
  log(`ℹ️  ${message}`, 'blue');
}

// Test configuration
const TEST_CONFIG = {
  // Critical user flows (MUST PASS)
  critical: [
    'tests/e2e/auth/login.spec.ts',
    'tests/e2e/shopping/homepage.spec.ts',
    'tests/e2e/shopping/cart.spec.ts',
    'tests/e2e/shopping/checkout.spec.ts'
  ],
  
  // Business critical flows (SHOULD PASS)
  business: [
    'tests/e2e/orders/order-flow.spec.ts'
  ],
  
  // Admin functionality (SHOULD PASS)
  admin: [
    'tests/e2e/admin/dashboard.spec.ts'
  ],
  
  // Error handling (SHOULD PASS)
  error: [
    'tests/e2e/error-handling/error-scenarios.spec.ts'
  ]
};

// Test results tracking
let testResults = {
  passed: 0,
  failed: 0,
  skipped: 0,
  total: 0
};

function updateTestResults(result) {
  testResults.total++;
  if (result === 'passed') testResults.passed++;
  else if (result === 'failed') testResults.failed++;
  else testResults.skipped++;
}

function runTest(testFile, category) {
  logStep(`Running ${category} test: ${path.basename(testFile)}`);
  
  try {
    const command = `npx playwright test ${testFile} --reporter=line`;
    execSync(command, { stdio: 'inherit' });
    logSuccess(`${path.basename(testFile)} passed`);
    updateTestResults('passed');
    return true;
  } catch (error) {
    logError(`${path.basename(testFile)} failed`);
    updateTestResults('failed');
    return false;
  }
}

function checkPrerequisites() {
  logSection('Checking Prerequisites');
  
  // Check if Playwright is installed
  try {
    execSync('npx playwright --version', { stdio: 'pipe' });
    logSuccess('Playwright is installed');
  } catch (error) {
    logError('Playwright is not installed. Run: npx playwright install');
    process.exit(1);
  }
  
  // Check if browsers are installed
  try {
    execSync('npx playwright install --dry-run', { stdio: 'pipe' });
    logSuccess('Browsers are installed');
  } catch (error) {
    logWarning('Some browsers may not be installed. Run: npx playwright install');
  }
  
  // Check if development server is running
  try {
    execSync('curl -s http://localhost:3000 > /dev/null', { stdio: 'pipe' });
    logSuccess('Development server is running on port 3000');
  } catch (error) {
    logError('Development server is not running. Start it with: pnpm dev');
    process.exit(1);
  }
}

function runCriticalTests() {
  logSection('Running Critical User Flow Tests');
  logInfo('These tests MUST pass for deployment');
  
  let allPassed = true;
  
  for (const testFile of TEST_CONFIG.critical) {
    if (fs.existsSync(testFile)) {
      const passed = runTest(testFile, 'Critical');
      if (!passed) allPassed = false;
    } else {
      logWarning(`Test file not found: ${testFile}`);
      updateTestResults('skipped');
    }
  }
  
  if (!allPassed) {
    logError('Critical tests failed. Deployment blocked.');
    process.exit(1);
  }
  
  logSuccess('All critical tests passed!');
}

function runBusinessTests() {
  logSection('Running Business Critical Tests');
  logInfo('These tests should pass for full functionality');
  
  for (const testFile of TEST_CONFIG.business) {
    if (fs.existsSync(testFile)) {
      runTest(testFile, 'Business');
    } else {
      logWarning(`Test file not found: ${testFile}`);
      updateTestResults('skipped');
    }
  }
}

function runAdminTests() {
  logSection('Running Admin Dashboard Tests');
  logInfo('Testing admin functionality');
  
  for (const testFile of TEST_CONFIG.admin) {
    if (fs.existsSync(testFile)) {
      runTest(testFile, 'Admin');
    } else {
      logWarning(`Test file not found: ${testFile}`);
      updateTestResults('skipped');
    }
  }
}

function runErrorHandlingTests() {
  logSection('Running Error Handling Tests');
  logInfo('Testing error scenarios and edge cases');
  
  for (const testFile of TEST_CONFIG.error) {
    if (fs.existsSync(testFile)) {
      runTest(testFile, 'Error Handling');
    } else {
      logWarning(`Test file not found: ${testFile}`);
      updateTestResults('skipped');
    }
  }
}

function generateTestReport() {
  logSection('Test Results Summary');
  
  const passRate = ((testResults.passed / testResults.total) * 100).toFixed(1);
  
  log(`Total Tests: ${testResults.total}`, 'bright');
  log(`Passed: ${testResults.passed}`, 'green');
  log(`Failed: ${testResults.failed}`, 'red');
  log(`Skipped: ${testResults.skipped}`, 'yellow');
  log(`Pass Rate: ${passRate}%`, passRate >= 80 ? 'green' : 'red');
  
  // Generate report file
  const report = {
    timestamp: new Date().toISOString(),
    summary: {
      total: testResults.total,
      passed: testResults.passed,
      failed: testResults.failed,
      skipped: testResults.skipped,
      passRate: parseFloat(passRate)
    },
    recommendations: []
  };
  
  if (testResults.failed > 0) {
    report.recommendations.push('Fix failed tests before deployment');
  }
  
  if (passRate < 80) {
    report.recommendations.push('Test coverage is below 80%. Consider adding more tests.');
  }
  
  if (testResults.skipped > 0) {
    report.recommendations.push('Some tests were skipped. Review and implement missing test files.');
  }
  
  // Write report to file
  const reportPath = 'test-results/e2e-test-report.json';
  fs.mkdirSync('test-results', { recursive: true });
  fs.writeFileSync(reportPath, JSON.stringify(report, null, 2));
  
  logInfo(`Detailed report saved to: ${reportPath}`);
  
  return testResults.failed === 0;
}

function main() {
  logSection('E2E Test Runner - Pre-Deployment Check');
  logInfo('Starting comprehensive E2E testing...');
  
  try {
    // Check prerequisites
    checkPrerequisites();
    
    // Run tests by priority
    runCriticalTests();
    runBusinessTests();
    runAdminTests();
    runErrorHandlingTests();
    
    // Generate report
    const deploymentReady = generateTestReport();
    
    if (deploymentReady) {
      logSection('Deployment Ready! 🚀');
      logSuccess('All critical tests passed. Your application is ready for deployment.');
    } else {
      logSection('Deployment Blocked! 🛑');
      logError('Some tests failed. Please fix the issues before deploying.');
      process.exit(1);
    }
    
  } catch (error) {
    logError(`Test runner failed: ${error.message}`);
    process.exit(1);
  }
}

// Run the main function
if (require.main === module) {
  main();
}

module.exports = {
  runTest,
  checkPrerequisites,
  generateTestReport
}; 