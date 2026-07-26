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
      {/* Overlay (Mobile) */}
      {sidebarOpen && (
        <div
          onClick={() => setSidebarOpen(false)}
          className="fixed inset-0 bg-black/40 z-40 lg:hidden"
        />
      )}

      {/* Sidebar */}
      <aside
        className={`
          fixed
          top-0
          left-0
          z-50
          h-screen
          w-72
          bg-[#5a3f2a]
          text-white
          shadow-2xl
          transform
          transition-transform
          duration-300

          ${sidebarOpen ? "translate-x-0" : "-translate-x-full"}

          lg:translate-x-0
          lg:fixed
        `}
      >
        <div className="h-full flex flex-col p-6">
          {/* Mobile Close Button */}
          <div className="flex justify-between items-center lg:hidden mb-8">
            <h1 className="text-2xl font-bold">DataNest AI</h1>

            <button onClick={() => setSidebarOpen(false)}>
              <FiX size={28} />
            </button>
          </div>

          {/* Desktop Logo */}
          <div className="hidden lg:block mb-12">
            <h1 className="text-3xl font-bold tracking-wide">DataNest AI</h1>

            <p className="text-sm text-white/70 mt-2">AI Knowledge Platform</p>
          </div>

          {/* Menu */}
          <nav className="flex-1 space-y-2">
            <Link
              to="/dashboard"
              onClick={() => setSidebarOpen(false)}
              className="flex items-center gap-4 px-5 py-4 rounded-2xl hover:bg-white/15 transition-all duration-300"
            >
              <FiHome size={22} />
              <span className="font-medium">Dashboard</span>
            </Link>

            <Link
              to="/upload"
              onClick={() => setSidebarOpen(false)}
              className="flex items-center gap-4 px-5 py-4 rounded-2xl hover:bg-white/15 transition-all duration-300"
            >
              <FiUploadCloud size={22} />
              <span className="font-medium">Upload</span>
            </Link>

            <Link
              to="/documents"
              onClick={() => setSidebarOpen(false)}
              className="flex items-center gap-4 px-5 py-4 rounded-2xl hover:bg-white/15 transition-all duration-300"
            >
              <FiFileText size={22} />
              <span className="font-medium">Documents</span>
            </Link>

            <Link
              to="/search"
              onClick={() => setSidebarOpen(false)}
              className="flex items-center gap-4 px-5 py-4 rounded-2xl hover:bg-white/15 transition-all duration-300"
            >
              <FiMessageSquare size={22} />
              <span className="font-medium">Ask AI</span>
            </Link>

            <Link
              to="/analytics"
              onClick={() => setSidebarOpen(false)}
              className="flex items-center gap-4 px-5 py-4 rounded-2xl hover:bg-white/15 transition-all duration-300"
            >
              <FiBarChart2 size={22} />
              <span className="font-medium">Analytics</span>
            </Link>

            <Link
              to="/settings"
              onClick={() => setSidebarOpen(false)}
              className="flex items-center gap-4 px-5 py-4 rounded-2xl hover:bg-white/15 transition-all duration-300"
            >
              <FiSettings size={22} />
              <span className="font-medium">Settings</span>
            </Link>
          </nav>

          {/* Bottom */}
          <div className="border-t border-white/20 pt-6 mt-6">
            <Link
              to="/"
              onClick={() => setSidebarOpen(false)}
              className="flex items-center gap-4 px-5 py-4 rounded-2xl hover:bg-white/15 transition-all duration-300"
            >
              <FiArrowLeft size={22} />
              <span className="font-medium">Back to Home</span>
            </Link>

            <p className="text-center text-xs text-white/60 mt-8">
              © 2026 DataNest AI
            </p>
          </div>
        </div>
      </aside>
    </>
  );
}
