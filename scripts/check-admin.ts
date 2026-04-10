import prisma from '../lib/db/prisma';
import bcrypt from 'bcryptjs';

async function checkAndFixAdmin() {
  try {
    console.log('🔍 Checking admin user...\n');

    // Check if admin exists
    const admin = await prisma.adminUser.findUnique({
      where: { email: 'admin@easybuy.com' },
    });

    if (!admin) {
      console.log('❌ Admin user not found!');
      console.log('Creating admin user...\n');

      // Create admin user
      const hashedPassword = await bcrypt.hash('admin123', 10);
      const newAdmin = await prisma.adminUser.create({
        data: {
          email: 'admin@easybuy.com',
          username: 'admin',
          password_hash: hashedPassword,
          role: 'admin',
        },
      });

      console.log('✅ Admin user created successfully!');
      console.log('Admin ID:', newAdmin.admin_id);
      console.log('Email:', newAdmin.email);
      console.log('Username:', newAdmin.username);
      console.log('Role:', newAdmin.role);
    } else {
      console.log('✅ Admin user found!');
      console.log('Admin ID:', admin.admin_id);
      console.log('Email:', admin.email);
      console.log('Username:', admin.username);
      console.log('Role:', admin.role);
      console.log('Created at:', admin.created_at);

      // Verify password
      const passwordMatch = await bcrypt.compare('admin123', admin.password_hash);
      console.log('\n🔐 Password verification:', passwordMatch ? '✅ Correct' : '❌ Incorrect');

      if (!passwordMatch) {
        console.log('\n⚠️  Resetting password to "admin123"...');
        const hashedPassword = await bcrypt.hash('admin123', 10);
        await prisma.adminUser.update({
          where: { email: 'admin@easybuy.com' },
          data: { password_hash: hashedPassword },
        });
        console.log('✅ Password reset successfully!');
      }

      // Ensure role is set to 'admin'
      if (admin.role !== 'admin') {
        console.log('\n⚠️  Role is not "admin", updating...');
        await prisma.adminUser.update({
          where: { email: 'admin@easybuy.com' },
          data: { role: 'admin' },
        });
        console.log('✅ Role updated to "admin"!');
      }
    }

    console.log('\n📋 Admin Credentials:');
    console.log('Email: admin@easybuy.com');
    console.log('Password: admin123');
    console.log('Role: admin');
    console.log('\n✅ Admin setup complete!');
  } catch (error) {
    console.error('❌ Error:', error);
  } finally {
    await prisma.$disconnect();
  }
}

checkAndFixAdmin();
