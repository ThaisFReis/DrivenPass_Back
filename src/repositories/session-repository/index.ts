import { Prisma } from '@prisma/client';
import { prisma } from '@/config';

// Create a session
async function createSession(data: Prisma.SessionUncheckedCreateInput) {
  return prisma.session.create({
    data,
  });

}

// Find a session by token
async function findSessionByToken(token: string, select?: Prisma.SessionSelect) {
  const session: Prisma.SessionFindUniqueArgs = {
    where: {
      token,
    },
  };

  if ( select ) {
    session.select = select;
  }

  return await prisma.session.findUnique(session);
}

// Delete a session by token
async function deleteSessionByToken(token: string) {
  return await prisma.session.delete({
    where: {
      token,
    },
  });
}

const SessionRepository = {
  createSession,
  findSessionByToken,
  deleteSessionByToken,
};

export default SessionRepository;