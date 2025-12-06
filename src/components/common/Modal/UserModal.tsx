// src/pages/admin/QuanLyNguoiDung/components/UserModal.tsx
import { useState, useEffect } from "react";
import {
  userApi,
  type User,
  validateUserData,
} from "./../../../services/api/userApi";

interface UserModalProps {
  isOpen: boolean;
  onClose: () => void;
  user: User | null;
  mode: "create" | "edit";
  onSuccess: () => void;
  showNotification: (type: "success" | "error", message: string) => void;
}

const UserModal: React.FC<UserModalProps> = ({
  isOpen,
  onClose,
  user,
  mode,
  onSuccess,
  showNotification,
}) => {
  const [formData, setFormData] = useState({
    taiKhoan: "",
    matKhau: "",
    hoTen: "",
    email: "",
    soDT: "",
    maLoaiNguoiDung: "HV",
    maNhom: "GP01",
  });

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  // Initialize form with user data if editing
  useEffect(() => {
    if (user && mode === "edit") {
      setFormData({
        taiKhoan: user.taiKhoan,
        matKhau: "", // Don't pre-fill password
        hoTen: user.hoTen,
        email: user.email,
        soDT: user.soDT,
        maLoaiNguoiDung: user.maLoaiNguoiDung,
        maNhom: user.maNhom,
      });
    } else {
      // Reset form for create
      setFormData({
        taiKhoan: "",
        matKhau: "",
        hoTen: "",
        email: "",
        soDT: "",
        maLoaiNguoiDung: "HV",
        maNhom: "GP01",
      });
    }
    setErrors({});
  }, [user, mode]);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));

    // Clear error for this field
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: "" }));
    }
  };

  const validate = (): boolean => {
    const newErrors: Record<string, string> = {};

    // Tài khoản
    if (!formData.taiKhoan.trim()) {
      newErrors.taiKhoan = "Tài khoản là bắt buộc";
    } else if (formData.taiKhoan.length < 4) {
      newErrors.taiKhoan = "Tài khoản phải có ít nhất 4 ký tự";
    } else if (!/^[a-zA-Z0-9_]+$/.test(formData.taiKhoan)) {
      newErrors.taiKhoan = "Tài khoản chỉ chứa chữ, số và gạch dưới";
    }

    // Mật khẩu (required for create, optional for edit)
    if (mode === "create") {
      if (!formData.matKhau) {
        newErrors.matKhau = "Mật khẩu là bắt buộc";
      } else if (formData.matKhau.length < 6) {
        newErrors.matKhau = "Mật khẩu phải có ít nhất 6 ký tự";
      }
    } else if (formData.matKhau && formData.matKhau.length < 6) {
      newErrors.matKhau = "Mật khẩu phải có ít nhất 6 ký tự";
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

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validate()) return;

    setIsSubmitting(true);

    try {
      if (mode === "create") {
        await userApi.createUser({
          taiKhoan: formData.taiKhoan,
          matKhau: formData.matKhau,
          hoTen: formData.hoTen,
          email: formData.email,
          soDT: formData.soDT,
          maNhom: formData.maNhom,
          maLoaiNguoiDung: formData.maLoaiNguoiDung,
        });
        showNotification("success", "Thêm người dùng thành công");
      } else {
        await userApi.updateUser({
          taiKhoan: formData.taiKhoan,
          matKhau: formData.matKhau || user?.matKhau || "", // Use existing password if not changed
          hoTen: formData.hoTen,
          email: formData.email,
          soDT: formData.soDT,
          maNhom: formData.maNhom,
          maLoaiNguoiDung: formData.maLoaiNguoiDung,
        });
        showNotification("success", "Cập nhật người dùng thành công");
      }

      onSuccess();
    } catch (error: any) {
      console.error("Error saving user:", error);
      const errorMessage =
        error.message || "Không thể lưu thông tin người dùng";
      showNotification("error", errorMessage);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      <div className="flex items-center justify-center min-h-screen px-4 pt-4 pb-20 text-center sm:block sm:p-0">
        {/* Overlay */}
        <div
          className="fixed inset-0 transition-opacity bg-gray-500 bg-opacity-75"
          onClick={onClose}
        ></div>

        {/* Modal */}
        <div className="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full">
          {/* Header */}
          <div className="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-medium leading-6 text-gray-900">
                {mode === "create"
                  ? "Thêm người dùng mới"
                  : "Chỉnh sửa người dùng"}
              </h3>
              <button
                onClick={onClose}
                className="text-gray-400 hover:text-gray-500 focus:outline-none"
              >
                <svg
                  className="h-6 w-6"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              </button>
            </div>

            {/* Form */}
            <div className="space-y-4">
              {/* Tài khoản */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Tài khoản <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  name="taiKhoan"
                  value={formData.taiKhoan}
                  onChange={handleChange}
                  disabled={mode === "edit"}
                  className={`w-full px-3 py-2 border rounded focus:outline-none focus:ring-2 ${
                    errors.taiKhoan ? "border-red-500" : "border-gray-300"
                  } ${mode === "edit" ? "bg-gray-100" : ""}`}
                  placeholder="VD: user123"
                />
                {errors.taiKhoan && (
                  <p className="mt-1 text-xs text-red-500">{errors.taiKhoan}</p>
                )}
              </div>

              {/* Họ tên */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Họ và tên <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  name="hoTen"
                  value={formData.hoTen}
                  onChange={handleChange}
                  className={`w-full px-3 py-2 border rounded focus:outline-none focus:ring-2 ${
                    errors.hoTen ? "border-red-500" : "border-gray-300"
                  }`}
                  placeholder="Nguyễn Văn A"
                />
                {errors.hoTen && (
                  <p className="mt-1 text-xs text-red-500">{errors.hoTen}</p>
                )}
              </div>

              {/* Email */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Email <span className="text-red-500">*</span>
                </label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  className={`w-full px-3 py-2 border rounded focus:outline-none focus:ring-2 ${
                    errors.email ? "border-red-500" : "border-gray-300"
                  }`}
                  placeholder="example@email.com"
                />
                {errors.email && (
                  <p className="mt-1 text-xs text-red-500">{errors.email}</p>
                )}
              </div>

              {/* Số điện thoại */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Số điện thoại <span className="text-red-500">*</span>
                </label>
                <input
                  type="tel"
                  name="soDT"
                  value={formData.soDT}
                  onChange={handleChange}
                  className={`w-full px-3 py-2 border rounded focus:outline-none focus:ring-2 ${
                    errors.soDT ? "border-red-500" : "border-gray-300"
                  }`}
                  placeholder="0912345678"
                />
                {errors.soDT && (
                  <p className="mt-1 text-xs text-red-500">{errors.soDT}</p>
                )}
              </div>

              {/* Mật khẩu */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Mật khẩu{" "}
                  {mode === "create" && <span className="text-red-500">*</span>}
                  {mode === "edit" && (
                    <span className="text-gray-500 text-xs">
                      (Để trống nếu không đổi)
                    </span>
                  )}
                </label>
                <div className="relative">
                  <input
                    type={showPassword ? "text" : "password"}
                    name="matKhau"
                    value={formData.matKhau}
                    onChange={handleChange}
                    className={`w-full px-3 py-2 pr-10 border rounded focus:outline-none focus:ring-2 ${
                      errors.matKhau ? "border-red-500" : "border-gray-300"
                    }`}
                    placeholder="••••••••"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400"
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

              {/* Vai trò & Mã nhóm */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Vai trò <span className="text-red-500">*</span>
                  </label>
                  <select
                    name="maLoaiNguoiDung"
                    value={formData.maLoaiNguoiDung}
                    onChange={handleChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2"
                  >
                    <option value="HV">Học viên</option>
                    <option value="GV">Giảng viên</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Mã nhóm <span className="text-red-500">*</span>
                  </label>
                  <select
                    name="maNhom"
                    value={formData.maNhom}
                    onChange={handleChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2"
                  >
                    {[
                      "GP01",
                      "GP02",
                      "GP03",
                      "GP04",
                      "GP05",
                      "GP06",
                      "GP07",
                      "GP08",
                      "GP09",
                      "GP10",
                    ].map((group) => (
                      <option key={group} value={group}>
                        {group}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
            </div>
          </div>

          {/* Footer */}
          <div className="bg-gray-50 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse">
            <button
              onClick={handleSubmit}
              disabled={isSubmitting}
              className="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-blue-600 text-base font-medium text-white hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 sm:ml-3 sm:w-auto sm:text-sm disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isSubmitting ? (
                <>
                  <svg
                    className="animate-spin -ml-1 mr-2 h-4 w-4 text-white"
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
                </>
              ) : mode === "create" ? (
                "Tạo mới"
              ) : (
                "Cập nhật"
              )}
            </button>
            <button
              onClick={onClose}
              disabled={isSubmitting}
              className="mt-3 w-full inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 sm:mt-0 sm:ml-3 sm:w-auto sm:text-sm"
            >
              Hủy
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserModal;

// ==========================================
