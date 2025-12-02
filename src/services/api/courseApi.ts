// src/services/api/courseApi.ts
import { axiosInstance } from './axiosConfig';

export interface Course {
  id: string;
  name: string;
  description: string;
  image: string;
  price: number;
  discount?: number;
  categoryId: string;
  instructor: string;
  duration: number;
  level: string;
  students: number;
  rating: number;
  createdAt: string;
}

export interface CourseListParams {
  page?: number;
  pageSize?: number;
  keyword?: string;
  categoryId?: string;
}

export const courseApi = {
  getCourses: (params: CourseListParams) => 
    axiosInstance.get<{ data: Course[]; total: number }>('/courses', { params }),
  
  getCourseById: (id: string) => 
    axiosInstance.get<Course>(`/courses/${id}`),
  
  createCourse: (data: FormData) => 
    axiosInstance.post<Course>('/courses', data, {
      headers: { 'Content-Type': 'multipart/form-data' }
    }),
  
  updateCourse: (id: string, data: FormData) => 
    axiosInstance.put<Course>(`/courses/${id}`, data, {
      headers: { 'Content-Type': 'multipart/form-data' }
    }),
  
  deleteCourse: (id: string) => 
    axiosInstance.delete(`/courses/${id}`),
  
  getCategories: () => 
    axiosInstance.get('/categories'),
};

// ==========================================