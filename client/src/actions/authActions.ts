import { createAsyncThunk } from '@reduxjs/toolkit';
import ApiService from '../ApiService';

export interface SignUpPayload {
  name: string;
  email: string;
  password: string;
}

export interface SignInPayload {
  email: string;
  password: string;
}

export const signUpAction = createAsyncThunk(
  'user/signup',
  async (payload: SignUpPayload, thunkApi) => {
    return await ApiService.post('/api/users/signup', payload);
  }
);

export const signInAction = createAsyncThunk(
  'user/signin',
  async (payload: SignInPayload, thunkApi) => {
    return await ApiService.post('/api/users/signin', payload);
  }
);

export const getCurrentUser = createAsyncThunk(
  'user/currentUser',
  async (payload, thunkApi) => {
    return await ApiService.get('/api/users/currentuser');
  }
);

export const signOutAction = createAsyncThunk('user/signout', async () => {
  return await ApiService.post('/api/users/signout', {});
});
