import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  console.log(' Updating admin password...');

  const adminEmail = 'admin@easybuy.com';
  const newPassword = 'EasyBuy@Admin2026'; // More secure password

  // Find the admin user
  const admin = await prisma.adminUser.findUnique({
    where: { email: adminEmail },
  });

  if (!admin) {
    console.log(' Admin account not found!');
    console.log(' Looking for email:', adminEmail);
    return;
  }

  console.log(' Admin found:', admin.username);

  // Hash the new password
  const hashedPassword = await bcrypt.hash(newPassword, 10);

  // Update the password
  await prisma.adminUser.update({
    where: { email: adminEmail },
    data: { password_hash: hashedPassword },
  });

  console.log('\n Password updated successfully!');
  console.log('\n New Admin Credentials:');
  console.log('');
  console.log(' Email:    ', adminEmail);
  console.log(' Username: ', admin.username);
  console.log(' Password: ', newPassword);
  console.log(' Role:     ', admin.role);
  console.log('');
  console.log('\n Login at: http://localhost:3000/signin');
}

main()
  .catch((e) => {
    console.error(' Error updating password:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
