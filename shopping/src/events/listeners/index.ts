import { natsWrapper } from '../../nats-wrapper';
import { UserCreatedListener } from './user-created-listener';
import { GroupAssociatedListener } from './group-associated-listener';

export function initListeners() {
  new UserCreatedListener(natsWrapper.client).listen();
  new GroupAssociatedListener(natsWrapper.client).listen();
}
