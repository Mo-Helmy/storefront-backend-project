import UserStore from '../../models/user';

const store = new UserStore();
export type UserTesting = {
  id?: number;
  username: string;
  firstname: string;
  lastname: string;
  password: string;
};
let user1: UserTesting;
let user2: UserTesting;
let user1Id: number;
let user2Id: number;

describe('test user store model', () => {
  it('create new user', async () => {
    user1 = await store.create({
      username: 'mohelmy',
      firstName: 'mo',
      lastName: 'helmy',
      password: 'mypassword'
    });
    user2 = await store.create({
      username: 'modiab',
      firstName: 'mo',
      lastName: 'diab',
      password: 'mypassword'
    });

    expect(user1.username).toBe('mohelmy');
    expect(user1.firstname).toBe('mo');
    expect(user1.lastname).toBe('helmy');

    expect(user2.username).toBe('modiab');
    expect(user2.firstname).toBe('mo');
    expect(user2.lastname).toBe('diab');
  });

  it('auth user', async () => {
    // valid inputs
    user1 = await store.authenticate({
      username: 'mohelmy',
      password: 'mypassword'
    });
    // invalid inputs
    user2 = await store.authenticate({
      username: 'modiab',
      password: 'invalid'
    });

    expect(user1.username).toBe('mohelmy');
    expect(user1.firstname).toBe('mo');
    expect(user1.lastname).toBe('helmy');

    expect(user2).toBeNull;
  });

  it('index all users', async () => {
    const result = await store.index();

    user1Id = result[0].id;
    user2Id = result[1].id;

    expect(result.length).toBe(2);

    expect(result[0].username).toBe('mohelmy');
    expect(result[0].firstname).toBe('mo');
    expect(result[0].lastname).toBe('helmy');

    expect(result[1].username).toBe('modiab');
    expect(result[1].firstname).toBe('mo');
    expect(result[1].lastname).toBe('diab');
  });

  it('show user by userId', async () => {
    user1 = await store.show(user1Id as unknown as string);
    user2 = await store.show(user2Id as unknown as string);

    expect(user1.username).toBe('mohelmy');
    expect(user1.firstname).toBe('mo');
    expect(user1.lastname).toBe('helmy');

    expect(user2.username).toBe('modiab');
    expect(user2.firstname).toBe('mo');
    expect(user2.lastname).toBe('diab');
  });

  afterAll(async () => {
    await store.deleteAll();
  });
});
