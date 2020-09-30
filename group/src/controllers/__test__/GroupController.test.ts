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
  const mockUser = {
    id: mongoose.Types.ObjectId().toHexString(),
    email: 'test@test.com',
    name: 'testuser',
  };

  beforeEach(async () => {
    const user = User.build(mockUser);
    await user.save();
  });

  it('can only be accessed if user is signed in', async () => {
    await request(server)
      .post('/api/group/invites')
      .send({})
      .expect(HTTP_CODE.HTTP_UNAUTHORISED);
  });
  it('returns an error if invalid email is sent', async () => {
    await request(server)
      .post('/api/group/invites')
      .set('Cookie', global.signin())
      .send({ email: '' })
      .expect(HTTP_CODE.HTTP_BAD_REQUEST);
  });

  it('does not publishes an event when requesting user is already associated with a group', async () => {
    const user = await User.findById(mockUser.id);
    user!.set({ groupId: mongoose.Types.ObjectId().toHexString() });
    await user!.save();
    await request(server)
      .post('/api/group/invites')
      .set('Cookie', global.signin(mockUser))
      .send({ email: 'newuser@email.com' })
      .expect(HTTP_CODE.HTTP_OK);

    expect(natsWrapper.client.publish).not.toHaveBeenCalled();
  });

  it('updates the model for new member invitaion', async () => {
    await request(server)
      .post('/api/group/invites')
      .set('Cookie', global.signin(mockUser))
      .send({ email: 'newuser@email.com' })
      .expect(HTTP_CODE.HTTP_OK);

    const user = await User.findById(mockUser.id);

    expect(user!.groupId).toBeDefined();

    const group = await Group.findById(user!.groupId);

    const newMember = await NewMember.findOne({ email: 'newuser@email.com' });

    expect(newMember!.senderEmail).toEqual(mockUser.email);
    expect(newMember!.senderName).toEqual(mockUser.name);
    expect(newMember!.groupId).toEqual(user!.groupId);
    expect(group!.members[0].toString()).toEqual(user!.id);
  });

  it('publishes an event when requesting user is associated with a new group', async () => {
    await request(server)
      .post('/api/group/invites')
      .set('Cookie', global.signin(mockUser))
      .send({ email: 'newuser@email.com' })
      .expect(HTTP_CODE.HTTP_OK);

    expect(natsWrapper.client.publish).toHaveBeenCalled();
  });

  it('throws bad request error when same user is again inviting same person', async () => {
    await request(server)
      .post('/api/group/invites')
      .set('Cookie', global.signin(mockUser))
      .send({ email: 'newuser@email.com' })
      .expect(HTTP_CODE.HTTP_OK);

    await request(server)
      .post('/api/group/invites')
      .set('Cookie', global.signin(mockUser))
      .send({ email: 'newuser@email.com' })
      .expect(HTTP_CODE.HTTP_BAD_REQUEST);
  });
});

describe('get all invites', () => {
  const mockUser1 = {
    id: mongoose.Types.ObjectId().toHexString(),
    email: 'user1@test.com',
    name: 'testuser1',
  };

  const mockUser2 = {
    id: mongoose.Types.ObjectId().toHexString(),
    email: 'user2@test.com',
    name: 'testuser2',
  };

  beforeEach(async () => {
    const user1 = User.build(mockUser1);
    await user1.save();

    const user2 = User.build(mockUser2);
    await user2.save();
  });

  it('can only be accessed when user is signed in', async () => {
    await request(server)
      .get('/api/group/invites')
      .expect(HTTP_CODE.HTTP_UNAUTHORISED);
  });

  it('can return all the invites', async () => {
    await request(server)
      .post('/api/group/invites')
      .set('Cookie', global.signin(mockUser1))
      .send({ email: mockUser2.email })
      .expect(HTTP_CODE.HTTP_OK);

    const response = await request(server)
      .get('/api/group/invites')
      .set('Cookie', global.signin(mockUser2))
      .expect(HTTP_CODE.HTTP_OK);

    expect(response.body).toHaveLength(1);
    expect(response.body[0].email).toEqual(mockUser2.email);
  });
});

describe('accept invitation', () => {
  const mockUser1 = {
    id: mongoose.Types.ObjectId().toHexString(),
    email: 'user1@test.com',
    name: 'testuser1',
  };

  const mockUser2 = {
    id: mongoose.Types.ObjectId().toHexString(),
    email: 'user2@test.com',
    name: 'testuser2',
  };

  beforeEach(async () => {
    const user1 = User.build(mockUser1);
    await user1.save();

    const user2 = User.build(mockUser2);
    await user2.save();
  });

  it('can only be accessed if user is signed up', async () => {
    await request(server)
      .post('/api/group/invites/adsadsd/accept')
      .send({})
      .expect(HTTP_CODE.HTTP_UNAUTHORISED);
  });

  it('throws 404 when invitiation id is not valid', async () => {
    await request(server)
      .post(
        `/api/group/invites/${mongoose.Types.ObjectId().toHexString()}/accept`
      )
      .set('Cookie', global.signin())
      .send({})
      .expect(HTTP_CODE.HTTP_NOT_FOUND);
  });

  it('updates the group and associated user table', async () => {
    await request(server)
      .post('/api/group/invites')
      .set('Cookie', global.signin(mockUser1))
      .send({ email: mockUser2.email })
      .expect(HTTP_CODE.HTTP_OK);

    const {
      body: [invite],
    } = await request(server)
      .get('/api/group/invites')
      .set('Cookie', global.signin(mockUser2))
      .expect(HTTP_CODE.HTTP_OK);

    await request(server)
      .post(`/api/group/invites/${invite.id}/accept`)
      .set('Cookie', global.signin(mockUser2))
      .send({})
      .expect(HTTP_CODE.HTTP_OK);

    const group = await Group.findById(invite.groupId);

    expect(group!.members).toHaveLength(2);
    expect(group!.members[1].toString()).toEqual(mockUser2.id);

    const user = await User.findById(mockUser2.id);

    expect(user!.groupId.toString()).toEqual(group!.id);

    expect(natsWrapper.client.publish).toHaveBeenCalled();
  });
});

describe('get members', () => {
  const mockUser1 = {
    id: mongoose.Types.ObjectId().toHexString(),
    email: 'user1@test.com',
    name: 'testuser1',
  };

  const mockUser2 = {
    id: mongoose.Types.ObjectId().toHexString(),
    email: 'user2@test.com',
    name: 'testuser2',
  };

  beforeEach(async () => {
    const user1 = User.build(mockUser1);
    await user1.save();

    const user2 = User.build(mockUser2);
    await user2.save();
  });

  it('returns members list based on users group', async () => {
    //// user1 send invites to user2

    await request(server)
      .post('/api/group/invites')
      .set('Cookie', global.signin(mockUser1))
      .send({ email: mockUser2.email })
      .expect(HTTP_CODE.HTTP_OK);

    /// get members for user1 should return only 1 member in his group

    const response = await request(server)
      .get('/api/group/members')
      .set('Cookie', global.signin(mockUser1));
    expect(response.body).toHaveLength(1);
    /// user2 signs in and accept the membership

    const {
      body: [invite],
    } = await request(server)
      .get('/api/group/invites')
      .set('Cookie', global.signin(mockUser2))
      .expect(HTTP_CODE.HTTP_OK);

    await request(server)
      .post(`/api/group/invites/${invite.id}/accept`)
      .set('Cookie', global.signin(mockUser2))
      .send({})
      .expect(HTTP_CODE.HTTP_OK);

    // get members for user1 and 2 should return 2 members
    const responseUser1 = await request(server)
      .get('/api/group/members')
      .set('Cookie', global.signin(mockUser1))
      .expect(HTTP_CODE.HTTP_OK);
    expect(responseUser1.body).toHaveLength(2);

    const responseUser2 = await request(server)
      .get('/api/group/members')
      .set('Cookie', global.signin(mockUser2))
      .expect(HTTP_CODE.HTTP_OK);
    expect(responseUser2.body).toHaveLength(2);
  });
});
