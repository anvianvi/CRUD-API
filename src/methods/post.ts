import { IncomingMessage, ServerResponse } from 'node:http';
import { v4 as uuidv4 } from 'uuid';
import returnData from '../helpers/return-data';
import { User } from 'interfaces';
import { pipeline } from 'stream/promises';
import { Writable } from 'stream';

export default async function methodPost(
  url: string,
  req: IncomingMessage,
  res: ServerResponse,
  users: User[],
) {
  if (url !== '/api/users') {
    return returnData(res, `Invalid Data`, 400);
  }

  let requestBody = '';

  await pipeline(
    req,
    new Writable({
      write(chunk, _, callback) {
        requestBody += chunk.toString();
        callback();
      },
    }),
  );

  const { username, age, hobbies } = JSON.parse(requestBody);

  if (!username || !age || !hobbies) {
    return returnData(res, `Missing required fields`, 400);
  }

  const newUser: User = {
    id: uuidv4(),
    username,
    age,
    hobbies: hobbies,
  };

  users.push(newUser);

  return returnData(res, newUser, 201);
}
