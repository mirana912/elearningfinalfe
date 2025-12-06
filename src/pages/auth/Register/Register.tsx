// src/pages/auth/Register/Register.tsx
import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../../../hooks/useAuth";

interface RegisterForm {
  taiKhoan: string;
  matKhau: string;
  xacNhanMatKhau: string;
  hoTen: string;
  email: string;
  soDT: string;
  maNhom: string;
}

const Register = () => {
  const { register, isLoading, error, clearError } = useAuth();

  const [formData, setFormData] = useState<RegisterForm>({
    taiKhoan: "",
    matKhau: "",
    xacNhanMatKhau: "",
    hoTen: "",
    email: "",
    soDT: "",
    maNhom: "GP01", // Mã nhóm mặc định
  });

  const [errors, setErrors] = useState<
    Partial<Record<keyof RegisterForm, string>>
  >({});
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [apiError, setApiError] = useState("");

  useEffect(() => {
    return () => {
      clearError();
    };
  }, [clearError]);

  useEffect(() => {
    if (error) {
      setApiError(error);
    }
  }, [error]);

  const validateForm = (): boolean => {
    const newErrors: Partial<Record<keyof RegisterForm, string>> = {};

    // Tài khoản
    if (!formData.taiKhoan.trim()) {
      newErrors.taiKhoan = "Tài khoản là bắt buộc";
    } else if (formData.taiKhoan.length < 4) {
      newErrors.taiKhoan = "Tài khoản phải có ít nhất 4 ký tự";
    } else if (!/^[a-zA-Z0-9_]+$/.test(formData.taiKhoan)) {
      newErrors.taiKhoan = "Tài khoản chỉ chứa chữ, số và gạch dưới";
    }

    // Họ tên
    if (!formData.hoTen.trim()) {
      newErrors.hoTen = "Họ tên là bắt buộc";
    } else if (formData.hoTen.trim().length < 2) {
      newErrors.hoTen = "Họ tên phải có ít nhất 2 ký tự";
    }

    // Email
    if (!formData.email) {
      newErrors.email = "Email là bắt buộc";
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = "Email không hợp lệ";
    }

    // Số điện thoại
    if (!formData.soDT) {
      newErrors.soDT = "Số điện thoại là bắt buộc";
    } else if (!/^(0|\+84)[3|5|7|8|9][0-9]{8}$/.test(formData.soDT)) {
      newErrors.soDT = "Số điện thoại không hợp lệ (VD: 0912345678)";
    }

    // Mật khẩu
    if (!formData.matKhau) {
      newErrors.matKhau = "Mật khẩu là bắt buộc";
    } else if (formData.matKhau.length < 6) {
      newErrors.matKhau = "Mật khẩu phải có ít nhất 6 ký tự";
    }

    // Xác nhận mật khẩu
    if (!formData.xacNhanMatKhau) {
      newErrors.xacNhanMatKhau = "Vui lòng xác nhận mật khẩu";
    } else if (formData.matKhau !== formData.xacNhanMatKhau) {
      newErrors.xacNhanMatKhau = "Mật khẩu xác nhận không khớp";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));

    if (errors[name as keyof RegisterForm]) {
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

    const result = await register({
      taiKhoan: formData.taiKhoan,
      matKhau: formData.matKhau,
      hoTen: formData.hoTen,
      email: formData.email,
      soDT: formData.soDT,
      maNhom: formData.maNhom,
    });

    if (!result.success && result.error) {
      setApiError(result.error);
    }
  };

  return (
    <div className="min-h-screen bg-linear-to-br from-blue-600 to-blue-800 flex items-center justify-center px-4 py-12 font-['Roboto',sans-serif]">
      <div className="max-w-2xl w-full">
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
          <h1 className="text-3xl font-bold text-white mb-2">Tạo tài khoản</h1>
          <p className="text-sm text-white/80">
            Đăng ký để bắt đầu học tập tại CyberSoft
          </p>
        </div>

        {/* Register Form */}
        <div className="bg-white rounded-lg shadow-xl p-8">
          <div className="space-y-5">
            {/* API Error Alert */}
            {apiError && (
              <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded text-sm flex items-start">
                <svg
                  className="w-5 h-5 mr-2 shrink-0 mt-0.5"
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

            {/* Tài khoản */}
            <div>
              <label
                htmlFor="taiKhoan"
                className="block text-sm font-medium text-gray-700 mb-2"
              >
                Tài khoản <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                id="taiKhoan"
                name="taiKhoan"
                value={formData.taiKhoan}
                onChange={handleChange}
                className={`w-full px-4 py-2.5 border rounded focus:outline-none focus:ring-2 transition-all ${
                  errors.taiKhoan
                    ? "border-red-500 focus:ring-red-500"
                    : "border-gray-300 focus:ring-blue-500"
                }`}
                placeholder="VD: user123"
                autoComplete="username"
              />
              {errors.taiKhoan && (
                <p className="mt-1 text-xs text-red-500">{errors.taiKhoan}</p>
              )}
            </div>

            {/* Họ tên & Email */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label
                  htmlFor="hoTen"
                  className="block text-sm font-medium text-gray-700 mb-2"
                >
                  Họ và tên <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  id="hoTen"
                  name="hoTen"
                  value={formData.hoTen}
                  onChange={handleChange}
                  className={`w-full px-4 py-2.5 border rounded focus:outline-none focus:ring-2 transition-all ${
                    errors.hoTen
                      ? "border-red-500 focus:ring-red-500"
                      : "border-gray-300 focus:ring-blue-500"
                  }`}
                  placeholder="Nguyễn Văn A"
                  autoComplete="name"
                />
                {errors.hoTen && (
                  <p className="mt-1 text-xs text-red-500">{errors.hoTen}</p>
                )}
              </div>

              <div>
                <label
                  htmlFor="email"
                  className="block text-sm font-medium text-gray-700 mb-2"
                >
                  Email <span className="text-red-500">*</span>
                </label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  className={`w-full px-4 py-2.5 border rounded focus:outline-none focus:ring-2 transition-all ${
                    errors.email
                      ? "border-red-500 focus:ring-red-500"
                      : "border-gray-300 focus:ring-blue-500"
                  }`}
                  placeholder="example@email.com"
                  autoComplete="email"
                />
                {errors.email && (
                  <p className="mt-1 text-xs text-red-500">{errors.email}</p>
                )}
              </div>
            </div>

            {/* Số điện thoại & Mã nhóm */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label
                  htmlFor="soDT"
                  className="block text-sm font-medium text-gray-700 mb-2"
                >
                  Số điện thoại <span className="text-red-500">*</span>
                </label>
                <input
                  type="tel"
                  id="soDT"
                  name="soDT"
                  value={formData.soDT}
                  onChange={handleChange}
                  className={`w-full px-4 py-2.5 border rounded focus:outline-none focus:ring-2 transition-all ${
                    errors.soDT
                      ? "border-red-500 focus:ring-red-500"
                      : "border-gray-300 focus:ring-blue-500"
                  }`}
                  placeholder="0912345678"
                  autoComplete="tel"
                />
                {errors.soDT && (
                  <p className="mt-1 text-xs text-red-500">{errors.soDT}</p>
                )}
              </div>

              <div>
                <label
                  htmlFor="maNhom"
                  className="block text-sm font-medium text-gray-700 mb-2"
                >
                  Mã nhóm <span className="text-red-500">*</span>
                </label>
                <select
                  id="maNhom"
                  name="maNhom"
                  value={formData.maNhom}
                  onChange={handleChange}
                  className="w-full px-4 py-2.5 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="GP01">GP01</option>
                  <option value="GP02">GP02</option>
                  <option value="GP03">GP03</option>
                  <option value="GP04">GP04</option>
                  <option value="GP05">GP05</option>
                  <option value="GP06">GP06</option>
                  <option value="GP07">GP07</option>
                  <option value="GP08">GP08</option>
                  <option value="GP09">GP09</option>
                  <option value="GP10">GP10</option>
                </select>
              </div>
            </div>

            {/* Mật khẩu & Xác nhận mật khẩu */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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
                    className={`w-full px-4 py-2.5 pr-10 border rounded focus:outline-none focus:ring-2 transition-all ${
                      errors.matKhau
                        ? "border-red-500 focus:ring-red-500"
                        : "border-gray-300 focus:ring-blue-500"
                    }`}
                    placeholder="••••••••"
                    autoComplete="new-password"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
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
                  <p className="mt-1 text-xs text-red-500">{errors.matKhau}</p>
                )}
              </div>

              <div>
                <label
                  htmlFor="xacNhanMatKhau"
                  className="block text-sm font-medium text-gray-700 mb-2"
                >
                  Xác nhận mật khẩu <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <input
                    type={showConfirmPassword ? "text" : "password"}
                    id="xacNhanMatKhau"
                    name="xacNhanMatKhau"
                    value={formData.xacNhanMatKhau}
                    onChange={handleChange}
                    className={`w-full px-4 py-2.5 pr-10 border rounded focus:outline-none focus:ring-2 transition-all ${
                      errors.xacNhanMatKhau
                        ? "border-red-500 focus:ring-red-500"
                        : "border-gray-300 focus:ring-blue-500"
                    }`}
                    placeholder="••••••••"
                    autoComplete="new-password"
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                  >
                    {showConfirmPassword ? (
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
                {errors.xacNhanMatKhau && (
                  <p className="mt-1 text-xs text-red-500">
                    {errors.xacNhanMatKhau}
                  </p>
                )}
              </div>
            </div>

            {/* Submit Button */}
            <button
              onClick={handleSubmit}
              disabled={isLoading}
              className="w-full bg-blue-600 text-white py-3 rounded hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-all disabled:opacity-50 disabled:cursor-not-allowed font-medium mt-2"
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
                "Đăng ký"
              )}
            </button>
          </div>

          {/* Login Link */}
          <div className="mt-6 text-center">
            <p className="text-sm text-gray-600">
              Đã có tài khoản?{" "}
              <Link
                to="/login"
                className="text-blue-600 hover:text-blue-800 font-medium transition-colors"
              >
                Đăng nhập ngay
              </Link>
            </p>
          </div>
        </div>

        {/* Footer */}
        <div className="mt-6 text-center text-white text-xs">
          <p>© 2025 E-Learning CyberSoft. All rights reserved.</p>
        </div>
      </div>
    </div>
  );
};

export default Register;
