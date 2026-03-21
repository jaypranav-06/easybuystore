import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function createTestUser() {
  try {
    // Check if test user already exists
    const existingUser = await prisma.user.findUnique({
      where: { email: 'testuser@example.com' },
    });

    if (existingUser) {
      console.log('Test user already exists!');
      console.log('Email: testuser@example.com');
      console.log('Password: testuser123');
      return;
    }

    // Create test user
    const password = 'testuser123';
    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await prisma.user.create({
      data: {
        first_name: 'Test',
        last_name: 'User',
        email: 'testuser@example.com',
        password_hash: hashedPassword,
        phone: '+1 234 567 8900',
        address: '123 Test Street',
        city: 'Test City',
        state: 'Test State',
        zip_code: '12345',
        country: 'Test Country',
      },
    });

    console.log('✅ Test user created successfully!');
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    console.log('📧 Email: testuser@example.com');
    console.log('🔑 Password: testuser123');
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    console.log('\nYou can now:');
    console.log('1. Sign in with these credentials');
    console.log('2. Go to Account Settings to test password change');
    console.log('3. Test the "Forgot Password" flow (when implemented)');
    console.log('\nUser ID:', user.user_id);
  } catch (error) {
    console.error('Error creating test user:', error);
  } finally {
    await prisma.$disconnect();
  }
}

createTestUser();
