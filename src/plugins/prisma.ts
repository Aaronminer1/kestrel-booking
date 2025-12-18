import { PrismaClient } from '@prisma/client';
import fastifyPlugin from 'fastify-plugin';
import type { FastifyPluginAsync } from 'fastify';

const prismaPluginImpl: FastifyPluginAsync = async (app) => {
  const prisma = new PrismaClient();

  app.decorate('prisma', prisma);

  app.addHook('onClose', async () => {
    await prisma.$disconnect();
  });
};

export const prismaPlugin = fastifyPlugin(prismaPluginImpl, {
  name: 'prisma'
});
