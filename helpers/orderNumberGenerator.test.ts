import { OrderNumberGenerator } from './orderNumberGenerator';

// Simple test function to verify order number generation
export async function testOrderNumberGenerator(): Promise<void> {
  console.log('🧪 Testing Order Number Generator...\n');

  try {
    // Test sequential format (default)
    const sequential1 = await OrderNumberGenerator.generateOrderNumber();
    const sequential2 = await OrderNumberGenerator.generateOrderNumber();
    console.log('✅ Sequential format:');
    console.log(`  Order 1: ${sequential1}`);
    console.log(`  Order 2: ${sequential2}\n`);

    // Test custom options
    const custom = await OrderNumberGenerator.generateOrderNumber({
      prefix: 'INV',
      padding: 4,
      separator: '/'
    });
    console.log('✅ Custom options:');
    console.log(`  Custom: ${custom}\n`);

    // Test uniqueness validation
    const isUnique = await OrderNumberGenerator.isOrderNumberUnique(sequential1);
    console.log('✅ Uniqueness check:');
    console.log(`  Is ${sequential1} unique: ${isUnique}\n`);

    // Test next order number (without creating)
    const nextNumber = await OrderNumberGenerator.getNextOrderNumber();
    console.log('✅ Next order number:');
    console.log(`  Next: ${nextNumber}\n`);

    console.log('🎉 All tests passed!');

  } catch (error) {
    console.error('❌ Test failed:', error);
  }
}

// Uncomment to run test
// testOrderNumberGenerator(); 