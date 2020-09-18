import { Publisher, UserCreatedEvent, Subjects } from '@familyapp/common';

export class UserCreatedPublisher extends Publisher<UserCreatedEvent> {
  readonly subject = Subjects.UserCreated;
}
