// src/services/api/userApi.ts
import { axiosInstance } from "./axiosConfig";

// ==========================================
// TYPES
// ==========================================
export interface User {
  taiKhoan: string;
  hoTen: string;
  email: string;
  soDT: string;
  matKhau?: string;
  maLoaiNguoiDung: string; // HV (Học viên), GV (Giáo vụ)
  maNhom: string;
}

export interface UserListParams {
  MaNhom?: string;
  tuKhoa?: string;
}

export interface UserSearchParams {
  tuKhoa?: string;
  MaNhom?: string;
}

export interface CreateUserRequest {
  taiKhoan: string;
  matKhau: string;
  hoTen: string;
  soDT: string;
  maNhom: string;
  email: string;
  maLoaiNguoiDung: string;
}

export interface UpdateUserRequest {
  taiKhoan: string;
  matKhau: string;
  hoTen: string;
  soDT: string;
  maLoaiNguoiDung: string;
  maNhom: string;
  email: string;
}

// ==========================================
// API ENDPOINTS
// ==========================================
export const userApi = {
  // Lấy danh sách người dùng
  getUsers: (params?: UserListParams) =>
    axiosInstance.get<User[]>("/QuanLyNguoiDung/LayDanhSachNguoiDung", {
      params,
    }),

  // Lấy danh sách người dùng phân trang
  getUsersPagination: (params: {
    MaNhom?: string;
    soPhanTu?: number;
    soTrang?: number;
  }) =>
    axiosInstance.get<User[]>(
      "/QuanLyNguoiDung/LayDanhSachNguoiDung_PhanTrang",
      { params }
    ),

  // Tìm kiếm người dùng
  searchUsers: (tuKhoa: string, MaNhom?: string) =>
    axiosInstance.get<User[]>("/QuanLyNguoiDung/TimKiemNguoiDung", {
      params: { tuKhoa, MaNhom },
    }),

  // Lấy thông tin tài khoản (user hiện tại)
  getProfile: () =>
    axiosInstance.post<User>("/QuanLyNguoiDung/ThongTinTaiKhoan"),

  // Lấy thông tin người dùng theo tài khoản
  getUserByAccount: (taiKhoan: string) =>
    axiosInstance.post<User>("/QuanLyNguoiDung/ThongTinNguoiDung", {
      taiKhoan,
    }),

  // Thêm người dùng
  createUser: (data: CreateUserRequest) =>
    axiosInstance.post<User>("/QuanLyNguoiDung/ThemNguoiDung", data),

  // Cập nhật thông tin người dùng
  updateUser: (data: UpdateUserRequest) =>
    axiosInstance.put<User>("/QuanLyNguoiDung/CapNhatThongTinNguoiDung", data),

  // Xóa người dùng
  deleteUser: (taiKhoan: string) =>
    axiosInstance.delete(`/QuanLyNguoiDung/XoaNguoiDung?TaiKhoan=${taiKhoan}`),
};

// ==========================================
// HELPER FUNCTIONS
// ==========================================

// Map maLoaiNguoiDung to readable name
export const getUserRoleName = (role: string): string => {
  switch (role) {
    case "GV":
      return "Giảng viên";
    case "HV":
      return "Học viên";
    default:
      return role;
  }
};

// Map role name back to code
export const getUserRoleCode = (roleName: string): string => {
  switch (roleName) {
    case "Giảng viên":
      return "GV";
    case "Học viên":
      return "HV";
    default:
      return roleName;
  }
};

// Validate user data
export const validateUserData = (
  data: Partial<CreateUserRequest>
): string | null => {
  if (!data.taiKhoan || data.taiKhoan.length < 4) {
    return "Tài khoản phải có ít nhất 4 ký tự";
  }
  if (!data.hoTen || data.hoTen.length < 2) {
    return "Họ tên phải có ít nhất 2 ký tự";
  }
  if (!data.email || !/\S+@\S+\.\S+/.test(data.email)) {
    return "Email không hợp lệ";
  }
  if (!data.soDT || !/^(0|\+84)[3|5|7|8|9][0-9]{8}$/.test(data.soDT)) {
    return "Số điện thoại không hợp lệ";
  }
  if (data.matKhau && data.matKhau.length < 6) {
    return "Mật khẩu phải có ít nhất 6 ký tự";
  }
  return null;
};
