import { beforeEach, describe, expect, it } from 'vitest';

import { Role } from '@prisma/client';

import { buildApp } from '../src/app.js';

describe('services', () => {
  beforeEach(async () => {
    const app = buildApp();
    await app.ready();

    await app.prisma.service.deleteMany();
    await app.prisma.user.deleteMany();

    await app.close();
  });

  it('GET /services returns an empty list when none exist', async () => {
    const app = buildApp();

    const res = await app.inject({ method: 'GET', url: '/services' });

    expect(res.statusCode).toBe(200);

    const body = res.json() as { services: Array<{ id: number; name: string; durationMinutes: number; priceCents: number }> };
    expect(body.services).toEqual([]);

    await app.close();
  });

  it('POST /services requires auth and STAFF/ADMIN role', async () => {
    const app = buildApp();

    const unauth = await app.inject({
      method: 'POST',
      url: '/services',
      payload: { name: 'Consultation', durationMinutes: 30, priceCents: 5000 }
    });

    expect(unauth.statusCode).toBe(401);

    const signup = await app.inject({
      method: 'POST',
      url: '/auth/signup',
      payload: { email: 'customer@example.com', password: 'pw' }
    });

    expect(signup.statusCode).toBe(201);

    const token = (signup.json() as { token: string }).token;

    const forbidden = await app.inject({
      method: 'POST',
      url: '/services',
      headers: { authorization: `Bearer ${token}` },
      payload: { name: 'Consultation', durationMinutes: 30, priceCents: 5000 }
    });

    expect(forbidden.statusCode).toBe(403);

    const user = await app.prisma.user.findUnique({ where: { email: 'customer@example.com' } });
    expect(user).not.toBeNull();
    if (user === null) {
      throw new Error('user should exist after signup');
    }

    await app.prisma.user.update({
      where: { id: user.id },
      data: { role: Role.STAFF }
    });

    const created = await app.inject({
      method: 'POST',
      url: '/services',
      headers: { authorization: `Bearer ${token}` },
      payload: { name: 'Consultation', durationMinutes: 30, priceCents: 5000 }
    });

    expect(created.statusCode).toBe(201);

    const createdBody = created.json() as {
      service: { id: number; name: string; durationMinutes: number; priceCents: number };
    };

    expect(createdBody.service).toEqual({
      id: expect.any(Number),
      name: 'Consultation',
      durationMinutes: 30,
      priceCents: 5000
    });

    const list = await app.inject({ method: 'GET', url: '/services' });
    expect(list.statusCode).toBe(200);

    const listBody = list.json() as {
      services: Array<{ id: number; name: string; durationMinutes: number; priceCents: number }>;
    };

    expect(listBody.services).toEqual([createdBody.service]);

    await app.close();
  });

  it('POST /services is not registered when JWT_SECRET is not set, but GET /services still works', async () => {
    const previous = process.env.JWT_SECRET;
    delete process.env.JWT_SECRET;

    try {
      const app = buildApp();

      const list = await app.inject({ method: 'GET', url: '/services' });
      expect(list.statusCode).toBe(200);

      const create = await app.inject({
        method: 'POST',
        url: '/services',
        payload: { name: 'Consultation', durationMinutes: 30, priceCents: 5000 }
      });
      expect(create.statusCode).toBe(404);

      await app.close();
    } finally {
      if (previous === undefined) {
        delete process.env.JWT_SECRET;
      } else {
        process.env.JWT_SECRET = previous;
      }
    }
  });
});
