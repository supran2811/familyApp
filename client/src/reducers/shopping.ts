import { createSlice } from '@reduxjs/toolkit';
import { ItemStatus } from '@familyapp/common';
import {
  createNewShoppingAction,
  getShoppingList,
  getShoppingListById,
  updateShoppingById,
  deleteShoppingByIds,
} from '../actions/shoppingAction';

import { signOutAction } from '../actions/authActions';

export interface Shopping {
  id: string;
  name: string;
  creatorName?: string;
  items: { _id?: string; name: string; qty: string; status: ItemStatus }[];
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
      .addCase(getShoppingListById.fulfilled, (state, action) => {
        if (!action.payload.errors) {
          state.data.push(action.payload);
        }
      })
      .addCase(updateShoppingById.fulfilled, (state, action) => {
        if (!action.payload.errors) {
          for (const shoppingData of state.data) {
            if (shoppingData.id === action.payload.id) {
              shoppingData.items = action.payload.items;
              shoppingData.name = action.payload.name;
              break;
            }
          }
        }
      })
      .addCase(deleteShoppingByIds.fulfilled, (state, action) => {
        if (!action.payload.errors) {
          state.data = state.data.filter(
            (item) => !action.payload.ids.includes(item.id)
          );
        }
      })
      .addCase(signOutAction.fulfilled, (state, action) => {
        state.data = [];
      }),
});

export default shoppingSlice;
