import type { Role } from '@prisma/client';
import type { FastifyInstance, FastifyReply, FastifyRequest } from 'fastify';

export function authenticate(app: FastifyInstance) {
  return async function authenticatePreHandler(
    request: FastifyRequest,
    reply: FastifyReply
  ): Promise<void> {
    try {
      await request.jwtVerify();
    } catch (err) {
      request.log.warn({ err }, 'jwt verify failed');
      await reply.code(401).send({ error: 'unauthorized' });
      return;
    }

    const tokenUser = request.user;
    const user = await app.prisma.user.findUnique({ where: { id: tokenUser.userId } });
    if (user === null) {
      await reply.code(401).send({ error: 'unauthorized' });
      return;
    }

    request.user = { userId: user.id, role: user.role };
  };
}

export function requireRole(allowed: ReadonlyArray<Role>) {
  return async function requireRolePreHandler(
    request: FastifyRequest,
    reply: FastifyReply
  ): Promise<void> {
    const user = request.user;

    if (user === undefined) {
      request.log.warn('missing request.user in requireRole');
      await reply.code(401).send({ error: 'unauthorized' });
      return;
    }

    if (!allowed.includes(user.role)) {
      await reply.code(403).send({ error: 'forbidden' });
      return;
    }
  };
}
