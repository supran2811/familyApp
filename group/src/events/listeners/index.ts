import { UserCreatedListener } from './user-created-listener';
import { natsWrapper } from '../../nats-wrapper';

export function initListeners() {
  new UserCreatedListener(natsWrapper.client).listen();
}
