import { Request, Response } from 'express';
import httpStatus from 'http-status';
import authenticationService, { SignInParams } from '@/services/authentication-service';
import { signInSchema } from '@/schemas';

export async function SignIn(req: Request, res: Response) {
  const { email, password } = req.body as SignInParams;

  if(!email || !password) {
    return res.status(httpStatus.BAD_REQUEST).json({
      message: 'Email and password are required',
    });
  }

  // Check if email is valid and password is longer than 6 characters
  const { error } = signInSchema.validate({ email, password });

  if(error) {
    return res.status(httpStatus.BAD_REQUEST).json({
      message: ' Email or password are invalid',
    });
  }

  try {
    const user = await authenticationService.SignIn({ email, password });

    return res.status(httpStatus.OK).json(user);
  } catch (error) {
    if(error === 'invalidCredentialsError') {
      return res.status(httpStatus.UNAUTHORIZED).json({
        message: 'Invalid credentials',
      });
    }
    return res.status(httpStatus.INTERNAL_SERVER_ERROR).json({
      message: 'Something went wrong',
    });
  }
}

// Log out
export async function LogOut(req: Request, res: Response) {
  const { userId, token } = req.body;

  if(!userId || !token) {
    return res.status(httpStatus.BAD_REQUEST).json({
      message: 'User id and token are required',
    });
  }

  try {
    await authenticationService.LogOut(userId, token);

    return res.status(httpStatus.OK).json({
      message: 'Log out successfully',
    });
  } catch (error) {
    if(error === 'invalidCredentialsError') {
      return res.status(httpStatus.UNAUTHORIZED).json({
        message: 'Invalid credentials',
      });
    }
    return res.status(httpStatus.INTERNAL_SERVER_ERROR).json({
      message: 'Something went wrong',
    });
  }
}