// src/pages/auth/Login/Login.tsx
import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../../../hooks/useAuth";

interface LoginForm {
  taiKhoan: string;
  matKhau: string;
  rememberMe: boolean;
}

const Login = () => {
  const { login, isLoading, error, clearError } = useAuth();

  const [formData, setFormData] = useState<LoginForm>({
    taiKhoan: "",
    matKhau: "",
    rememberMe: false,
  });

  const [errors, setErrors] = useState<
    Partial<Record<keyof LoginForm, string>>
  >({});
  const [showPassword, setShowPassword] = useState(false);
  const [apiError, setApiError] = useState("");

  // Clear error when component unmounts
  useEffect(() => {
    return () => {
      clearError();
    };
  }, [clearError]);

  // Update API error when auth error changes
  useEffect(() => {
    if (error) {
      setApiError(error);
    }
  }, [error]);

  const validateForm = (): boolean => {
    const newErrors: Partial<Record<keyof LoginForm, string>> = {};

    if (!formData.taiKhoan.trim()) {
      newErrors.taiKhoan = "Tài khoản là bắt buộc";
    } else if (formData.taiKhoan.length < 4) {
      newErrors.taiKhoan = "Tài khoản phải có ít nhất 4 ký tự";
    }

    if (!formData.matKhau) {
      newErrors.matKhau = "Mật khẩu là bắt buộc";
    } else if (formData.matKhau.length < 6) {
      newErrors.matKhau = "Mật khẩu phải có ít nhất 6 ký tự";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));

    if (errors[name as keyof LoginForm]) {
      setErrors((prev) => ({ ...prev, [name]: undefined }));
    }

    if (apiError) {
      setApiError("");
      clearError();
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) return;

    setApiError("");

    const result = await login({
      taiKhoan: formData.taiKhoan,
      matKhau: formData.matKhau,
    });

    if (!result.success && result.error) {
      setApiError(result.error);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-600 to-blue-800 flex items-center justify-center px-4 py-12 font-['Roboto',sans-serif]">
      <div className="max-w-md w-full">
        {/* Logo */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-white rounded-full mb-4 shadow-lg">
            <svg
              className="w-10 h-10 text-blue-600"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"
              />
            </svg>
          </div>
          <h1 className="text-3xl font-bold text-white mb-2">
            E-Learning CyberSoft
          </h1>
          <p className="text-sm text-white/80">Đăng nhập vào hệ thống</p>
        </div>

        {/* Info Box */}
        <div className="bg-blue-500 text-white rounded-lg p-4 mb-6">
          <p className="font-medium mb-2 flex items-center">
            <svg
              className="w-5 h-5 mr-2"
              fill="currentColor"
              viewBox="0 0 20 20"
            >
              <path
                fillRule="evenodd"
                d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z"
                clipRule="evenodd"
              />
            </svg>
            Hướng dẫn
          </p>
          <div className="text-sm space-y-1 bg-blue-600 rounded p-2">
            <p>
              • Nếu chưa có tài khoản, vui lòng <strong>Đăng ký</strong> trước
            </p>
            <p>• Hoặc sử dụng tài khoản đã được cấp từ giảng viên</p>
          </div>
        </div>

        {/* Login Form */}
        <div className="bg-white rounded-lg shadow-xl p-8">
          <div className="space-y-6">
            {/* API Error Alert */}
            {apiError && (
              <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded text-sm flex items-start">
                <svg
                  className="w-5 h-5 mr-2 flex-shrink-0 mt-0.5"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path
                    fillRule="evenodd"
                    d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
                    clipRule="evenodd"
                  />
                </svg>
                <span>{apiError}</span>
              </div>
            )}

            {/* Tài khoản Field */}
            <div>
              <label
                htmlFor="taiKhoan"
                className="block text-sm font-medium text-gray-700 mb-2"
              >
                Tài khoản <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <input
                  type="text"
                  id="taiKhoan"
                  name="taiKhoan"
                  value={formData.taiKhoan}
                  onChange={handleChange}
                  className={`w-full px-4 py-3 pl-10 border rounded focus:outline-none focus:ring-2 transition-all ${
                    errors.taiKhoan
                      ? "border-red-500 focus:ring-red-500"
                      : "border-gray-300 focus:ring-blue-500"
                  }`}
                  placeholder="Nhập tài khoản"
                  autoComplete="username"
                />
                <svg
                  className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                  />
                </svg>
              </div>
              {errors.taiKhoan && (
                <p className="mt-1 text-xs text-red-500 flex items-center">
                  <svg
                    className="w-4 h-4 mr-1"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path
                      fillRule="evenodd"
                      d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z"
                      clipRule="evenodd"
                    />
                  </svg>
                  {errors.taiKhoan}
                </p>
              )}
            </div>

            {/* Mật khẩu Field */}
            <div>
              <label
                htmlFor="matKhau"
                className="block text-sm font-medium text-gray-700 mb-2"
              >
                Mật khẩu <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  id="matKhau"
                  name="matKhau"
                  value={formData.matKhau}
                  onChange={handleChange}
                  className={`w-full px-4 py-3 pl-10 pr-10 border rounded focus:outline-none focus:ring-2 transition-all ${
                    errors.matKhau
                      ? "border-red-500 focus:ring-red-500"
                      : "border-gray-300 focus:ring-blue-500"
                  }`}
                  placeholder="Nhập mật khẩu"
                  autoComplete="current-password"
                />
                <svg
                  className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
                  />
                </svg>
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
                >
                  {showPassword ? (
                    <svg
                      className="w-5 h-5"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21"
                      />
                    </svg>
                  ) : (
                    <svg
                      className="w-5 h-5"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                      />
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
                      />
                    </svg>
                  )}
                </button>
              </div>
              {errors.matKhau && (
                <p className="mt-1 text-xs text-red-500 flex items-center">
                  <svg
                    className="w-4 h-4 mr-1"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path
                      fillRule="evenodd"
                      d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z"
                      clipRule="evenodd"
                    />
                  </svg>
                  {errors.matKhau}
                </p>
              )}
            </div>

            {/* Remember Me & Forgot Password */}
            <div className="flex items-center justify-between">
              <label className="flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  name="rememberMe"
                  checked={formData.rememberMe}
                  onChange={handleChange}
                  className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                />
                <span className="ml-2 text-sm text-gray-700">
                  Ghi nhớ đăng nhập
                </span>
              </label>
              <Link
                to="/forgot-password"
                className="text-sm text-blue-600 hover:text-blue-800 transition-colors"
              >
                Quên mật khẩu?
              </Link>
            </div>

            {/* Submit Button */}
            <button
              onClick={handleSubmit}
              disabled={isLoading}
              className="w-full bg-blue-600 text-white py-3 rounded hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-all disabled:opacity-50 disabled:cursor-not-allowed font-medium"
            >
              {isLoading ? (
                <span className="flex items-center justify-center">
                  <svg
                    className="animate-spin -ml-1 mr-3 h-5 w-5 text-white"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                  >
                    <circle
                      className="opacity-25"
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      strokeWidth="4"
                    ></circle>
                    <path
                      className="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                    ></path>
                  </svg>
                  Đang xử lý...
                </span>
              ) : (
                "Đăng nhập"
              )}
            </button>
          </div>

          {/* Register Link */}
          <div className="mt-6 text-center">
            <p className="text-sm text-gray-600">
              Chưa có tài khoản?{" "}
              <Link
                to="/register"
                className="text-blue-600 hover:text-blue-800 font-medium transition-colors"
              >
                Đăng ký ngay
              </Link>
            </p>
          </div>
        </div>

        {/* Footer */}
        <div className="mt-6 text-center text-white text-xs">
          <p>© 2024 E-Learning CyberSoft. All rights reserved.</p>
        </div>
      </div>
    </div>
  );
};

export default Login;
