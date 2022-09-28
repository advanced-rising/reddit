import { configureStore, ThunkAction, Action, combineReducers } from '@reduxjs/toolkit';
import user from './slices/user';

export const store = configureStore({
  reducer: {
    user: user,
  },
});

export type AppDispatch = typeof store.dispatch;
export type RootState = ReturnType<typeof store.getState>;
export type AppThunk<ReturnType = void> = ThunkAction<
  ReturnType,
  RootState,
  unknown,
  Action<string>
>;
