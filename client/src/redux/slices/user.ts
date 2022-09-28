import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { RootState } from '../store';

export interface CounterState {
  user: boolean;
}

const initialState: CounterState = {
  user: false,
};

export const user = createSlice({
  name: 'user',
  initialState,
  reducers: {
    login: (state, action: PayloadAction) => {
      state.user = true;
    },
    logout: (state, action: PayloadAction) => {
      state.user = false;
    },
  },
});

export const { login, logout } = user.actions;

export const userSelector = (state: RootState) => state.user;

export default user.reducer;
