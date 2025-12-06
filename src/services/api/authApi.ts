// src/services/api/authApi.ts
import { axiosInstance } from "./axiosConfig";

export interface LoginRequest {
  taiKhoan: string;
  matKhau: string;
}

export interface RegisterRequest {
  taiKhoan: string;
  matKhau: string;
  hoTen: string;
  soDT: string;
  maNhom: string;
  email: string;
}

export interface LoginResponse {
  taiKhoan: string;
  hoTen: string;
  email: string;
  soDT: string;
  maNhom: string;
  maLoaiNguoiDung: string;
  accessToken: string;
}

export interface RegisterResponse {
  taiKhoan: string;
  matKhau: string;
  hoTen: string;
  soDT: string;
  maNhom: string;
  email: string;
  maLoaiNguoiDung: string;
}

export const authApi = {
  // Đăng nhập
  login: (data: LoginRequest) =>
    axiosInstance.post<LoginResponse>("/QuanLyNguoiDung/DangNhap", data),

  // Đăng ký
  register: (data: RegisterRequest) =>
    axiosInstance.post<RegisterResponse>("/QuanLyNguoiDung/DangKy", data),

  // Lấy thông tin tài khoản
  getProfile: () => axiosInstance.post("/QuanLyNguoiDung/ThongTinTaiKhoan"),

  // Cập nhật thông tin
  updateProfile: (data: any) =>
    axiosInstance.put("/QuanLyNguoiDung/CapNhatThongTinNguoiDung", data),
};

// ==========================================
