import { User } from '@prisma/client';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { invalidCredentialsError } from './errors';
import { exclude } from '@/utils/prisma-utils';
import userRepository from '@/repositories/user-repository';
import sessionRepository from '@/repositories/session-repository';

async function SignIn( params: SignInParams) : Promise<SignInResult> {
  const { email, password} = params;

  // Check if user exists
  const user = await userRepository.findUserByEmail(email, { id: true, email: true, password: true });

  if (!user) throw invalidCredentialsError();

  await validatePasswordOrFail(password, user.password);

  const token = await createSession(user.id);

  const result = {
    user : exclude(user, 'password'),
    token,
  };

  return result;
}

// Create a session
async function createSession(userId: number) {
  const token = jwt.sign({ userId }, process.env.JWT_SECRET, {
    expiresIn: '1h',
  });

  // Create a session with the token, user id, created at and expires at 1h
  await sessionRepository.createSession({
    token,
    userId,
    createdAt: new Date(),
    expiresAt: new Date(Date.now() + 3600),
  });

  return token;
}

// Log out
export async function LogOut(userId: number, token: string) {
  if (!token) throw invalidCredentialsError();

  // Search for the session
  const session = await sessionRepository.findSessionByToken(token, { id: true, userId: true });

  // If the session does not exist, throw an error
  if (!session) throw invalidCredentialsError();

  // If the session exists, check if the user id matches
  if (session.userId !== userId) throw invalidCredentialsError();

  // Delete the session
  return await sessionRepository.deleteSessionByToken(token);
}

// Delete a session
async function deleteSession(userId: number, token: string) {
  
  // Search for the session
  const session = await sessionRepository.findSessionByToken(token, { id: true, userId: true });

  // If the session does not exist, throw an error
  if (!session) throw invalidCredentialsError();

  // If the session exists, check if the user id matches
  if (session.userId !== userId) throw invalidCredentialsError();

  // Check if the time has expired
  const now = new Date();

  // If the date now is greater than the expiration date, delete the session
  if (now.getTime() > session.expiresAt.getTime()) {
    await sessionRepository.deleteSessionByToken(token);
    throw invalidCredentialsError();
  }

  // If the date is less than the expiration date, return the session
  return session;
}

async function validatePasswordOrFail(password: string, userPassword: string) {
  const isPasswordValid = await bcrypt.compare(password, userPassword);
  if (!isPasswordValid) throw invalidCredentialsError();
}

export type SignInParams = Pick<User, 'email' | 'password'>;

type SignInResult = {
  user: Pick<User, 'id' | 'email'>;
  token: string;
};

const authenticationService = {
  SignIn,
  deleteSession,
  LogOut
};

export default authenticationService;
export * from './errors';
