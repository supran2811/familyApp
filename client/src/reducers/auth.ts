import { createSlice } from '@reduxjs/toolkit';
import { isEmpty } from 'lodash';
import {
  signUpAction,
  signInAction,
  getCurrentUser,
  signOutAction,
} from '../actions/authActions';

export interface User {
  name: string;
  email: string;
}

const authSlice = createSlice({
  name: 'auth',
  initialState: {
    user: null,
  },
  reducers: {},
  extraReducers: (builder) =>
    builder
      .addCase(signUpAction.fulfilled, (state, action) => {
        if (!action.payload.errors) {
          state.user = action.payload;
        }
      })
      .addCase(signInAction.fulfilled, (state, action) => {
        if (!action.payload.errors) {
          state.user = action.payload;
        }
      })
      .addCase(getCurrentUser.fulfilled, (state, action) => {
        state.user = isEmpty(action.payload) ? null : action.payload;
      })
      .addCase(signOutAction.fulfilled, (state, action) => {
        state.user = null;
      }),
});

export default authSlice;
