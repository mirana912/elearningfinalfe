// src/layouts/HomeLayout/HomeLayout.tsx
// ==========================================
import { Outlet, Link } from "react-router-dom";
import { useEffect } from "react";

const HomeLayout = () => {
  const userInfoStr = localStorage.getItem("userInfo");
  const userInfo = userInfoStr ? JSON.parse(userInfoStr) : null;

  useEffect(() => {
    console.log("HomeLayout mounted");
    console.log("Current user:", userInfo?.hoTen || "Guest");
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("accessToken");
    localStorage.removeItem("userInfo");
    window.location.href = "/login";
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-8">
              <Link to="/" className="flex items-center space-x-2">
                <svg
                  className="w-8 h-8 text-blue-600"
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
                <span className="text-2xl font-bold text-gray-900">
                  E-Learning
                </span>
              </Link>

              <nav className="hidden md:flex space-x-6">
                <Link
                  to="/"
                  className="text-gray-700 hover:text-blue-600 transition-colors"
                >
                  Trang chủ
                </Link>
                <Link
                  to="/courses"
                  className="text-gray-700 hover:text-blue-600 transition-colors"
                >
                  Khóa học
                </Link>
              </nav>
            </div>

            <div className="flex items-center space-x-4">
              {userInfo ? (
                <>
                  {userInfo.maLoaiNguoiDung === "GV" && (
                    <Link
                      to="/admin/users"
                      className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors"
                    >
                      Admin
                    </Link>
                  )}
                  <div className="flex items-center space-x-2">
                    <span className="text-gray-700">
                      Xin chào, <strong>{userInfo.hoTen}</strong>
                    </span>
                    <button
                      onClick={handleLogout}
                      className="text-red-600 hover:text-red-800"
                    >
                      Đăng xuất
                    </button>
                  </div>
                </>
              ) : (
                <>
                  <Link
                    to="/login"
                    className="text-gray-700 hover:text-blue-600"
                  >
                    Đăng nhập
                  </Link>
                  <Link
                    to="/register"
                    className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors"
                  >
                    Đăng ký
                  </Link>
                </>
              )}
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 py-8">
        <Outlet />
      </main>

      {/* Footer */}
      <footer className="bg-gray-800 text-white mt-12">
        <div className="max-w-7xl mx-auto px-4 py-8">
          <div className="grid md:grid-cols-3 gap-8">
            <div>
              <h3 className="text-lg font-semibold mb-4">
                E-Learning Platform
              </h3>
              <p className="text-gray-400 text-sm">
                Nền tảng học tập trực tuyến hàng đầu Việt Nam
              </p>
            </div>
            <div>
              <h3 className="text-lg font-semibold mb-4">Liên kết</h3>
              <ul className="space-y-2 text-sm text-gray-400">
                <li>
                  <Link to="/" className="hover:text-white">
                    Trang chủ
                  </Link>
                </li>
                <li>
                  <Link to="/courses" className="hover:text-white">
                    Khóa học
                  </Link>
                </li>
              </ul>
            </div>
            <div>
              <h3 className="text-lg font-semibold mb-4">Liên hệ</h3>
              <p className="text-gray-400 text-sm">
                Email: support@elearning.com
                <br />
                Phone: 0123-456-789
              </p>
            </div>
          </div>
          <div className="border-t border-gray-700 mt-8 pt-8 text-center text-sm text-gray-400">
            <p>© 2024 E-Learning Platform. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default HomeLayout;

// ==========================================
