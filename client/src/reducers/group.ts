import { createSlice } from '@reduxjs/toolkit';
import {
  acceptInvitation,
  declineInvitation,
  fetchMembers,
  fetchInvitations,
} from '../actions/groupAction';
import { signOutAction } from '../actions/authActions';

export interface Invite {
  id: string;
  email: string;
  senderName: string;
  senderEmail: string;
  groupId?: string;
}

export interface Member {
  name: string;
  email: string;
}

interface GroupState {
  invites: Invite[];
  members: Member[];
}

const initialState: GroupState = {
  invites: [],
  members: [],
};

const groupSlice = createSlice({
  name: 'group',
  initialState,
  reducers: {},
  extraReducers: (builder) =>
    builder
      .addCase(fetchMembers.fulfilled, (state, action) => {
        if (!action.payload.errors) {
          state.members = action.payload;
        }
      })
      .addCase(fetchInvitations.fulfilled, (state, action) => {
        if (!action.payload.errors) {
          state.invites = action.payload;
        }
      })
      .addCase(acceptInvitation.fulfilled, (state, action) => {
        state.invites = [];
      })
      .addCase(declineInvitation.fulfilled, (state, action) => {
        state.invites = state.invites.filter(({ id }) => id !== action.payload);
      })
      .addCase(signOutAction.fulfilled, (state, action) => {
        state.invites = [];
        state.members = [];
      }),
});

export default groupSlice;
