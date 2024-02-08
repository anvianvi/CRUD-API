import { User } from 'interfaces';
import returnData from '../helpers/return-data';
import isValidUUID from '../helpers/uuid-validator';
import { ServerResponse } from 'node:http';

export default function methodDelete(
  url: string,
  res: ServerResponse,
  users: User[],
) {
  const userId = url.split('/').pop();

  if (!isValidUUID(userId)) {
    return returnData(res, 'Invalid Data', 400);
  }

  const userIndex = users.findIndex((user) => user.id === userId);

  if (userIndex === -1) {
    return returnData(res, 'User not found', 404);
  }

  users = users.filter((user) => user.id !== userId);

  return returnData(res, 'User deleted successfully', 204);
}
