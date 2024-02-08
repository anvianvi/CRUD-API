import { ServerResponse } from 'node:http';
import returnData from '../helpers/return-data';
import isValidUUID from '../helpers/uuid-validator';
import { User } from 'interfaces';

export default function methodGet(
  url: string,
  res: ServerResponse,
  users: User[],
) {
  const userId = url.substring(url.lastIndexOf('/') + 1);

  if (url === '/api/users') {
    returnData(res, users, 200);
  } else if (!isValidUUID(userId)) {
    returnData(res, 'Invalid Data', 400);
  } else {
    const user = users.find((user) => user.id === userId);
    if (!user) {
      returnData(res, 'User not found', 404);
    } else {
      returnData(res, user, 200);
    }
  }
}
