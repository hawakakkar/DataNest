import { Link } from "react-router-dom";
import {
  FiHome,
  FiUploadCloud,
  FiFileText,
  FiMessageSquare,
  FiBarChart2,
  FiSettings,
  FiArrowLeft,
  FiX,
} from "react-icons/fi";

export default function Sidebar({ sidebarOpen, setSidebarOpen }) {
  return (
    <>
      {sidebarOpen && (
        <div
          onClick={() => setSidebarOpen(false)}
          className="fixed inset-0 z-40 bg-black/40 lg:hidden"
        />
      )}

      <aside
        className={`
          fixed top-0 left-0 z-50 h-screen w-72
          bg-[#5A3F2A] dark:bg-[#5A3F2A]
          text-white
          shadow-2xl
          transform transition-transform duration-300
          ${sidebarOpen ? "translate-x-0" : "-translate-x-full"}
          lg:translate-x-0 lg:fixed
        `}
      >
        <div className="flex h-full flex-col p-6">
          {/* Mobile */}
          <div className="mb-8 flex items-center justify-between lg:hidden">
            <h1 className="text-2xl font-bold">DataNest AI</h1>

            <button onClick={() => setSidebarOpen(false)}>
              <FiX size={28} />
            </button>
          </div>

          {/* Logo */}
          <div className="mb-12 hidden lg:block">
            <h1 className="text-3xl font-bold tracking-wide">DataNest AI</h1>

            <p className="mt-2 text-sm text-white/70">AI Knowledge Platform</p>
          </div>

          {/* Menu */}
          <nav className="flex-1 space-y-2">
            <Link
              to="/dashboard"
              onClick={() => setSidebarOpen(false)}
              className="flex items-center gap-4 rounded-2xl px-5 py-4 transition hover:bg-white/10 dark:hover:bg-gray-700"
            >
              <FiHome size={22} />
              <span>Dashboard</span>
            </Link>

            <Link
              to="/upload"
              onClick={() => setSidebarOpen(false)}
              className="flex items-center gap-4 rounded-2xl px-5 py-4 transition hover:bg-white/10 dark:hover:bg-gray-700"
            >
              <FiUploadCloud size={22} />
              <span>Upload</span>
            </Link>

            <Link
              to="/documents"
              onClick={() => setSidebarOpen(false)}
              className="flex items-center gap-4 rounded-2xl px-5 py-4 transition hover:bg-white/10 dark:hover:bg-gray-700"
            >
              <FiFileText size={22} />
              <span>Documents</span>
            </Link>

            <Link
              to="/search"
              onClick={() => setSidebarOpen(false)}
              className="flex items-center gap-4 rounded-2xl px-5 py-4 transition hover:bg-white/10 dark:hover:bg-gray-700"
            >
              <FiMessageSquare size={22} />
              <span>AI History</span>
            </Link>

            <Link
              to="/analytics"
              onClick={() => setSidebarOpen(false)}
              className="flex items-center gap-4 rounded-2xl px-5 py-4 transition hover:bg-white/10 dark:hover:bg-gray-700"
            >
              <FiBarChart2 size={22} />
              <span>Analytics</span>
            </Link>

            <Link
              to="/settings"
              onClick={() => setSidebarOpen(false)}
              className="flex items-center gap-4 rounded-2xl px-5 py-4 transition hover:bg-white/10 dark:hover:bg-gray-700"
            >
              <FiSettings size={22} />
              <span>Settings</span>
            </Link>
          </nav>

          {/* Bottom */}
          <div className="mt-6 border-t border-white/20 pt-6">
            <Link
              to="/"
              onClick={() => setSidebarOpen(false)}
              className="flex items-center gap-4 rounded-2xl px-5 py-4 transition hover:bg-white/10 dark:hover:bg-gray-700"
            >
              <FiArrowLeft size={22} />
              <span>Back to Home</span>
            </Link>

            <p className="mt-8 text-center text-xs text-white/60">
              © 2026 DataNest AI
            </p>
          </div>
        </div>
      </aside>
    </>
  );
}
