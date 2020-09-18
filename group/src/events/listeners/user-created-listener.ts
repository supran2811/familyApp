import { UserCreatedEvent, Listener, Subjects } from '@familyapp/common';
import { Message } from 'node-nats-streaming';

import { queueGroupName } from './queue-group-name';
import User from '../../models/user';

export class UserCreatedListener extends Listener<UserCreatedEvent> {
  readonly subject = Subjects.UserCreated;
  readonly queueGroupName = queueGroupName;

  async onMessage(data: UserCreatedEvent['data'], msg: Message) {
    const user = User.build({
      id: data.userid,
      name: data.name,
      email: data.email,
    });

    await user.save();

    msg.ack();
  }
}
