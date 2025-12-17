import type { FastifyInstance } from 'fastify';
import type { FastifyReply, FastifyRequest } from 'fastify';

export async function registerHealthRoutes(app: FastifyInstance): Promise<void> {
  app.get('/health', async (_request: FastifyRequest, reply: FastifyReply) => {
    return reply.send({ status: 'ok' });
  });
}
