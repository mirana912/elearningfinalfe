// src/hooks/useAuth.ts
import { useSelector, useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { type RootState, type AppDispatch } from "./../store/store/store";
import {
  loginAsync,
  registerAsync,
  logout,
  clearError,
} from "../store/slices/authSlice";
import {
  type LoginRequest,
  type RegisterRequest,
} from "../services/api/authApi";

export const useAuth = () => {
  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();
  const { user, isAuthenticated, isLoading, error } = useSelector(
    (state: RootState) => state.auth
  );

  const login = async (credentials: LoginRequest) => {
    try {
      const result = await dispatch(loginAsync(credentials));
      if (loginAsync.fulfilled.match(result)) {
        const userData = result.payload;
        // GV (Giảng viên) hoặc Admin
        if (userData.maLoaiNguoiDung === "GV") {
          navigate("/admin/users");
        } else {
          navigate("/");
        }
        return { success: true };
      } else {
        return { success: false, error: result.payload as string };
      }
    } catch (err: any) {
      return { success: false, error: err.message };
    }
  };

  const register = async (userData: RegisterRequest) => {
    try {
      const result = await dispatch(registerAsync(userData));
      if (registerAsync.fulfilled.match(result)) {
        navigate("/");
        return { success: true };
      } else {
        return { success: false, error: result.payload as string };
      }
    } catch (err: any) {
      return { success: false, error: err.message };
    }
  };

  const logoutUser = () => {
    dispatch(logout());
    navigate("/login");
  };

  const clearAuthError = () => {
    dispatch(clearError());
  };

  return {
    user,
    isAuthenticated,
    isLoading,
    error,
    login,
    register,
    logout: logoutUser,
    clearError: clearAuthError,
  };
};

// ==========================================
