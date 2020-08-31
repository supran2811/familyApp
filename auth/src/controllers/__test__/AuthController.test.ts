import request from 'supertest';
import { HTTP_CODE } from '@familyapp/common';

import { server } from '../../server';
import '..';
import User from '../../models/user';

describe('signup', () => {
  it('returns a 201 after a sucessfull signup', async () => {
    await request(server)
      .post('/api/users/signup')
      .send({ name: 'asdsa', email: 'dfdsf@test.com', password: '234324' })
      .expect(201);
  });

  it('return 400 with an invalid email or password', async () => {
    await request(server)
      .post('/api/users/signup')
      .send({ name: 'asdsa', email: 'dfdsf', password: '234324' })
      .expect(400);

    await request(server)
      .post('/api/users/signup')
      .send({ name: 'asdsa', email: 'dfdsf@email.com', password: '23' })
      .expect(400);
  });

  it('returns 400 for missing name ,email and password', async () => {
    await request(server)
      .post('/api/users/signup')
      .send({ name: 'asdsa', email: '', password: '' })
      .expect(400);

    await request(server)
      .post('/api/users/signup')
      .send({ name: 'asdsa', email: '', password: '233333' })
      .expect(400);
  });

  it('saves the password in encrypted form', async () => {
    await request(server)
      .post('/api/users/signup')
      .send({ name: 'asdsa', email: 'dfdsf@test.com', password: '234324' })
      .expect(201);
    const user = await User.findOne({ email: 'dfdsf@test.com' });
    expect(user!.password).not.toEqual('234324');
  });

  it('should throw 400 error if user is already signed up', async () => {
    await request(server)
      .post('/api/users/signup')
      .send({ name: 'asdsa', email: 'dfdsf@test.com', password: '234324' })
      .expect(201);

    await request(server)
      .post('/api/users/signup')
      .send({ name: 'asdsa', email: 'dfdsf@test.com', password: '234324' })
      .expect(400);
  });

  it('sets up the cooking after a successfull signup', async () => {
    const response = await request(server)
      .post('/api/users/signup')
      .send({ name: 'asdsa', email: 'dfdsf@test.com', password: '234324' })
      .expect(201);

    expect(response.get('Set-Cookie')).toBeDefined();
  });
});

describe('signin', () => {
  const user = {
    name: 'asdsa',
    email: 'gfg@test.com',
    password: '234324',
  };
  beforeEach(async () => {
    await request(server).post('/api/users/signup').send(user).expect(201);
  });

  it('returns 401 if either email or password is not valid', async () => {
    await request(server)
      .post('/api/users/signin')
      .send({ email: 'gff@test.com', password: '234324' })
      .expect(HTTP_CODE.HTTP_UNAUTHORISED);
    await request(server)
      .post('/api/users/signin')
      .send({ email: 'gfg@test.com', password: '234355' })
      .expect(HTTP_CODE.HTTP_UNAUTHORISED);
  });

  it('returns 400 if email or password is not in correct format or empty', async () => {
    await request(server)
      .post('/api/users/signin')
      .send({ email: '', password: '233333' })
      .expect(400);

    await request(server)
      .post('/api/users/signin')
      .send({ email: 'sadsad', password: '233333' })
      .expect(400);

    await request(server)
      .post('/api/users/signin')
      .send({ email: 'sadsad', password: '' })
      .expect(400);
  });

  it('return 200 status with jwt token if valid email and password is entered', async () => {
    const response = await request(server)
      .post('/api/users/signin')
      .send({ email: user.email, password: user.password })
      .expect(200);
    expect(response.get('Set-Cookie')).toBeDefined();
  });
});

describe('signout', () => {
  it('should clear the cooking after signout', async () => {
    await request(server)
      .post('/api/users/signup')
      .send({ name: 'asdsa', email: 'gfg@test.com', password: '234324' })
      .expect(201);

    const response = await request(server)
      .post('/api/users/signout')
      .send({})
      .expect(200);
    expect(response.get('Set-Cookie')).toEqual([
      'express:sess=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT; httponly',
    ]);
  });
});
