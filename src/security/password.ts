import bcrypt from 'bcryptjs';

const SALT_ROUNDS = 12;

export async function hashPassword(password: string): Promise<string> {
  if (password.trim() === '') {
    throw new Error('Password must not be empty');
  }

  const salt = await bcrypt.genSalt(SALT_ROUNDS);
  return bcrypt.hash(password, salt);
}

export async function verifyPassword(password: string, hash: string): Promise<boolean> {
  if (password.trim() === '') {
    return false;
  }

  if (hash.trim() === '') {
    return false;
  }

  return bcrypt.compare(password, hash);
}
