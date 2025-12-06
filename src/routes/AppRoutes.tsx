// src/routes/ AppRoutes.tsx;
import {
  BrowserRouter,
  Route,
  Navigate,
  Router,
  Routes,
} from "react-router-dom";
import { useSelector } from "react-redux";
import { type RootState } from "./../store/store/store";

// Layouts
import AdminLayout from "../layouts/AdminLayout/AdminLayout";
import AuthLayout from "../layouts/AuthLayout/AuthLayout";
import HomeLayout from "../layouts/HomeLayout/HomeLayout";

// Admin Pages
import QuanLyNguoiDung from "../pages/admin/QuanLyNguoiDung/QuanLyNguoiDung";
// import QuanLyKhoaHoc from "../pages/admin/QuanLyKhoaHoc/QuanLyKhoaHoc";
// import QuanLyGhiDanh from "../pages/admin/QuanLyGhiDanh/QuanLyGhiDanh";

// Auth Pages
import Login from "../pages/auth/Login/Login";
import Register from "../pages/auth/Register/Register";

// Public Pages
import NotFound from "../pages/NotFound/NotFound";

// Protected Route Components
import ProtectedRoute from "./ProtectedRoute";
import AdminRoute from "./AdminRoute";

const AppRoutes = () => {
  return (
    <BrowserRouter>
      <Routes>
        {/* Auth Routes */}
        <Route element={<AuthLayout />}>
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
        </Route>

        {/* Admin Routes - Protected */}
        <Route
          path="/admin"
          element={
            <AdminRoute>
              <AdminLayout />
            </AdminRoute>
          }
        >
          <Route index element={<Navigate to="/admin/users" replace />} />
          <Route path="users" element={<QuanLyNguoiDung />} />
          {/* <Route path="courses" element={<QuanLyKhoaHoc />} />
          <Route path="enrollments" element={<QuanLyGhiDanh />} /> */}
        </Route>

        {/* Home Routes - Will be implemented by partner */}
        <Route path="/" element={<HomeLayout />}>
          <Route index element={<div>Home Page - To be implemented</div>} />
          <Route
            path="courses/:id"
            element={<div>Course Detail - To be implemented</div>}
          />
          <Route
            path="profile"
            element={
              <ProtectedRoute>
                <div>User Profile - To be implemented</div>
              </ProtectedRoute>
            }
          />
        </Route>

        {/* 404 */}
        <Route path="*" element={<NotFound />} />
      </Routes>
    </BrowserRouter>
  );
};

export default AppRoutes;

// ==========================================
