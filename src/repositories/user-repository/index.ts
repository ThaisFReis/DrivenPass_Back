import { Prisma } from '@prisma/client';
import { prisma } from '@/config';

// Create a new user
async function createUser(email: string, password: string) {
  return await prisma.user.create({
    data: {
      email,
      password,
    },
  });
}

// Find a user by email
async function findUserByEmail(email: string, select?: Prisma.UserSelect) {
  const user: Prisma.UserFindUniqueArgs = {
    where: {
      email,
    },
  };

  if ( select ) {
    user.select = select;
  }

  return await prisma.user.findUnique(user);

}

// Find a user by id
async function findUserById(id: number) {
  return await prisma.user.findUnique({
    where: {
      id,
    },
  });
}

const UserRepository = {
  createUser,
  findUserByEmail,
  findUserById,
};

export default UserRepository;