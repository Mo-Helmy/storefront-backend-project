import supertest from 'supertest';
import jwt, { JwtPayload } from 'jsonwebtoken';
import app from '../../server';
import UserStore from '../../models/user';

const request = supertest(app);

export type UserTestingResponse = {
  id: number;
  username: string;
  firstname: string;
  lastname: string;
  password_digest: string;
};

let user: UserTestingResponse;
let token: string;

describe('test responses from user end point', () => {
  it('create new user', async () => {
    const response = await request.post('/api/users').send({
      username: 'mohelmy',
      firstname: 'mo',
      lastname: 'helmy',
      password: 'mypassword'
    });

    token = response.body;
    const payload = jwt.decode(token) as JwtPayload;
    user = payload.user;

    expect(user.id).toEqual(jasmine.any(Number));
    expect(user.username).toBe('mohelmy');
    expect(user.firstname).toBe('mo');
    expect(user.lastname).toBe('helmy');
    expect(user.password_digest).toEqual(jasmine.any(String));
  });

  it('auth invalid user password', async () => {
    const response = await request.post('/api/users/auth').send({
      username: 'mohelmy',
      password: 'invalid'
    });

    const result = response.body;

    expect(result).toEqual('authentication failed!');
  });

  it('auth valid user', async () => {
    const response = await request.post('/api/users/auth').send({
      username: 'mohelmy',
      password: 'mypassword'
    });

    token = response.body;
    const payload = jwt.decode(token) as JwtPayload;
    const authUser = payload.user;

    expect(authUser.id).toEqual(user.id);
    expect(authUser.username).toBe(user.username);
    expect(authUser.firstname).toBe(user.firstname);
    expect(authUser.lastname).toBe(user.lastname);
    expect(authUser.password_digest).toEqual(user.password_digest);
  });

  it('get all user', async () => {
    const response = await request
      .get('/api/users')
      .set('Authorization', `Bearer ${token}`);

    const allUsers = response.body;

    expect(allUsers.length).toEqual(1);

    expect(allUsers[0].id).toEqual(user.id);
    expect(allUsers[0].username).toBe(user.username);
    expect(allUsers[0].firstname).toBe(user.firstname);
    expect(allUsers[0].lastname).toBe(user.lastname);
    expect(allUsers[0].password_digest).toEqual(user.password_digest);
  });

  it('get user by user id', async () => {
    const response = await request
      .get(`/api/users/${user.id}`)
      .set('Authorization', `Bearer ${token}`);

    const userResult = response.body;

    expect(userResult.id).toEqual(user.id);
    expect(userResult.username).toBe(user.username);
    expect(userResult.firstname).toBe(user.firstname);
    expect(userResult.lastname).toBe(user.lastname);
    expect(userResult.password_digest).toEqual(user.password_digest);
  });

  afterAll(async () => {
    const store = new UserStore();
    await store.deleteAll();
  });
});
