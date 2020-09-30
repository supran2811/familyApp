import { RootState } from '../reducers';

export const getMembers = (state: RootState) => state.group.members;

export const getInvites = (state: RootState) => state.group.invites;
