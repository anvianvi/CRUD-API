import { IncomingMessage, ServerResponse } from 'http';
import returnData from '../helpers/return-data';
import isValidUUID from '../helpers/uuid-validator';
import { User } from 'interfaces';

export default async function methodPut(
  url: string,
  req: IncomingMessage,
  res: ServerResponse,
  users: User[],
) {
  const userId = url.split('/').pop();

  if (!userId || !isValidUUID(userId)) {
    return returnData(res, 'Invalid Data', 400);
  }

  let requestBody = '';

  for await (const chunk of req) {
    requestBody += chunk;
  }

  const { username, age, hobbies } = JSON.parse(requestBody);
  const userIndex = users.findIndex((user) => user.id === userId);

  if (userIndex === -1) {
    return returnData(res, 'User not found', 404);
  }

  const updatedUser: User = {
    id: userId,
    username: username || users[userIndex]?.username,
    age: age || users[userIndex]?.age,
    hobbies: hobbies || users[userIndex]?.hobbies,
  };

  users[userIndex] = updatedUser;

  return returnData(res, updatedUser, 200);
}
