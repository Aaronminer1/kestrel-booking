import { Role } from '@prisma/client';
import { describe, expect, it } from 'vitest';

import { buildApp } from '../src/app.js';
import { hashPassword } from '../src/security/password.js';

describe('admin routes', () => {
  it('enforces auth and role for GET /admin/ping', async () => {
    const app = buildApp();
    await app.ready();

    await app.prisma.user.deleteMany();

    const adminUser = await app.prisma.user.create({
      data: {
        email: 'admin@example.com',
        passwordHash: await hashPassword('pw'),
        role: Role.ADMIN
      }
    });

    const customerUser = await app.prisma.user.create({
      data: {
        email: 'customer@example.com',
        passwordHash: await hashPassword('pw'),
        role: Role.CUSTOMER
      }
    });

    const adminToken = app.jwt.sign({ userId: adminUser.id, role: adminUser.role });
    const customerToken = app.jwt.sign({ userId: customerUser.id, role: customerUser.role });

    const resUnauthed = await app.inject({ method: 'GET', url: '/admin/ping' });
    expect(resUnauthed.statusCode).toBe(401);

    const resForbidden = await app.inject({
      method: 'GET',
      url: '/admin/ping',
      headers: { authorization: `Bearer ${customerToken}` }
    });
    expect(resForbidden.statusCode).toBe(403);

    const resOk = await app.inject({
      method: 'GET',
      url: '/admin/ping',
      headers: { authorization: `Bearer ${adminToken}` }
    });

    expect(resOk.statusCode).toBe(200);
    expect(resOk.json()).toEqual({ pong: true });

    await app.close();
  });
});
