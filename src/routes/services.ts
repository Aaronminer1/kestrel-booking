import { Role } from '@prisma/client';
import type { FastifyPluginAsync } from 'fastify';

import { authenticate, requireRole } from '../auth/guards.js';

function toServiceResponse(service: {
  id: number;
  name: string;
  durationMinutes: number;
  priceCents: number;
}): { id: number; name: string; durationMinutes: number; priceCents: number } {
  return {
    id: service.id,
    name: service.name,
    durationMinutes: service.durationMinutes,
    priceCents: service.priceCents
  };
}

export const registerPublicServiceRoutes: FastifyPluginAsync = async (app) => {
  app.get('/services', async (_request, reply) => {
    const services = await app.prisma.service.findMany({ orderBy: { id: 'asc' } });

    return reply.send({ services: services.map(toServiceResponse) });
  });
};

export const registerServiceAdminRoutes: FastifyPluginAsync = async (app) => {
  app.post(
    '/services',
    {
      preHandler: [authenticate(app), requireRole([Role.ADMIN, Role.STAFF])],
      schema: {
        body: {
          type: 'object',
          required: ['name', 'durationMinutes', 'priceCents'],
          additionalProperties: false,
          properties: {
            name: { type: 'string', minLength: 1 },
            durationMinutes: { type: 'integer', minimum: 1 },
            priceCents: { type: 'integer', minimum: 0 }
          }
        }
      }
    },
    async (request, reply) => {
      const body = request.body as {
        name: string;
        durationMinutes: number;
        priceCents: number;
      };

      const service = await app.prisma.service.create({
        data: {
          name: body.name,
          durationMinutes: body.durationMinutes,
          priceCents: body.priceCents
        }
      });

      return reply.code(201).send({ service: toServiceResponse(service) });
    }
  );
};
