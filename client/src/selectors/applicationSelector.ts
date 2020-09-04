import { RootState } from '../reducers';

export const loading = (state: RootState) => state.application.loading;
export const errors = (state: RootState) => state.application.errors;
