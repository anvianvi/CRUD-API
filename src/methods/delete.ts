import returnData from '../helpers/return-data';
import isValidUUID from '../helpers/uuid-validater';
import User from 'interfaces';
import { ServerResponse } from 'node:http';

export default function methodDelete(
  url: string,
  res: ServerResponse,
  users: User[],
) {
  const userId = url.split('/').pop();
  const isValid = /\/api\/users\/([^/]+)/.test(url);
  if (!isValid || !isValidUUID(userId)) {
    returnData(res, 'Invalid Data', 400);
    return;
  }

  const userIndex = users.findIndex((u) => u.id === userId);

  if (userIndex === -1) {
    returnData(res, 'User not found', 404);
    return;
  }

  users.splice(userIndex, 1);

  res.statusCode = 204;
  res.end();
}
