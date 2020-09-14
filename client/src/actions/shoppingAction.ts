import { createAsyncThunk } from '@reduxjs/toolkit';
import { History } from 'history';
import ApiService from '../ApiService';
import { Shopping } from '../reducers/shopping';

export interface NewShoppingPayload {
  name: string;
  history: History;
}

export const createNewShoppingAction = createAsyncThunk(
  'shopping/create',
  async (payload: NewShoppingPayload, thunkApi) => {
    const response = await ApiService.post('/api/shopping', {
      name: payload.name,
    });
    payload.history.push(`/shopping/${response.id}`);

    return response;
  }
);

export const getShoppingList = createAsyncThunk(
  'shopping/list',
  async (payload, thunkApi) => {
    return await ApiService.get('/api/shopping');
  }
);

export const getShoppingListById = createAsyncThunk(
  'shopping/id',
  async (payload: string, thunkApi) => {
    return await ApiService.get(`/api/shopping/${payload}`);
  }
);

export const updateShoppingById = createAsyncThunk(
  'shopping/update',
  async (payload: { shopping: Shopping; history: History }, thunkApi) => {
    const response = await ApiService.put(
      `/api/shopping/${payload.shopping.id}`,
      payload.shopping
    );
    payload.history.replace('/');
    return response;
  }
);

export const deleteShoppingByIds = createAsyncThunk(
  'shopping/delete',
  async (payload: string[], thunkApi) => {
    return await ApiService.del('/api/shopping', { ids: payload });
  }
);
