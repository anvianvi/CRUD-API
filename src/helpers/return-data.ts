import { ServerResponse } from 'node:http';
import User from '../interfaces';

export default function returnData(
  res: ServerResponse,
  message: string | User | User[],
  code: number,
) {
  const data = typeof message === 'string' ? { message } : message;

  res.writeHead(code, {
    'Content-Type': 'application/json',
  });

  res.end(JSON.stringify(data));
}
