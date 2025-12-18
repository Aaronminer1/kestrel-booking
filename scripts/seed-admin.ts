import 'dotenv/config';

import { PrismaClient, Role } from '@prisma/client';

const ADMIN_EMAIL = process.env.ADMIN_EMAIL;

async function main(): Promise<void> {
  if (ADMIN_EMAIL === undefined || ADMIN_EMAIL.trim() === '') {
    throw new Error('ADMIN_EMAIL is required');
  }

  const prisma = new PrismaClient();

  try {
    const user = await prisma.user.findUnique({ where: { email: ADMIN_EMAIL } });
    if (user === null) {
      throw new Error(`User not found for ADMIN_EMAIL: ${ADMIN_EMAIL}`);
    }

    const updated = await prisma.user.update({
      where: { id: user.id },
      data: { role: Role.ADMIN }
    });

    process.stdout.write(`Promoted user to ADMIN: ${updated.email}\n`);
  } finally {
    await prisma.$disconnect();
  }
}

await main();
