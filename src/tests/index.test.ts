import http from 'http';
import { ServerResponse } from 'http';
import User from '../interfaces';
import { v4 as uuidv4 } from 'uuid';
import methodGet from '../methods/get';
import methodPost from '../methods/post';
import methodPut from '../methods/put';
import methodDelete from '../methods/delete';

const getOptions = (method: string, id?: string): http.RequestOptions => {
  return {
    hostname: 'localhost',
    port: 4000,
    path: `/api/users${id ? `/${id}` : ''}`,
    method: method,
  };
};

const defaultUser = {
  username: 'Pavel',
  age: 31,
  hobbies: ['test1', 'test2'],
};

describe('API Tests', () => {
  let server: http.Server;
  let users: User[];

  beforeEach(() => {
    users = [];
  });

  beforeAll(() => {
    server = http.createServer(
      async (req: http.IncomingMessage, res: ServerResponse) => {
        const { method, url } = req;
        if (typeof url !== 'string') return;
        switch (method) {
          case 'GET':
            methodGet(url, res, users);
            break;
          case 'POST':
            await methodPost(url, req, res, users);
            break;
          case 'PUT':
            await methodPut(url, req, res, users);
            break;
          case 'DELETE':
            methodDelete(url, res, users);
            break;
          default:
            res.statusCode = 404;
            res.end();
        }
      },
    );
    server.listen(4000);
  });

  afterAll(() => {
    server.close();
  });

  test('Get all records with a GET api/users request (an empty array is expected)', (done) => {
    const options = getOptions('GET');
    const req = http.request(options, (res: http.IncomingMessage) => {
      expect(res.statusCode).toBe(200);
      let responseBody = '';
      res.on('data', (chunk) => {
        responseBody += chunk;
      });
      res.on('end', () => {
        const data = JSON.parse(responseBody);
        expect(data).toEqual([]);
        done();
      });
    });
    req.end();
  });

  test('A new object is created by a POST api/users request', (done) => {
    const user = { ...defaultUser };
    const options = {
      ...getOptions('POST'),
      headers: {
        'Content-Type': 'application/json',
      },
    };
    const req = http.request(options, (res: http.IncomingMessage) => {
      expect(res.statusCode).toBe(201);
      let responseBody = '';
      res.on('data', (chunk) => {
        responseBody += chunk;
      });
      res.on('end', () => {
        const data = JSON.parse(responseBody);
        expect(data).toEqual(expect.objectContaining(user));
        done();
      });
    });
    req.write(JSON.stringify(user));
    req.end();
  });

  test('With a GET api/user/{userId} request', (done) => {
    const user = {
      id: uuidv4(),
      ...defaultUser,
    };
    users.push(user);
    const options = getOptions('GET', user.id);
    const req = http.request(options, (res: http.IncomingMessage) => {
      expect(res.statusCode).toBe(200);
      let responseBody = '';
      res.on('data', (chunk) => {
        responseBody += chunk;
      });
      res.on('end', () => {
        const data = JSON.parse(responseBody);
        expect(data).toEqual(expect.objectContaining(user));
        done();
      });
    });
    req.end();
  });

  test('Update the created record with a PUT api/users/{userId}request', (done) => {
    const user = {
      id: uuidv4(),
      ...defaultUser,
    };
    users.push(user);
    const updatedUser = {
      username: 'New Name',
      age: 30,
      hobbies: ['test3', 'test4'],
    };
    const options = {
      ...getOptions('PUT', user.id),
      headers: {
        'Content-Type': 'application/json',
      },
    };
    const req = http.request(options, (res: http.IncomingMessage) => {
      expect(res.statusCode).toBe(200);
      let responseBody = '';
      res.on('data', (chunk) => {
        responseBody += chunk;
      });
      res.on('end', () => {
        const data = JSON.parse(responseBody);
        expect(data).toEqual(expect.objectContaining(updatedUser));
        done();
      });
    });
    req.write(JSON.stringify(updatedUser));
    req.end();
  });

  test('DELETE api/users/{userId} request', (done) => {
    const user = {
      id: uuidv4(),
      ...defaultUser,
    };
    users.push(user);
    const options = getOptions('DELETE', user.id);
    const req = http.request(options, (res: http.IncomingMessage) => {
      expect(res.statusCode).toBe(204);
      expect(users.length).toBe(0);
      done();
    });
    req.end();
  });

  test('GET api/users/{userId} request, we are trying to get a deleted object by id', (done) => {
    const user = {
      id: uuidv4(),
      ...defaultUser,
    };
    users.push(user);
    const options = getOptions('DELETE', user.id);
    const deleteReq = http.request(options, (res: http.IncomingMessage) => {
      expect(res.statusCode).toBe(204);
      const optionsForGet: http.RequestOptions = getOptions('GET', user.id);
      const getReq = http.request(
        optionsForGet,
        (res: http.IncomingMessage) => {
          expect(res.statusCode).toBe(404);
          done();
        },
      );
      getReq.end();
    });
    deleteReq.end();
  });
});
