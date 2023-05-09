import { Router } from 'express';
import { SignUp } from '@/controllers/users-controller';

const usersRouter = Router();

usersRouter.post('/register', SignUp);

export { usersRouter };