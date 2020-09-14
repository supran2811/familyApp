import { RootState } from '../reducers';
import { Shopping } from '../reducers/shopping';

export const shoppingList = (state: RootState): Shopping[] =>
  state.shopping.data;

export const selectShoppingListById = (
  id: string,
  state: RootState
): Shopping | undefined =>
  state.shopping.data.find((item: Shopping) => item.id === id);
