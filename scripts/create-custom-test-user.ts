import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function createCustomTestUser() {
  try {
    const email = 'brotestuser@gmail.com';
    const password = 'easybuystore123';

    // Check if user already exists
    const existingUser = await prisma.user.findUnique({
      where: { email },
    });

    if (existingUser) {
      console.log('User already exists!');
      console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
      console.log('📧 Email:', email);
      console.log('🔑 Password: easybuystore123');
      console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
      console.log('User ID:', existingUser.user_id);
      return;
    }

    // Create new user
    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await prisma.user.create({
      data: {
        first_name: 'Bro',
        last_name: 'Test User',
        email: email,
        password_hash: hashedPassword,
        phone: '+1 555 123 4567',
        address: '456 Main Street',
        city: 'New York',
        state: 'NY',
        zip_code: '10001',
        country: 'USA',
      },
    });

    console.log('✅ Custom test user created successfully!');
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    console.log('📧 Email: brotestuser@gmail.com');
    console.log('🔑 Password: easybuystore123');
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    console.log('\nYou can now:');
    console.log('1. Sign in at http://localhost:3000/signin');
    console.log('2. Browse products and add to cart');
    console.log('3. Test checkout process');
    console.log('4. Test profile settings');
    console.log('\nUser ID:', user.user_id);
  } catch (error) {
    console.error('Error creating user:', error);
  } finally {
    await prisma.$disconnect();
  }
}

createCustomTestUser();
