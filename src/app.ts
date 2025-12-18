import Fastify, { type FastifyInstance } from 'fastify';
import fastifyJwt from '@fastify/jwt';

import { prismaPlugin } from './plugins/prisma.js';
import { registerAdminRoutes } from './routes/admin.js';
import { registerAuthRoutes } from './routes/auth.js';
import { registerHealthRoutes } from './routes/health.js';
import { registerPublicServiceRoutes, registerServiceAdminRoutes } from './routes/services.js';

function getJwtSecret(): string | undefined {
  const secret = process.env.JWT_SECRET;
  if (secret === undefined || secret.trim() === '') {
    return undefined;
  }

  return secret;
}

export function buildApp(): FastifyInstance {
  const app = Fastify({
    logger: true
  });

  void app.register(prismaPlugin);
  void app.register(registerHealthRoutes);
  void app.register(registerPublicServiceRoutes);

  const jwtSecret = getJwtSecret();
  if (jwtSecret !== undefined) {
    void app.register(fastifyJwt, { secret: jwtSecret });
    void app.register(registerAuthRoutes);
    void app.register(registerAdminRoutes);
    void app.register(registerServiceAdminRoutes);
  } else {
    app.log.warn('JWT_SECRET is not set; auth routes are disabled');
  }

  return app;
}
