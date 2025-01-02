import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { User, AuthState } from '../../types';

const initialState: AuthState = {
  user: null,
  isAuthenticated: false,
  token: localStorage.getItem('token') || null,
  isOrganisation: localStorage.getItem('isOrganisation') === 'true',
};

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    login: (state, action: PayloadAction<{ user: User; token: string; isOrganisation: boolean }>) => {
      state.user = action.payload.user;
      state.isAuthenticated = true;
      state.token = action.payload.token;
      state.isOrganisation = action.payload.isOrganisation;
      
      // localStorage.setItem('token', action.payload.token);
      // localStorage.setItem('isOrganisation', String(action.payload.isOrganisation));
      // localStorage.setItem('user', JSON.stringify(action.payload.user));
    },
    logout: (state) => {
      state.user = null;
      state.isAuthenticated = false;
      state.token = null;
      state.isOrganisation = false;
      
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      localStorage.removeItem('isOrganisation');
    },
  },
});

export const { login, logout } = authSlice.actions;
export default authSlice.reducer;