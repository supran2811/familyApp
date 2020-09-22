import mongoose from 'mongoose';
import { UserCreatedEvent } from '@familyapp/common';
import { Message } from 'node-nats-streaming';
import { UserCreatedListener } from '../user-created-listener';
import { natsWrapper } from '../../../nats-wrapper';
import User from '../../../models/user';

const setup = async () => {
  const listener = new UserCreatedListener(natsWrapper.client);
  const data: UserCreatedEvent['data'] = {
    userid: new mongoose.Types.ObjectId().toHexString(),
    name: 'sfdsf',
    email: 'dfdsf@email.com',
  };

  //@ts-ignore
  const msg: Message = {
    ack: jest.fn(),
  };

  return { listener, data, msg };
};

it('creates and save user', async () => {
  const { listener, data, msg } = await setup();

  await listener.onMessage(data, msg);

  const user = await User.findById(data.userid);

  expect(user).toBeDefined();

  expect(msg.ack).toHaveBeenCalled();
});
