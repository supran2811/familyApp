import { combineReducers } from '@reduxjs/toolkit';

import auth from './auth';
import application from './application';
import shopping from './shopping';

const rootReducer = combineReducers({
  [auth.name]: auth.reducer,
  [application.name]: application.reducer,
  [shopping.name]: shopping.reducer,
});
export type RootState = ReturnType<typeof rootReducer>;
export default rootReducer;
