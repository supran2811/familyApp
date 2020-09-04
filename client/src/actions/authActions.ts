import { createAsyncThunk } from '@reduxjs/toolkit';

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
    const response = await fetch('/api/users/signup', {
      method: 'post',
      body: JSON.stringify(payload),
      headers: {
        'Content-Type': 'application/json',
      },
    });
    const data = await response.json();
    return data;
  }
);

export const signInAction = createAsyncThunk(
  'user/signin',
  async (payload: SignInPayload, thunkApi) => {
    const response = await fetch('/api/users/signin', {
      method: 'post',
      body: JSON.stringify(payload),
      headers: {
        'Content-Type': 'application/json',
      },
    });
    const data = await response.json();
    return data;
  }
);

export const getCurrentUser = createAsyncThunk(
  'user/currentUser',
  async (payload, thunkApi) => {
    const response = await fetch('/api/users/currentuser', {
      method: 'get',
      headers: {
        'Content-Type': 'application/json',
      },
    });
    const data = await response.json();
    return data;
  }
);

export const signOutAction = createAsyncThunk('user/signout', async () => {
  const response = await fetch('/api/users/signout', {
    method: 'post',
    headers: {
      'Content-Type': 'application/json',
    },
  });
  const data = await response.json();
  return data;
});
