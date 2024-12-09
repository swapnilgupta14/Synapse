import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { User, AuthState } from '../../types';
import { loadFromLocalStorage } from "../../utils/localStorage";
const savedToken = localStorage.getItem('token');

const initialState: AuthState = {
  user: JSON.parse(localStorage.getItem('userCurrent') || 'null'),
  isAuthenticated: !!savedToken,
  token: savedToken || null,
};

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    login: (state, action: PayloadAction<{ user: Omit<User, "email">; token: string }>) => {
      const signedUpUsers: User[] = loadFromLocalStorage("SignedUpUsers", []);
      const extractUser = signedUpUsers.find((it: User) => it.id === action.payload.user.id);
      const userWithEmail = {
        ...action.payload.user,
        email: extractUser?.email || "",
      };

      state.user = userWithEmail;
      state.isAuthenticated = true;
      state.token = action.payload.token;

      localStorage.setItem("userCurrent", JSON.stringify(userWithEmail));
      localStorage.setItem("token", action.payload.token);
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