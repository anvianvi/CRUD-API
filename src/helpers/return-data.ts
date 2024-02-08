import { ServerResponse } from 'node:http';
import { User } from '../interfaces';

export default function returnData(
  response: ServerResponse,
  message: string | User | User[],
  code: number,
) {
  response.writeHead(code, { 'Content-Type': 'application/json' });
  response.end(JSON.stringify({ message }));
}
