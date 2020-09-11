import { createSlice } from '@reduxjs/toolkit';
import {
  createNewShoppingAction,
  getShoppingList,
} from '../actions/shoppingAction';

import { signOutAction } from '../actions/authActions';

export interface Shopping {
  id: string;
  name: string;
  creatorName: string;
  items: { name: string; qty: string; status: string }[];
}

interface ShoppingState {
  data: Shopping[];
}

const initialState: ShoppingState = {
  data: [],
};

const shoppingSlice = createSlice({
  name: 'shopping',
  initialState,
  reducers: {},
  extraReducers: (builder) =>
    builder
      .addCase(createNewShoppingAction.fulfilled, (state, action) => {
        if (!action.payload.errors) {
          state.data.push(action.payload);
        }
      })
      .addCase(getShoppingList.fulfilled, (state, action) => {
        if (!action.payload.errors) {
          state.data = action.payload;
        }
      })
      .addCase(signOutAction.fulfilled, (state, action) => {
        state.data = [];
      }),
});

export default shoppingSlice;
