import { db } from '@/lib/db';
import bcrypt from 'bcryptjs';
import { config } from 'dotenv';

config();

async function initializeAdmin() {
  const { ADMIN_EMAIL, ADMIN_PASSWORD, ADMIN_USERNAME } = process.env;

  if (!ADMIN_EMAIL || !ADMIN_PASSWORD || !ADMIN_USERNAME) {
    throw new Error('Missing admin credentials in .env file');
  }

  try {
    const existingAdmin = await db.user.findFirst({
      where: { role: 'ADMIN' }
    });

    if (!existingAdmin) {
      const hashedPassword = await bcrypt.hash(ADMIN_PASSWORD, 12);
      
      await db.user.create({
        data: {
          email: ADMIN_EMAIL,
          name: ADMIN_USERNAME,
          password: hashedPassword,
          role: 'ADMIN',
        }
      });
      
      console.log('Admin user created successfully');
    } else {
      console.log('Admin user already exists');
    }
  } catch (error) {
    console.error('Failed to initialize admin:', error);
    process.exit(1);
  }
}

initializeAdmin();