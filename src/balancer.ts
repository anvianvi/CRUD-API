import cluster, { Worker } from 'cluster';
import { env } from 'process';
import { cpus } from 'os';
import dotenv from 'dotenv';
import serverCreate from './helpers/server-create';
import { User } from 'interfaces';

dotenv.config();
const port = Number(env.PORT || 4000);

if (cluster.isPrimary) {
  const workers: Worker[] = Array.from({ length: cpus().length - 1 }, () =>
    cluster.fork(),
  );

  workers.forEach((worker) => {
    worker.on('message', (message: string) => {
      if (typeof message === 'string') {
        workers.forEach((e) => e.send(message));
      }
    });
  });
} else {
  const currentPort = port + (cluster.worker?.id || 1) - 1;
  const users: User[] = [];
  cluster.worker?.on('message', (message: string) => {
    if (typeof message === 'string') {
      users.length = 0;
      users.push(...JSON.parse(message));
    }
  });

  serverCreate(currentPort, users, cluster.worker);
}
