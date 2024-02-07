import { ServerResponse } from 'node:http';
import returnData from '../helpers/return-data';
import isValidUUID from '../helpers/uuid-validator';
import { User } from 'interfaces';

export default function methodGet(
  url: string,
  res: ServerResponse,
  users: User[],
) {
  if (url === '/api/users') {
    returnData(res, users, 200);
    return;
  }

  const userId = url.substring(url.lastIndexOf('/') + 1);
  const user = users.find((u) => u.id === userId);

  if (!isValidUUID(userId)) {
    returnData(res, 'Invalid Data', 400);
    return;
  }

  if (!user) {
    returnData(res, 'User not found', 404);
    return;
  }

  returnData(res, user, 200);
}
