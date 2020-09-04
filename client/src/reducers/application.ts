import { createSlice, PayloadAction, AnyAction } from '@reduxjs/toolkit';

function isPendingAction(
  action: AnyAction
): action is PayloadAction<{ type: string }> {
  return action.type.endsWith('pending');
}

function isFullfiledAction(
  action: AnyAction
): action is PayloadAction<{ type: string }> {
  return action.type.endsWith('fulfilled');
}

function isRejectedAction(
  action: AnyAction
): action is PayloadAction<{ type: string }> {
  return action.type.endsWith('rejected');
}

const application = createSlice({
  name: 'application',
  initialState: {
    errors: null,
    loading: false,
    pendingRequest: 0,
  },
  reducers: {},
  extraReducers: (builder) =>
    builder
      .addMatcher(isPendingAction, (state, action) => {
        state.pendingRequest++;
        state.loading = true;
      })
      .addMatcher(isRejectedAction, (state, action) => {
        state.pendingRequest--;
        if (state.pendingRequest === 0) {
          state.loading = false;
        }
      })
      .addMatcher(isFullfiledAction, (state, action) => {
        state.pendingRequest--;
        if (state.pendingRequest === 0) {
          state.loading = false;
        }
        // @ts-ignore
        state.errors = action.payload.errors || null;
      }),
});

export default application;
