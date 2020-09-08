import request from 'supertest';
import mongoose from 'mongoose';

import { server } from '../../server';
import { HTTP_CODE } from '@familyapp/common';
import '../ShoppingController';
import ShoppingModel, { ItemStatus } from '../../models/shopping';

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
      .send({ name: 'asda' })
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

    expect(shoppingDeleted).toBeUndefined();
  });
});
