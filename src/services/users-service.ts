import { db } from '../db';
import { users, sessions } from '../db/schema';
import { eq } from 'drizzle-orm';
import { UnauthorizedError, BadRequestError } from '../utils/errors';

export const registerUser = async (data: any) => {
  const { name, email, password } = data;

  // 1. Check if email already exists
  const existingUser = await db.select().from(users).where(eq(users.email, email)).limit(1);
  
  if (existingUser.length > 0) {
    throw new BadRequestError('Email Sudah Terdaftar');
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

export const loginUser = async (data: any) => {
  const { email, password } = data;

  // 1. Find user by email
  const [user] = await db.select().from(users).where(eq(users.email, email)).limit(1);

  if (!user) {
    throw new UnauthorizedError('Email atau Password Salah');
  }

  // 2. Verify password
  const isPasswordValid = await Bun.password.verify(password, user.password);

  if (!isPasswordValid) {
    throw new UnauthorizedError('Email atau Password Salah');
  }

  // 3. Generate session token
  const token = crypto.randomUUID();

  // 4. Create session
  await db.insert(sessions).values({
    token,
    userId: user.id,
  });

  return token;
};

export const getCurrentUser = async (token: string) => {
  const [result] = await db
    .select({
      id: users.id,
      name: users.name,
      email: users.email,
      createdAt: users.createdAt,
    })
    .from(sessions)
    .innerJoin(users, eq(sessions.userId, users.id))
    .where(eq(sessions.token, token))
    .limit(1);

  if (!result) {
    throw new UnauthorizedError();
  }

  return result;
};

export const logoutUser = async (token: string) => {
  const result = await db.delete(sessions).where(eq(sessions.token, token));
  
  if (result[0].affectedRows === 0) {
    throw new UnauthorizedError();
  }

  return 'OK';
};
