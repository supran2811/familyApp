import { createAsyncThunk } from '@reduxjs/toolkit';

import ApiService from '../ApiService';

export interface NewShoppingPayload {
  name: string;
}

export const createNewShoppingAction = createAsyncThunk(
  'shopping/create',
  async (payload: NewShoppingPayload, thunkApi) => {
    return await ApiService.post('/api/shopping', payload);
  }
);

export const getShoppingList = createAsyncThunk(
  'shopping/list',
  async (payload, thunkApi) => {
    return await ApiService.get('/api/shopping');
  }
);
