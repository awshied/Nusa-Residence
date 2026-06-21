import { getCurrentUser, isAuthenticated } from "@/services/auth.service";
import type { TipeUser } from "@/types";
import { createSlice, type PayloadAction } from "@reduxjs/toolkit";

type TipeAuthState = {
  user: TipeUser;
  isAuthenticated: boolean;
  isLoading: boolean;
  isError: boolean;
};

const initialState: TipeAuthState = {
  user: getCurrentUser(),
  isAuthenticated: isAuthenticated(),
  isLoading: false,
  isError: false,
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
