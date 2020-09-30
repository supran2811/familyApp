import { combineReducers } from '@reduxjs/toolkit';

import auth from './auth';
import application from './application';
import shopping from './shopping';
import group from './group';

const rootReducer = combineReducers({
  [auth.name]: auth.reducer,
  [application.name]: application.reducer,
  [shopping.name]: shopping.reducer,
  [group.name]: group.reducer,
});
export type RootState = ReturnType<typeof rootReducer>;
export default rootReducer;
