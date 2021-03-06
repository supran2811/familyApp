import request from 'supertest';
import mongoose from 'mongoose';

import { server } from '../../server';
import { HTTP_CODE } from '@familyapp/common';
import '../ShoppingController';
import ShoppingModel, { ItemStatus } from '../../models/shopping';
import User from '../../models/user';

describe('create new shopping list', () => {
  it('can only be access if user is signedin', async () => {
    await request(server)
      .post('/api/shopping')
      .send({})
      .expect(HTTP_CODE.HTTP_UNAUTHORISED);
  });
  it('return an error if invalid name', async () => {
    await request(server)
      .post('/api/shopping')
      .set('Cookie', global.signin())
      .send({})
      .expect(HTTP_CODE.HTTP_BAD_REQUEST);
  });
  it('returns creates a new list for valid name and returns a 201', async () => {
    await request(server)
      .post('/api/shopping')
      .set('Cookie', global.signin())
      .send({ name: 'sample' })
      .expect(HTTP_CODE.HTTP_CREATED);
  });
});

describe('update existing shopping list', () => {
  it('returns a 404 if shopping id does not exist', async () => {
    const id = new mongoose.Types.ObjectId().toHexString();
    await request(server)
      .put(`/api/shopping/${id}`)
      .set('Cookie', global.signin())
      .send({ name: 'asdafjh' })
      .expect(HTTP_CODE.HTTP_NOT_FOUND);
  });
  it('returns a unauthenticated error if accessed without authenticator', async () => {
    const id = new mongoose.Types.ObjectId().toHexString();
    await request(server)
      .put(`/api/shopping/${id}`)
      .send({ name: 'asda' })
      .expect(HTTP_CODE.HTTP_UNAUTHORISED);
  });
  it('sucessfully update the shopping list', async () => {
    const cookie = global.signin();
    const response = await request(server)
      .post('/api/shopping')
      .set('Cookie', cookie)
      .send({ name: 'sample' })
      .expect(HTTP_CODE.HTTP_CREATED);
    const updatedRes = await request(server)
      .put(`/api/shopping/${response.body.id}`)
      .set('Cookie', cookie)
      .send({
        name: 'updated sample',
        items: [{ name: 'wheat', qty: '1kg', status: ItemStatus.PENDING }],
      })
      .expect(HTTP_CODE.HTTP_OK);
    expect(updatedRes.body.name).toEqual('updated sample');
    expect(updatedRes.body.items[0].name).toEqual('wheat');
  });
});

describe('delete operation', () => {
  it('deletes many record sucessfully', async () => {
    const cookie = global.signin();
    const res1 = await request(server)
      .post('/api/shopping')
      .set('Cookie', cookie)
      .send({ name: 'sample1' })
      .expect(HTTP_CODE.HTTP_CREATED);
    const res2 = await request(server)
      .post('/api/shopping')
      .set('Cookie', cookie)
      .send({ name: 'sample2' })
      .expect(HTTP_CODE.HTTP_CREATED);

    await request(server)
      .delete('/api/shopping')
      .set('Cookie', cookie)
      .send({ ids: [res1.body.id, res2.body.id] })
      .expect(200);

    const shoppingDeleted = await ShoppingModel.findById(res1.body.id);

    expect(shoppingDeleted).toBeNull();
  });
});

describe('get one shopping list by id', () => {
  it('returns a 404 whene invalid id is passed', async () => {
    const id = new mongoose.Types.ObjectId().toHexString();
    await request(server)
      .get(`/api/shopping/${id}`)
      .set('Cookie', global.signin())
      .expect(HTTP_CODE.HTTP_NOT_FOUND);
  });
  it('returns a authorisation error when shopping list is not created by the user', async () => {
    const res = await request(server)
      .post('/api/shopping')
      .set('Cookie', global.signin())
      .send({ name: 'sample1' })
      .expect(HTTP_CODE.HTTP_CREATED);

    await request(server)
      .get(`/api/shopping/${res.body.id}`)
      .set('Cookie', global.signin())
      .expect(HTTP_CODE.HTTP_UNAUTHORISED);
  });
  it('returns a valid shopping list when id is passed', async () => {
    const cookie = global.signin();
    const res = await request(server)
      .post('/api/shopping')
      .set('Cookie', cookie)
      .send({ name: 'sample1' })
      .expect(HTTP_CODE.HTTP_CREATED);

    await request(server)
      .get(`/api/shopping/${res.body.id}`)
      .set('Cookie', cookie)
      .expect(HTTP_CODE.HTTP_OK);
  });
});

describe('get all shopping list by user', () => {
  it('returns a shopping list for that user ', async () => {
    const user = {
      id: mongoose.Types.ObjectId().toHexString(),
      name: 'fsdsf',
      email: 'sfds@dsfds.com',
    };

    const userLocalDb = User.build({
      id: user.id,
    });

    await userLocalDb.save();

    const cookie = global.signin(user);
    const res1 = await request(server)
      .post('/api/shopping')
      .set('Cookie', cookie)
      .send({ name: 'sample1' })
      .expect(HTTP_CODE.HTTP_CREATED);
    const res2 = await request(server)
      .post('/api/shopping')
      .set('Cookie', cookie)
      .send({ name: 'sample2' })
      .expect(HTTP_CODE.HTTP_CREATED);

    const response = await request(server)
      .get('/api/shopping')
      .set('Cookie', cookie)
      .expect(HTTP_CODE.HTTP_OK);
    expect(response.body.length).toEqual(2);
    expect(response.body[0].id).toEqual(res1.body.id);
    expect(response.body[0].name).toEqual(res1.body.name);

    expect(response.body[1].id).toEqual(res2.body.id);
    expect(response.body[1].name).toEqual(res2.body.name);
  });

  it('returns all shopping list for user and also groups which user belongs to', async () => {
    const user1 = {
      id: mongoose.Types.ObjectId().toHexString(),
      name: 'fsdsf',
      email: 'sfds@dsfds.com',
    };

    const userLocalDb1 = User.build({
      id: user1.id,
      groupId: '123',
    });

    await userLocalDb1.save();

    const user2 = {
      id: mongoose.Types.ObjectId().toHexString(),
      name: 'sdfd',
      email: 'sdfdsf@dgfdg.com',
    };

    const userLocalDb2 = User.build({
      id: user2.id,
      groupId: '123',
    });

    await userLocalDb2.save();

    const user3 = {
      id: mongoose.Types.ObjectId().toHexString(),
      name: 'dsfdf',
      email: 'fgfdg@dgfdhgfhgg.com',
    };

    const userLocalDb3 = User.build({
      id: user3.id,
      groupId: '345',
    });

    await userLocalDb2.save();

    const cookie = global.signin(user1);
    const resUser11 = await request(server)
      .post('/api/shopping')
      .set('Cookie', cookie)
      .send({ name: 'sample1' })
      .expect(HTTP_CODE.HTTP_CREATED);
    const resUser12 = await request(server)
      .post('/api/shopping')
      .set('Cookie', cookie)
      .send({ name: 'sample2' })
      .expect(HTTP_CODE.HTTP_CREATED);

    const cookie1 = global.signin(user2);
    const resUser21 = await request(server)
      .post('/api/shopping')
      .set('Cookie', cookie1)
      .send({ name: 'sample1' })
      .expect(HTTP_CODE.HTTP_CREATED);
    const resUser22 = await request(server)
      .post('/api/shopping')
      .set('Cookie', cookie1)
      .send({ name: 'sample2' })
      .expect(HTTP_CODE.HTTP_CREATED);

    const cookie2 = global.signin(user3);
    const resUser31 = await request(server)
      .post('/api/shopping')
      .set('Cookie', cookie2)
      .send({ name: 'sample1' })
      .expect(HTTP_CODE.HTTP_CREATED);
    const resUser32 = await request(server)
      .post('/api/shopping')
      .set('Cookie', cookie2)
      .send({ name: 'sample2' })
      .expect(HTTP_CODE.HTTP_CREATED);

    const response = await request(server)
      .get('/api/shopping')
      .set('Cookie', cookie)
      .expect(HTTP_CODE.HTTP_OK);

    expect(response.body.length).toEqual(4);
  });
});
