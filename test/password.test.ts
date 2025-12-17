import { describe, expect, it } from 'vitest';

import { hashPassword, verifyPassword } from '../src/security/password.js';

describe('password hashing', () => {
  it('hashes and verifies a password', async () => {
    const password = 'correct horse battery staple';

    const hash = await hashPassword(password);

    expect(hash).not.toBe(password);
    expect(hash.length).toBeGreaterThan(10);

    await expect(verifyPassword(password, hash)).resolves.toBe(true);
  });

  it('returns false for an incorrect password', async () => {
    const password = 'correct horse battery staple';

    const hash = await hashPassword(password);

    await expect(verifyPassword('wrong password', hash)).resolves.toBe(false);
  });

  it('rejects empty passwords for hashing', async () => {
    await expect(hashPassword('')).rejects.toThrow(/must not be empty/i);
  });
});
