import fastify from 'fastify'
import { PrismaClient } from '@prisma/client'

export const app = fastify()

const prisma = new PrismaClient()

prisma.user.create({
  data: {
    email: 'joseiltonjuniortech@gmail.com',
    name: 'Junior Ferreira',
  },
})
