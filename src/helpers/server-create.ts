import http, { IncomingMessage, ServerResponse } from 'node:http';
import { Worker } from 'node:cluster';
import { User } from '../interfaces';

import methodPut from '../methods/put';
import methodPost from '../methods/post';
import methodDelete from '../methods/delete';
import methodGet from '../methods/get';
import returnData from './return-data';

export default function serverCreate(
  port: number,
  users: User[],
  worker?: Worker,
): void {
  const server = http.createServer(
    async (req: IncomingMessage, res: ServerResponse) => {
      try {
        const { method, url } = req;
        if (typeof url !== 'string') {
          returnData(res, 'Invalid Data', 400);
          return;
        }
        switch (method) {
          case 'GET':
            methodGet(url, res, users);
            break;
          case 'POST':
            await methodPost(url, req, res, users);
            break;
          case 'PUT':
            await methodPut(url, req, res, users);
            break;
          case 'DELETE':
            methodDelete(url, res, users);
            break;
          default:
            returnData(res, 'Endpoint not found', 404);
        }
        if (worker) {
          worker.send(JSON.stringify(users));
        }
      } catch {
        returnData(res, 'Server Error', 500);
      }
    },
  );

  server.listen(port, () => {
    console.log(`Server is running on port ${port}`);
  });
}
