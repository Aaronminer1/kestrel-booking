import { buildApp } from './app.js';

function parsePort(value: string | undefined): number {
  if (value === undefined || value.trim() === '') {
    return 3000;
  }

  const port = Number(value);
  if (!Number.isInteger(port) || port < 1 || port > 65535) {
    throw new Error(`Invalid PORT: ${value}`);
  }

  return port;
}

async function main(): Promise<void> {
  const port = parsePort(process.env.PORT);
  const host = '127.0.0.1';

  const app = buildApp();

  try {
    const address = await app.listen({ port, host });
    app.log.info({ address }, 'server listening');
  } catch (err) {
    app.log.error(err, 'server failed to start');
    await app.close();
    process.exitCode = 1;
  }
}

await main();
