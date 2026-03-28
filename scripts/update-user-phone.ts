import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function updateUserPhone() {
  try {
    const email = 'brotestuser@gmail.com';
    const newPhone = '+94759073302';

    // Check if user exists
    const existingUser = await prisma.user.findUnique({
      where: { email },
    });

    if (!existingUser) {
      console.log('❌ User not found');
      console.log('Email:', email);
      return;
    }

    // Update phone number
    const updatedUser = await prisma.user.update({
      where: { email },
      data: {
        phone: newPhone,
      },
      select: {
        user_id: true,
        first_name: true,
        last_name: true,
        email: true,
        phone: true,
      },
    });

    console.log('✅ Phone number updated successfully!');
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    console.log('User ID:', updatedUser.user_id);
    console.log('Name:', `${updatedUser.first_name} ${updatedUser.last_name}`);
    console.log('Email:', updatedUser.email);
    console.log('Phone:', updatedUser.phone);
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
  } catch (error) {
    console.error('Error updating phone:', error);
  } finally {
    await prisma.$disconnect();
  }
}

updateUserPhone();
