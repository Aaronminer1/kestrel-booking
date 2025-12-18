import type { FastifyInstance, FastifyPluginAsync } from 'fastify';

import { hashPassword, verifyPassword } from '../security/password.js';

function normalizeEmail(email: string): string {
  return email.trim().toLowerCase();
}

function requireJwtSecret(app: FastifyInstance): void {
  const secret = process.env.JWT_SECRET;
  if (secret === undefined || secret.trim() === '') {
    app.log.error('JWT_SECRET is not set');
    throw new Error('JWT_SECRET is required');
  }
}

export const registerAuthRoutes: FastifyPluginAsync = async (app) => {
  requireJwtSecret(app);

  app.post(
    '/auth/signup',
    {
      schema: {
        body: {
          type: 'object',
          required: ['email', 'password'],
          additionalProperties: false,
          properties: {
            email: { type: 'string', minLength: 3 },
            password: { type: 'string', minLength: 1 }
          }
        }
      }
    },
    async (request, reply) => {
      const body = request.body as { email: string; password: string };
      const email = normalizeEmail(body.email);
      const password = body.password;

      const existing = await app.prisma.user.findUnique({ where: { email } });
      if (existing !== null) {
        return reply.code(409).send({ error: 'email_taken' });
      }

      const passwordHash = await hashPassword(password);

      const user = await app.prisma.user.create({
        data: {
          email,
          passwordHash
        }
      });

      const token = await reply.jwtSign({ userId: user.id, role: user.role });

      return reply.code(201).send({
        token,
        user: { id: user.id, email: user.email, role: user.role }
      });
    }
  );

  app.post(
    '/auth/login',
    {
      schema: {
        body: {
          type: 'object',
          required: ['email', 'password'],
          additionalProperties: false,
          properties: {
            email: { type: 'string', minLength: 3 },
            password: { type: 'string', minLength: 1 }
          }
        }
      }
    },
    async (request, reply) => {
      const body = request.body as { email: string; password: string };
      const email = normalizeEmail(body.email);
      const password = body.password;

      const user = await app.prisma.user.findUnique({ where: { email } });
      if (user === null) {
        return reply.code(401).send({ error: 'invalid_credentials' });
      }

      const ok = await verifyPassword(password, user.passwordHash);
      if (!ok) {
        return reply.code(401).send({ error: 'invalid_credentials' });
      }

      const token = await reply.jwtSign({ userId: user.id, role: user.role });

      return reply.send({
        token,
        user: { id: user.id, email: user.email, role: user.role }
      });
    }
  );

  app.get('/auth/me', async (request, reply) => {
    try {
      await request.jwtVerify();
    } catch (err) {
      request.log.warn({ err }, 'jwt verify failed');
      return reply.code(401).send({ error: 'unauthorized' });
    }

    const payload = request.user;

    const user = await app.prisma.user.findUnique({ where: { id: payload.userId } });
    if (user === null) {
      return reply.code(401).send({ error: 'unauthorized' });
    }

    return reply.send({ user: { id: user.id, email: user.email, role: user.role } });
  });
};
