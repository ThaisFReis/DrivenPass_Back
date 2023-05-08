import { Request, Response } from 'express';
import httpStatus from 'http-status';
import userService from '@/services/users-service';
import { createUserSchema } from '@/schemas';

// Sign up
export async function SignUp(req: Request, res: Response) {
  const { email, password } = req.body;

  if(!email || !password) {
    return res.status(httpStatus.BAD_REQUEST).json({
      message: 'Email and password are required',
    });
  }

  // Check if email is valid and password is longer than 6 characters
  const { error } = createUserSchema.validate({ email, password });

  if(error) {
    return res.status(httpStatus.BAD_REQUEST).json({
      message: ' Email has to be a valid email and password has to be longer than 6 characters',
    });
  }
  
    try {
        const user = await userService.createUser({ email, password });
        return res.status(httpStatus.CREATED).json(user);
        }

    catch (error) {
        if(error === 'duplicatedEmailError') {
            return res.status(httpStatus.CONFLICT).json({
                message: 'Email already in use',
            });
        }
        return res.status(httpStatus.INTERNAL_SERVER_ERROR).json({
            message: 'Something went wrong',
        });
    }
}