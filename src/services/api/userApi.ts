// src/services/api/userApi.ts
import { axiosInstance } from './axiosConfig';

export interface User {
  id: string;
  email: string;
  name: string;
  phone?: string;
  role: string;
  avatar?: string;
  createdAt: string;
}

export interface UserListParams {
  page?: number;
  pageSize?: number;
  keyword?: string;
  role?: string;
}

export const userApi = {
  getUsers: (params: UserListParams) => 
    axiosInstance.get<{ data: User[]; total: number }>('/users', { params }),
  
  getUserById: (id: string) => 
    axiosInstance.get<User>(`/users/${id}`),
  
  createUser: (data: Partial<User>) => 
    axiosInstance.post<User>('/users', data),
  
  updateUser: (id: string, data: Partial<User>) => 
    axiosInstance.put<User>(`/users/${id}`, data),
  
  deleteUser: (id: string) => 
    axiosInstance.delete(`/users/${id}`),
  
  searchUsers: (keyword: string) => 
    axiosInstance.get<User[]>('/users/search', { params: { keyword } }),
};
// ==========================================