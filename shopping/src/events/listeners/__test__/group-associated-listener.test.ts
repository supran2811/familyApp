import { Message } from 'node-nats-streaming';
import mongoose from 'mongoose';
import { GroupAssociated } from '@familyapp/common';

import { GroupAssociatedListener } from '../group-associated-listener';
import { natsWrapper } from '../../../nats-wrapper';
import User from '../../../models/user';

const setUp = async () => {
  const listener = new GroupAssociatedListener(natsWrapper.client);
  const userid = mongoose.Types.ObjectId().toHexString();
  const user = User.build({
    id: userid,
  });

  await user.save();

  const data: GroupAssociated['data'] = {
    userid,
    groupid: mongoose.Types.ObjectId().toHexString(),
    version: 1,
  };

  //@ts-ignore
  const msg: Message = {
    ack: jest.fn(),
  };

  return { listener, user, data, msg };
};

it('associate groupid with userid and sends an ack', async () => {
  const { listener, user, data, msg } = await setUp();

  await listener.onMessage(data, msg);

  const updatedUser = await User.findById(user.id);

  expect(updatedUser!.groupId).toEqual(data.groupid);
  expect(msg.ack).toHaveBeenCalled();
});

it('throws error when data is out of order', async () => {
  const { listener, user, data, msg } = await setUp();

  data.version = 4;

  listener.onMessage(data, msg);

  expect(user.groupId).not.toEqual(data.groupid);

  expect(msg.ack).not.toHaveBeenCalled();
});
