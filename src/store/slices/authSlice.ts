// src/store/slices/authSlice.ts
import {
  createSlice,
  createAsyncThunk,
  type PayloadAction,
} from "@reduxjs/toolkit";
import {
  authApi,
  type LoginRequest,
  type RegisterRequest,
  type LoginResponse,
} from "../../services/api/authApi";

interface User {
  taiKhoan: string;
  hoTen: string;
  email: string;
  soDT: string;
  maNhom: string;
  maLoaiNguoiDung: string;
}

interface AuthState {
  user: User | null;
  accessToken: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
}

const initialState: AuthState = {
  user: null,
  accessToken: localStorage.getItem("accessToken"),
  isAuthenticated: !!localStorage.getItem("accessToken"),
  isLoading: false,
  error: null,
};

// Async thunks
export const loginAsync = createAsyncThunk(
  "auth/login",
  async (credentials: LoginRequest, { rejectWithValue }) => {
    try {
      const response = await authApi.login(credentials);
      const userData = response.data;

      // Lưu vào localStorage
      localStorage.setItem("accessToken", userData.accessToken);
      localStorage.setItem("userInfo", JSON.stringify(userData));

      return userData;
    } catch (error: any) {
      return rejectWithValue(error.message || "Đăng nhập thất bại");
    }
  }
);

export const registerAsync = createAsyncThunk(
  "auth/register",
  async (userData: RegisterRequest, { rejectWithValue }) => {
    try {
      const response = await authApi.register(userData);

      // Sau khi đăng ký thành công, tự động đăng nhập
      const loginResponse = await authApi.login({
        taiKhoan: userData.taiKhoan,
        matKhau: userData.matKhau,
      });

      const loginData = loginResponse.data;
      localStorage.setItem("accessToken", loginData.accessToken);
      localStorage.setItem("userInfo", JSON.stringify(loginData));

      return loginData;
    } catch (error: any) {
      return rejectWithValue(error.message || "Đăng ký thất bại");
    }
  }
);

export const getProfileAsync = createAsyncThunk(
  "auth/getProfile",
  async (_, { rejectWithValue }) => {
    try {
      const response = await authApi.getProfile();
      return response.data;
    } catch (error: any) {
      return rejectWithValue(error.message || "Lấy thông tin thất bại");
    }
  }
);

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    logout: (state) => {
      state.user = null;
      state.accessToken = null;
      state.isAuthenticated = false;
      localStorage.removeItem("accessToken");
      localStorage.removeItem("userInfo");
    },
    clearError: (state) => {
      state.error = null;
    },
    setUserFromStorage: (state) => {
      const userInfo = localStorage.getItem("userInfo");
      const accessToken = localStorage.getItem("accessToken");
      if (userInfo && accessToken) {
        state.user = JSON.parse(userInfo);
        state.accessToken = accessToken;
        state.isAuthenticated = true;
      }
    },
  },
  extraReducers: (builder) => {
    // Login
    builder
      .addCase(loginAsync.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(
        loginAsync.fulfilled,
        (state, action: PayloadAction<LoginResponse>) => {
          state.isLoading = false;
          state.user = {
            taiKhoan: action.payload.taiKhoan,
            hoTen: action.payload.hoTen,
            email: action.payload.email,
            soDT: action.payload.soDT,
            maNhom: action.payload.maNhom,
            maLoaiNguoiDung: action.payload.maLoaiNguoiDung,
          };
          state.accessToken = action.payload.accessToken;
          state.isAuthenticated = true;
        }
      )
      .addCase(loginAsync.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      });

    // Register
    builder
      .addCase(registerAsync.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(
        registerAsync.fulfilled,
        (state, action: PayloadAction<LoginResponse>) => {
          state.isLoading = false;
          state.user = {
            taiKhoan: action.payload.taiKhoan,
            hoTen: action.payload.hoTen,
            email: action.payload.email,
            soDT: action.payload.soDT,
            maNhom: action.payload.maNhom,
            maLoaiNguoiDung: action.payload.maLoaiNguoiDung,
          };
          state.accessToken = action.payload.accessToken;
          state.isAuthenticated = true;
        }
      )
      .addCase(registerAsync.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      });

    // Get Profile
    builder
      .addCase(getProfileAsync.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(getProfileAsync.fulfilled, (state, action) => {
        state.isLoading = false;
        state.user = action.payload;
        state.isAuthenticated = true;
      })
      .addCase(getProfileAsync.rejected, (state) => {
        state.isLoading = false;
        state.isAuthenticated = false;
        state.user = null;
        localStorage.removeItem("accessToken");
        localStorage.removeItem("userInfo");
      });
  },
});

export const { logout, clearError, setUserFromStorage } = authSlice.actions;
export default authSlice.reducer;

// ==========================================
