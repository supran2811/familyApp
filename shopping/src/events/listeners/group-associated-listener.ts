import { Listener, GroupAssociated, Subjects } from '@familyapp/common';
import { Message } from 'node-nats-streaming';
import { queueGroupName } from './queueGroupName';
import User from '../../models/user';

export class GroupAssociatedListener extends Listener<GroupAssociated> {
  readonly subject = Subjects.GroupAssociated;
  readonly queueGroupName = queueGroupName;

  async onMessage(data: GroupAssociated['data'], msg: Message) {
    const user = await User.findByEvent({
      id: data.userid,
      version: data.version,
    });

    if (!user) {
      throw new Error('User not found!');
    }

    user.set({ groupId: data.groupid });
    await user.save();

    msg.ack();
  }
}
