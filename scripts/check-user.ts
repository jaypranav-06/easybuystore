import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function checkUser() {
  try {
    const email = 'brotestuser@gmail.com';

    const user = await prisma.user.findUnique({
      where: { email },
      select: {
        user_id: true,
        first_name: true,
        last_name: true,
        email: true,
        phone: true,
        address: true,
        city: true,
        state: true,
        zip_code: true,
        country: true,
        created_at: true,
        updated_at: true,
      },
    });

    if (!user) {
      console.log('❌ User NOT found in database');
      console.log(`Email: ${email}`);
      console.log('\nRun this to create the user:');
      console.log('npx tsx scripts/create-custom-test-user.ts');
      return;
    }

    console.log('✅ User FOUND in database!');
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    console.log('📧 Email:', user.email);
    console.log('🔑 Password: easybuystore123');
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    console.log('\n📋 User Details:');
    console.log('User ID:', user.user_id);
    console.log('Name:', `${user.first_name} ${user.last_name}`);
    console.log('Phone:', user.phone || 'Not set');
    console.log('Address:', user.address || 'Not set');
    console.log('City:', user.city || 'Not set');
    console.log('State:', user.state || 'Not set');
    console.log('Zip:', user.zip_code || 'Not set');
    console.log('Country:', user.country || 'Not set');
    console.log('Created:', user.created_at.toLocaleString());
    console.log('Updated:', user.updated_at.toLocaleString());
    console.log('\n🚀 Ready to login at:');
    console.log('- Localhost: http://localhost:3000/signin');
    console.log('- Vercel: https://buystore-rbhw.vercel.app/signin');
  } catch (error) {
    console.error('Error checking user:', error);
  } finally {
    await prisma.$disconnect();
  }
}

checkUser();
