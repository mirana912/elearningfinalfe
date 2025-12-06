// src/store/slices/userSlice.ts
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import {
  userApi,
  type User,
  type UserListParams,
} from "./../../services/api/userApi";

interface UserState {
  users: User[];
  currentUser: User | null;
  total: number;
  isLoading: boolean;
  error: string | null;
}

const initialState: UserState = {
  users: [],
  currentUser: null,
  total: 0,
  isLoading: false,
  error: null,
};

export const getUsersAsync = createAsyncThunk(
  "user/getUsers",
  async (params: UserListParams, { rejectWithValue }) => {
    try {
      const response = await userApi.getUsers(params);
      return response.data;
    } catch (error: any) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to fetch users"
      );
    }
  }
);

export const createUserAsync = createAsyncThunk(
  "user/createUser",
  async (userData: Partial<User>, { rejectWithValue }) => {
    try {
      const response = await userApi.createUser(userData);
      return response.data;
    } catch (error: any) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to create user"
      );
    }
  }
);

export const updateUserAsync = createAsyncThunk(
  "user/updateUser",
  async (
    { id, data }: { id: string; data: Partial<User> },
    { rejectWithValue }
  ) => {
    try {
      const response = await userApi.updateUser(id, userData);
      return response.data;
    } catch (error: any) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to update user"
      );
    }
  }
);

export const deleteUserAsync = createAsyncThunk(
  "user/deleteUser",
  async (id: string, { rejectWithValue }) => {
    try {
      await userApi.deleteUser(id);
      return id;
    } catch (error: any) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to delete user"
      );
    }
  }
);

const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    // Get users
    builder
      .addCase(getUsersAsync.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(getUsersAsync.fulfilled, (state, action) => {
        state.isLoading = false;
        state.users = action.payload.data;
        state.total = action.payload.total;
      })
      .addCase(getUsersAsync.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      });

    // Create user
    builder.addCase(createUserAsync.fulfilled, (state, action) => {
      state.users.unshift(action.payload);
      state.total += 1;
    });

    // Update user
    builder.addCase(updateUserAsync.fulfilled, (state, action) => {
      const index = state.users.findIndex((u) => u.id === action.payload.id);
      if (index !== -1) {
        state.users[index] = action.payload;
      }
    });

    // Delete user
    builder.addCase(deleteUserAsync.fulfilled, (state, action) => {
      state.users = state.users.filter((u) => u.id !== action.payload);
      state.total -= 1;
    });
  },
});

export const { clearError } = userSlice.actions;
export default userSlice.reducer;

// ==========================================
