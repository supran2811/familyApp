import { RootState } from '../reducers';

import { User } from '../reducers/auth';

export const currentUser = (state: RootState): User | null => state.auth.user;
