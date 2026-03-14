import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  console.log(' Creating admin account...');

  const adminEmail = 'admin@easybuystore.com';
  const adminPassword = 'Admin@123'; // You should change this after first login
  const adminName = 'Admin User';

  // Check if admin already exists
  const existingAdmin = await prisma.user.findUnique({
    where: { email: adminEmail },
  });

  if (existingAdmin) {
    console.log('  Admin account already exists!');
    console.log(' Email:', adminEmail);
    console.log(' Name:', existingAdmin.name);
    console.log(' Role:', existingAdmin.role);
    return;
  }

  // Hash the password
  const hashedPassword = await bcrypt.hash(adminPassword, 10);

  // Create admin user
  const admin = await prisma.user.create({
    data: {
      name: adminName,
      email: adminEmail,
      password: hashedPassword,
      role: 'admin',
      phone: '+1-555-ADMIN',
      address: '123 Admin Street, Admin City, AC 12345',
    },
  });

  console.log('\n Admin account created successfully!');
  console.log('\n Admin Credentials:');
  console.log('');
  console.log(' Email:    ', adminEmail);
  console.log(' Password: ', adminPassword);
  console.log(' Name:     ', adminName);
  console.log(' Role:     ', admin.role);
  console.log('');
  console.log('\n  IMPORTANT: Please change the password after first login!');
  console.log('\n Login at: http://localhost:3000/signin');
}

main()
  .catch((e) => {
    console.error(' Error creating admin account:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
