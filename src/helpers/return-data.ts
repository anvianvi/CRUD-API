import { ServerResponse } from 'node:http';
import { User } from '../interfaces';

export default function returnData(
  response: ServerResponse,
  message: string | User | User[],
  code: number,
) {
  const data = typeof message === 'string' ? { message } : message;

  response.writeHead(code, {
    'Content-Type': 'application/json',
  });

  response.end(JSON.stringify(data));
}
