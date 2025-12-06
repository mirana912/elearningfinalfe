import { Outlet } from "react-router-dom";

const AdminLayout = () => {
  return (
    <div className="min-h-screen">
      {/* Header - to be implemented by partner */}
      <header className="bg-white shadow">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <h1 className="text-2xl font-bold text-gray-900">
            E-Learning Platform
          </h1>
        </div>
      </header>

      {/* Main Content */}
      <main>
        <Outlet />
      </main>

      {/* Footer - to be implemented by partner */}
      <footer className="bg-gray-800 text-white mt-12">
        <div className="max-w-7xl mx-auto px-4 py-8">
          <p className="text-center">
            © 2025 E-Learning Platform. All rights reserved.
          </p>
        </div>
      </footer>
    </div>
  );
};

export default AdminLayout;

// ==========================================
