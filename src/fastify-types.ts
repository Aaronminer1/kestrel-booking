import type { PrismaClient, Role } from '@prisma/client';

declare module 'fastify' {
  interface FastifyInstance {
    prisma: PrismaClient;
  }
}

declare module '@fastify/jwt' {
  interface FastifyJWT {
    payload: { userId: number; role: Role };
    user: { userId: number; role: Role };
  }
}
