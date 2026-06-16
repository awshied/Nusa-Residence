import { getCurrentUser, isAuthenticated } from "@/services/auth.service";
import { createSlice, type PayloadAction } from "@reduxjs/toolkit";

type TipeUser = {
  id: string;
  email: string;
  namaLengkap?: string | null;
  peran: string;
} | null;

type TipeAuthState = {
  user: TipeUser;
  isAuthenticated: boolean;
  isLoading: boolean;
};

const initialState: TipeAuthState = {
  user: getCurrentUser(),
  isAuthenticated: isAuthenticated(),
  isLoading: false,
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    setLoading: (state, action: PayloadAction<boolean>) => {
      state.isLoading = action.payload;
    },
    setUser: (state, action: PayloadAction<TipeUser>) => {
      state.user = action.payload;
      state.isAuthenticated = !!action.payload;
    },
    setLogout: (state) => {
      state.user = null;
      state.isAuthenticated = false;
    },
  },
});

export const { setLoading, setUser, setLogout } = authSlice.actions;
export default authSlice.reducer;
