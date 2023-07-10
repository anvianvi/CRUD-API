import { IncomingMessage, ServerResponse } from 'node:http';
import { v4 as uuidv4 } from 'uuid';
import returnData from '../helpers/return-data';
import User from '../interfaces';

export default async function methodPost(
  url: string,
  req: IncomingMessage,
  res: ServerResponse,
  users: User[],
) {
  if (url !== '/api/users') {
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

  if (!username || !age) {
    returnData(res, 'Missing required fields', 400);
    return;
  }

  const newUser: User = {
    id: uuidv4(),
    username,
    age,
    hobbies: hobbies || [],
  };

  users.push(newUser);

  returnData(res, newUser, 201);
}
