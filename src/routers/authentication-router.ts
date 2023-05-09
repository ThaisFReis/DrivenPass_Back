import { Router } from 'express';
import { SignIn, LogOut } from '@/controllers/authentication-controller';
import { authenticate } from '@/middlewares/authentication-middleware';

const authRouter = Router();

authRouter
    .post('/login', SignIn)
    .post('/logout', authenticate, LogOut);

export { authRouter };