import { createAsyncThunk, createSlice, PayloadAction } from "@reduxjs/toolkit";
import Cookies from "js-cookie";
import api from "../utils/api";
// import { jwtDecode } from "jwt-decode";

interface User {
  id: number;
  nombre: string;
  email: string;
}

interface AuthState {
  isAuthenticated: boolean;
  token: string | null;
  user: User | null;
  loading: boolean;
  error: string | null;
}

const initialState: AuthState = {
  isAuthenticated: !!Cookies.get("token"),
  token: Cookies.get("token") || null,
  user: null,
  loading: false,
  error: null,
};

interface LoginPayload {
  email: string;
  password: string;
}

// interface JwtPayload {
//   id: number;
//   exp: number;
//   iat: number;
// }

export const loginAndLoadUser = createAsyncThunk(
  "auth/loginAndLoadUser",
  async ({ email, password }: LoginPayload, { rejectWithValue }) => {
    try {
      const response = await api.post("/auth/login", { email, password });
      const token: string = response.data.data.token;

      // const decoded = jwtDecode<JwtPayload>(token);
      // const userId = decoded.id;

      Cookies.set("token", token, { expires: 1, secure: true, sameSite: "Strict" });

      const userResponse = await api.get(`/auth/me`);
      const user: User = userResponse.data.data;

      return { token, user };
    } catch (error: unknown) {
      if (error instanceof Error) {
        return rejectWithValue(error.message);
      }
      return rejectWithValue("Error desconocido al iniciar sesión");
    }
  }
);

export const loadUserFromToken = createAsyncThunk(
  "auth/loadUserFromToken",
  async (_, { rejectWithValue }) => {
    try {
      const token = Cookies.get("token");
      if (!token) return rejectWithValue("No token found");

      // const decoded = jwtDecode<JwtPayload>(token);
      // const userId = decoded.id;

      const userResponse = await api.get(`/auth/me`);
      const user: User = userResponse.data.data;

      return { token, user };
    } catch (error: unknown) {
      if (error instanceof Error) return rejectWithValue(error.message);
      return rejectWithValue("Error al recuperar la sesión");
    }
  }
);


const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    logout: (state) => {
      state.token = null;
      state.user = null;
      state.isAuthenticated = false;
      state.loading = false;
      Cookies.remove("token");
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(loginAndLoadUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(loginAndLoadUser.fulfilled, (state, action: PayloadAction<{ token: string; user: User }>) => {
        state.token = action.payload.token;
        state.user = action.payload.user;
        state.isAuthenticated = true;
        state.loading = false;
      })
      .addCase(loginAndLoadUser.rejected, (state, action) => {
        state.loading = false;
        state.token = null;
        state.user = null;
        state.isAuthenticated = false;
        state.error = action.payload as string;
        Cookies.remove("token");
      })
      .addCase(loadUserFromToken.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(loadUserFromToken.fulfilled, (state, action: PayloadAction<{ token: string; user: User }>) => {
        state.token = action.payload.token;
        state.user = action.payload.user;
        state.isAuthenticated = true;
        state.loading = false;
      })
      .addCase(loadUserFromToken.rejected, (state) => {
        state.token = null;
        state.user = null;
        state.isAuthenticated = false;
        state.loading = false;
        Cookies.remove("token");
      });

  },
});

export const { logout } = authSlice.actions;
export default authSlice.reducer;
