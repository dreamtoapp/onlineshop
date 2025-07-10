import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

async function main() {
  // Find orders with empty addressId (should never happen)
  const badOrders = await prisma.order.findMany({
    where: {
      addressId: { equals: '' },
    },
  });

  if (badOrders.length) {
    console.error('❌ Orders with empty addressId:', badOrders);
    process.exit(1);
  } else {
    console.log('✅ All orders have valid addressId. Data integrity check passed.');
  }
  await prisma.$disconnect();
}

main(); 