import { spawnSync } from 'node:child_process';
import { rmSync } from 'node:fs';

function run(command: string, args: string[], env: NodeJS.ProcessEnv): void {
  const res = spawnSync(command, args, {
    stdio: 'inherit',
    env,
    shell: process.platform === 'win32'
  });

  if (res.status !== 0) {
    process.exit(res.status ?? 1);
  }
}

const env: NodeJS.ProcessEnv = {
  ...process.env,
  DATABASE_URL: 'file:./test.db',
  JWT_SECRET: process.env.JWT_SECRET ?? 'test-secret'
};

try {
  rmSync('test.db', { force: true });
} catch (err) {
  const code = (err as NodeJS.ErrnoException).code;
  if (code !== 'ENOENT') {
    throw err;
  }
}

run('pnpm', ['db:deploy'], env);
run('pnpm', ['exec', 'vitest', 'run'], env);
