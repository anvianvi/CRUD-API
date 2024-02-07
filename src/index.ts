import dotenv from 'dotenv';
import { env } from 'node:process';
import { User } from './interfaces';
import serverCreate from './helpers/server-create';

dotenv.config();

const port = Number(env.PORT || 4000);
const users: User[] = [];

const defaultUser: User = {
  id: '2d04f2b7-04ea-45a7-90dc-08bd78d49a55',
  username: 'defaultuser',
  age: 20,
  hobbies: ['some', 'test', 'hobbies'],
};
users.push(defaultUser);

serverCreate(port, users);
