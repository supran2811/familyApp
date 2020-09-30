import { createAsyncThunk } from '@reduxjs/toolkit';
import ApiService from '../ApiService';

export interface PayloadWithCallback {
  payload: string;
  callback: (responce: any) => void;
}

export const sendInviteToNewMember = createAsyncThunk(
  'group/invite',
  async (payloadWithCallback: PayloadWithCallback, thunkApi) => {
    const response = await ApiService.post('/api/group/invites', {
      email: payloadWithCallback.payload,
    });

    payloadWithCallback.callback(response);

    return response;
  }
);

export const fetchInvitations = createAsyncThunk('group/invites', async () => {
  return await ApiService.get('/api/group/invites');
});

export const acceptInvitation = createAsyncThunk(
  'group/accept',
  async (payloadWithCallback: PayloadWithCallback) => {
    const response = await ApiService.post(
      `/api/group/invites/${payloadWithCallback.payload}/accept`,
      {}
    );
    payloadWithCallback.callback(response);
    return response;
  }
);

export const declineInvitation = createAsyncThunk(
  'group/decline',
  async (payloadWithCallback: PayloadWithCallback) => {
    const response = await ApiService.post(
      `/api/group/invites/${payloadWithCallback.payload}/decline`,
      {}
    );
    payloadWithCallback.callback(response);
    return response;
  }
);

export const fetchMembers = createAsyncThunk('group/members', async () => {
  return await ApiService.get('/api/group/members');
});
