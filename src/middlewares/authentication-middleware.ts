import { NextFunction, Request, Response } from 'express';
import httpStatus from 'http-status';
import * as jwt from 'jsonwebtoken';

import { unauthorizedError } from '@/errors';
import { prisma } from '@/config';

// Check if the user is authenticated
export async function authenticate(req: AuthenticatedRequest, res: Response, next: NextFunction) {
  
  // Get the token from the header
  const authHeader = req.header('Authorization');
  if (!authHeader) res.status(httpStatus.UNAUTHORIZED).send(unauthorizedError());

  const token = authHeader.split(' ')[1];
  if (!token) return res.status(httpStatus.UNAUTHORIZED).send(unauthorizedError());

  // Verify the token
  try {
    const { userId } = jwt.verify(token, process.env.JWT_SECRET) as JWTPayload;

    const session = await prisma.session.findFirst({
      where: {
        token,
      },
    });

    if (!session) res.status(httpStatus.UNAUTHORIZED).send(unauthorizedError());

    
    // If the token is valid, set the userId in the request object
    req.userId = userId;

    return next();
  } catch (err) {
    res.status(httpStatus.UNAUTHORIZED).send(unauthorizedError());
  }
}

export type AuthenticatedRequest = Request & JWTPayload;

type JWTPayload = {
  userId: number;
};
