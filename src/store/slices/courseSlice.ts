// src/store/slices/courseSlice.ts
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { courseApi, type Course, type CourseListParams } from './../../services/api/courseApi';

interface CourseState {
  courses: Course[];
  currentCourse: Course | null;
  total: number;
  isLoading: boolean;
  error: string | null;
}

const initialState: CourseState = {
  courses: [],
  currentCourse: null,
  total: 0,
  isLoading: false,
  error: null,
};

export const getCoursesAsync = createAsyncThunk(
  'course/getCourses',
  async (params: CourseListParams, { rejectWithValue }) => {
    try {
      const response = await courseApi.getCourses(params);
      return response.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message);
    }
  }
);

const courseSlice = createSlice({
  name: 'course',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(getCoursesAsync.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(getCoursesAsync.fulfilled, (state, action) => {
        state.isLoading = false;
        state.courses = action.payload.data;
        state.total = action.payload.total;
      })
      .addCase(getCoursesAsync.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      });
  },
});

export default courseSlice.reducer;

// ==========================================