import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { User, AuthState } from '../types';

const savedUser = localStorage.getItem('userCurrent');
const savedToken = localStorage.getItem('token');

const initialState: AuthState = {
  user: savedUser ? JSON.parse(savedUser) : null,
  isAuthenticated: !!savedToken,
  token: savedToken || null,
};

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    login: (state, action: PayloadAction<{ user: User; token: string }>) => {
      state.user = action.payload.user;
      state.isAuthenticated = true;
      state.token = action.payload.token;
      localStorage.setItem('userCurrent', JSON.stringify(action.payload.user));
      localStorage.setItem('token', action.payload.token);
    },
    logout: (state) => {
      state.user = null;
      state.isAuthenticated = false;
      state.token = null;
      localStorage.removeItem('userCurrent');
      localStorage.removeItem('token');
    },
  },
});

export const { login, logout } = authSlice.actions;
export default authSlice.reducer;