import { IncomingMessage, ServerResponse } from 'node:http';
import User from '../interfaces';
import returnData from '../helpers/return-data';
import isValidUUID from '../helpers/uuid-validater';

export default async function methodPut(
  url: string,
  req: IncomingMessage,
  res: ServerResponse,
  users: User[],
) {
  const userId = url.split('/').pop();
  const isValid = /\/api\/users\/([^/]+)/.test(url);
  if (!userId || !isValid || !isValidUUID(userId)) {
    returnData(res, 'Invalid Data', 400);
    return;
  }

  let requestBody = '';

  await new Promise<void>((resolve) => {
    req.on('data', (chunk) => {
      requestBody += chunk.toString();
    });

    req.on('end', () => {
      resolve();
    });
  });

  const { username, age, hobbies } = JSON.parse(requestBody);
  const userIndex = users.findIndex((u) => u.id === userId);

  if (userIndex === -1) {
    returnData(res, 'User not found', 404);
    return;
  }

  const updatedUser: User = {
    id: userId,
    username: username || users[userIndex]?.username,
    age: age || users[userIndex]?.age,
    hobbies: hobbies || users[userIndex]?.hobbies,
  };

  users[userIndex] = updatedUser;

  returnData(res, updatedUser, 200);
}
