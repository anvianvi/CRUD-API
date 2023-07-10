import { ServerResponse } from 'node:http';
import User from '../interfaces';

export default function returnData(
  res: ServerResponse,
  message: string | User | User[],
  code: number,
) {
  res.statusCode = code;
  res.setHeader('Content-Type', 'application/json');

  res.end(
    JSON.stringify(
      typeof message === 'string' ? { message: message } : message,
    ),
  );
}
