import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  const email = 'admin@easybuy';
  const password = 'admin123';

  console.log('Testing admin password...');
  console.log('Email:', email);
  console.log('Password:', password);

  const admin = await prisma.adminUser.findUnique({
    where: { email },
  });

  if (!admin) {
    console.log(' Admin not found!');
    return;
  }

  console.log('\n Admin found in database:');
  console.log('- ID:', admin.admin_id);
  console.log('- Username:', admin.username);
  console.log('- Email:', admin.email);
  console.log('- Role:', admin.role);
  console.log('- Password hash:', admin.password_hash.substring(0, 30) + '...');

  const isMatch = await bcrypt.compare(password, admin.password_hash);

  console.log('\n Password verification:');
  console.log('- Match:', isMatch ? ' YES' : ' NO');

  if (isMatch) {
    console.log('\n Password is correct! Login should work.');
  } else {
    console.log('\n Password does not match! There is a problem with the password hash.');
  }
}

main()
  .catch((e) => {
    console.error('Error:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
