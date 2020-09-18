import request from 'supertest';
import { HTTP_CODE } from '@familyapp/common';
import mongoose from 'mongoose';

import User from '../../models/user';
import Group from '../../models/group';
import NewMember from '../../models/new-member';
import { server } from '../../server';
import '../GroupController';
import { natsWrapper } from '../../nats-wrapper';

describe('new member invitation', () => {
  beforeEach(async () => {
    const user = User.build(global.mockUser);
    await user.save();
  });

  it('can only be accessed if user is signed in', async () => {
    await request(server)
      .post('/api/group/invite')
      .send({})
      .expect(HTTP_CODE.HTTP_UNAUTHORISED);
  });
  it('returns an error if invalid email is sent', async () => {
    await request(server)
      .post('/api/group/invite')
      .set('Cookie', global.signin())
      .send({ email: '' })
      .expect(HTTP_CODE.HTTP_BAD_REQUEST);
  });

  it('does not publishes an event when requesting user is already associated with a group', async () => {
    const user = await User.findById(global.mockUser.id);
    user!.set({ groupId: mongoose.Types.ObjectId().toHexString() });
    await user!.save();
    await request(server)
      .post('/api/group/invite')
      .set('Cookie', global.signin())
      .send({ email: 'newuser@email.com' })
      .expect(HTTP_CODE.HTTP_OK);

    expect(natsWrapper.client.publish).not.toHaveBeenCalled();
  });

  it('updates the model for new member invitaion', async () => {
    await request(server)
      .post('/api/group/invite')
      .set('Cookie', global.signin())
      .send({ email: 'newuser@email.com' })
      .expect(HTTP_CODE.HTTP_OK);

    const user = await User.findById(global.mockUser.id);

    expect(user!.groupId).toBeDefined();

    const group = await Group.findById(user!.groupId);

    const newMember = await NewMember.findOne({ email: 'newuser@email.com' });

    expect(newMember!.senderEmail).toEqual(global.mockUser.email);
    expect(newMember!.senderName).toEqual(global.mockUser.name);
    expect(newMember!.groupId).toEqual(user!.groupId);
    expect(group!.members[0].toString()).toEqual(user!.id);
  });

  it('publishes an event when requesting user is associated with a new group', async () => {
    await request(server)
      .post('/api/group/invite')
      .set('Cookie', global.signin())
      .send({ email: 'newuser@email.com' })
      .expect(HTTP_CODE.HTTP_OK);

    expect(natsWrapper.client.publish).toHaveBeenCalled();
  });
});
