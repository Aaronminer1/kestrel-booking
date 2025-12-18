import { beforeEach, describe, expect, it } from 'vitest';

import { buildApp } from '../src/app.js';

describe('auth', () => {
  beforeEach(async () => {
    const app = buildApp();
    await app.ready();
    await app.prisma.user.deleteMany();
    await app.close();
  });

  it('signup creates a user and returns a token', async () => {
    const app = buildApp();

    const res = await app.inject({
      method: 'POST',
      url: '/auth/signup',
      payload: { email: 'test@example.com', password: 'pw' }
    });

    expect(res.statusCode).toBe(201);

    const body = res.json() as { token: string; user: { id: number; email: string; role: string } };
    expect(body.token).toMatch(/\S+/);
    expect(body.user.email).toBe('test@example.com');

    await app.close();
  });

  it('login returns a token for valid credentials', async () => {
    const app = buildApp();

    await app.inject({
      method: 'POST',
      url: '/auth/signup',
      payload: { email: 'test@example.com', password: 'pw' }
    });

    const res = await app.inject({
      method: 'POST',
      url: '/auth/login',
      payload: { email: 'test@example.com', password: 'pw' }
    });

    expect(res.statusCode).toBe(200);

    const body = res.json() as { token: string };
    expect(body.token).toMatch(/\S+/);

    await app.close();
  });

  it('login rejects invalid password', async () => {
    const app = buildApp();

    await app.inject({
      method: 'POST',
      url: '/auth/signup',
      payload: { email: 'test@example.com', password: 'pw' }
    });

    const res = await app.inject({
      method: 'POST',
      url: '/auth/login',
      payload: { email: 'test@example.com', password: 'wrong' }
    });

    expect(res.statusCode).toBe(401);

    await app.close();
  });

  it('me returns current user for valid token', async () => {
    const app = buildApp();

    const signup = await app.inject({
      method: 'POST',
      url: '/auth/signup',
      payload: { email: 'test@example.com', password: 'pw' }
    });

    const token = (signup.json() as { token: string }).token;

    const res = await app.inject({
      method: 'GET',
      url: '/auth/me',
      headers: { authorization: `Bearer ${token}` }
    });

    expect(res.statusCode).toBe(200);

    const body = res.json() as { user: { email: string } };
    expect(body.user.email).toBe('test@example.com');

    await app.close();
  });
});
