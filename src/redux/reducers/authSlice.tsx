import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { User } from '../../types';

interface AuthState {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  isOrganisation: boolean;
  isLoading: boolean;
}

const initialState: AuthState = {
  user: null,
  token: null,
  isAuthenticated: false,
  isOrganisation: false,
  isLoading: true,
};

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    setCredentials: (state, action: PayloadAction<{ user: User; token: string }>) => {
      state.user = action.payload.user;
      state.token = action.payload.token;
      state.isAuthenticated = true;
      state.isOrganisation = action.payload.user.role === 'Organisation';
      state.isLoading = false;
    },
    logout: (state) => {
      state.user = null;
      state.token = null;
      state.isAuthenticated = false;
      state.isOrganisation = false;
      state.isLoading = false;
      localStorage.removeItem('token');
    },
    finishInitialLoad: (state) => {
      state.isLoading = false;
    },
  },
});

export const { setCredentials, logout, finishInitialLoad } = authSlice.actions;
export default authSlice.reducer;