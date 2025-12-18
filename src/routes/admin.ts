import { Role } from '@prisma/client';
import type { FastifyPluginAsync } from 'fastify';

import { authenticate, requireRole } from '../auth/guards.js';

export const registerAdminRoutes: FastifyPluginAsync = async (app) => {
  app.get(
    '/admin/ping',
    {
      preHandler: [authenticate(app), requireRole([Role.ADMIN])]
    },
    async (_request, reply) => {
      return reply.send({ pong: true });
    }
  );
};
