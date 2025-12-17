import Fastify, { type FastifyInstance } from 'fastify';

import { registerHealthRoutes } from './routes/health.js';

export function buildApp(): FastifyInstance {
  const app = Fastify({
    logger: true
  });

  void app.register(registerHealthRoutes);

  return app;
}
