import { User } from '@prisma/client'
import { prisma } from '@/config'
import * as jwt from 'jsonwebtoken'

export async  function cleanDatabase() {
    await prisma.session.deleteMany({});
    await prisma.user.deleteMany({});
}