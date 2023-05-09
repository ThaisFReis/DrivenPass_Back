import { Request, Response } from 'express';
import httpStatus from 'http-status';
import userService from '@/services/users-service';

// Sign up
export async function SignUp(req: Request, res: Response) {
  const { email, password } = req.body;
  
  try {
    const user = await userService.createUser({ email, password });
    
    return res.status(httpStatus.CREATED).json({
      user: {
        id: user.id,
        email: user.email,
      },
    });
  }
  catch (error) {
    if(error.name === 'EmailExist' || error.name === 'InvalidParamsError' || error.name === 'MissingParamsError'){
      return res.status(httpStatus.BAD_REQUEST).json({
        error: {
          name: error.name,
          message: error.message,
        },
      });
    }

    else{
      return res.status(httpStatus.INTERNAL_SERVER_ERROR).json({
        error: {
          name: error.name,
          message: error.message,
        },
      });
    }
  }
}