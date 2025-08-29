import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function testDatabaseConnection(): Promise<void> {
  console.log('🔄 Testing database connection...');
  
  try {
    // Test the connection
    await prisma.$connect();
    console.log('✅ Database connection successful!');
    
    // Test a simple query
    const result = await prisma.$queryRaw`SELECT 1 as test`;
    console.log('✅ Database query test successful:', result);
    
    // Test model access (if tables exist)
    try {
      const userCount = await prisma.user.count();
      console.log(`✅ User table accessible. Current user count: ${userCount}`);
    } catch (modelError) {
      console.log('ℹ️  Tables may not exist yet. Run migrations first.');
    }
    
  } catch (error) {
    console.error('❌ Database connection failed:', error instanceof Error ? error.message : error);
    if (error instanceof Error) {
      console.error('Full error:', error);
    }
  } finally {
    // Always disconnect
    await prisma.$disconnect();
    console.log('🔌 Database disconnected');
  }
}

testDatabaseConnection().catch(console.error);
