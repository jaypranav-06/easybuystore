import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  console.log(' Creating admin user account...');

  const adminEmail = 'admin@easybuy';
  const adminUsername = 'admin';
  const adminPassword = 'admin123'; // Default password (min 6 chars)
  const adminRole = 'super_admin';

  // Check if admin already exists
  const existingAdmin = await prisma.adminUser.findUnique({
    where: { email: adminEmail },
  });

  if (existingAdmin) {
    console.log('  Admin account already exists!');
    console.log(' Email:', existingAdmin.email);
    console.log(' Username:', existingAdmin.username);
    console.log(' Role:', existingAdmin.role);
    return;
  }

  // Hash the password
  const hashedPassword = await bcrypt.hash(adminPassword, 10);

  // Create admin user in admin_users table
  const admin = await prisma.adminUser.create({
    data: {
      username: adminUsername,
      email: adminEmail,
      password_hash: hashedPassword,
      role: adminRole,
    },
  });

  console.log('\n Admin account created successfully!');
  console.log('\n Admin Credentials:');
  console.log('');
  console.log(' Email:    ', adminEmail);
  console.log(' Username: ', adminUsername);
  console.log(' Password: ', adminPassword);
  console.log(' Role:     ', admin.role);
  console.log('');
  console.log('\n  IMPORTANT: Please change the password after first login!');
  console.log('\n Login at: http://localhost:3000/admin/login');
}

main()
  .catch((e) => {
    console.error(' Error creating admin account:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
