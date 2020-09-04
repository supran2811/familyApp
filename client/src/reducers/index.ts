import { combineReducers } from '@reduxjs/toolkit';

import auth from './auth';
import application from './application';

const rootReducer = combineReducers({
  [auth.name]: auth.reducer,
  [application.name]: application.reducer,
});
export type RootState = ReturnType<typeof rootReducer>;
export default rootReducer;
