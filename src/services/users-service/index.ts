import { User } from '@prisma/client';
import bcrypt from 'bcrypt';
import { duplicatedEmailError } from './errors';
import UserRepository from '@/repositories/user-repository';

export async function createUser({ email, password }: CreateUserParams): Promise<User> {

  // Check if email is already in use
  const existingUser = await UserRepository.findUserByEmail(email);

  if (existingUser) {
    throw duplicatedEmailError;
  }

  // Hash password
  const hashedPassword = await bcrypt.hash(password, 10);

  // Create user
  const user = await UserRepository.createUser(
    email,
    hashedPassword,
  );

  return user;
}

export type CreateUserParams = Pick<User, 'email' | 'password'>;

const UserService = {
  createUser,
};

export * from './errors';
export default UserService;