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
      const { method, url } = req;
      if (typeof url !== 'string') {
        return returnData(res, 'Invalid Data', 400);
      }
      try {
        switch (method) {
          case 'GET':
            return methodGet(url, res, users);
          case 'POST':
            return await methodPost(url, req, res, users);
          case 'PUT':
            return await methodPut(url, req, res, users);
          case 'DELETE':
            return methodDelete(url, res, users);
          default:
            return returnData(res, 'Endpoint not found', 404);
        }
      } catch (error) {
        console.error(error);
        return returnData(res, 'Server Error', 500);
      } finally {
        if (worker) {
          worker.send(JSON.stringify(users));
        }
      }
    },
  );

  server.listen(port, () => {
    console.log(`Server is running on port ${port}`);
  });
}
