import { db } from '../db';
import { users } from '../db/schema';
import { eq } from 'drizzle-orm';

export const registerUser = async (data: any) => {
  const { name, email, password } = data;

  // 1. Check if email already exists
  const existingUser = await db.select().from(users).where(eq(users.email, email)).limit(1);
  
  if (existingUser.length > 0) {
    throw new Error('Email Sudah Terdaftar');
  }

  // 2. Hash password
  const hashedPassword = await Bun.password.hash(password, {
    algorithm: 'bcrypt',
    cost: 10,
  });

  // 3. Insert new user
  await db.insert(users).values({
    name,
    email,
    password: hashedPassword,
  });

  return 'OK';
};
