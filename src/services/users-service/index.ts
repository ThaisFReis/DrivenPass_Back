import { User } from '@prisma/client';
import bcrypt from 'bcrypt';
import UserRepository from '@/repositories/user-repository';
import { createUserSchema } from '@/schemas';

export async function createUser({ email, password }: CreateUserParams): Promise<User> {

  // Has email and password?
  if(!email || !password) {
    throw {
      name: 'MissingParamsError',
      message: 'Email and password are required',
    };
  }

  // Check if email is valid and password is longer than 6 characters
  const { error } = createUserSchema.validate({ email, password });

  if(error) {
    throw {
      name: 'InvalidParamsError',
      message: 'Email must be valid and password must be longer than 6 characters',
    };
  }

  // Check if email already exists
  const emailAlreadyExists = await UserRepository.findUserByEmail(email);

  if(emailAlreadyExists) {
    throw {
      name: 'EmailExist',
      message: 'Email already exists',
    };
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

export default UserService;